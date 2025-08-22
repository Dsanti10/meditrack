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

  // If status is 'picked_up', properly update medication stock
  if (rows.length > 0 && status === "picked_up") {
    const refill = rows[0];

    // Get medication details to calculate proper refill amount
    const medicationQuery = `
      SELECT m.*, array_agg(ms.time_slot ORDER BY ms.time_slot) as time_slots
      FROM medications m
      LEFT JOIN medication_schedules ms ON m.id = ms.medication_id AND ms.is_active = true
      WHERE m.id = $1 AND m.user_id = $2
      GROUP BY m.id
    `;
    const {
      rows: [medication],
    } = await db.query(medicationQuery, [refill.medication_id, userId]);

    if (medication) {
      // Calculate daily doses based on time slots or frequency
      let dailyDoses = 0;
      if (medication.time_slots && medication.time_slots[0] !== null) {
        dailyDoses = medication.time_slots.filter(
          (slot) => slot !== null
        ).length;
      } else {
        // Fallback to frequency-based calculation
        const frequency = medication.frequency.toLowerCase();
        if (frequency.includes("once")) dailyDoses = 1;
        else if (frequency.includes("twice")) dailyDoses = 2;
        else if (frequency.includes("three") || frequency.includes("thrice"))
          dailyDoses = 3;
        else if (frequency.includes("four")) dailyDoses = 4;
        else dailyDoses = 1; // Default
      }

      // Standard 30-day supply (can be made configurable later)
      const refillAmount = dailyDoses * 30;

      // Update medication stock and reset status to active if needed
      await db.query(
        `
        UPDATE medications
        SET current_stock = current_stock + $1,
            status = 'active',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND user_id = $3
        `,
        [refillAmount, refill.medication_id, userId]
      );
    }
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
