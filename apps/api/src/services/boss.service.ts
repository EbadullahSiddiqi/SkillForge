import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

type GenerateBossInput = {
  targetRole: string;
  skill: {
    name: string;
    currentScore: number;
    requiredScore: number;
    gap: number;
  };
  knowledge: string;
};

export async function generateBossBattle(data: GenerateBossInput) {
  const prompt = `
You are the Boss Battle generator for SkillForge.

SkillForge is a career development platform that
measures a student's skills and creates practical
challenges to test whether they actually understand
their weak areas.

TARGET ROLE:
${data.targetRole}

SKILL BEING TESTED:
${data.skill.name}

CURRENT SCORE:
${data.skill.currentScore}/10

REQUIRED SCORE:
${data.skill.requiredScore}/10

SKILL GAP:
${data.skill.gap}/10

GROUNDED KNOWLEDGE FROM SKILLFORGE RAG:
${data.knowledge}

Create ONE challenging but fair boss battle.

The challenge should test understanding, not memorization.

The student should have to reason about the problem.

Return ONLY valid JSON using exactly this structure:

{
  "name": "creative boss name",
  "skill": "${data.skill.name}",
  "difficulty": 1,
  "story": "short dramatic scenario",
  "challenge": "the actual technical problem",
  "tasks": [
    "task 1",
    "task 2",
    "task 3"
  ],
  "hints": [
    "optional hint 1",
    "optional hint 2"
  ]
}

Rules:

- difficulty must be between 1 and 10.
- Difficulty should reflect the student's current skill level.
- Do not test concepts unrelated to the provided skill.
- Use the provided knowledge as grounding.
- Do not invent numerical information about the student.
- Do not reveal the answer.
- Keep the challenge solvable in approximately 5-10 minutes.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty boss battle");
  }

  return JSON.parse(response.text);
}

type EvaluateBossInput = {
  targetRole: string;
  skillName: string;
  challenge: string;
  tasks: string[];
  answer: string;
};

export async function evaluateBossBattle(data: EvaluateBossInput) {
  const prompt = `
You are the evaluator for a SkillForge Boss Battle.

TARGET ROLE:
${data.targetRole}

SKILL:
${data.skillName}

CHALLENGE:
${data.challenge}

TASKS:
${JSON.stringify(data.tasks)}

STUDENT ANSWER:
${data.answer}

Evaluate the student's actual technical understanding.

Return ONLY valid JSON:

{
  "score": 0,
  "passed": false,
  "feedback": "clear explanation of the result",
  "strengths": [
    "strength 1"
  ],
  "weaknesses": [
    "weakness 1"
  ],
  "skillEvidence": {
    "skill": "${data.skillName}",
    "demonstratedLevel": 0
  }
}

Rules:

- score must be between 0 and 10.
- demonstratedLevel must be between 0 and 10.
- Be strict but fair.
- Evaluate reasoning rather than keyword matching.
- Explain mistakes clearly.
- passed should be true when the student demonstrates
  meaningful competency.
- Do not inflate the score.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty evaluation");
  }

  return JSON.parse(response.text);
}
