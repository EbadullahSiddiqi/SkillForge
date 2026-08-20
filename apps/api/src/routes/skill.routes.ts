import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { StudentProfile } from "../models/StudentProfile.js";
import { Assessment } from "../models/Assessment.js";
import { analyzeSkills } from "../services/skill-engine.service.js";
import { SkillAnalysis } from "../models/SkillAnalysis.js";

const router = Router();

router.post("/analyze", authenticate, async (req: any, res) => {
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

    const latestAssessment = await Assessment.findOne({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    if (!latestAssessment) {
      return res.status(400).json({
        success: false,
        message: "Complete an assessment first",
      });
    }

    const skills = profile.skills.map((skill) => {
      const assessment = latestAssessment.scores.find(
        (score) => score.skill.toLowerCase() === skill.name.toLowerCase(),
      );

      return {
        name: skill.name,

        self_score: skill.selfScore,

        assessment_score: assessment?.score ?? 0,
      };
    });

    const analysis = await analyzeSkills({
      target_role: profile.targetRole,
      skills,
    });

    await SkillAnalysis.create({
      userId: req.userId,
      targetRole: profile.targetRole,
      skills: analysis.skills,
    });

    return res.json(analysis);
  } catch (error) {
    console.error("Skill analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Skill analysis failed",
    });
  }
});

export default router;
