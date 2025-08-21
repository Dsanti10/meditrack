import { useState } from "react";
import {
  BellIcon,
  PlusIcon,
  CalendarDaysIcon,
  ClockIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import SlimCalendar from "./SlimCalendar";
import { formatTo12Hour } from "../utils/timeFormat";

export default function RemindersModule() {
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Take Morning Medication",
      time: "08:00",
      date: "2025-08-13",
      type: "medication",
      completed: false,
    },
    {
      id: 2,
      title: "Doctor Appointment",
      time: "14:30",
      date: "2025-08-15",
      type: "appointment",
      completed: false,
    },
    {
      id: 3,
      title: "Refill Prescription",
      time: "10:00",
      date: "2025-08-16",
      type: "refill",
      completed: false,
    },
  ]);

  const [newReminder, setNewReminder] = useState({
    title: "",
    time: "",
    date: selectedDate.toISOString().split("T")[0],
    type: "medication",
  });

  const handleAddReminder = () => {
    if (newReminder.title && newReminder.time && newReminder.date) {
      const reminder = {
        id: Date.now(),
        ...newReminder,
        completed: false,
      };
      setReminders([...reminders, reminder]);
      setNewReminder({
        title: "",
        time: "",
        date: selectedDate.toISOString().split("T")[0],
        type: "medication",
      });
      setShowAddReminder(false);
    }
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

  const todayReminders = reminders.filter(
    (reminder) => reminder.date === new Date().toISOString().split("T")[0]
  );

  const upcomingReminders = reminders
    .filter(
      (reminder) => reminder.date > new Date().toISOString().split("T")[0]
    )
    .slice(0, 3);

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BellIcon className="w-6 h-6 text-primary" />
            <h2 className="card-title">Reminders</h2>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddReminder(true)}
          >
            <PlusIcon className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Slim Calendar */}
        <div className="mb-6">
          <SlimCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            reminders={reminders}
          />
        </div>

        {/* Today's Reminders */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <ClockIcon className="w-5 h-5" />
            Today's Reminders ({todayReminders.length})
          </h3>
          {todayReminders.length > 0 ? (
            <div className="space-y-2">
              {todayReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    reminder.completed
                      ? "bg-success/10 border-success/20"
                      : "bg-base-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={reminder.completed}
                      onChange={() => handleToggleComplete(reminder.id)}
                    />
                    <span className="text-lg">
                      {getTypeIcon(reminder.type)}
                    </span>
                    <div>
                      <p
                        className={`font-medium ${
                          reminder.completed
                            ? "line-through text-base-content/50"
                            : ""
                        }`}
                      >
                        {reminder.title}
                      </p>
                      <p className="text-sm text-base-content/60">
                        {formatTo12Hour(reminder.time)}
                      </p>
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
                    <button
                      className="btn btn-ghost btn-xs text-error"
                      onClick={() => handleDeleteReminder(reminder.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-base-content/50 text-center py-4">
              No reminders for today
            </p>
          )}
        </div>

        {/* Upcoming Reminders */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5" />
            Upcoming ({upcomingReminders.length})
          </h3>
          {upcomingReminders.length > 0 ? (
            <div className="space-y-2">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-2 rounded border border-base-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      {getTypeIcon(reminder.type)}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{reminder.title}</p>
                      <p className="text-xs text-base-content/60">
                        {reminder.date} at {formatTo12Hour(reminder.time)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`badge ${getTypeColor(reminder.type)} badge-xs`}
                  >
                    {reminder.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-base-content/50 text-center py-2 text-sm">
              No upcoming reminders
            </p>
          )}
        </div>

        {/* Add Reminder Modal */}
        {showAddReminder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="card bg-base-100 w-full max-w-md mx-4">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Add New Reminder</h3>
                  <button
                    className="btn btn-ghost btn-sm btn-circle"
                    onClick={() => setShowAddReminder(false)}
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
                    value={newReminder.title}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, title: e.target.value })
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
                      value={newReminder.date}
                      onChange={(e) =>
                        setNewReminder({ ...newReminder, date: e.target.value })
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
                      value={newReminder.time}
                      onChange={(e) =>
                        setNewReminder({ ...newReminder, time: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text">Type</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={newReminder.type}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, type: e.target.value })
                    }
                  >
                    <option value="medication">💊 Medication</option>
                    <option value="appointment">🏥 Appointment</option>
                    <option value="refill">📋 Refill</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    className="btn btn-outline flex-1"
                    onClick={() => setShowAddReminder(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary flex-1"
                    onClick={handleAddReminder}
                  >
                    Add Reminder
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
