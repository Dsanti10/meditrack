import SideNavbar from "../components/SideNavbar";
import TodaySchedule from "../components/TodaySchedule";
import UpcomingRefills from "../components/UpcomingRefills";
import MyMedications from "../components/MyMedications";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
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

          <div className="flex-none gap-2">
            {/* Search */}
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search..."
                  className="input input-sm input-bordered w-auto"
                />
                <button className="btn btn-square btn-sm">
                  <MagnifyingGlassIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications */}
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <BellIcon className="w-6 h-6" />
                <span className="badge badge-primary badge-xs indicator-item">
                  3
                </span>
              </div>
            </button>

            {/* Profile */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <UserCircleIcon className="w-8 h-8" />
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a>Profile</a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Today's Schedule Card */}
            <div className="xl:col-span-2">
              <TodaySchedule />
            </div>

            {/* Upcoming Refills Card */}
            <div className="xl:col-span-1">
              <UpcomingRefills />
            </div>
          </div>

          {/* My Medications Card - Full Width */}
          <div className="mb-8">
            <MyMedications />
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
                <h3 className="card-title text-lg">Support</h3>
                <p>Get help</p>
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

      {/* Sidebar */}
      <SideNavbar />
    </div>
  );
}
