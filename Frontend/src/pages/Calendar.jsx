import { useState, useEffect } from "react";
import {
  CalendarDaysIcon,
  PlusIcon,
  BellIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useReminders } from "../contexts/ReminderContext";
import { formatTo12Hour } from "../utils/timeFormat";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Ensure selectedDate is never null
  const safeSelectedDate = selectedDate || new Date();

  const {
    reminders,
    loading,
    error,
    createReminder,
    updateReminder,
    deleteReminder,
    toggleReminderComplete,
    getRemindersByDate,
  } = useReminders();

  const [reminderForm, setReminderForm] = useState({
    title: "",
    reminder_time: "",
    reminder_date: new Date().toISOString().split("T")[0],
    type: "general",
    description: "",
    is_recurring: false,
    recurrence_pattern: "daily",
    end_date: "",
  });

  // Update form date when selected date changes
  useEffect(() => {
    if (selectedDate) {
      setReminderForm((prev) => ({
        ...prev,
        reminder_date: safeSelectedDate.toISOString().split("T")[0],
      }));
    }
  }, [selectedDate, safeSelectedDate]);

  // Calendar functionality
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(safeSelectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === safeSelectedDate.toDateString();
  };

  const getRemindersForDate = (date) => {
    if (!date) return [];
    return getRemindersByDate(date);
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
      setReminderForm({
        ...reminderForm,
        reminder_date: date.toISOString().split("T")[0],
      });
    }
  };

  const handleAddReminder = async () => {
    if (
      reminderForm.title &&
      reminderForm.reminder_time &&
      reminderForm.reminder_date
    ) {
      try {
        if (editingReminder) {
          await updateReminder(editingReminder.id, reminderForm);
          setToastMessage("Reminder updated successfully!");
          setEditingReminder(null);
        } else {
          const result = await createReminder(reminderForm);
          const successMessage = reminderForm.is_recurring
            ? `Recurring reminder(s) created successfully! (${
                Array.isArray(result) ? result.length : "Multiple"
              } reminders)`
            : "Reminder created successfully!";
          setToastMessage(successMessage);
        }

        setReminderForm({
          title: "",
          reminder_time: "",
          reminder_date: safeSelectedDate.toISOString().split("T")[0],
          type: "general",
          description: "",
          is_recurring: false,
          recurrence_pattern: "daily",
          end_date: "",
        });
        setShowAddReminder(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        setToastMessage("Failed to save reminder. Please try again.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
    setReminderForm({
      title: reminder.title,
      reminder_time: reminder.reminder_time,
      reminder_date: reminder.reminder_date,
      type: reminder.type,
      description: reminder.description || "",
      is_recurring: reminder.is_recurring || false,
      recurrence_pattern: reminder.recurrence_pattern || "daily",
      end_date: reminder.end_date || "",
    });
    setShowAddReminder(true);
  };

  const handleDeleteReminder = async (id) => {
    if (confirm("Are you sure you want to delete this reminder?")) {
      try {
        await deleteReminder(id);
        setToastMessage("Reminder deleted successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        setToastMessage("Failed to delete reminder. Please try again.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const reminder = reminders.find((r) => r.id === id);
      if (reminder) {
        await toggleReminderComplete(id, !reminder.is_completed);
      }
    } catch (error) {
      setToastMessage("Failed to update reminder. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "medication":
        return "💊";
      case "appointment":
        return "🏥";
      case "refill":
        return "📋";
      default:
        return "⏰";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "medication":
        return "badge-primary";
      case "appointment":
        return "badge-secondary";
      case "refill":
        return "badge-warning";
      case "general":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  const days = getDaysInMonth(safeSelectedDate);
  const selectedDateReminders = getRemindersForDate(safeSelectedDate);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="ml-4 text-lg">Loading calendar...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-base-100 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="alert alert-error">
            <span>Failed to load reminders: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      {/* Toast notification */}
      {showToast && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Calendar</h1>
            <p className="text-base-content/70">
              Manage your medication schedule and appointments
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddReminder(true)}
          >
            <PlusIcon className="w-5 h-5" />
            Add Reminder
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Full Calendar */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <button
                    className="btn btn-ghost"
                    onClick={() => navigateMonth(-1)}
                  >
                    ←
                  </button>
                  <h2 className="text-2xl font-bold">
                    {monthNames[safeSelectedDate.getMonth()]}{" "}
                    {safeSelectedDate.getFullYear()}
                  </h2>
                  <button
                    className="btn btn-ghost"
                    onClick={() => navigateMonth(1)}
                  >
                    →
                  </button>
                </div>

                {/* Days of the week header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-base-content/60 py-2"
                    >
                      {day.slice(0, 3)}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((date, index) => {
                    const dateReminders = getRemindersForDate(date);

                    return (
                      <div
                        key={index}
                        className={`
                          min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors
                          ${!date ? "invisible" : ""}
                          ${
                            isSelected(date)
                              ? "bg-primary/20 border-primary"
                              : "border-base-300 hover:bg-base-200"
                          }
                          ${
                            isToday(date) && !isSelected(date)
                              ? "bg-info/10 border-info"
                              : ""
                          }
                        `}
                        onClick={() => handleDateClick(date)}
                      >
                        {date && (
                          <>
                            <div
                              className={`text-sm font-medium mb-1 ${
                                isToday(date) ? "text-info font-bold" : ""
                              }`}
                            >
                              {date.getDate()}
                            </div>
                            <div className="space-y-1">
                              {dateReminders.slice(0, 3).map((reminder) => (
                                <div
                                  key={reminder.id}
                                  className={`text-xs p-1 rounded truncate ${
                                    reminder.type === "medication"
                                      ? "bg-primary/20 text-primary"
                                      : reminder.type === "appointment"
                                      ? "bg-secondary/20 text-secondary"
                                      : "bg-warning/20 text-warning"
                                  }`}
                                >
                                  {getTypeIcon(reminder.type)}{" "}
                                  {formatTo12Hour(reminder.reminder_time)}
                                </div>
                              ))}
                              {dateReminders.length > 3 && (
                                <div className="text-xs text-base-content/60">
                                  +{dateReminders.length - 3} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Details */}
          <div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CalendarDaysIcon className="w-6 h-6" />
                  {safeSelectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>

                <div className="space-y-4">
                  {selectedDateReminders.length > 0 ? (
                    selectedDateReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className={`p-4 rounded-lg border ${
                          reminder.is_completed
                            ? "bg-success/10 border-success/20"
                            : "bg-base-200"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-sm"
                              checked={reminder.is_completed}
                              onChange={() => handleToggleComplete(reminder.id)}
                            />
                            <div>
                              <h4
                                className={`font-medium ${
                                  reminder.is_completed
                                    ? "line-through text-base-content/50"
                                    : ""
                                }`}
                              >
                                {getTypeIcon(reminder.type)} {reminder.title}
                              </h4>
                              <p className="text-sm text-base-content/60">
                                {formatTo12Hour(reminder.reminder_time)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              className="btn btn-ghost btn-xs"
                              onClick={() => handleEditReminder(reminder)}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              className="btn btn-ghost btn-xs text-error"
                              onClick={() => handleDeleteReminder(reminder.id)}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`badge ${getTypeColor(
                              reminder.type
                            )} badge-sm`}
                          >
                            {reminder.type}
                          </span>
                        </div>

                        {reminder.description && (
                          <p className="text-sm text-base-content/70 mt-2">
                            {reminder.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <BellIcon className="w-12 h-12 mx-auto text-base-300 mb-4" />
                      <p className="text-base-content/50">
                        No reminders for this date
                      </p>
                      <button
                        className="btn btn-primary btn-sm mt-4"
                        onClick={() => setShowAddReminder(true)}
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add Reminder
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Reminder Modal */}
        {showAddReminder && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">
                    {editingReminder ? "Edit Reminder" : "Add New Reminder"}
                  </h3>
                  <button
                    className="btn btn-ghost btn-sm btn-circle"
                    onClick={() => {
                      setShowAddReminder(false);
                      setEditingReminder(null);
                      setReminderForm({
                        title: "",
                        reminder_time: "",
                        reminder_date: safeSelectedDate
                          .toISOString()
                          .split("T")[0],
                        type: "general",
                        description: "",
                      });
                    }}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="Enter reminder title"
                    value={reminderForm.title}
                    onChange={(e) =>
                      setReminderForm({
                        ...reminderForm,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date</span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={reminderForm.reminder_date}
                      onChange={(e) =>
                        setReminderForm({
                          ...reminderForm,
                          reminder_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Time</span>
                    </label>
                    <input
                      type="time"
                      className="input input-bordered"
                      value={reminderForm.reminder_time}
                      onChange={(e) =>
                        setReminderForm({
                          ...reminderForm,
                          reminder_time: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Type</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={reminderForm.type}
                    onChange={(e) =>
                      setReminderForm({ ...reminderForm, type: e.target.value })
                    }
                  >
                    <option value="general">⏰ General</option>
                    <option value="medication">💊 Medication</option>
                    <option value="appointment">🏥 Appointment</option>
                    <option value="refill">📋 Refill</option>
                  </select>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Description (Optional)</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    placeholder="Enter additional details..."
                    value={reminderForm.description}
                    onChange={(e) =>
                      setReminderForm({
                        ...reminderForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label cursor-pointer">
                    <span className="label-text">Recurring Reminder</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={reminderForm.is_recurring}
                      onChange={(e) =>
                        setReminderForm({
                          ...reminderForm,
                          is_recurring: e.target.checked,
                        })
                      }
                    />
                  </label>
                </div>

                {reminderForm.is_recurring && (
                  <>
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Recurrence Pattern</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={reminderForm.recurrence_pattern}
                        onChange={(e) =>
                          setReminderForm({
                            ...reminderForm,
                            recurrence_pattern: e.target.value,
                          })
                        }
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="twice daily">Twice Daily</option>
                        <option value="every 2 days">Every 2 Days</option>
                        <option value="every 3 days">Every 3 Days</option>
                      </select>
                    </div>

                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">End Date (Optional)</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered"
                        value={reminderForm.end_date}
                        onChange={(e) =>
                          setReminderForm({
                            ...reminderForm,
                            end_date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}

                <div className="modal-action">
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setShowAddReminder(false);
                      setEditingReminder(null);
                      setReminderForm({
                        title: "",
                        reminder_time: "",
                        reminder_date: safeSelectedDate
                          .toISOString()
                          .split("T")[0],
                        type: "general",
                        description: "",
                        is_recurring: false,
                        recurrence_pattern: "daily",
                        end_date: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAddReminder}
                  >
                    {editingReminder ? "Update" : "Add"} Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
