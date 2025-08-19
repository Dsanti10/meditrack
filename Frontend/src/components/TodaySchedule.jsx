import { Link } from "react-router";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function TodaySchedule() {
  const todayEvents = [
    {
      id: 1,
      type: "medication",
      title: "Metformin 500mg",
      time: "08:00 AM",
      status: "completed",
      description: "Take with breakfast",
    },
    {
      id: 2,
      type: "medication",
      title: "Lisinopril 10mg",
      time: "12:00 PM",
      status: "pending",
      description: "Take before lunch",
    },
    {
      id: 3,
      type: "appointment",
      title: "Dr. Smith - Cardiology",
      time: "02:30 PM",
      status: "upcoming",
      description: "Regular checkup",
    },
    {
      id: 4,
      type: "medication",
      title: "Vitamin D3",
      time: "06:00 PM",
      status: "pending",
      description: "Take with dinner",
    },
    {
      id: 5,
      type: "medication",
      title: "Atorvastatin 20mg",
      time: "09:00 PM",
      status: "pending",
      description: "Take before bed",
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      completed: "badge badge-success",
      pending: "badge badge-warning",
      upcoming: "badge badge-info",
      overdue: "badge badge-error",
    };
    return badges[status] || "badge badge-neutral";
  };

  const getTypeIcon = (type) => {
    return type === "appointment" ? (
      <CalendarDaysIcon className="w-5 h-5" />
    ) : (
      <ClockIcon className="w-5 h-5" />
    );
  };

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="card-title text-2xl mb-2">Today's Schedule</h2>
            <p className="text-base-content/70">{todayDate}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{currentTime}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="badge badge-success badge-sm">3 completed</div>
              <div className="badge badge-warning badge-sm">3 pending</div>
            </div>
          </div>
        </div>

        <div className="divider my-2"></div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {todayEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-base-300 hover:bg-base-200 transition-colors"
            >
              <div
                className={`p-2 rounded-lg ${
                  event.type === "appointment"
                    ? "bg-info/20 text-info"
                    : "bg-primary/20 text-primary"
                }`}
              >
                {getTypeIcon(event.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{event.title}</h3>
                  <span className={getStatusBadge(event.status)}>
                    {event.status}
                  </span>
                </div>
                <p className="text-sm text-base-content/70">
                  {event.description}
                </p>
              </div>

              <div className="text-right">
                <div className="font-bold text-lg">{event.time}</div>
                <div className="text-xs text-base-content/50">
                  {event.type === "appointment" ? "Appointment" : "Medication"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-actions justify-end mt-4">
          <Link to="/calendar">
            <button className="btn btn-primary btn-sm">
              View Full Calendar
            </button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="stat bg-primary/10 rounded-lg">
            <div className="stat-value text-lg text-primary">5</div>
            <div className="stat-title text-xs">Total Events</div>
          </div>
          <div className="stat bg-success/10 rounded-lg">
            <div className="stat-value text-lg text-success">2</div>
            <div className="stat-title text-xs">Completed</div>
          </div>
          <div className="stat bg-warning/10 rounded-lg">
            <div className="stat-value text-lg text-warning">3</div>
            <div className="stat-title text-xs">Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
}
