import { Link } from "react-router";
import {
  ExclamationTriangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";

export default function UpcomingRefills() {
  const {
    data: refills = [],
    loading,
    error,
  } = useQuery("/refills/upcoming", "upcomingRefills");
  const createReminderMutation = useMutation("POST", "/reminders", [
    "upcomingRefills",
  ]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSetReminder = async (refill) => {
    try {
      const reminderData = {
        title: `Refill ${refill.medication_name}`,
        description: `Refill prescription at ${refill.pharmacy}`,
        reminder_date: refill.refill_date,
        reminder_time: "09:00",
        type: "refill",
        medication_id: refill.medication_id,
      };

      const success = await createReminderMutation.mutate(reminderData);
      if (success) {
        setToastMessage(`Reminder set for ${refill.medication_name} refill`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Failed to set reminder:", error);
    }
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: "badge badge-error",
      medium: "badge badge-warning",
      low: "badge badge-success",
    };
    return badges[priority] || "badge badge-neutral";
  };

  const getPriorityIcon = (priority) => {
    if (priority === "high") {
      return <ExclamationTriangleIcon className="w-4 h-4" />;
    }
    return <ClockIcon className="w-4 h-4" />;
  };

  const getStockStatus = (stock) => {
    if (stock <= 5) return { text: "Low Stock", class: "text-error" };
    if (stock <= 10) return { text: "Medium Stock", class: "text-warning" };
    return { text: "Good Stock", class: "text-success" };
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl h-full">
        <div className="card-body p-4 sm:p-6 flex flex-col h-full">
          <div className="loading loading-spinner loading-lg mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-xl h-full">
        <div className="card-body p-4 sm:p-6 flex flex-col h-full">
          <div className="alert alert-error">
            <span>Error loading refills: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl h-full">
      {/* Toast notification */}
      {showToast && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="card-body p-4 sm:p-6 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 flex-shrink-0">
          <div className="mb-2 sm:mb-0">
            <h2 className="card-title text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">
              Upcoming Refills
            </h2>
            <p className="text-base-content/70 text-sm sm:text-base hidden sm:block">
              Monitor your medication inventory
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="badge badge-error badge-xs sm:badge-sm">
                {refills.filter((r) => r.priority === "high").length} urgent
              </div>
              <div className="badge badge-warning badge-xs sm:badge-sm">
                {refills.filter((r) => r.priority === "medium").length} soon
              </div>
            </div>
          </div>
        </div>

        <div className="divider my-2 flex-shrink-0"></div>

        <div className="space-y-2 sm:space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
          {refills.map((refill) => {
            const stockStatus = getStockStatus(refill.current_stock);
            return (
              <div
                key={refill.id}
                className={`p-3 sm:p-4 rounded-lg border transition-colors hover:bg-base-200 ${
                  refill.priority === "high"
                    ? "border-error bg-error/5"
                    : refill.priority === "medium"
                    ? "border-warning bg-warning/5"
                    : "border-base-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {refill.medication_name} {refill.dosage}
                      </h3>
                      <span className={getPriorityBadge(refill.priority)}>
                        <div className="flex items-center gap-1">
                          {getPriorityIcon(refill.priority)}
                          {refill.priority}
                        </div>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-base-content/70">Current Stock</p>
                        <p className={`font-bold ${stockStatus.class}`}>
                          {refill.current_stock} pills ({stockStatus.text})
                        </p>
                      </div>
                      <div>
                        <p className="text-base-content/70">Days Remaining</p>
                        <p className="font-bold">{refill.days_left} days</p>
                      </div>
                      <div>
                        <p className="text-base-content/70">Refill Date</p>
                        <p className="font-bold">
                          {new Date(refill.refill_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-base-content/70">Pharmacy</p>
                        <p className="font-bold">{refill.pharmacy}</p>
                      </div>
                    </div>

                    <p className="text-xs text-base-content/50 mt-2">
                      Prescription: {refill.prescription_number}
                    </p>
                  </div>

                  <div className="gap-2">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleSetReminder(refill)}
                      disabled={createReminderMutation.loading}
                    >
                      {createReminderMutation.loading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "Set Reminder"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {refills.length === 0 && (
            <div className="text-center py-8 text-base-content/70">
              <p>No upcoming refills at this time</p>
            </div>
          )}
        </div>

        <Link to="/refills" className="card-actions justify-between mt-4">
          <button className="btn btn-primary">View All Refills</button>
        </Link>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="stat bg-error/10 rounded-lg">
            <div className="stat-value text-lg text-error">
              {refills.filter((r) => r.priority === "high").length}
            </div>
            <div className="stat-title text-xs">Critical</div>
          </div>
          <div className="stat bg-warning/10 rounded-lg">
            <div className="stat-value text-lg text-warning">
              {refills.filter((r) => r.priority === "medium").length}
            </div>
            <div className="stat-title text-xs">Soon</div>
          </div>
          <div className="stat bg-success/10 rounded-lg">
            <div className="stat-value text-lg text-success">
              {refills.filter((r) => r.priority === "low").length}
            </div>
            <div className="stat-title text-xs">Good</div>
          </div>
          <div className="stat bg-info/10 rounded-lg">
            <div className="stat-value text-lg text-info">{refills.length}</div>
            <div className="stat-title text-xs">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}
