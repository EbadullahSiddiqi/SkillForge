import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { StudentProfile } from "../models/StudentProfile.js";
import { SkillAnalysis } from "../models/SkillAnalysis.js";
import { generateCareerRoadmap } from "../services/gemini.service.js";

const router = Router();

router.post("/roadmap", authenticate, async (req: any, res) => {
  try {
    const profile = await StudentProfile.findOne({
      userId: req.userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const analysis = await SkillAnalysis.findOne({
      userId: req.userId,
    }).sort({
      analyzedAt: -1,
    });

    if (!analysis) {
      return res.status(400).json({
        success: false,
        message: "Run skill analysis first",
      });
    }

    const roadmap = await generateCareerRoadmap({
      targetRole: analysis.targetRole,
      skills: analysis.skills,
    });

    return res.json({
      success: true,
      roadmap,
    });
  } catch (error) {
    console.error("Career roadmap error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate roadmap",
    });
  }
});

export default router;
