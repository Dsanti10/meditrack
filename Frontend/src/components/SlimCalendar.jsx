import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function SlimCalendar({
  selectedDate,
  onDateSelect,
  reminders = [],
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

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

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
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

  const hasReminders = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split("T")[0];
    return reminders.some((reminder) => reminder.date === dateStr);
  };

  const getReminderCount = (date) => {
    if (!date) return 0;
    const dateStr = date.toISOString().split("T")[0];
    return reminders.filter((reminder) => reminder.date === dateStr).length;
  };

  const handleDateClick = (date) => {
    if (date) {
      onDateSelect(date);
    }
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="bg-base-200 rounded-lg p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="btn btn-ghost btn-sm btn-circle"
          onClick={() => navigateMonth(-1)}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          className="btn btn-ghost btn-sm btn-circle"
          onClick={() => navigateMonth(1)}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Days of the week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-base-content/60 p-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const reminderCount = getReminderCount(date);

          return (
            <div
              key={index}
              className={`
                relative aspect-square flex flex-col items-center justify-center text-sm cursor-pointer rounded-md transition-colors
                ${!date ? "invisible" : ""}
                ${
                  isSelected(date)
                    ? "bg-primary text-primary-content font-bold"
                    : "hover:bg-base-300"
                }
                ${
                  isToday(date) && !isSelected(date)
                    ? "bg-info/20 text-info font-semibold"
                    : ""
                }
                ${!date ? "" : ""}
              `}
              onClick={() => handleDateClick(date)}
            >
              {date && (
                <>
                  <span className="text-xs">{date.getDate()}</span>
                  {hasReminders(date) && (
                    <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2">
                      <div className="flex gap-0.5">
                        {Array.from(
                          { length: Math.min(reminderCount, 3) },
                          (_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-1 rounded-full ${
                                isSelected(date)
                                  ? "bg-primary-content"
                                  : "bg-primary"
                              }`}
                            />
                          )
                        )}
                        {reminderCount > 3 && (
                          <div
                            className={`w-1 h-1 rounded-full ${
                              isSelected(date)
                                ? "bg-primary-content"
                                : "bg-primary"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-base-content/60">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-info"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span>Has reminders</span>
        </div>
      </div>
    </div>
  );
}
