import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateCareerRoadmap(data: {
  targetRole: string;
  skills: any[];
  knowledge: string;
}) {
  const prompt = `
You are SkillForge's Career Architect.

Your job is to transform objectively calculated
student skill data into a practical career roadmap.

IMPORTANT RULES:

1. Never change or invent numerical scores.
2. Never invent skill gaps.
3. Respect the provided prerequisites.
4. Prioritize skills that unblock other skills.
5. Focus on practical learning.
6. Every major skill should have a practical project.
7. Keep the roadmap achievable for a student.

Student target role:
${data.targetRole}

Skill analysis:
${JSON.stringify(data.skills, null, 2)}

KNOWLEDGE FROM SKILLFORGE RAG:
${data.knowledge}

Return ONLY valid JSON.

Use this structure:

{
  "summary": "short personalized summary",

  "phases": [
    {
      "phase": 1,
      "title": "Phase title",
      "description": "What this phase accomplishes",

      "skills": [
        {
          "name": "skill name",
          "why": "why this skill matters",
          "topics": [
            "topic 1",
            "topic 2",
            "topic 3"
          ],
          "project": {
            "title": "project title",
            "description": "project description"
          },
          "completionCriteria": [
            "measurable criterion 1",
            "measurable criterion 2"
          ]
        }
      ]
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  return JSON.parse(response.text);
}
