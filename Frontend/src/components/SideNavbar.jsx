import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  CalendarDaysIcon,
  ClockIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import LogoutIcon from "@mui/icons-material/Logout";
import MedicationIcon from "@mui/icons-material/Medication";
import ThemeToggle from "./ThemeToggle";
import ThemeAwareIcon from "./ThemeAwareIcon";
import { useAuth } from "../auth/AuthContext";

export default function SideNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: HomeIcon, path: "/dashboard" },
    {
      id: "medications",
      label: "Medications",
      icon: MedicationIcon,
      path: "/medications",
    },
    {
      id: "calendar_reminders",
      label: "Calendar & Reminders",
      icon: CalendarDaysIcon,
      path: "/calendar",
    },
    { id: "refills", label: "Refills", icon: ClockIcon, path: "/refills" },
    { id: "profile", label: "Profile", icon: UserIcon, path: "/profile" },
    {
      id: "logout",
      label: "Logout",
      icon: LogoutIcon,
      action: "logout",
    },
  ];

  // Check if current path matches menu item
  const isActivePath = (path) => location.pathname === path;

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return "User";

    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
      return user.first_name;
    } else if (user.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";

    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    } else if (user.first_name) {
      return user.first_name[0].toUpperCase();
    } else if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <div className="drawer-side z-40">
      <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
      <aside className="min-h-full w-64 sm:w-72 bg-base-200 text-base-content flex flex-col">
        {/* Logo/Brand */}
        <div className="p-3 sm:p-4 border-b border-base-300 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center">
                <ThemeAwareIcon className="w-8 sm:w-10 h-8 sm:h-10" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-primary truncate">
                MediTrack
              </h1>
              <p className="text-xs sm:text-sm text-base-content/70 truncate">
                Health Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-3 sm:p-4 border-b border-base-300 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-center items-center">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-primary text-primary-content flex text-center items-center justify-center font-semibold text-lg flex-shrink-0">
                {getUserInitials()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">
                {getUserDisplayName()}
              </h3>
              <p className="text-xs sm:text-sm text-base-content/70 truncate">
                {user?.email || "Loading..."}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 sm:p-4 flex-1 overflow-y-auto">
          <ul className="menu menu-vertical gap-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActivePath(item.path);

              // Handle logout action
              if (item.action === "logout") {
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        logout();
                        window.location.href = "/login";
                      }}
                      className="flex items-center gap-3 p-2 sm:p-3 rounded-lg transition-colors text-sm sm:text-base hover:bg-base-300 w-full text-left"
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="font-medium truncate">{item.label}</span>
                    </button>
                  </li>
                );
              }

              // Regular menu items with navigation
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-2 sm:p-3 rounded-lg transition-colors text-sm sm:text-base ${
                      isActive
                        ? "bg-primary text-primary-content"
                        : "hover:bg-base-300"
                    }`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="font-medium truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Theme Toggle and Footer */}
        <div className="p-3 sm:p-4 border-t border-base-300">
          <div className="flex items-center justify-between">
            <span className="text-xs text-base-content/70">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </div>
  );
}
