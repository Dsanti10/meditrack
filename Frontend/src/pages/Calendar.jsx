import { useState } from "react";
import {
  CalendarDaysIcon,
  PlusIcon,
  BellIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Take Morning Medication",
      time: "08:00",
      date: "2025-08-13",
      type: "medication",
      completed: false,
      description: "Take 2 tablets of medication with water",
    },
    {
      id: 2,
      title: "Doctor Appointment",
      time: "14:30",
      date: "2025-08-15",
      type: "appointment",
      completed: false,
      description: "Annual checkup with Dr. Smith",
    },
    {
      id: 3,
      title: "Refill Prescription",
      time: "10:00",
      date: "2025-08-16",
      type: "refill",
      completed: false,
      description: "Pick up prescription from pharmacy",
    },
  ]);

  const [reminderForm, setReminderForm] = useState({
    title: "",
    time: "",
    date: selectedDate.toISOString().split("T")[0],
    type: "medication",
    description: "",
  });

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
    const newDate = new Date(selectedDate);
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
    return date.toDateString() === selectedDate.toDateString();
  };

  const getRemindersForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return reminders.filter((reminder) => reminder.date === dateStr);
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
      setReminderForm({
        ...reminderForm,
        date: date.toISOString().split("T")[0],
      });
    }
  };

  const handleAddReminder = () => {
    if (reminderForm.title && reminderForm.time && reminderForm.date) {
      const reminder = {
        id: editingReminder ? editingReminder.id : Date.now(),
        ...reminderForm,
        completed: editingReminder ? editingReminder.completed : false,
      };

      if (editingReminder) {
        setReminders(
          reminders.map((r) => (r.id === editingReminder.id ? reminder : r))
        );
        setEditingReminder(null);
      } else {
        setReminders([...reminders, reminder]);
      }

      setReminderForm({
        title: "",
        time: "",
        date: selectedDate.toISOString().split("T")[0],
        type: "medication",
        description: "",
      });
      setShowAddReminder(false);
    }
  };

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
    setReminderForm({ ...reminder });
    setShowAddReminder(true);
  };

  const handleDeleteReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  const handleToggleComplete = (id) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
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
      default:
        return "badge-neutral";
    }
  };

  const days = getDaysInMonth(selectedDate);
  const selectedDateReminders = getRemindersForDate(selectedDate);

  return (
    <div className="min-h-screen bg-base-100 p-6">
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
                    {monthNames[selectedDate.getMonth()]}{" "}
                    {selectedDate.getFullYear()}
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
                                  {getTypeIcon(reminder.type)} {reminder.time}
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
                  {selectedDate.toLocaleDateString("en-US", {
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
                          reminder.completed
                            ? "bg-success/10 border-success/20"
                            : "bg-base-200"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-sm"
                              checked={reminder.completed}
                              onChange={() => handleToggleComplete(reminder.id)}
                            />
                            <div>
                              <h4
                                className={`font-medium ${
                                  reminder.completed
                                    ? "line-through text-base-content/50"
                                    : ""
                                }`}
                              >
                                {getTypeIcon(reminder.type)} {reminder.title}
                              </h4>
                              <p className="text-sm text-base-content/60">
                                {reminder.time}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="card bg-base-100 w-full max-w-md mx-4">
              <div className="card-body">
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
                        time: "",
                        date: selectedDate.toISOString().split("T")[0],
                        type: "medication",
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
                      value={reminderForm.date}
                      onChange={(e) =>
                        setReminderForm({
                          ...reminderForm,
                          date: e.target.value,
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
                      value={reminderForm.time}
                      onChange={(e) =>
                        setReminderForm({
                          ...reminderForm,
                          time: e.target.value,
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
                    <option value="medication">💊 Medication</option>
                    <option value="appointment">🏥 Appointment</option>
                    <option value="refill">📋 Refill</option>
                  </select>
                </div>

                <div className="form-control mb-6">
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

                <div className="flex gap-2">
                  <button
                    className="btn btn-outline flex-1"
                    onClick={() => {
                      setShowAddReminder(false);
                      setEditingReminder(null);
                      setReminderForm({
                        title: "",
                        time: "",
                        date: selectedDate.toISOString().split("T")[0],
                        type: "medication",
                        description: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary flex-1"
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
