"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch, ApiError } from "@/lib/api";
import type { Boss, BossEvaluation } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { SKILL_ICONS } from "@/lib/constants";

type BattlePhase = "intro" | "battle" | "evaluating" | "result";

export default function BossPage() {
  const [boss, setBoss] = useState<Boss | null>(null);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<BossEvaluation | null>(null);
  const [phase, setPhase] = useState<BattlePhase>("intro");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorAction, setErrorAction] = useState<{
    label: string;
    href?: string;
    onClick?: () => void;
  } | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(
    new Set(),
  );

  const generateBoss = useCallback(async () => {
    setLoading(true);
    setError("");
    setErrorAction(null);
    setEvaluation(null);
    setAnswer("");
    setCompletedTasks(new Set());
    setShowHints(false);

    try {
      const data = await apiFetch<{ boss: Boss }>("/api/boss/generate", {
        method: "POST",
      });
      setBoss(data.boss);
      setPhase("intro");
    } catch (err) {
      if (err instanceof ApiError) {
        if (
          err.status === 400 &&
          err.message.includes("analysis")
        ) {
          setError("Complete your skill assessment first.");
          setErrorAction({
            label: "Take assessment",
            href: "/assessment",
          });
        } else if (
          err.status === 400 &&
          (err.message.includes("gap") || err.message.includes("Gap"))
        ) {
          setError(
            "All your skills meet requirements! You've mastered everything — no boss to fight.",
          );
          setErrorAction({
            label: "View dashboard",
            href: "/dashboard",
          });
        } else {
          setError(err.message);
          setErrorAction({
            label: "Try again",
            onClick: () => generateBoss(),
          });
        }
      } else {
        setError("Failed to summon boss. Check that RAG and Gemini services are running.");
        setErrorAction({
          label: "Try again",
          onClick: () => generateBoss(),
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    generateBoss();
  }, [generateBoss]);

  function toggleTask(index: number) {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  async function submitAnswer() {
    if (!boss || !answer.trim()) return;

    setPhase("evaluating");

    try {
      const data = await apiFetch<{ evaluation: BossEvaluation }>(
        "/api/boss/evaluate",
        {
          method: "POST",
          body: JSON.stringify({
            skillName: boss.skill,
            challenge: boss.challenge,
            tasks: boss.tasks,
            answer,
          }),
        },
      );

      setEvaluation(data.evaluation);
      setPhase("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
      setPhase("battle");
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-7xl"
          >
            ⚔️
          </motion.div>
          <LoadingSpinner message="Summoning your boss..." />
          <p className="text-sm text-muted">
            Analyzing your biggest skill gap...
          </p>
        </div>
      </AppShell>
    );
  }

  if (error && !boss) {
    return (
      <AppShell>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
          <ErrorState
            title="Boss unavailable"
            message={error}
            actionLabel={errorAction?.label}
            actionHref={errorAction?.href}
            onAction={errorAction?.onClick}
          />
        </div>
      </AppShell>
    );
  }

  if (!boss) return null;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center"
            >
              <p className="text-sm text-red-400 tracking-[0.3em] animate-pulse">
                ⚠️ BOSS APPROACHING
              </p>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-black mt-6 gradient-text"
              >
                {boss.name}
              </motion.h1>

              <div className="flex items-center justify-center gap-4 mt-6 text-muted">
                <span className="text-3xl">
                  {SKILL_ICONS[boss.skill] ?? "💎"}
                </span>
                <span>{boss.skill}</span>
                <span>·</span>
                <span className="text-amber-400">
                  Difficulty {boss.difficulty}/10
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-3xl p-8 mt-10 max-w-2xl mx-auto text-left"
              >
                <p className="text-lg leading-relaxed italic text-muted">
                  &ldquo;{boss.story}&rdquo;
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  onClick={() => setPhase("battle")}
                  size="lg"
                  className="mt-10"
                >
                  ⚔️ Enter Battle
                </Button>
              </motion.div>
            </motion.div>
          )}

          {phase === "battle" && (
            <motion.div
              key="battle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Battle header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs text-red-400 tracking-widest">
                    BOSS BATTLE
                  </p>
                  <h1 className="text-2xl font-black">{boss.name}</h1>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">BOSS HP</p>
                  <div className="w-32 h-3 rounded-full bg-white/10 mt-1">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-red-500 to-orange-500" />
                  </div>
                </div>
              </div>

              {/* Challenge */}
              <div className="glass rounded-3xl p-8 mb-6 border-red-500/20">
                <p className="text-xs text-red-400 tracking-widest mb-3">
                  THE CHALLENGE
                </p>
                <p className="text-lg leading-relaxed">{boss.challenge}</p>
              </div>

              {/* Tasks checklist */}
              <div className="glass rounded-2xl p-6 mb-6">
                <p className="text-xs text-muted tracking-widest mb-4">
                  OBJECTIVES
                </p>
                <div className="space-y-3">
                  {boss.tasks.map((task, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleTask(i)}
                      className={`w-full text-left flex gap-3 p-3 rounded-xl transition-all ${
                        completedTasks.has(i)
                          ? "bg-emerald-500/10 border border-emerald-500/30"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={
                          completedTasks.has(i)
                            ? "text-emerald-400"
                            : "text-muted"
                        }
                      >
                        {completedTasks.has(i) ? "✓" : `${i + 1}.`}
                      </span>
                      <span
                        className={
                          completedTasks.has(i) ? "line-through opacity-50" : ""
                        }
                      >
                        {task}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hints */}
              {boss.hints && boss.hints.length > 0 && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setShowHints(!showHints)}
                    className="text-sm text-amber-400 hover:underline"
                  >
                    {showHints ? "Hide hints" : "💡 Need a hint?"}
                  </button>
                  {showHints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="glass rounded-xl p-4 mt-3"
                    >
                      {boss.hints.map((hint, i) => (
                        <p key={i} className="text-sm text-muted">
                          💡 {hint}
                        </p>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Answer */}
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your solution here. Explain your approach, code logic, or architecture..."
                className="w-full min-h-[200px] glass rounded-2xl p-5 outline-none resize-none focus:border-cyan-500/30 text-foreground placeholder:text-muted/50"
              />

              {error && (
                <p className="text-sm text-red-400 mt-3">{error}</p>
              )}

              <Button
                onClick={submitAnswer}
                disabled={!answer.trim()}
                size="lg"
                className="w-full mt-5"
              >
                ⚔️ ATTACK!
              </Button>
            </motion.div>
          )}

          {phase === "evaluating" && (
            <motion.div
              key="evaluating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-[60vh] flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="text-6xl mb-6"
              >
                ⚔️
              </motion.div>
              <LoadingSpinner message="Boss is evaluating your attack..." />
            </motion.div>
          )}

          {phase === "result" && evaluation && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-8xl mb-4"
              >
                {evaluation.passed ? "🏆" : "💀"}
              </motion.div>

              <h1 className="text-5xl font-black">
                {evaluation.passed ? "BOSS DEFEATED!" : "BOSS SURVIVED"}
              </h1>
              <p className="text-muted mt-2">{boss.name}</p>

              <div className="my-10">
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.4 }}
                  className="text-8xl font-black gradient-text"
                >
                  {evaluation.score}
                </motion.p>
                <p className="text-muted">/ 10</p>
              </div>

              <div className="glass rounded-3xl p-8 text-left max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-xs text-muted">DEMONSTRATED SKILL</p>
                    <h2 className="text-xl font-bold">
                      {evaluation.skillEvidence.skill}
                    </h2>
                  </div>
                  <span className="text-2xl font-black text-cyan-400">
                    {evaluation.skillEvidence.demonstratedLevel}/10
                  </span>
                </div>

                {evaluation.strengths.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-emerald-400 mb-2">
                      ✓ Strengths
                    </p>
                    <ul className="space-y-1 text-sm text-muted">
                      {evaluation.strengths.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluation.weaknesses.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-amber-400 mb-2">
                      Areas to improve
                    </p>
                    <ul className="space-y-1 text-sm text-muted">
                      {evaluation.weaknesses.map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-sm text-muted leading-relaxed border-t border-white/5 pt-4">
                  {evaluation.feedback}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center mt-10">
                {!evaluation.passed && (
                  <Button onClick={() => { setPhase("battle"); setAnswer(""); setError(""); }}>
                    ⚔️ Try again
                  </Button>
                )}
                <Button href="/roadmap" variant="secondary">
                  🗺️ View roadmap
                </Button>
                <Button href="/dashboard" variant="ghost">
                  Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
