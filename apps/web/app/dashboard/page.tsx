"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/ai";

type Skill = {
  name: string;
  assessmentScore: number;
  requiredScore: number;
  gap: number;
};

type Analysis = {
  targetRole: string;
  skills: Skill[];
};

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch("/api/skills/latest");

        setAnalysis(data.analysis);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading your skill profile...</div>
      </main>
    );
  }

  if (!analysis) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Complete your skill assessment first.</p>
      </main>
    );
  }

  const skills = analysis.skills || [];

  const average =
    skills.length > 0
      ? Math.round(
          skills.reduce(
            (sum, skill) => sum + Number(skill.assessmentScore || 0),
            0,
          ) / skills.length,
        )
      : 0;

  const biggestGap = [...skills].sort(
    (a, b) => Number(b.gap) - Number(a.gap),
  )[0];

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="mb-10">
          <p className="text-sm opacity-60 mb-2">YOUR CAREER JOURNEY</p>

          <h1 className="text-4xl font-bold">
            Your path to{" "}
            <span className="opacity-70">{analysis.targetRole}</span>
          </h1>

          <p className="mt-3 opacity-60">
            Your roadmap adapts as you prove what you actually know.
          </p>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <StatCard label="Average Skill" value={`${average}/10`} />

          <StatCard label="Skills Analyzed" value={skills.length} />

          <StatCard
            label="Biggest Gap"
            value={biggestGap ? biggestGap.name : "None"}
          />
        </div>

        {/* Skills */}

        <section className="mb-10">
          <div className="flex justify-between items-end mb-5">
            <div>
              <p className="text-sm opacity-50">YOUR SKILLS</p>

              <h2 className="text-2xl font-semibold">Skill gaps</h2>
            </div>

            <a href="/roadmap" className="text-sm underline opacity-70">
              View roadmap →
            </a>
          </div>

          <div className="space-y-4">
            {skills
              .sort((a, b) => Number(b.gap) - Number(a.gap))
              .map((skill) => (
                <SkillBar key={skill.name} skill={skill} />
              ))}
          </div>
        </section>

        {/* Boss */}

        <section>
          <div className="border rounded-2xl p-8">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <p className="text-sm opacity-50 mb-2">YOUR NEXT CHALLENGE</p>

                <h2 className="text-3xl font-bold">⚔️ Fight your next boss</h2>

                <p className="mt-3 opacity-60 max-w-xl">
                  Don't just follow a roadmap. Prove that you've actually
                  learned the skill.
                </p>
              </div>

              <a
                href="/boss"
                className="self-start px-6 py-3 rounded-xl border font-medium hover:opacity-70 transition"
              >
                Enter Battle →
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border rounded-2xl p-6">
      <p className="text-sm opacity-50">{label}</p>

      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function SkillBar({ skill }: { skill: Skill }) {
  const current = Number(skill.assessmentScore || 0);

  const required = Number(skill.requiredScore || 0);

  const width = Math.min(current * 10, 100);

  return (
    <div className="border rounded-2xl p-5">
      <div className="flex justify-between mb-3">
        <span className="font-medium">{skill.name}</span>

        <span className="text-sm opacity-60">
          {current}/10 → {required}/10
        </span>
      </div>

      <div className="h-3 rounded-full bg-black/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-current"
          style={{
            width: `${width}%`,
          }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-xs opacity-50">Current</span>

        <span className="text-xs opacity-50">Gap: {skill.gap}</span>
      </div>
    </div>
  );
}
