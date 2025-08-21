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
      current_stock: 5,
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
      current_stock: 12,
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
      current_stock: 20,
      status: "active",
      color: "accent",
      notes: "Take before bedtime",
      prescribed_by: "Dr. Smith",
      start_date: "2024-02-01",
      refills_remaining: 2,
      prescription_number: "RX901234",
      pharmacy: "Target Pharmacy",
    },
    {
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      current_stock: 8,
      status: "active",
      color: "success",
      notes: "Supplement - take with fatty meal",
      prescribed_by: "Dr. Wilson",
      start_date: "2024-01-01",
      refills_remaining: 0,
      prescription_number: "RX345678",
      pharmacy: "CVS Pharmacy",
    },
    {
      name: "Aspirin",
      dosage: "81mg",
      frequency: "As needed",
      current_stock: 0,
      status: "paused",
      color: "warning",
      notes: "Low-dose for heart health - currently paused",
      prescribed_by: "Dr. Smith",
      start_date: "2023-12-01",
      refills_remaining: 1,
      prescription_number: "RX567890",
      pharmacy: "Walgreens",
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

  // Seed medication schedules
  const schedules = [
    { medication_idx: 0, times: ["08:00", "20:00"] }, // Metformin
    { medication_idx: 1, times: ["08:00"] }, // Lisinopril
    { medication_idx: 2, times: ["21:00"] }, // Atorvastatin
    { medication_idx: 3, times: ["08:00"] }, // Vitamin D3
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
