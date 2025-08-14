import {
  BeakerIcon,
  CalendarDaysIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import RemindersModule from "./RemindersModule";
// import TodaySchedule from "./TodaySchedule";
// import UpcomingRefills from "./UpcomingRefills";
// import MyMedications from "./MyMedications";

export default function Dashboard() {
  const stats = [
    {
      title: "Active Medications",
      value: "8",
      icon: BeakerIcon,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Today's Doses",
      value: "3",
      icon: ClockIcon,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Upcoming Refills",
      value: "2",
      icon: CalendarDaysIcon,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: "Missed Doses",
      value: "1",
      icon: ExclamationTriangleIcon,
      color: "text-error",
      bg: "bg-error/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">
          Welcome back, John! 👋
        </h1>
        <p className="text-base-content/70">
          Here's your medication overview for today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="card bg-base-100 shadow-md">
              <div className="card-body p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base-content/60 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-base-content mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule - Takes 2 columns on large screens */}
        {/* <div className="lg:col-span-2">
          <TodaySchedule />
        </div> */}

        {/* Reminders Module - Takes 1 column */}
        <div>
          <RemindersModule />
        </div>

        {/* Upcoming Refills - Takes 1 column */}
        {/* <div>
          <UpcomingRefills />
        </div> */}
      </div>

      {/* My Medications - Full width */}
      {/* <div>
        <MyMedications />
      </div> */}
    </div>
  );
}
