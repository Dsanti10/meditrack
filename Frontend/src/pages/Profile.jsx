import {
  UserCircleIcon,
  PencilIcon,
  CogIcon,
  BellIcon,
  HeartIcon,
  CalendarDaysIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CameraIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

export default function Profile() {
  // User profile state
  const [userProfile, setUserProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State 12345",
    dateOfBirth: "1985-03-15",
    emergencyContact: "Jane Doe - (555) 987-6543",
    bloodType: "A+",
    allergies: ["Penicillin", "Shellfish"],
    medicalConditions: ["Hypertension", "Type 2 Diabetes"],
    primaryDoctor: "Dr. Sarah Smith",
    insurance: "Blue Cross Blue Shield",
    insuranceNumber: "BC123456789",
    avatar: null,
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...userProfile });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    medicationReminders: true,
    refillAlerts: true,
    appointmentReminders: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  // Settings state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    theme: localStorage.getItem("theme") || "system",
    language: "en",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12",
  });

  // Theme handling
  useEffect(() => {
    const applyTheme = () => {
      const html = document.querySelector("html");

      if (settings.theme === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        html.setAttribute("data-theme", systemPrefersDark ? "dark" : "light");
      } else {
        html.setAttribute("data-theme", settings.theme);
      }
    };

    applyTheme();

    // Listen for system theme changes if theme is set to system
    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [settings.theme]);

  const handleThemeChange = (newTheme) => {
    const updatedSettings = { ...settings, theme: newTheme };
    setSettings(updatedSettings);
    localStorage.setItem("theme", newTheme);
  };

  const handleSettingsChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Save to localStorage or send to backend
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(`setting_${key}`, JSON.stringify(value));
    });
    setIsSettingsModalOpen(false);
  };

  const handleSaveProfile = () => {
    setUserProfile({ ...tempProfile });
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setTempProfile({ ...userProfile });
    setIsEditingProfile(false);
    setIsEditingMedical(false);
  };

  const handleSaveMedical = () => {
    setUserProfile({ ...tempProfile });
    setIsEditingMedical(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile({ ...tempProfile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Profile</h1>
            <p className="text-base-content/70">
              Manage your personal information and settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl sticky top-6">
              <div className="card-body text-center">
                {/* Avatar Section */}
                <div className="relative mx-auto mb-4">
                  <div className="avatar">
                    <div className="w-32 h-32 rounded-full border-4 border-primary/20">
                      {userProfile.avatar ? (
                        <img src={userProfile.avatar} alt="Profile" />
                      ) : (
                        <div className="bg-primary/10 flex items-center justify-center">
                          <UserCircleIcon className="w-20 h-20 text-primary/50" />
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="absolute bottom-2 right-2 btn btn-circle btn-primary btn-sm cursor-pointer">
                    <CameraIcon className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <h2 className="text-2xl font-bold">
                  {userProfile.firstName} {userProfile.lastName}
                </h2>
                <p className="text-base-content/70 mb-4">{userProfile.email}</p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="stat bg-primary/10 rounded-lg p-3">
                    <div className="stat-value text-lg text-primary">5</div>
                    <div className="stat-title text-xs">Active Meds</div>
                  </div>
                  <div className="stat bg-secondary/10 rounded-lg p-3">
                    <div className="stat-value text-lg text-secondary">12</div>
                    <div className="stat-title text-xs">Daily Doses</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <button className="btn btn-primary btn-sm w-full">
                    <PencilIcon className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    className="btn btn-outline btn-sm w-full"
                    onClick={() => setIsSettingsModalOpen(true)}
                  >
                    <CogIcon className="w-4 h-4" />
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <UserCircleIcon className="w-6 h-6" />
                    Personal Information
                  </h3>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setTempProfile({ ...userProfile });
                      setIsEditingProfile(!isEditingProfile);
                    }}
                  >
                    <PencilIcon className="w-4 h-4" />
                    {isEditingProfile ? "Cancel" : "Edit"}
                  </button>
                </div>

                {isEditingProfile ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveProfile();
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">First Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={tempProfile.firstName}
                          onChange={(e) =>
                            setTempProfile({
                              ...tempProfile,
                              firstName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Last Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={tempProfile.lastName}
                          onChange={(e) =>
                            setTempProfile({
                              ...tempProfile,
                              lastName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Email</span>
                        </label>
                        <input
                          type="email"
                          className="input input-bordered"
                          value={tempProfile.email}
                          onChange={(e) =>
                            setTempProfile({
                              ...tempProfile,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Phone</span>
                        </label>
                        <input
                          type="tel"
                          className="input input-bordered"
                          value={tempProfile.phone}
                          onChange={(e) =>
                            setTempProfile({
                              ...tempProfile,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Address</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={tempProfile.address}
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Date of Birth</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered"
                        value={tempProfile.dateOfBirth}
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            dateOfBirth: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="w-5 h-5 text-base-content/50" />
                        <div>
                          <p className="text-sm text-base-content/50">Email</p>
                          <p className="font-medium">{userProfile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="w-5 h-5 text-base-content/50" />
                        <div>
                          <p className="text-sm text-base-content/50">Phone</p>
                          <p className="font-medium">{userProfile.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarDaysIcon className="w-5 h-5 text-base-content/50" />
                        <div>
                          <p className="text-sm text-base-content/50">
                            Date of Birth
                          </p>
                          <p className="font-medium">
                            {new Date(
                              userProfile.dateOfBirth
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPinIcon className="w-5 h-5 text-base-content/50" />
                        <div>
                          <p className="text-sm text-base-content/50">
                            Address
                          </p>
                          <p className="font-medium">{userProfile.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <HeartIcon className="w-6 h-6" />
                    Medical Information
                  </h3>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setTempProfile({ ...userProfile });
                      setIsEditingMedical(!isEditingMedical);
                    }}
                  >
                    <PencilIcon className="w-4 h-4" />
                    {isEditingMedical ? "Cancel" : "Edit"}
                  </button>
                </div>

                {isEditingMedical ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveMedical();
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Blood Type</span>
                        </label>
                        <select
                          className="select select-bordered"
                          value={tempProfile.bloodType}
                          onChange={(e) =>
                            setTempProfile({
                              ...tempProfile,
                              bloodType: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Blood Type</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Primary Doctor</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={tempProfile.primaryDoctor}
                          onChange={(e) =>
                            setTempProfile({
                              ...tempProfile,
                              primaryDoctor: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Emergency Contact</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={tempProfile.emergencyContact}
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            emergencyContact: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          Allergies (comma separated)
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={tempProfile.allergies.join(", ")}
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            allergies: e.target.value
                              .split(",")
                              .map((a) => a.trim())
                              .filter((a) => a),
                          })
                        }
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          Medical Conditions (comma separated)
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={tempProfile.medicalConditions.join(", ")}
                        onChange={(e) =>
                          setTempProfile({
                            ...tempProfile,
                            medicalConditions: e.target.value
                              .split(",")
                              .map((c) => c.trim())
                              .filter((c) => c),
                          })
                        }
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-base-content/50 mb-1">
                          Blood Type
                        </p>
                        <p className="font-medium">{userProfile.bloodType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/50 mb-1">
                          Primary Doctor
                        </p>
                        <p className="font-medium">
                          {userProfile.primaryDoctor}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/50 mb-1">
                          Emergency Contact
                        </p>
                        <p className="font-medium">
                          {userProfile.emergencyContact}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-base-content/50 mb-1">
                          Allergies
                        </p>
                        <div className="flex gap-1 flex-wrap">
                          {userProfile.allergies.map((allergy, index) => (
                            <span key={index} className="badge badge-error">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/50 mb-1">
                          Medical Conditions
                        </p>
                        <div className="flex gap-1 flex-wrap">
                          {userProfile.medicalConditions.map(
                            (condition, index) => (
                              <span key={index} className="badge badge-warning">
                                {condition}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
                  <BellIcon className="w-6 h-6" />
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="form-control">
                      <label className="label cursor-pointer justify-start gap-4">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={value}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              [key]: e.target.checked,
                            })
                          }
                        />
                        <div>
                          <span className="label-text font-medium">
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </span>
                          <p className="text-sm text-base-content/50">
                            {key === "medicationReminders" &&
                              "Get reminded to take your medications"}
                            {key === "refillAlerts" &&
                              "Alerts when medications need refills"}
                            {key === "appointmentReminders" &&
                              "Reminders for upcoming appointments"}
                            {key === "emailNotifications" &&
                              "Receive notifications via email"}
                            {key === "smsNotifications" &&
                              "Receive notifications via SMS"}
                          </p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        {isSettingsModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-2xl mb-6 flex items-center gap-2">
                <CogIcon className="w-6 h-6" />
                Settings
              </h3>

              {/* Theme Settings */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <SunIcon className="w-5 h-5" />
                  Theme Preferences
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    className={`btn ${
                      settings.theme === "light" ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => handleThemeChange("light")}
                  >
                    <SunIcon className="w-4 h-4" />
                    Light
                  </button>
                  <button
                    className={`btn ${
                      settings.theme === "dark" ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => handleThemeChange("dark")}
                  >
                    <MoonIcon className="w-4 h-4" />
                    Dark
                  </button>
                  <button
                    className={`btn ${
                      settings.theme === "system"
                        ? "btn-primary"
                        : "btn-outline"
                    }`}
                    onClick={() => handleThemeChange("system")}
                  >
                    <ComputerDesktopIcon className="w-4 h-4" />
                    System
                  </button>
                </div>
                <p className="text-sm text-base-content/60 mt-2">
                  {settings.theme === "system"
                    ? "Theme will automatically switch based on your device settings"
                    : `Using ${settings.theme} theme`}
                </p>
              </div>

              {/* Language & Region */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <GlobeAltIcon className="w-5 h-5" />
                  Language & Region
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Language</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={settings.language}
                      onChange={(e) =>
                        handleSettingsChange("language", e.target.value)
                      }
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Timezone</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={settings.timezone}
                      onChange={(e) =>
                        handleSettingsChange("timezone", e.target.value)
                      }
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">GMT</option>
                      <option value="Europe/Paris">
                        Central European Time
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Date & Time Format */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5" />
                  Date & Time Format
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date Format</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={settings.dateFormat}
                      onChange={(e) =>
                        handleSettingsChange("dateFormat", e.target.value)
                      }
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      <option value="MMM DD, YYYY">MMM DD, YYYY</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Time Format</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={settings.timeFormat}
                      onChange={(e) =>
                        handleSettingsChange("timeFormat", e.target.value)
                      }
                    >
                      <option value="12">12 Hour (AM/PM)</option>
                      <option value="24">24 Hour</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setIsSettingsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
