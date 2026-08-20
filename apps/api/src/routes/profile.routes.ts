import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { StudentProfile } from "../models/StudentProfile.js";

const router = Router();

router.get("/", authenticate, async (req: any, res) => {
  const profile = await StudentProfile.findOne({
    userId: req.userId,
  });

  res.json({
    success: true,
    profile,
  });
});

router.post("/", authenticate, async (req: any, res) => {
  const profile = await StudentProfile.findOneAndUpdate(
    {
      userId: req.userId,
    },
    {
      userId: req.userId,
      ...req.body,
    },
    {
      new: true,
      upsert: true,
    },
  );

  res.json({
    success: true,
    profile,
  });
});

export default router;
