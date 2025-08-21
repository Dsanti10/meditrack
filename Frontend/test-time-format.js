// Simple test of time formatting function

/**
 * Converts 24-hour time format to 12-hour format with AM/PM
 * @param {string} timeString - Time in 24-hour format (e.g., "14:30" or "14:30:00")
 * @returns {string} Time in 12-hour format (e.g., "2:30 PM")
 */
const formatTo12Hour = (timeString) => {
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

console.log("Testing formatTo12Hour function:");
console.log("08:00 ->", formatTo12Hour("08:00"));
console.log("14:30 ->", formatTo12Hour("14:30"));
console.log("23:45 ->", formatTo12Hour("23:45"));
console.log("00:15 ->", formatTo12Hour("00:15"));
console.log("12:00 ->", formatTo12Hour("12:00"));
console.log("12:30 ->", formatTo12Hour("12:30"));
console.log("01:00 ->", formatTo12Hour("01:00"));
console.log("13:00 ->", formatTo12Hour("13:00"));

// Test edge cases
console.log("Empty string ->", formatTo12Hour(""));
console.log("Invalid ->", formatTo12Hour("invalid"));
console.log("null ->", formatTo12Hour(null));
console.log("undefined ->", formatTo12Hour(undefined));
