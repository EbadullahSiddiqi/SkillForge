"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import type { AssessmentQuestion, StudentProfile } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { Target, CheckCircle2, ChevronRight, ChevronLeft, HelpCircle } from "lucide-react";

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
    async function loadQuestionsAndProfile() {
      try {
        const profileData = await apiFetch<{ profile: StudentProfile | null }>(
          "/api/profile",
        );
        
        if (!profileData.profile) {
          setError("You must create your profile before taking the assessment.");
          setLoading(false);
          return;
        }

        const data = await apiFetch<{ questions: AssessmentQuestion[] }>(
          "/api/assessment/questions",
        );

        // Filter questions by skills in the student's profile
        const profileSkills = new Set(
          profileData.profile.skills.map((s) => s.name.toLowerCase())
        );

        const filtered = data.questions.filter((q) =>
          profileSkills.has(q.skill.toLowerCase())
        );

        setQuestions(filtered);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load assessment data",
        );
      } finally {
        setLoading(false);
      }
    }
    loadQuestionsAndProfile();
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
          <LoadingSpinner message="Preparing your skill assessment..." />
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
        <div className="max-w-2xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#101012] border border-zinc-850 p-8 shadow-2xl text-center"
          >
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-850 flex items-center justify-center mx-auto text-cyan-400 mb-6">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            
            <h1 className="text-3xl font-mono font-bold uppercase tracking-tight">Assessment complete!</h1>
            <p className="text-xs text-zinc-400 mt-2 font-mono uppercase tracking-wider">
              {analyzing
                ? "Running skill analysis engine..."
                : "Your verified metrics are now active."}
            </p>

            {analyzing ? (
              <div className="mt-10">
                <LoadingSpinner message="Synthesizing gap metrics..." />
              </div>
            ) : (
              <>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {scores.map((s) => (
                    <div key={s.skill} className="bg-zinc-950 border border-zinc-900 p-5">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">SKILL // {s.skill}</p>
                      <p className="text-2xl font-mono font-bold text-cyan-400 mt-1">
                        {s.score}
                        <span className="text-xs text-zinc-600 font-mono ml-1">/ 10.0</span>
                      </p>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => router.push("/dashboard")}
                  size="lg"
                  className="mt-8 font-mono uppercase text-xs tracking-wider w-full"
                >
                  View your skill cards <ChevronRight className="w-4 h-4 ml-1" />
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
        <div className="mb-8 pb-6 border-b border-zinc-850">
          <p className="text-xs font-mono text-cyan-400 tracking-[0.2em] uppercase">STEP 02 // ASSESSMENT</p>
          <h1 className="text-3xl font-mono font-bold uppercase tracking-tight mt-2">Skill assessment</h1>
          <p className="text-xs text-zinc-400 mt-2 font-mono leading-relaxed">
            Answer honestly — this validates your self-ratings.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-mono text-zinc-500 mb-2">
            <span>
              QUESTION {currentIndex + 1} OF {questions.length}
            </span>
            <span className="text-cyan-400 uppercase tracking-widest">{current?.skill}</span>
          </div>
          <div className="h-1 bg-zinc-850">
            <motion.div
              className="h-full bg-cyan-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[#101012] border border-zinc-850 p-8 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <span
                  className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border ${
                    current.difficulty === "easy"
                      ? "border-emerald-950 bg-emerald-950/20 text-emerald-400"
                      : "border-amber-950 bg-amber-950/20 text-amber-400"
                  }`}
                >
                  {current.difficulty}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{current.skill}</span>
              </div>

              <h2 className="text-lg font-mono font-bold leading-relaxed uppercase tracking-tight text-foreground">
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
                      className={`w-full text-left p-4 font-mono text-xs transition-all border ${
                        selected
                          ? "border-cyan-500 bg-cyan-950/20 text-cyan-400 font-bold"
                          : "border-zinc-900 bg-zinc-950 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
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
          <p className="text-xs font-mono text-red-400 mt-4 bg-red-950/20 border border-red-950 px-4 py-2 uppercase">
            {error}
          </p>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="secondary"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="font-mono uppercase text-xs tracking-wider"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button 
              onClick={goNext} 
              disabled={!answers[current?.id ?? ""]}
              className="font-mono uppercase text-xs tracking-wider"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="font-mono uppercase text-xs tracking-wider"
            >
              {submitting ? "Submitting..." : "Submit assessment"} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
