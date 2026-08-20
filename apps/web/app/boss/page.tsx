"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/ai";

type Boss = {
  name: string;
  skill: string;
  difficulty: number;
  story: string;
  challenge: string;
  tasks: string[];
  hints?: string[];
};

type Evaluation = {
  score: number;
  passed: boolean;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  skillEvidence: {
    skill: string;
    demonstratedLevel: number;
  };
};

export default function BossPage() {
  const [boss, setBoss] = useState<Boss | null>(null);

  const [answer, setAnswer] = useState("");

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    generateBoss();
  }, []);

  async function generateBoss() {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/api/boss/generate", {
        method: "POST",
      });

      setBoss(data.boss);
    } catch (error: any) {
      setError(error.message || "Failed to generate boss");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer() {
    if (!boss || !answer.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const data = await apiFetch("/api/boss/evaluate", {
        method: "POST",

        body: JSON.stringify({
          skillName: boss.skill,
          challenge: boss.challenge,
          tasks: boss.tasks,
          answer,
        }),
      });

      setEvaluation(data.evaluation);
    } catch (error: any) {
      setError(error.message || "Failed to evaluate answer");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-5">⚔️</div>

          <h1 className="text-2xl font-bold">Summoning your boss...</h1>

          <p className="opacity-50 mt-2">Analyzing your biggest skill gap</p>
        </div>
      </main>
    );
  }

  if (error && !boss) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">{error}</p>

          <button
            onClick={generateBoss}
            className="px-5 py-3 border rounded-xl"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (evaluation && boss) {
    return <VictoryScreen boss={boss} evaluation={evaluation} />;
  }

  if (!boss) return null;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}

        <div className="text-center mb-10">
          <p className="text-sm tracking-widest opacity-50">⚔️ BOSS BATTLE</p>

          <h1 className="text-5xl font-black mt-3">{boss.name}</h1>

          <p className="mt-3 opacity-60">
            {boss.skill} · Difficulty {boss.difficulty}/10
          </p>
        </div>

        {/* Boss */}

        <div className="border rounded-3xl p-8">
          <div className="mb-8">
            <p className="text-lg leading-relaxed">{boss.story}</p>
          </div>

          <div className="border rounded-2xl p-6 mb-8">
            <p className="text-sm opacity-50 mb-3">THE CHALLENGE</p>

            <p className="text-lg leading-relaxed">{boss.challenge}</p>
          </div>

          <div className="mb-8">
            <p className="text-sm opacity-50 mb-4">YOUR OBJECTIVES</p>

            <div className="space-y-3">
              {boss.tasks.map((task, index) => (
                <div key={index} className="flex gap-4">
                  <span className="font-bold">{index + 1}.</span>

                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Explain your solution..."
            className="w-full min-h-[240px] border rounded-2xl p-5 outline-none resize-none"
          />

          {error && <p className="mt-3 text-sm">{error}</p>}

          <button
            onClick={submitAnswer}
            disabled={submitting || !answer.trim()}
            className="w-full mt-5 py-4 rounded-2xl border font-bold text-lg disabled:opacity-40"
          >
            {submitting ? "⚔️ Evaluating..." : "⚔️ ATTACK THE BOSS"}
          </button>
        </div>
      </div>
    </main>
  );
}

function VictoryScreen({
  boss,
  evaluation,
}: {
  boss: Boss;
  evaluation: Evaluation;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center">
        <p className="text-sm tracking-[0.3em] opacity-50">
          ⚔️ BOSS BATTLE COMPLETE
        </p>

        <h1 className="text-6xl font-black mt-5">
          {evaluation.passed ? "BOSS DEFEATED" : "BOSS SURVIVED"}
        </h1>

        <p className="text-2xl mt-4 opacity-60">{boss.name}</p>

        {/* Score */}

        <div className="my-12">
          <p className="text-8xl font-black">{evaluation.score}</p>

          <p className="opacity-50">/ 10</p>
        </div>

        {/* Evidence */}

        <div className="border rounded-3xl p-8 text-left">
          <p className="text-sm opacity-50">DEMONSTRATED SKILL</p>

          <div className="flex justify-between items-center mt-3">
            <h2 className="text-2xl font-bold">
              {evaluation.skillEvidence.skill}
            </h2>

            <span className="text-2xl font-bold">
              {evaluation.skillEvidence.demonstratedLevel}/10
            </span>
          </div>

          {/* Strengths */}

          {evaluation.strengths?.length > 0 && (
            <div className="mt-8">
              <p className="font-semibold mb-3">✓ What you did well</p>

              <ul className="space-y-2 opacity-70">
                {evaluation.strengths.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}

          {evaluation.weaknesses?.length > 0 && (
            <div className="mt-8">
              <p className="font-semibold mb-3">Areas to improve</p>

              <ul className="space-y-2 opacity-70">
                {evaluation.weaknesses.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 pt-6 border-t">
            <p className="leading-relaxed opacity-70">{evaluation.feedback}</p>
          </div>
        </div>

        <a
          href="/roadmap"
          className="inline-block mt-8 px-8 py-4 border rounded-2xl font-bold"
        >
          Continue to Roadmap →
        </a>
      </div>
    </main>
  );
}
