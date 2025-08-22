import {
  ClockIcon,
  ShoppingCartIcon,
  BellIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import { useApi } from "../api/ApiContext";

export default function RefillsPage() {
  const { request, invalidateTags } = useApi();
  const {
    data: refills = [],
    loading,
    error,
    refetch,
  } = useQuery("/refills", "refills");
  const createReminderMutation = useMutation("POST", "/reminders", ["refills"]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [updatingRefill, setUpdatingRefill] = useState(null);

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
      setToastMessage("Failed to set reminder");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleUpdateRefillStatus = async (refillId, status) => {
    setUpdatingRefill(refillId);
    try {
      await request(`/refills/${refillId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      let message = `Refill status updated to ${status}`;
      if (status === "picked_up") {
        message = "Refill picked up! Medication stock has been updated.";
      }

      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Refresh the data using proper query invalidation
      invalidateTags(["refills", "medications"]);
      refetch();
    } catch (error) {
      console.error("Failed to update refill status:", error);
      setToastMessage("Failed to update refill status");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setUpdatingRefill(null);
    }
  };

  const getStatusBadge = (priority, daysLeft) => {
    if (priority === "high" || daysLeft <= 3) {
      return <span className="badge badge-error">Urgent</span>;
    } else if (priority === "medium" || daysLeft <= 7) {
      return <span className="badge badge-warning">Soon</span>;
    }
    return <span className="badge badge-success">OK</span>;
  };

  const getStatusColor = (priority, daysLeft) => {
    if (priority === "high" || daysLeft <= 3) return "border-error bg-error/5";
    if (priority === "medium" || daysLeft <= 7)
      return "border-warning bg-warning/5";
    return "border-base-300";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="loading loading-spinner loading-lg mx-auto mt-20"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="alert alert-error mt-20">
            <span>Error loading refills: {error}</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-base-100 p-6">
      {/* Toast notification */}
      {showToast && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Refills</h1>
            <p className="text-base-content/70">
              Track and manage medication refills
            </p>
          </div>
          <div className="flex gap-3">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Urgent</div>
                <div className="stat-value text-error">
                  {
                    refills.filter(
                      (r) => r.priority === "high" || r.days_left <= 3
                    ).length
                  }
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Soon</div>
                <div className="stat-value text-warning">
                  {
                    refills.filter(
                      (r) =>
                        r.priority === "medium" ||
                        (r.days_left > 3 && r.days_left <= 7)
                    ).length
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refills Content */}
        <div className="space-y-4">
          {refills.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="h-60 flex items-center justify-center text-base-content/50">
                  <div className="text-center">
                    <ClockIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No medications need refills right now.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            refills.map((refill) => (
              <div
                key={refill.id}
                className={`card bg-base-100 shadow-xl border ${getStatusColor(
                  refill.priority,
                  refill.days_left
                )}`}
              >
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="card-title text-xl">
                          {refill.medication_name} {refill.dosage}
                        </h3>
                        {getStatusBadge(refill.priority, refill.days_left)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-base-content/70 text-sm">
                            Refill Date
                          </p>
                          <p className="font-semibold">
                            {new Date(refill.refill_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-base-content/70 text-sm">
                            Days Left
                          </p>
                          <p className="font-semibold">
                            {refill.days_left} days
                          </p>
                        </div>
                        <div>
                          <p className="text-base-content/70 text-sm">
                            Pharmacy
                          </p>
                          <p className="font-semibold">{refill.pharmacy}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-base-content/70 text-sm">
                            Prescription Number
                          </p>
                          <p className="font-mono text-sm">
                            {refill.prescription_number}
                          </p>
                        </div>
                        <div>
                          <p className="text-base-content/70 text-sm">Status</p>
                          <p className="capitalize">{refill.status}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSetReminder(refill)}
                        disabled={createReminderMutation.loading}
                      >
                        {createReminderMutation.loading ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <>
                            <BellIcon className="w-4 h-4" />
                            Set Reminder
                          </>
                        )}
                      </button>

                      {refill.status === "pending" && (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() =>
                            handleUpdateRefillStatus(refill.id, "ordered")
                          }
                        >
                          <ShoppingCartIcon className="w-4 h-4" />
                          Mark Ordered
                        </button>
                      )}

                      {refill.status === "ordered" && (
                        <button
                          className={`btn btn-success btn-sm ${
                            updatingRefill === refill.id ? "loading" : ""
                          }`}
                          disabled={updatingRefill === refill.id}
                          onClick={() =>
                            handleUpdateRefillStatus(refill.id, "picked_up")
                          }
                        >
                          {updatingRefill === refill.id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <CheckCircleIcon className="w-4 h-4" />
                          )}
                          {updatingRefill === refill.id
                            ? "Updating..."
                            : "Mark Picked Up"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
