const SKILL_ENGINE_URL =
  process.env.SKILL_ENGINE_URL || "http://localhost:8000";

export async function analyzeSkills(data: {
  target_role: string;
  skills: {
    name: string;
    self_score: number;
    assessment_score: number;
  }[];
}) {
  const response = await fetch(`${SKILL_ENGINE_URL}/analyze`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Skill Engine failed: ${response.status}`);
  }

  return response.json();
}
