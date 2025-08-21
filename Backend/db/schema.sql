DROP DATABASE IF EXISTS meditrack;
CREATE DATABASE meditrack;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_allergies;
DROP TABLE IF EXISTS user_medical_conditions;

CREATE TABLE users (
  id serial PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  phone text,
  address text,
  date_of_birth date,
  emergency_contact text,
  blood_type text,
  primary_doctor text,
  insurance text,
  insurance_number text,
  avatar_url text
);

CREATE TABLE user_allergies (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  allergy text NOT NULL
);

CREATE TABLE user_medical_conditions (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  condition text NOT NULL
);

CREATE TABLE medications (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  current_stock integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'discontinued')),
  color text DEFAULT 'primary',
  notes text,
  prescribed_by text,
  start_date date,
  refills_remaining integer DEFAULT 0,
  prescription_number text,
  pharmacy text,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medication_schedules (
  id serial PRIMARY KEY,
  medication_id integer REFERENCES medications(id) ON DELETE CASCADE,
  time_slot time NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  doctor_name text,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  location text,
  notes text,
  appointment_type text,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reminders (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  reminder_date date NOT NULL,
  reminder_time time NOT NULL,
  type text NOT NULL CHECK (type IN ('medication', 'appointment', 'refill', 'general')),
  medication_id integer REFERENCES medications(id) ON DELETE CASCADE,
  appointment_id integer REFERENCES appointments(id) ON DELETE CASCADE,
  is_completed boolean DEFAULT false,
  is_recurring boolean DEFAULT false,
  recurrence_pattern text,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medication_logs (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  medication_id integer REFERENCES medications(id) ON DELETE CASCADE,
  scheduled_time time NOT NULL,
  actual_time timestamp,
  date_taken date NOT NULL,
  status text NOT NULL CHECK (status IN ('taken', 'missed', 'skipped')),
  notes text,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refills (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  medication_id integer REFERENCES medications(id) ON DELETE CASCADE,
  prescription_number text,
  pharmacy text,
  refill_date date NOT NULL,
  days_left integer,
  priority text DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'ordered', 'ready', 'picked_up')),
  reminder_set boolean DEFAULT false,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_settings (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme text DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language text DEFAULT 'en',
  timezone text DEFAULT 'UTC',
  date_format text DEFAULT 'MM/DD/YYYY',
  time_format text DEFAULT '12' CHECK (time_format IN ('12', '24')),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_notifications (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  medication_reminders boolean DEFAULT true,
  refill_alerts boolean DEFAULT true,
  appointment_reminders boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_medications_user_id ON medications(user_id);
CREATE INDEX idx_medications_status ON medications(status);
CREATE INDEX idx_medication_schedules_medication_id ON medication_schedules(medication_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_date_time ON reminders(reminder_date, reminder_time);
CREATE INDEX idx_reminders_type ON reminders(type);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_medication_logs_user_id ON medication_logs(user_id);
CREATE INDEX idx_medication_logs_medication_id ON medication_logs(medication_id);
CREATE INDEX idx_medication_logs_date ON medication_logs(date_taken);
CREATE INDEX idx_refills_user_id ON refills(user_id);
CREATE INDEX idx_refills_medication_id ON refills(medication_id);
CREATE INDEX idx_refills_priority ON refills(priority);
