DROP DATABASE IF EXISTS meditrack;
CREATE DATABASE translationsdb;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
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
  
)
