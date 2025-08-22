import db from "#db/client";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Create a test user
  const testUser = await createUser({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password123",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State 12345",
    dateOfBirth: "1985-03-15",
    emergencyContact: "Jane Doe - (555) 987-6543",
    bloodType: "A+",
    primaryDoctor: "Dr. Sarah Smith",
    insurance: "Blue Cross Blue Shield",
    insuranceNumber: "BC123456789",
    allergies: ["Penicillin", "Shellfish"],
    medicalConditions: ["Hypertension", "Type 2 Diabetes"],
  });
  const userId = testUser.id;

  // Seed medications
  const medications = [
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      current_stock: 25,
      status: "active",
      color: "primary",
      notes: "Take with meals to reduce stomach upset",
      prescribed_by: "Dr. Smith",
      start_date: "2024-01-15",
      refills_remaining: 3,
      prescription_number: "RX123456",
      pharmacy: "CVS Pharmacy",
    },
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      current_stock: 28,
      status: "active",
      color: "secondary",
      notes: "Monitor blood pressure regularly",
      prescribed_by: "Dr. Johnson",
      start_date: "2023-11-20",
      refills_remaining: 5,
      prescription_number: "RX789012",
      pharmacy: "Walgreens",
    },
    {
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      current_stock: 30,
      status: "active",
      color: "accent",
      notes: "Take before bedtime for cholesterol management",
      prescribed_by: "Dr. Smith",
      start_date: "2024-02-01",
      refills_remaining: 2,
      prescription_number: "RX901234",
      pharmacy: "Target Pharmacy",
    },
    {
      name: "Levothyroxine",
      dosage: "75mcg",
      frequency: "Once daily",
      current_stock: 29,
      status: "active",
      color: "success",
      notes: "Take on empty stomach, 30-60 minutes before breakfast",
      prescribed_by: "Dr. Wilson",
      start_date: "2023-10-01",
      refills_remaining: 4,
      prescription_number: "RX111222",
      pharmacy: "CVS Pharmacy",
    },
    {
      name: "Omega-3 Fish Oil",
      dosage: "1000mg",
      frequency: "Twice daily",
      current_stock: 45,
      status: "active",
      color: "info",
      notes: "Heart health supplement - take with meals",
      prescribed_by: "Dr. Martinez",
      start_date: "2024-03-01",
      refills_remaining: 6,
      prescription_number: "RX333444",
      pharmacy: "Walgreens",
    },
    {
      name: "Vitamin D3",
      dosage: "2000 IU",
      frequency: "Once daily",
      current_stock: 15,
      status: "active",
      color: "warning",
      notes: "Supplement - take with fatty meal for better absorption",
      prescribed_by: "Dr. Wilson",
      start_date: "2024-01-01",
      refills_remaining: 2,
      prescription_number: "RX345678",
      pharmacy: "CVS Pharmacy",
    },
    {
      name: "Probiotic Complex",
      dosage: "10 billion CFU",
      frequency: "Once daily",
      current_stock: 22,
      status: "active",
      color: "success",
      notes: "Digestive health - take with or after meals",
      prescribed_by: "Dr. Chen",
      start_date: "2024-04-15",
      refills_remaining: 3,
      prescription_number: "RX555666",
      pharmacy: "Target Pharmacy",
    },
    {
      name: "Low-dose Aspirin",
      dosage: "81mg",
      frequency: "Once daily",
      current_stock: 2,
      status: "active",
      color: "warning",
      notes: "Heart health - low stock, need refill soon",
      prescribed_by: "Dr. Smith",
      start_date: "2023-12-01",
      refills_remaining: 1,
      prescription_number: "RX567890",
      pharmacy: "Walgreens",
    },
    {
      name: "Calcium + Magnesium",
      dosage: "500mg/250mg",
      frequency: "Twice daily",
      current_stock: 0,
      status: "paused",
      color: "error",
      notes: "Bone health supplement - currently out of stock",
      prescribed_by: "Dr. Wilson",
      start_date: "2024-02-15",
      refills_remaining: 0,
      prescription_number: "RX777888",
      pharmacy: "CVS Pharmacy",
    },
  ];

  const medicationIds = [];
  for (const med of medications) {
    const result = await db.query(
      `
      INSERT INTO medications (user_id, name, dosage, frequency, current_stock, status, color, notes, prescribed_by, start_date, refills_remaining, prescription_number, pharmacy)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `,
      [
        userId,
        med.name,
        med.dosage,
        med.frequency,
        med.current_stock,
        med.status,
        med.color,
        med.notes,
        med.prescribed_by,
        med.start_date,
        med.refills_remaining,
        med.prescription_number,
        med.pharmacy,
      ]
    );
    medicationIds.push(result.rows[0].id);
  }

  // Seed medication schedules with diverse time slots
  const schedules = [
    { medication_idx: 0, times: ["08:00", "20:00"] }, // Metformin - morning & evening
    { medication_idx: 1, times: ["08:00"] }, // Lisinopril - morning
    { medication_idx: 2, times: ["22:00"] }, // Atorvastatin - bedtime
    { medication_idx: 3, times: ["07:00"] }, // Levothyroxine - early morning (empty stomach)
    { medication_idx: 4, times: ["08:30", "18:30"] }, // Omega-3 - with meals
    { medication_idx: 5, times: ["12:00"] }, // Vitamin D3 - with lunch
    { medication_idx: 6, times: ["19:00"] }, // Probiotic - with dinner
    { medication_idx: 7, times: ["21:30"] }, // Low-dose Aspirin - evening
    // Note: Calcium + Magnesium (idx 8) is paused, so no schedule
  ];

  for (const schedule of schedules) {
    for (const time of schedule.times) {
      await db.query(
        `
        INSERT INTO medication_schedules (medication_id, time_slot)
        VALUES ($1, $2)
      `,
        [medicationIds[schedule.medication_idx], time]
      );
    }
  }

  // Seed medication reminders to demonstrate calendar integration
  const medicationReminders = [
    // Metformin reminders (twice daily)
    {
      title: "Take Metformin",
      description: "500mg - Twice daily",
      reminder_date: "2025-08-22",
      reminder_time: "08:00",
      type: "medication",
      medication_id: medicationIds[0],
      is_recurring: true,
      recurrence_pattern: "daily",
    },
    {
      title: "Take Metformin",
      description: "500mg - Twice daily",
      reminder_date: "2025-08-22",
      reminder_time: "20:00",
      type: "medication",
      medication_id: medicationIds[0],
      is_recurring: true,
      recurrence_pattern: "daily",
    },
    // Lisinopril reminder (once daily)
    {
      title: "Take Lisinopril",
      description: "10mg - Once daily",
      reminder_date: "2025-08-22",
      reminder_time: "08:00",
      type: "medication",
      medication_id: medicationIds[1],
      is_recurring: true,
      recurrence_pattern: "daily",
    },
    // Levothyroxine reminder (early morning)
    {
      title: "Take Levothyroxine",
      description: "75mcg - Once daily (empty stomach)",
      reminder_date: "2025-08-22",
      reminder_time: "07:00",
      type: "medication",
      medication_id: medicationIds[3],
      is_recurring: true,
      recurrence_pattern: "daily",
    },
    // Omega-3 reminders (twice daily with meals)
    {
      title: "Take Omega-3 Fish Oil",
      description: "1000mg - Twice daily with meals",
      reminder_date: "2025-08-22",
      reminder_time: "08:30",
      type: "medication",
      medication_id: medicationIds[4],
      is_recurring: true,
      recurrence_pattern: "daily",
    },
    {
      title: "Take Omega-3 Fish Oil",
      description: "1000mg - Twice daily with meals",
      reminder_date: "2025-08-22",
      reminder_time: "18:30",
      type: "medication",
      medication_id: medicationIds[4],
      is_recurring: true,
      recurrence_pattern: "daily",
    },
  ];

  for (const reminder of medicationReminders) {
    await db.query(
      `
      INSERT INTO reminders (user_id, title, description, reminder_date, reminder_time, type, medication_id, is_recurring, recurrence_pattern)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
      [
        userId,
        reminder.title,
        reminder.description,
        reminder.reminder_date,
        reminder.reminder_time,
        reminder.type,
        reminder.medication_id,
        reminder.is_recurring,
        reminder.recurrence_pattern,
      ]
    );
  }

  // Seed appointments
  await db.query(
    `
    INSERT INTO appointments (user_id, title, doctor_name, appointment_date, appointment_time, location, appointment_type, status)
    VALUES 
    ($1, 'Cardiology Checkup', 'Dr. Smith', '2025-08-25', '14:30', 'Heart Center', 'routine', 'scheduled'),
    ($1, 'Annual Physical', 'Dr. Johnson', '2025-09-15', '10:00', 'Primary Care Clinic', 'annual', 'scheduled')
  `,
    [userId]
  );

  // Seed reminders
  await db.query(
    `
    INSERT INTO reminders (user_id, title, reminder_date, reminder_time, type, medication_id, is_completed)
    VALUES 
    ($1, 'Take Morning Medication', '2025-08-20', '08:00', 'medication', $2, false),
    ($1, 'Refill Prescription', '2025-08-22', '10:00', 'refill', $3, false),
    ($1, 'Doctor Appointment', '2025-08-25', '14:30', 'appointment', null, false)
  `,
    [userId, medicationIds[0], medicationIds[0]]
  );

  // Seed refills data
  const refillsData = [
    { med_idx: 0, days_left: 3, priority: "high", refill_date: "2025-08-23" },
    { med_idx: 1, days_left: 7, priority: "medium", refill_date: "2025-08-27" },
    { med_idx: 3, days_left: 5, priority: "medium", refill_date: "2025-08-25" },
    { med_idx: 2, days_left: 14, priority: "low", refill_date: "2025-09-03" },
  ];

  for (const refill of refillsData) {
    await db.query(
      `
      INSERT INTO refills (user_id, medication_id, prescription_number, pharmacy, refill_date, days_left, priority, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
    `,
      [
        userId,
        medicationIds[refill.med_idx],
        medications[refill.med_idx].prescription_number,
        medications[refill.med_idx].pharmacy,
        refill.refill_date,
        refill.days_left,
        refill.priority,
      ]
    );
  }

  // Seed user settings and notifications
  await db.query(
    `
    INSERT INTO user_settings (user_id, theme, language, timezone, date_format, time_format)
    VALUES ($1, 'system', 'en', 'America/New_York', 'MM/DD/YYYY', '12')
  `,
    [userId]
  );

  await db.query(
    `
    INSERT INTO user_notifications (user_id, medication_reminders, refill_alerts, appointment_reminders, email_notifications, sms_notifications)
    VALUES ($1, true, true, true, true, false)
  `,
    [userId]
  );
}
