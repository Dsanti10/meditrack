/**
 * Converts 24-hour time format to 12-hour format with AM/PM
 * @param {string} timeString - Time in 24-hour format (e.g., "14:30" or "14:30:00")
 * @returns {string} Time in 12-hour format (e.g., "2:30 PM")
 */
export const formatTo12Hour = (timeString) => {
  if (!timeString) return "";

  // Handle both "HH:MM" and "HH:MM:SS" formats
  const timeParts = timeString.split(":");
  if (timeParts.length < 2) return timeString;

  const hour = parseInt(timeParts[0]);
  const minute = timeParts[1];

  if (isNaN(hour) || hour < 0 || hour > 23) return timeString;

  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${ampm}`;
};
