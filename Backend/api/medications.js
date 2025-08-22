import { Router } from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  getMedicationsByUserId,
  createMedication,
  updateMedication,
  deleteMedication,
  getMedicationById,
  getMedicationSchedules,
  createMedicationSchedule,
  deleteMedicationSchedule,
  deleteMedicationSchedules,
  getTodayMedicationSchedule,
} from "#db/queries/medications";

const router = Router();

// Get all medications for the current user
router.get("/", requireUser, async (req, res) => {
  const medications = await getMedicationsByUserId(req.user.id);
  res.json(medications);
});

// Get today's medication schedule
router.get("/schedule/today", requireUser, async (req, res) => {
  try {
    const todaySchedule = await getTodayMedicationSchedule(req.user.id);
    res.json(todaySchedule);
  } catch (error) {
    console.error("Error fetching today's schedule:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific medication by id
router.get("/:id", requireUser, async (req, res) => {
  const medication = await getMedicationById(req.params.id, req.user.id);
  if (!medication) {
    return res.status(404).json({ error: "Medication not found" });
  }
  res.json(medication);
});

// Create a new medication
router.post(
  "/",
  requireUser,
  requireBody(["name", "dosage", "frequency"]),
  async (req, res) => {
    try {
      const { time_slots, ...medicationData } = req.body;

      const medicationWithUserId = {
        ...medicationData,
        user_id: req.user.id,
      };

      const medication = await createMedication(medicationWithUserId);

      // Handle time slots if provided
      if (time_slots && time_slots.length > 0) {
        // Create schedules for the medication
        for (const timeSlot of time_slots) {
          await createMedicationSchedule(medication.id, req.user.id, timeSlot);
        }
      }

      // Return the medication with time slots
      const medicationWithSchedules = await getMedicationById(
        medication.id,
        req.user.id
      );

      res.status(201).json(medicationWithSchedules);
    } catch (error) {
      console.error("Error creating medication:", error);
      res.status(500).json({ error: "Failed to create medication" });
    }
  }
);

// Update a medication
router.put("/:id", requireUser, async (req, res) => {
  try {
    const { time_slots, ...medicationData } = req.body;

    // Update the medication record (excluding time_slots)
    const medication = await updateMedication(
      req.params.id,
      req.user.id,
      medicationData
    );

    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }

    // Handle time slots if provided
    if (time_slots) {
      // Delete existing schedules for this medication
      await deleteMedicationSchedules(req.params.id, req.user.id);

      // Create new schedules
      for (const timeSlot of time_slots) {
        await createMedicationSchedule(req.params.id, req.user.id, timeSlot);
      }
    }

    // Return the updated medication with time slots
    const updatedMedicationWithSchedules = await getMedicationById(
      req.params.id,
      req.user.id
    );

    res.json(updatedMedicationWithSchedules);
  } catch (error) {
    console.error("Error updating medication:", error);
    res.status(500).json({ error: "Failed to update medication" });
  }
});

// Delete a medication
router.delete("/:id", requireUser, async (req, res) => {
  const deleted = await deleteMedication(req.params.id, req.user.id);
  if (!deleted) {
    return res.status(404).json({ error: "Medication not found" });
  }
  res.status(204).send();
});

// Get schedules for a medication
router.get("/:id/schedules", requireUser, async (req, res) => {
  const schedules = await getMedicationSchedules(req.params.id, req.user.id);
  res.json(schedules);
});

// Create a schedule for a medication
router.post(
  "/:id/schedules",
  requireUser,
  requireBody(["time_slot"]),
  async (req, res) => {
    const schedule = await createMedicationSchedule(
      req.params.id,
      req.user.id,
      req.body.time_slot
    );
    res.status(201).json(schedule);
  }
);

// Delete a medication schedule
router.delete("/:id/schedules/:scheduleId", requireUser, async (req, res) => {
  const deleted = await deleteMedicationSchedule(
    req.params.scheduleId,
    req.user.id
  );
  if (!deleted) {
    return res.status(404).json({ error: "Schedule not found" });
  }
  res.status(204).send();
});

// Update medication stock (when doses are taken)
router.patch("/:id/stock", requireUser, async (req, res) => {
  const { doses_consumed = 1 } = req.body;
  try {
    const { updateMedicationStock } = await import(
      "#db/queries/refillCalculations"
    );
    const newStock = await updateMedicationStock(
      req.params.id,
      req.user.id,
      doses_consumed
    );

    if (newStock !== null) {
      res.json({ current_stock: newStock });
    } else {
      res.status(404).json({ error: "Medication not found" });
    }
  } catch (error) {
    console.error("Error updating medication stock:", error);
    res.status(500).json({ error: "Failed to update medication stock" });
  }
});

export default router;
