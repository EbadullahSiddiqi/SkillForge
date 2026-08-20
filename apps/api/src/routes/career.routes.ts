import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { StudentProfile } from "../models/StudentProfile.js";
import { SkillAnalysis } from "../models/SkillAnalysis.js";
import { generateCareerRoadmap } from "../services/gemini.service.js";
import { askRAG } from "../services/rag.service.js";

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

    const topskillGaps = analysis.skills
      .filter((skill) => skill.skillGap > 0)
      .sort((a, b) => b.skillGap - a.skillGap)
      .slice(0, 5);

    const ragQuestion = `
The student wants to become a ${analysis.targetRole}.

Their most important skill skillGaps are:

${topskillGaps
  .map(
    (skill) =>
      `- ${skill.name}: current ${skill.assessmentScore}/10, required ${skill.requiredScore}/10, skillGap ${skill.skillGap}/10`,
  )
  .join("\n")}

Based on the SkillForge knowledge base, identify the
most relevant concepts, learning topics, practical
skills, prerequisites, and project ideas that would
help this student close these skillGaps.

Prioritize foundational knowledge and prerequisites.
Do not provide generic career advice.
`;

    const ragResult = await askRAG(ragQuestion);

    const roadmap = await generateCareerRoadmap({
      targetRole: analysis.targetRole,
      skills: analysis.skills,
      knowledge: ragResult.answer,
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
