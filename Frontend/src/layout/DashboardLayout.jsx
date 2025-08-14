import { Outlet } from "react-router";
import SideNavbar from "../components/SideNavbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="drawer lg:drawer-open">
        <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />

        {/* Main content area */}
        <div className="drawer-content flex flex-col">
          {/* Mobile menu button */}
          <div className="navbar lg:hidden bg-base-200">
            <div className="flex-none">
              <label
                htmlFor="drawer-toggle"
                className="btn btn-square btn-ghost"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">MediTrack Dashboard</h1>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>

        {/* Sidebar */}
        <SideNavbar />
      </div>
    </div>
  );
}
