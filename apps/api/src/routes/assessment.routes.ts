import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { Assessment } from "../models/Assessment.js";
import { StudentProfile } from "../models/StudentProfile.js";
import { assessmentQuestions } from "../data/assessmentQuestions.js";

const router = Router();

// Get assessment questions
router.get("/questions", authenticate, (_req, res) => {
  const questions = assessmentQuestions.map(
    ({ answer, ...question }) => question,
  );

  res.json({
    success: true,
    questions,
  });
});

// Submit assessment
router.post("/submit", authenticate, async (req: any, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
      });
    }

    const results = answers
      .map((submitted: any) => {
        const question = assessmentQuestions.find(
          (q) => q.id === submitted.questionId,
        );

        if (!question) {
          return null;
        }

        return {
          questionId: question.id,
          skill: question.skill,
          answer: submitted.answer,
          correct: submitted.answer === question.answer,
        };
      })
      .filter(Boolean);

    // Group results by skill
    const skillGroups: Record<
      string,
      {
        total: number;
        correct: number;
      }
    > = {};

    for (const result of results as any[]) {
      if (!skillGroups[result.skill]) {
        skillGroups[result.skill] = {
          total: 0,
          correct: 0,
        };
      }

      skillGroups[result.skill].total++;

      if (result.correct) {
        skillGroups[result.skill].correct++;
      }
    }

    const scores = Object.entries(skillGroups).map(([skill, data]) => ({
      skill,

      // Convert percentage to 0-10
      score: Number(((data.correct / data.total) * 10).toFixed(1)),
    }));

    const assessment = await Assessment.create({
      userId: req.userId,
      answers: results,
      scores,
      completedAt: new Date(),
    });

    // Update student's actual assessment scores
    const profile = await StudentProfile.findOne({
      userId: req.userId,
    });

    if (profile) {
      for (const result of scores) {
        const skill = profile.skills.find(
          (s) => s.name.toLowerCase() === result.skill.toLowerCase(),
        );

        if (skill) {
          skill.assessmentScore = result.score;
        }
      }

      await profile.save();
    }

    res.json({
      success: true,
      assessmentId: assessment._id,
      scores,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Assessment submission failed",
    });
  }
});

export default router;
