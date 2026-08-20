import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { SkillAnalysis } from "../models/SkillAnalysis.js";

import { askRAG } from "../services/rag.service.js";
import {
  generateBossBattle,
  evaluateBossBattle,
} from "../services/boss.service.js";

const router = Router();

router.post("/generate", authenticate, async (req: any, res) => {
  try {
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

    const skills = analysis.skills || [];

    if (!skills.length) {
      return res.status(400).json({
        success: false,
        message: "No skill analysis available",
      });
    }

    // Find the biggest skill skillGap
    const weakestSkill = [...skills]
      .filter((skill) => Number(skill.skillGap) > 0)
      .sort((a, b) => Number(b.skillGap) - Number(a.skillGap))[0];

    if (!weakestSkill) {
      return res.status(400).json({
        success: false,
        message: "No skill skillGaps found",
      });
    }

    const ragResult = await askRAG(`
The student wants to become a ${analysis.targetRole}.

We are creating a practical challenge to test the
student's understanding of:

${weakestSkill.name}

Find the most relevant concepts, common mistakes,
practical scenarios, and technical knowledge from the
SkillForge knowledge base that could be used to create
a challenging assessment for this skill.

Focus specifically on ${weakestSkill.name}.
`);

    const boss = await generateBossBattle({
      targetRole: analysis.targetRole,

      skill: {
        name: weakestSkill.name,
        currentScore: Number(weakestSkill.assessmentScore ?? 0),
        requiredScore: Number(weakestSkill.requiredScore ?? 0),
        gap: Number(weakestSkill.skillGap ?? 0),
      },

      knowledge: ragResult.answer,
    });

    return res.json({
      success: true,
      boss,
    });
  } catch (error) {
    console.error("Boss generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate boss battle",
    });
  }
});

router.post("/evaluate", authenticate, async (req: any, res) => {
  try {
    const { skillName, challenge, tasks, answer } = req.body;

    if (!skillName || !challenge || !Array.isArray(tasks) || !answer) {
      return res.status(400).json({
        success: false,
        message: "Incomplete boss battle submission",
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
        message: "Skill analysis not found",
      });
    }

    const evaluation = await evaluateBossBattle({
      targetRole: analysis.targetRole,
      skillName,
      challenge,
      tasks,
      answer,
    });

    return res.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error("Boss evaluation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to evaluate boss battle",
    });
  }
});

export default router;
