import { Router } from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  getRefillsByUserId,
  createRefillReminder,
  updateRefillStatus,
  getUpcomingRefills,
} from "#db/queries/refills";
import { calculateRefillsNeeded } from "#db/queries/refillCalculations";

const router = Router();

// Get all refills for the current user
router.get("/", requireUser, async (req, res) => {
  // First calculate any new refills needed
  await calculateRefillsNeeded(req.user.id);

  const refills = await getRefillsByUserId(req.user.id);
  res.json(refills);
});

// Get upcoming refills that need attention
router.get("/upcoming", requireUser, async (req, res) => {
  // First calculate any new refills needed
  await calculateRefillsNeeded(req.user.id);

  const refills = await getUpcomingRefills(req.user.id);
  res.json(refills);
});

// Create a refill reminder
router.post(
  "/",
  requireUser,
  requireBody(["medication_id", "refill_date"]),
  async (req, res) => {
    const refillData = {
      ...req.body,
      user_id: req.user.id,
    };
    const refill = await createRefillReminder(refillData);
    res.status(201).json(refill);
  }
);

// Update refill status
router.patch(
  "/:id/status",
  requireUser,
  requireBody(["status"]),
  async (req, res) => {
    const refill = await updateRefillStatus(
      req.params.id,
      req.user.id,
      req.body.status
    );
    if (!refill) {
      return res.status(404).json({ error: "Refill not found" });
    }
    res.json(refill);
  }
);

// Manually trigger refill calculations
router.post("/calculate", requireUser, async (req, res) => {
  try {
    const refillsNeeded = await calculateRefillsNeeded(req.user.id);
    res.json({
      message: "Refill calculations updated",
      refillsNeeded: refillsNeeded.length,
    });
  } catch (error) {
    console.error("Error calculating refills:", error);
    res.status(500).json({ error: "Failed to calculate refills" });
  }
});

export default router;
