import { createContext, useContext, useState, useEffect } from "react";
import { useApi } from "../api/ApiContext";
import { useAuth } from "../auth/AuthContext";

const ReminderContext = createContext();

export function ReminderProvider({ children }) {
  const { request, invalidateTags } = useApi();
  const { user, loading: authLoading } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all reminders
  const fetchReminders = async () => {
    console.log(
      "fetchReminders called, user:",
      user,
      "authLoading:",
      authLoading
    );

    // Don't fetch if user is not authenticated
    if (!user) {
      console.log("No user, clearing reminders");
      setReminders([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    console.log("Fetching reminders for user:", user.id);
    try {
      const data = await request("/reminders");
      console.log("Reminders fetched successfully:", data);
      setReminders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reminders:", err);
      setError(err.message);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new reminder
  const createReminder = async (reminderData) => {
    if (!user) {
      throw new Error("You must be logged in to create reminders");
    }

    try {
      const newReminder = await request("/reminders", {
        method: "POST",
        body: JSON.stringify(reminderData),
      });
      setReminders((prev) => [...prev, newReminder]);
      // Invalidate related queries to refresh components
      invalidateTags(["reminders", "todaySchedule"]);
      return newReminder;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update a reminder
  const updateReminder = async (id, reminderData) => {
    if (!user) {
      throw new Error("You must be logged in to update reminders");
    }

    try {
      const updatedReminder = await request(`/reminders/${id}`, {
        method: "PUT",
        body: JSON.stringify(reminderData),
      });
      setReminders((prev) =>
        prev.map((reminder) =>
          reminder.id === id ? updatedReminder : reminder
        )
      );
      // Invalidate related queries to refresh components
      invalidateTags(["reminders", "todaySchedule"]);
      return updatedReminder;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete a reminder
  const deleteReminder = async (id) => {
    if (!user) {
      throw new Error("You must be logged in to delete reminders");
    }

    try {
      await request(`/reminders/${id}`, {
        method: "DELETE",
      });
      setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
      // Invalidate related queries to refresh components
      invalidateTags(["reminders", "todaySchedule"]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Mark reminder as complete/incomplete
  const toggleReminderComplete = async (id, isCompleted) => {
    if (!user) {
      throw new Error("You must be logged in to update reminders");
    }

    try {
      const updatedReminder = await request(`/reminders/${id}/complete`, {
        method: "PATCH",
        body: JSON.stringify({ is_completed: isCompleted }),
      });
      setReminders((prev) =>
        prev.map((reminder) =>
          reminder.id === id ? updatedReminder : reminder
        )
      );
      // Invalidate related queries to refresh components
      invalidateTags(["reminders", "todaySchedule"]);
      return updatedReminder;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get reminders for a specific date
  const getRemindersByDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split("T")[0];
    return reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.reminder_date)
        .toISOString()
        .split("T")[0];
      return reminderDate === dateString;
    });
  };

  // Get today's reminders
  const getTodaysReminders = () => {
    const today = new Date();
    return getRemindersByDate(today);
  };

  // Get upcoming reminders (next 7 days)
  const getUpcomingReminders = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.reminder_date);
      return reminderDate >= today && reminderDate <= nextWeek;
    });
  };

  useEffect(() => {
    console.log("ReminderContext useEffect:", { user: user?.id, authLoading });
    // Only fetch reminders when auth loading is complete and user exists
    if (!authLoading && user) {
      console.log("Calling fetchReminders");
      fetchReminders();
    } else if (!authLoading && !user) {
      // Clear reminders when not authenticated
      console.log("Not authenticated, clearing reminders");
      setReminders([]);
      setError(null);
    }
  }, [user, authLoading]);

  const value = {
    reminders,
    loading,
    error,
    fetchReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    toggleReminderComplete,
    getRemindersByDate,
    getTodaysReminders,
    getUpcomingReminders,
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminders() {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error("useReminders must be used within a ReminderProvider");
  }
  return context;
}
