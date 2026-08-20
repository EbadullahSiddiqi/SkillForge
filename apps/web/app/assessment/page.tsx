"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import type { AssessmentQuestion } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorState } from "@/components/ui/ErrorState";

export default function AssessmentPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"quiz" | "results">("quiz");
  const [scores, setScores] = useState<{ skill: string; score: number }[]>(
    [],
  );

  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await apiFetch<{ questions: AssessmentQuestion[] }>(
          "/api/assessment/questions",
        );
        setQuestions(data.questions);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load questions",
        );
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const current = questions[currentIndex];
  const progress = questions.length
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;
  const allAnswered = questions.every((q) => answers[q.id]);

  function selectAnswer(option: string) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
  }

  function goNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        answers: questions.map((q) => ({
          questionId: q.id,
          answer: answers[q.id],
        })),
      };

      const data = await apiFetch<{
        scores: { skill: string; score: number }[];
      }>("/api/assessment/submit", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setScores(data.scores);
      setPhase("results");

      setAnalyzing(true);
      await apiFetch("/api/skills/analyze", { method: "POST" });
      setAnalyzing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <LoadingSpinner message="Preparing your assessment..." />
        </div>
      </AppShell>
    );
  }

  if (error && questions.length === 0) {
    return (
      <AppShell>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
          <ErrorState
            message={error}
            actionLabel="Set up profile first"
            actionHref="/profile"
          />
        </div>
      </AppShell>
    );
  }

  if (phase === "results") {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-6 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-6xl">🎯</span>
            <h1 className="text-4xl font-black mt-6">Assessment complete!</h1>
            <p className="text-muted mt-3">
              {analyzing
                ? "Analyzing your skill gaps..."
                : "Your skill analysis is ready."}
            </p>

            {analyzing ? (
              <div className="mt-10">
                <LoadingSpinner message="Running skill engine analysis..." />
              </div>
            ) : (
              <>
                <div className="mt-10 grid grid-cols-2 gap-4">
                  {scores.map((s) => (
                    <div key={s.skill} className="glass rounded-2xl p-5">
                      <p className="text-sm text-muted">{s.skill}</p>
                      <p className="text-3xl font-black text-cyan-400 mt-1">
                        {s.score}
                        <span className="text-lg text-muted">/10</span>
                      </p>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => router.push("/dashboard")}
                  size="lg"
                  className="mt-10"
                >
                  View your skill cards →
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-sm text-cyan-400 tracking-widest">STEP 2 OF 2</p>
          <h1 className="text-3xl font-black mt-2">Skill assessment</h1>
          <p className="text-muted mt-2">
            Answer honestly — this validates your self-ratings.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted mb-2">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-cyan-400">{current?.skill}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="glass rounded-3xl p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    current.difficulty === "easy"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {current.difficulty}
                </span>
                <span className="text-xs text-muted">{current.skill}</span>
              </div>

              <h2 className="text-xl font-bold leading-relaxed">
                {current.question}
              </h2>

              <div className="mt-8 space-y-3">
                {current.options.map((option) => {
                  const selected = answers[current.id] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectAnswer(option)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selected
                          ? "border-cyan-500/50 bg-cyan-500/10 text-foreground"
                          : "border-white/10 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="text-sm text-red-400 mt-4 bg-red-500/10 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="secondary"
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            ← Previous
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button onClick={goNext} disabled={!answers[current?.id ?? ""]}>
              Next →
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
            >
              {submitting ? "Submitting..." : "Submit assessment →"}
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
