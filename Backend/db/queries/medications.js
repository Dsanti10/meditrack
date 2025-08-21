import db from "#db/client";

// Get all medications for a user
export async function getMedicationsByUserId(userId) {
  const sql = `
    SELECT m.*, 
           array_agg(ms.time_slot ORDER BY ms.time_slot) as time_slots
    FROM medications m
    LEFT JOIN medication_schedules ms ON m.id = ms.medication_id AND ms.is_active = true
    WHERE m.user_id = $1
    GROUP BY m.id
    ORDER BY m.name
  `;
  const { rows } = await db.query(sql, [userId]);
  return rows.map((row) => ({
    ...row,
    time_slots: row.time_slots.filter((slot) => slot !== null),
  }));
}

// Get a specific medication by id
export async function getMedicationById(medicationId, userId) {
  const sql = `
    SELECT m.*, 
           array_agg(ms.time_slot ORDER BY ms.time_slot) as time_slots
    FROM medications m
    LEFT JOIN medication_schedules ms ON m.id = ms.medication_id AND ms.is_active = true
    WHERE m.id = $1 AND m.user_id = $2
    GROUP BY m.id
  `;
  const { rows } = await db.query(sql, [medicationId, userId]);
  if (rows.length === 0) return null;

  const medication = rows[0];
  medication.time_slots = medication.time_slots.filter((slot) => slot !== null);
  return medication;
}

// Create a new medication
export async function createMedication(medicationData) {
  const {
    user_id,
    name,
    dosage,
    frequency,
    current_stock = 0,
    status = "active",
    color = "primary",
    notes,
    prescribed_by,
    start_date,
    refills_remaining = 0,
    prescription_number,
    pharmacy,
  } = medicationData;

  const sql = `
    INSERT INTO medications (
      user_id, name, dosage, frequency, current_stock, status, color, 
      notes, prescribed_by, start_date, refills_remaining, prescription_number, pharmacy
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `;

  const {
    rows: [medication],
  } = await db.query(sql, [
    user_id,
    name,
    dosage,
    frequency,
    current_stock,
    status,
    color,
    notes,
    prescribed_by,
    start_date,
    refills_remaining,
    prescription_number,
    pharmacy,
  ]);

  return medication;
}

// Update a medication
export async function updateMedication(medicationId, userId, updateData) {
  const fields = [];
  const values = [];
  let paramCount = 1;

  // Build dynamic update query
  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined && key !== "id" && key !== "user_id") {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) return null;

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(medicationId, userId);

  const sql = `
    UPDATE medications 
    SET ${fields.join(", ")}
    WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
    RETURNING *
  `;

  const { rows } = await db.query(sql, values);
  return rows.length > 0 ? rows[0] : null;
}

// Delete a medication
export async function deleteMedication(medicationId, userId) {
  const sql = `
    DELETE FROM medications 
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `;
  const { rows } = await db.query(sql, [medicationId, userId]);
  return rows.length > 0;
}

// Get medication schedules
export async function getMedicationSchedules(medicationId, userId) {
  const sql = `
    SELECT ms.* 
    FROM medication_schedules ms
    JOIN medications m ON ms.medication_id = m.id
    WHERE ms.medication_id = $1 AND m.user_id = $2 AND ms.is_active = true
    ORDER BY ms.time_slot
  `;
  const { rows } = await db.query(sql, [medicationId, userId]);
  return rows;
}

// Create a medication schedule
export async function createMedicationSchedule(medicationId, userId, timeSlot) {
  // First verify the medication belongs to the user
  const medicationCheck = await db.query(
    "SELECT id FROM medications WHERE id = $1 AND user_id = $2",
    [medicationId, userId]
  );

  if (medicationCheck.rows.length === 0) {
    return null;
  }

  const sql = `
    INSERT INTO medication_schedules (medication_id, time_slot)
    VALUES ($1, $2)
    RETURNING *
  `;
  const {
    rows: [schedule],
  } = await db.query(sql, [medicationId, timeSlot]);
  return schedule;
}

// Delete a medication schedule
export async function deleteMedicationSchedule(scheduleId, userId) {
  const sql = `
    UPDATE medication_schedules 
    SET is_active = false
    WHERE id = $1 
    AND medication_id IN (
      SELECT id FROM medications WHERE user_id = $2
    )
    RETURNING id
  `;
  const { rows } = await db.query(sql, [scheduleId, userId]);
  return rows.length > 0;
}

// Get today's medication schedule
export async function getTodayMedicationSchedule(userId) {
  const sql = `
    SELECT 
      m.id as medication_id,
      m.name,
      m.dosage,
      m.color,
      m.notes,
      ms.id as schedule_id,
      ms.time_slot,
      CASE 
        WHEN ml.id IS NOT NULL THEN 'completed'
        WHEN ms.time_slot <= CURRENT_TIME THEN 'pending'
        ELSE 'upcoming'
      END as status
    FROM medications m
    INNER JOIN medication_schedules ms ON m.id = ms.medication_id 
    LEFT JOIN medication_logs ml ON m.id = ml.medication_id 
      AND ml.scheduled_time = ms.time_slot 
      AND ml.date_taken = CURRENT_DATE
    WHERE m.user_id = $1 
      AND m.status = 'active'
      AND ms.is_active = true
    ORDER BY ms.time_slot
  `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}
