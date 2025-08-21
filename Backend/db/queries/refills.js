import db from "#db/client";

// Get all refills for a user
export async function getRefillsByUserId(userId) {
  const sql = `
    SELECT r.*, m.name as medication_name, m.dosage
    FROM refills r
    JOIN medications m ON r.medication_id = m.id
    WHERE r.user_id = $1
    ORDER BY r.refill_date ASC, r.priority DESC
  `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

// Get upcoming refills that need attention (next 14 days or high priority)
export async function getUpcomingRefills(userId) {
  const sql = `
    SELECT r.*, m.name as medication_name, m.dosage, m.current_stock
    FROM refills r
    JOIN medications m ON r.medication_id = m.id
    WHERE r.user_id = $1 
    AND (
      r.refill_date <= CURRENT_DATE + INTERVAL '14 days'
      OR r.priority = 'high'
    )
    AND r.status IN ('pending', 'ordered')
    ORDER BY r.priority DESC, r.refill_date ASC
  `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

// Create a refill reminder
export async function createRefillReminder(refillData) {
  const {
    user_id,
    medication_id,
    prescription_number,
    pharmacy,
    refill_date,
    days_left,
    priority = "medium",
  } = refillData;

  const sql = `
    INSERT INTO refills (
      user_id, medication_id, prescription_number, pharmacy, 
      refill_date, days_left, priority
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const {
    rows: [refill],
  } = await db.query(sql, [
    user_id,
    medication_id,
    prescription_number,
    pharmacy,
    refill_date,
    days_left,
    priority,
  ]);

  return refill;
}

// Update refill status
export async function updateRefillStatus(refillId, userId, status) {
  const sql = `
    UPDATE refills 
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND user_id = $3
    RETURNING *
  `;
  const { rows } = await db.query(sql, [status, refillId, userId]);

  // If status is 'picked_up', increase medication stock
  if (rows.length > 0 && status === "picked_up") {
    const refill = rows[0];
    // Add 30 days worth of medication (estimate)
    await db.query(
      `
      UPDATE medications 
      SET current_stock = current_stock + 30,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
    `,
      [refill.medication_id, userId]
    );
  }

  return rows.length > 0 ? rows[0] : null;
}

// Set reminder for a refill
export async function setRefillReminder(refillId, userId, reminderSet = true) {
  const sql = `
    UPDATE refills 
    SET reminder_set = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND user_id = $3
    RETURNING *
  `;
  const { rows } = await db.query(sql, [reminderSet, refillId, userId]);
  return rows.length > 0 ? rows[0] : null;
}
