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

// Create a new reminder
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
  } = reminderData;

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

// Update a reminder
export async function updateReminder(reminderId, userId, updateData) {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined && key !== "id" && key !== "user_id") {
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
