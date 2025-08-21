import express from "express";
const router = express.Router();
export default router;

import {
  createUser,
  getUserByEmailAndPassword,
  getUserById,
} from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(
    requireBody(["firstName", "lastName", "email", "password"]),
    async (req, res) => {
      const {
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
        allergies,
        medicalConditions,
      } = req.body;

      // Parse allergies and medicalConditions if sent as comma-separated strings
      const allergyArr =
        typeof allergies === "string"
          ? allergies
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : allergies || [];
      const medCondArr =
        typeof medicalConditions === "string"
          ? medicalConditions
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : medicalConditions || [];

      const user = await createUser({
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
        allergies: allergyArr,
        medicalConditions: medCondArr,
      });

      const token = await createToken({ id: user.id });
      res.status(201).send(token);
    }
  );

router
  .route("/login")
  .post(requireBody(["email", "password"]), async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmailAndPassword(email, password);
    if (!user) return res.status(401).send("Invalid email or password.");

    const token = await createToken({ id: user.id });
    res.send(token);
  });

router.route("/me").get(requireUser, async (req, res) => {
  const user = await getUserById(req.user.id);
  if (!user) return res.status(404).send("User not found.");

  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});
