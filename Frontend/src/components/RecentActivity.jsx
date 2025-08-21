import { Link } from "react-router";
import useQuery from "../api/useQuery";
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

export default function RecentActivity() {
  const { data: todaySchedule = [], loading } = useQuery(
    "/medications/schedule/today",
    "todaySchedule"
  );
  const { data: upcomingRefills = [] } = useQuery(
    "/refills/upcoming",
    "upcomingRefills"
  );

  // Combine and sort recent activities
  const activities = [
    ...todaySchedule.slice(0, 3).map((item) => ({
      type: "medication",
      title: `${item.medication_name} - ${item.dosage}`,
      time: item.time_slot,
      status: item.status,
      icon: item.status === "completed" ? CheckCircleIcon : ClockIcon,
      color:
        item.status === "completed"
          ? "text-green-600"
          : item.status === "overdue"
          ? "text-red-600"
          : "text-yellow-600",
    })),
    ...upcomingRefills.slice(0, 2).map((refill) => ({
      type: "refill",
      title: `${refill.medication_name} refill due`,
      time: refill.refill_date,
      status: "pending",
      icon: ExclamationCircleIcon,
      color: "text-orange-600",
    })),
  ].slice(0, 5);

  const formatTime = (timeSlot) => {
    if (!timeSlot) return "";
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Recent Activity</h3>
          <div className="flex items-center justify-center py-4">
            <div className="loading loading-spinner loading-md"></div>
            <p className="ml-2">Loading recent activity...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title">Recent Activity</h3>
          <Link to="/calendar" className="btn btn-ghost btn-sm">
            View All
          </Link>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-8">
            <PlusCircleIcon className="w-12 h-12 text-base-content/30 mx-auto mb-2" />
            <p className="text-base-content/60">No recent activity</p>
            <Link to="/medications" className="btn btn-primary btn-sm mt-2">
              Add Your First Medication
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 hover:bg-base-200 rounded-lg transition-colors"
                >
                  <div className={`p-2 rounded-full bg-base-200`}>
                    <IconComponent className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-base-content/60">
                      {activity.type === "medication"
                        ? formatTime(activity.time)
                        : formatDate(activity.time)}
                    </p>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : activity.status === "overdue"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {activity.status.charAt(0).toUpperCase() +
                      activity.status.slice(1)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
