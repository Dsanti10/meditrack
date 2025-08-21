import { Link } from "react-router";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import MedicationIcon from "@mui/icons-material/Medication";

export default function TodayScheduleMockup({ disableCalendarLink = false }) {
  // Hardcoded schedule data
  const todaySchedule = [
    {
      medication_id: 1,
      name: "Metformin",
      dosage: "500mg",
      color: "primary",
      notes: "Take with meals to reduce stomach upset",
      schedule_id: 1,
      time_slot: "08:00:00",
      status: "completed",
    },
    {
      medication_id: 2,
      name: "Lisinopril",
      dosage: "10mg",
      color: "secondary",
      notes: "Monitor blood pressure regularly",
      schedule_id: 3,
      time_slot: "08:00:00",
      status: "completed",
    },
    {
      medication_id: 4,
      name: "Vitamin D3",
      dosage: "1000 IU",
      color: "success",
      notes: "Supplement - take with fatty meal",
      schedule_id: 5,
      time_slot: "08:00:00",
      status: "pending",
    },
    {
      medication_id: 1,
      name: "Metformin",
      dosage: "500mg",
      color: "primary",
      notes: "Take with meals to reduce stomach upset",
      schedule_id: 2,
      time_slot: "20:00:00",
      status: "upcoming",
    },
    {
      medication_id: 3,
      name: "Atorvastatin",
      dosage: "20mg",
      color: "accent",
      notes: "Take before bedtime",
      schedule_id: 4,
      time_slot: "21:00:00",
      status: "upcoming",
    },
  ];

  const loading = false;
  const error = null;
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const getStatusBadge = (status) => {
    const badges = {
      completed: "badge badge-success",
      pending: "badge badge-warning",
      upcoming: "badge badge-info",
      overdue: "badge badge-error",
    };
    return badges[status] || "badge badge-neutral";
  };

  const formatTime = (timeSlot) => {
    if (!timeSlot) return "";

    // If timeSlot is already in format like "08:00" or "08:00:00"
    const timeParts = timeSlot.split(":");
    if (timeParts.length >= 2) {
      const hour = parseInt(timeParts[0]);
      const minute = timeParts[1];
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minute} ${ampm}`;
    }

    return timeSlot;
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="ml-4">Loading today's schedule...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="alert alert-error">
            <span>Failed to load today's schedule</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      {/* Toast notification */}
      {showToast && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="card-body">
        <div className="flex items-center justify-between mb-6">
          <h2 className="card-title text-xl">
            <CalendarDaysIcon className="w-6 h-6" />
            Today's Schedule
          </h2>
          {!disableCalendarLink && (
            <Link to="/calendar" className="btn btn-ghost btn-sm">
              View Calendar
            </Link>
          )}
        </div>

        {todaySchedule.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDaysIcon className="w-16 h-16 mx-auto text-base-300 mb-4" />
            <h3 className="text-lg font-semibold text-base-content/60 mb-2">
              No scheduled medications today
            </h3>
            <p className="text-base-content/40">
              Your schedule is clear for today!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaySchedule.map((item) => (
              <div
                key={`${item.medication_id}-${item.schedule_id}`}
                className="flex items-center gap-4 p-4 border border-base-300 rounded-lg hover:bg-base-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`p-3 rounded-full bg-${
                      item.color || "primary"
                    }/20`}
                  >
                    <MedicationIcon
                      className={`w-5 h-5 text-${item.color || "primary"}`}
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base truncate">
                      {item.name} {item.dosage}
                    </h3>
                    <span className={`${getStatusBadge(item.status)} badge-sm`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <ClockIcon className="w-4 h-4" />
                    <span>{formatTime(item.time_slot)}</span>
                  </div>

                  {item.notes && (
                    <p className="text-sm text-base-content/60 mt-1 line-clamp-1">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  {item.status === "pending" && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        // TODO: Implement mark as completed functionality
                        setToastMessage(`Marked ${item.name} as taken`);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                    >
                      Mark Taken
                    </button>
                  )}
                  {item.status === "completed" && (
                    <div className="text-success text-sm font-medium">
                      ✓ Completed
                    </div>
                  )}
                  {item.status === "upcoming" && (
                    <div className="text-info text-sm font-medium">
                      Upcoming
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
