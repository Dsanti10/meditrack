import { Link } from "react-router";
import { useState } from "react";
import TodaySchedule from "../components/TodaySchedule";
import UpcomingRefills from "../components/UpcomingRefills";
import MyMedications from "../components/MyMedications";
import DashboardStats from "../components/DashboardStats";
import RecentActivity from "../components/RecentActivity";
import { useAuth } from "../auth/AuthContext";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.first_name || user.email?.split("@")[0] || "User";
  };

  if (loading) {
    return (
      <div className="drawer lg:drawer-open min-h-screen bg-base-200">
        <div className="drawer-content flex flex-col items-center justify-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* Top Navigation Bar */}
        <div className="navbar bg-base-100 shadow-sm border-b border-base-300">
          <div className="flex-none lg:hidden">
            <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
              <Bars3Icon className="w-6 h-6" />
            </label>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold ml-4">Dashboard</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {getGreeting()}, {getUserDisplayName()}!
            </h2>
            <p className="text-base-content/70 text-lg">{currentDate}</p>
          </div>

          {/* Dashboard Statistics */}
          {/* <DashboardStats /> */}

          {/* Dashboard Cards Grid */}
          <div className="mb-8 grid sm:grid-cols-1 gap-3">
            {/* Today's Schedule Card */}
            <div>
              <TodaySchedule />
            </div>
          </div>

          {/* My Medications and Upcoming Refills Grid */}
          <div className="mb-8 grid sm:grid-cols-2 gap-3">
            <MyMedications />
            {/* Upcoming Refills Card */}
            <div className="xl:col-span-1">
              <UpcomingRefills />
            </div>
          </div>

          {/* Bottom Section - Choose one of these options */}

          {/* Option 1: Functional Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Link
              to="/medications"
              className="card bg-primary text-primary-content hover:shadow-lg transition-shadow"
            >
              <div className="card-body items-center text-center">
                <div className="text-3xl mb-2">💊</div>
                <h3 className="card-title text-lg">Add Medication</h3>
                <p>Add new medication to your list</p>
                <div className="card-actions">
                  <button className="btn btn-primary-content btn-sm">
                    Add Now
                  </button>
                </div>
              </div>
            </Link>

            <Link
              to="/calendar"
              className="card bg-secondary text-secondary-content hover:shadow-lg transition-shadow"
            >
              <div className="card-body items-center text-center">
                <div className="text-3xl mb-2">📅</div>
                <h3 className="card-title text-lg">Calendar</h3>
                <p>View medication schedule</p>
                <div className="card-actions">
                  <button className="btn btn-secondary-content btn-sm">
                    View
                  </button>
                </div>
              </div>
            </Link>

            <Link
              to="/refills"
              className="card bg-accent text-accent-content hover:shadow-lg transition-shadow"
            >
              <div className="card-body items-center text-center">
                <div className="text-3xl mb-2">🔄</div>
                <h3 className="card-title text-lg">Refills</h3>
                <p>Manage prescription refills</p>
                <div className="card-actions">
                  <button className="btn btn-accent-content btn-sm">
                    Manage
                  </button>
                </div>
              </div>
            </Link>

            <Link
              to="/profile"
              className="card bg-info text-info-content hover:shadow-lg transition-shadow"
            >
              <div className="card-body items-center text-center">
                <div className="text-3xl mb-2">👤</div>
                <h3 className="card-title text-lg">Profile</h3>
                <p>Update your settings</p>
                <div className="card-actions">
                  <button className="btn btn-info-content btn-sm">Edit</button>
                </div>
              </div>
            </Link>
          </div>

          {/* Option 2: Recent Activity (comment out the Quick Actions above and uncomment this) */}
          {/*
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">Quick Tips</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Set medication reminders to never miss a dose</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Check your refill dates regularly to avoid running out</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Keep your medication list updated with your doctor</p>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <Link to="/medications" className="btn btn-primary btn-sm">
                    Manage Medications
                  </Link>
                </div>
              </div>
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}
