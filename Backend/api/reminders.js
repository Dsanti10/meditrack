import { Router } from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  getRemindersByUserId,
  createReminder,
  updateReminder,
  deleteReminder,
  markReminderComplete,
  getUpcomingReminders,
  createMedicationReminder,
} from "#db/queries/reminders";

const router = Router();

// Get all reminders for the current user
router.get("/", requireUser, async (req, res) => {
  const reminders = await getRemindersByUserId(req.user.id);
  res.json(reminders);
});

// Get upcoming reminders
router.get("/upcoming", requireUser, async (req, res) => {
  const reminders = await getUpcomingReminders(req.user.id);
  res.json(reminders);
});

// Create a new reminder
router.post(
  "/",
  requireUser,
  requireBody(["title", "reminder_date", "reminder_time", "type"]),
  async (req, res) => {
    const reminderData = {
      ...req.body,
      user_id: req.user.id,
    };
    const reminder = await createReminder(reminderData);
    res.status(201).json(reminder);
  }
);

// Create a medication reminder
router.post(
  "/medication/:medicationId",
  requireUser,
  requireBody(["reminder_date", "reminder_time"]),
  async (req, res) => {
    try {
      const reminder = await createMedicationReminder(
        req.params.medicationId,
        req.user.id,
        req.body
      );
      res.status(201).json(reminder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Update a reminder
router.put("/:id", requireUser, async (req, res) => {
  const reminder = await updateReminder(req.params.id, req.user.id, req.body);
  if (!reminder) {
    return res.status(404).json({ error: "Reminder not found" });
  }
  res.json(reminder);
});

// Mark a reminder as complete/incomplete
router.patch("/:id/complete", requireUser, async (req, res) => {
  const { is_completed = true } = req.body;
  const reminder = await markReminderComplete(
    req.params.id,
    req.user.id,
    is_completed
  );
  if (!reminder) {
    return res.status(404).json({ error: "Reminder not found" });
  }
  res.json(reminder);
});

// Delete a reminder
router.delete("/:id", requireUser, async (req, res) => {
  const deleted = await deleteReminder(req.params.id, req.user.id);
  if (!deleted) {
    return res.status(404).json({ error: "Reminder not found" });
  }
  res.status(204).send();
});

export default router;
