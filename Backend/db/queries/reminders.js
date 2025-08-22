import db from "#db/client";

// Get all reminders for a user
export async function getRemindersByUserId(userId) {
  const sql = `
    SELECT r.*, 
           m.name as medication_name,
           a.title as appointment_title
    FROM reminders r
    LEFT JOIN medications m ON r.medication_id = m.id
    LEFT JOIN appointments a ON r.appointment_id = a.id
    WHERE r.user_id = $1
    ORDER BY r.reminder_date, r.reminder_time
  `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

// Get upcoming reminders (next 7 days)
export async function getUpcomingReminders(userId) {
  const sql = `
    SELECT r.*, 
           m.name as medication_name,
           a.title as appointment_title
    FROM reminders r
    LEFT JOIN medications m ON r.medication_id = m.id
    LEFT JOIN appointments a ON r.appointment_id = a.id
    WHERE r.user_id = $1 
    AND r.reminder_date >= CURRENT_DATE 
    AND r.reminder_date <= CURRENT_DATE + INTERVAL '7 days'
    AND r.is_completed = false
    ORDER BY r.reminder_date, r.reminder_time
  `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

// Create a new reminder (with recurring logic)
export async function createReminder(reminderData) {
  const {
    user_id,
    title,
    description,
    reminder_date,
    reminder_time,
    type,
    medication_id,
    appointment_id,
    is_recurring = false,
    recurrence_pattern,
    end_date,
  } = reminderData;

  if (is_recurring && recurrence_pattern) {
    return await createRecurringReminders({
      user_id,
      title,
      description,
      reminder_date,
      reminder_time,
      type,
      medication_id,
      appointment_id,
      recurrence_pattern,
      end_date,
    });
  }

  const sql = `
    INSERT INTO reminders (
      user_id, title, description, reminder_date, reminder_time, type,
      medication_id, appointment_id, is_recurring, recurrence_pattern
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;

  const {
    rows: [reminder],
  } = await db.query(sql, [
    user_id,
    title,
    description,
    reminder_date,
    reminder_time,
    type,
    medication_id,
    appointment_id,
    is_recurring,
    recurrence_pattern,
  ]);

  return reminder;
}

// Create recurring reminders
export async function createRecurringReminders(reminderData) {
  const {
    user_id,
    title,
    description,
    reminder_date,
    reminder_time,
    type,
    medication_id,
    appointment_id,
    recurrence_pattern,
    end_date,
  } = reminderData;

  const reminders = [];
  const startDate = new Date(reminder_date);
  const endDate = end_date
    ? new Date(end_date)
    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default to 1 year

  let currentDate = new Date(startDate);
  let iterationCount = 0;
  const maxIterations = 1000; // Safety limit to prevent infinite loops

  while (currentDate <= endDate && iterationCount < maxIterations) {
    const sql = `
      INSERT INTO reminders (
        user_id, title, description, reminder_date, reminder_time, type,
        medication_id, appointment_id, is_recurring, recurrence_pattern
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const {
      rows: [reminder],
    } = await db.query(sql, [
      user_id,
      title,
      description,
      currentDate.toISOString().split("T")[0],
      reminder_time,
      type,
      medication_id,
      appointment_id,
      true,
      recurrence_pattern,
    ]);

    reminders.push(reminder);

    // Calculate next date based on recurrence pattern
    switch (recurrence_pattern) {
      case "daily":
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case "weekly":
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case "monthly":
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case "yearly":
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
      default:
        // For custom patterns like "every 2 days", "twice daily", etc.
        if (recurrence_pattern.includes("twice daily")) {
          // For twice daily, we need to create two reminders per day
          // This should be handled differently - create all instances for the day first
          if (reminders.length === 1) {
            // Create second reminder for the same day with evening time
            const eveningTime = "20:00"; // 8 PM default
            const eveningReminder = await db.query(sql, [
              user_id,
              title,
              description,
              currentDate.toISOString().split("T")[0],
              eveningTime,
              type,
              medication_id,
              appointment_id,
              true,
              recurrence_pattern,
            ]);
            reminders.push(eveningReminder.rows[0]);
          }
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (recurrence_pattern.includes("every")) {
          const match = recurrence_pattern.match(
            /every (\d+) (day|week|month)s?/
          );
          if (match) {
            const interval = parseInt(match[1]);
            const unit = match[2];
            switch (unit) {
              case "day":
                currentDate.setDate(currentDate.getDate() + interval);
                break;
              case "week":
                currentDate.setDate(currentDate.getDate() + interval * 7);
                break;
              case "month":
                currentDate.setMonth(currentDate.getMonth() + interval);
                break;
            }
          } else {
            currentDate.setDate(currentDate.getDate() + 1);
          }
        } else {
          currentDate.setDate(currentDate.getDate() + 1);
        }
        break;
    }

    iterationCount++;
  }

  return reminders;
}

// Update a reminder
export async function updateReminder(reminderId, userId, updateData) {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.entries(updateData).forEach(([key, value]) => {
    if (
      value !== undefined &&
      key !== "id" &&
      key !== "user_id" &&
      key !== "updated_at"
    ) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) return null;

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(reminderId, userId);

  const sql = `
    UPDATE reminders 
    SET ${fields.join(", ")}
    WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
    RETURNING *
  `;

  const { rows } = await db.query(sql, values);
  return rows.length > 0 ? rows[0] : null;
}

// Mark reminder as complete/incomplete
export async function markReminderComplete(reminderId, userId, isCompleted) {
  const sql = `
    UPDATE reminders 
    SET is_completed = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND user_id = $3
    RETURNING *
  `;
  const { rows } = await db.query(sql, [isCompleted, reminderId, userId]);
  return rows.length > 0 ? rows[0] : null;
}

// Delete a reminder
export async function deleteReminder(reminderId, userId) {
  const sql = `
    DELETE FROM reminders 
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `;
  const { rows } = await db.query(sql, [reminderId, userId]);
  return rows.length > 0;
}

// Create medication reminder from medication data
export async function createMedicationReminder(
  medicationId,
  userId,
  reminderData
) {
  // First, get the medication details
  const medicationQuery = `
    SELECT * FROM medications WHERE id = $1 AND user_id = $2
  `;
  const { rows: medications } = await db.query(medicationQuery, [
    medicationId,
    userId,
  ]);

  if (medications.length === 0) {
    throw new Error("Medication not found");
  }

  const medication = medications[0];

  const reminderTitle = reminderData.title || `Take ${medication.name}`;
  const reminderDescription =
    reminderData.description ||
    `${medication.dosage} - ${medication.frequency}`;

  return await createReminder({
    user_id: userId,
    medication_id: medicationId,
    title: reminderTitle,
    description: reminderDescription,
    reminder_date: reminderData.reminder_date,
    reminder_time: reminderData.reminder_time,
    type: "medication",
    is_recurring: reminderData.is_recurring || false,
    recurrence_pattern: reminderData.recurrence_pattern,
    end_date: reminderData.end_date,
  });
}
