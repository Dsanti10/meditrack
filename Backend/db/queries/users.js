import db from "#db/client";
import bcrypt from "bcrypt";

export async function createUser({
  firstName,
  lastName,
  email,
  password,
  phone,
  address,
  dateOfBirth,
  emergencyContact,
  bloodType,
  primaryDoctor,
  insurance,
  insuranceNumber,
  allergies = [],
  medicalConditions = [],
}) {
  const sql = `
    INSERT INTO users
      (first_name, last_name, email, password, phone, address, date_of_birth, emergency_contact, blood_type, primary_doctor, insurance, insurance_number)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [
    firstName,
    lastName,
    email,
    hashedPassword,
    phone,
    address,
    dateOfBirth,
    emergencyContact,
    bloodType,
    primaryDoctor,
    insurance,
    insuranceNumber,
  ]);

  // Insert allergies
  if (Array.isArray(allergies)) {
    for (const allergy of allergies) {
      if (allergy && allergy.length > 0) {
        await db.query(
          "INSERT INTO user_allergies (user_id, allergy) VALUES ($1, $2)",
          [user.id, allergy]
        );
      }
    }
  }
  // Insert medical conditions
  if (Array.isArray(medicalConditions)) {
    for (const condition of medicalConditions) {
      if (condition && condition.length > 0) {
        await db.query(
          "INSERT INTO user_medical_conditions (user_id, condition) VALUES ($1, $2)",
          [user.id, condition]
        );
      }
    }
  }
  return user;
}

export async function getUserByEmailAndPassword(email, password) {
  const sql = `
  SELECT *
  FROM users
  WHERE email = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [email]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function getUserById(id) {
  const sql = `
  SELECT *
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
