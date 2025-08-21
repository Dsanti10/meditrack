import db from "#db/client";

// Calculate when refills are needed based on medication usage
export async function calculateRefillsNeeded(userId) {
  const sql = `
    SELECT 
      m.id as medication_id,
      m.name as medication_name,
      m.dosage,
      m.current_stock,
      m.prescription_number,
      m.pharmacy,
      m.frequency,
      array_agg(ms.time_slot ORDER BY ms.time_slot) as time_slots
    FROM medications m
    LEFT JOIN medication_schedules ms ON m.id = ms.medication_id AND ms.is_active = true
    WHERE m.user_id = $1 
    AND m.status = 'active'
    AND m.current_stock > 0
    GROUP BY m.id, m.name, m.dosage, m.current_stock, m.prescription_number, m.pharmacy, m.frequency
  `;

  const { rows: medications } = await db.query(sql, [userId]);
  const refillsNeeded = [];

  for (const med of medications) {
    // Calculate daily usage based on time slots
    const dailyDoses =
      med.time_slots.filter((slot) => slot !== null).length ||
      getDailyDosesFromFrequency(med.frequency);

    if (dailyDoses > 0) {
      const daysRemaining = Math.floor(med.current_stock / dailyDoses);

      // Only create refill entries for medications that need refills within 30 days
      if (daysRemaining <= 30) {
        const refillDate = new Date();
        refillDate.setDate(
          refillDate.getDate() + Math.max(daysRemaining - 3, 0)
        ); // Refill 3 days before running out

        let priority = "low";
        if (daysRemaining <= 3) priority = "high";
        else if (daysRemaining <= 7) priority = "medium";

        // Check if refill entry already exists
        const existingRefill = await db.query(
          "SELECT id FROM refills WHERE medication_id = $1 AND status IN ($2, $3)",
          [med.medication_id, "pending", "ordered"]
        );

        if (existingRefill.rows.length === 0) {
          // Create new refill entry
          await db.query(
            `
            INSERT INTO refills (user_id, medication_id, prescription_number, pharmacy, refill_date, days_left, priority, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
          `,
            [
              userId,
              med.medication_id,
              med.prescription_number,
              med.pharmacy,
              refillDate.toISOString().split("T")[0],
              daysRemaining,
              priority,
            ]
          );
        }

        refillsNeeded.push({
          medication_id: med.medication_id,
          medication_name: med.medication_name,
          dosage: med.dosage,
          current_stock: med.current_stock,
          days_remaining: daysRemaining,
          refill_date: refillDate.toISOString().split("T")[0],
          priority,
          prescription_number: med.prescription_number,
          pharmacy: med.pharmacy,
        });
      }
    }
  }

  return refillsNeeded;
}

// Helper function to extract daily doses from frequency string
function getDailyDosesFromFrequency(frequency) {
  const freq = frequency.toLowerCase();
  if (freq.includes("once")) return 1;
  if (freq.includes("twice")) return 2;
  if (freq.includes("three times")) return 3;
  if (freq.includes("four times")) return 4;
  if (freq.includes("every other day")) return 0.5;
  if (freq.includes("weekly")) return 1 / 7;
  if (freq.includes("as needed")) return 0.5; // Conservative estimate
  return 1; // Default to once daily
}

// Update medication stock when doses are taken
export async function updateMedicationStock(
  medicationId,
  userId,
  dosesConsumed = 1
) {
  const sql = `
    UPDATE medications 
    SET current_stock = GREATEST(current_stock - $1, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND user_id = $3
    RETURNING current_stock
  `;
  const { rows } = await db.query(sql, [dosesConsumed, medicationId, userId]);

  if (rows.length > 0) {
    // Check if refill calculation is needed
    await calculateRefillsNeeded(userId);
    return rows[0].current_stock;
  }
  return null;
}
