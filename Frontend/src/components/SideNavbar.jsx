import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  CalendarDaysIcon,
  BeakerIcon,
  ClockIcon,
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import MediTrackIcon from "../assets/MediTrackIcon.svg";

export default function SideNavbar() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: HomeIcon, path: "/dashboard" },
    {
      id: "calendar_reminders",
      label: "Calendar & Reminders",
      icon: CalendarDaysIcon,
      path: "/calendar",
    },
    {
      id: "medications",
      label: "Medications",
      icon: BeakerIcon,
      path: "/medications",
    },
    { id: "refills", label: "Refills", icon: ClockIcon, path: "/refills" },
    { id: "profile", label: "Profile", icon: UserIcon, path: "/profile" },
    {
      id: "settings",
      label: "Settings",
      icon: Cog6ToothIcon,
      path: "/settings",
    },
  ];

  // Check if current path matches menu item
  const isActivePath = (path) => location.pathname === path;

  return (
    <div className="drawer-side">
      <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
      <aside className="min-h-full w-64 bg-base-200 text-base-content">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <img
                  src={MediTrackIcon}
                  alt="MediTrack"
                  className="w-10 h-10"
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">MediTrack</h1>
              <p className="text-sm text-base-content/70">Health Dashboard</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full bg-accent">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User"
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-sm text-base-content/70">Patient ID: #12345</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="menu menu-vertical gap-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActivePath(item.path);
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-content"
                        : "hover:bg-base-300"
                    }`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
