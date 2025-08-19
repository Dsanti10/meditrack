import { Link } from "react-router";
import { useState } from "react";
import TodaySchedule from "../components/TodaySchedule";
import UpcomingRefills from "../components/UpcomingRefills";
import MyMedications from "../components/MyMedications";
import SlimCalendar from "../components/SlimCalendar";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
            <h2 className="text-3xl font-bold mb-2">Good morning, John!</h2>
            <p className="text-base-content/70 text-lg">{currentDate}</p>
          </div>

          {/* Dashboard Cards Grid */}
          <div className="mb-8 grid sm:grid-cols-2 gap-3">
            {/* Today's Schedule Card */}
            <div>
              <TodaySchedule />
            </div>
            <div>
              <SlimCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                reminders={[]}
              />
            </div>
          </div>

          {/* My Medications Card - Full Width */}
          <div className="mb-8 grid sm:grid-cols-2 gap-3">
            <MyMedications />
            {/* Upcoming Refills Card */}
            <div className="xl:col-span-1">
              <UpcomingRefills />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card bg-primary text-primary-content">
              <div className="card-body items-center text-center">
                <h3 className="card-title text-lg">Quick Add</h3>
                <p>Log a dose</p>
                <div className="card-actions">
                  <button className="btn btn-primary-content btn-sm">
                    Add Now
                  </button>
                </div>
              </div>
            </div>

            <div className="card bg-secondary text-secondary-content">
              <div className="card-body items-center text-center">
                <h3 className="card-title text-lg">Emergency</h3>
                <p>Contact help</p>
                <div className="card-actions">
                  <button className="btn btn-secondary-content btn-sm">
                    Call
                  </button>
                </div>
              </div>
            </div>

            <div className="card bg-accent text-accent-content">
              <div className="card-body items-center text-center">
                <h3 className="card-title text-lg">Reports</h3>
                <p>View analytics</p>
                <div className="card-actions">
                  <button className="btn btn-accent-content btn-sm">
                    View
                  </button>
                </div>
              </div>
            </div>

            <div className="card bg-info text-info-content">
              <div className="card-body items-center text-center">
                <h3 className="card-title text-lg">Pharmacies</h3>
                <p>See List</p>
                <div className="card-actions">
                  <button className="btn btn-info-content btn-sm">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
