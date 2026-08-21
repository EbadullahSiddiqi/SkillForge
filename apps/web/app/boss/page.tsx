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
import * as LucideIcons from "lucide-react";
import { 
  Swords, 
  Skull, 
  Trophy, 
  AlertTriangle, 
  Check, 
  HelpCircle, 
  Play, 
  ChevronRight,
  Terminal as TerminalIcon
} from "lucide-react";

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
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-cyan-400 p-4 bg-zinc-900 border border-zinc-800"
          >
            <Swords className="w-8 h-8" />
          </motion.div>
          <LoadingSpinner message="Summoning your boss challenge..." />
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
            ANALYZING CRITICAL GAP INDEX...
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

  const skillIconName = SKILL_ICONS[boss.skill] ?? "HelpCircle";
  const SkillIcon = (LucideIcons as any)[skillIconName] || LucideIcons.HelpCircle;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="text-center bg-[#101012] border border-zinc-850 p-8 shadow-2xl"
            >
              <div className="flex justify-center items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-[0.25em] mb-6">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
                CRITICAL WARNING // TARGET ENEMY SPOTTED
              </div>

              <motion.h1
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-mono font-bold mt-2 uppercase tracking-tight"
              >
                {boss.name}
              </motion.h1>

              <div className="flex items-center justify-center gap-3 mt-6 font-mono text-xs text-zinc-400 uppercase">
                <SkillIcon className="w-4 h-4 text-cyan-400" />
                <span>{boss.skill}</span>
                <span>·</span>
                <span className="text-amber-500 font-bold border border-amber-950 bg-amber-950/20 px-2.5 py-0.5">
                  DIFFICULTY: {boss.difficulty}/10.0
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-zinc-950 border border-zinc-900 p-6 mt-8 max-w-2xl mx-auto text-left font-mono"
              >
                <p className="text-xs leading-relaxed italic text-zinc-400">
                  &ldquo;{boss.story}&rdquo;
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={() => setPhase("battle")}
                  size="lg"
                  className="mt-8 font-mono uppercase text-xs tracking-wider w-full sm:w-auto"
                >
                  <Swords className="w-4 h-4 mr-1.5" /> Enter Battle
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
              className="space-y-6"
            >
              {/* Battle header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
                <div>
                  <p className="text-xs font-mono text-red-500 uppercase tracking-widest">
                    ACTIVE ENGAGEMENT // CONSOLE
                  </p>
                  <h1 className="text-2xl font-mono font-bold uppercase mt-1">{boss.name}</h1>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">BOSS STRENGTH</p>
                  <div className="w-full sm:w-48 h-1.5 bg-zinc-850 mt-1.5">
                    <div className="h-full w-full bg-gradient-to-r from-red-500 to-orange-500" />
                  </div>
                </div>
              </div>

              {/* Challenge */}
              <div className="bg-[#101012] border border-zinc-850 p-6">
                <p className="text-[10px] font-mono text-red-500 tracking-widest uppercase mb-3">
                  THE SYSTEM REQUIREMENT // PROBLEM
                </p>
                <p className="text-sm font-mono leading-relaxed text-zinc-350">{boss.challenge}</p>
              </div>

              {/* Tasks checklist */}
              <div className="bg-[#101012] border border-zinc-850 p-6">
                <p className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-4">
                  COMPLETION TASKS Checklist
                </p>
                <div className="space-y-2">
                  {boss.tasks.map((task, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleTask(i)}
                      className={`w-full text-left flex gap-3 p-3 font-mono text-xs border transition-all ${
                        completedTasks.has(i)
                          ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-400"
                          : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
                      }`}
                    >
                      <span className={completedTasks.has(i) ? "text-emerald-400 font-bold" : "text-zinc-650"}>
                        {completedTasks.has(i) ? "[✓]" : `[${i + 1}]`}
                      </span>
                      <span className={completedTasks.has(i) ? "line-through opacity-50" : ""}>
                        {task}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hints */}
              {boss.hints && boss.hints.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowHints(!showHints)}
                    className="text-xs font-mono text-amber-500 hover:underline uppercase tracking-wider"
                  >
                    {showHints ? "[- Hide Hints]" : "[+ Request System Hints]"}
                  </button>
                  {showHints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-[#101012] border border-zinc-850 p-4 mt-3 space-y-2 font-mono text-xs"
                    >
                      {boss.hints.map((hint, i) => (
                        <p key={i} className="text-zinc-400">
                          &gt; {hint}
                        </p>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Answer */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>SOLUTION INPUT TERMINAL // PLAIN TEXT OR MD</span>
                  <span>MONOSPACE</span>
                </div>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter code block, configuration manifest, or explanation architecture..."
                  className="w-full min-h-[220px] bg-zinc-950 border border-zinc-850 p-4 outline-none resize-none focus:border-cyan-500 text-xs font-mono text-zinc-300 placeholder:text-zinc-700"
                />
              </div>

              {error && (
                <p className="text-xs font-mono text-red-500 uppercase bg-red-950/20 border border-red-950 p-3">{error}</p>
              )}

              <Button
                onClick={submitAnswer}
                disabled={!answer.trim()}
                size="lg"
                className="w-full font-mono uppercase text-xs tracking-wider"
              >
                <Swords className="w-4 h-4 mr-1.5" /> Submit Solution
              </Button>
            </motion.div>
          )}

          {phase === "evaluating" && (
            <motion.div
              key="evaluating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-[50vh] flex flex-col items-center justify-center bg-[#101012] border border-zinc-850 p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="text-cyan-400 p-3 bg-zinc-900 border border-zinc-850 mb-6"
              >
                <TerminalIcon className="w-8 h-8" />
              </motion.div>
              <LoadingSpinner message="Evaluating technical response manifest..." />
            </motion.div>
          )}

          {phase === "result" && evaluation && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#101012] border border-zinc-850 p-8 shadow-2xl text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-zinc-900 border border-zinc-850 text-cyan-400">
                  {evaluation.passed ? <Trophy className="w-10 h-10 text-amber-500" /> : <Skull className="w-10 h-10 text-red-500" />}
                </div>
              </div>

              <h1 className="text-3xl font-mono font-bold uppercase tracking-tight">
                {evaluation.passed ? "Challenge Completed!" : "Requirements Met: FALSE"}
              </h1>
              <p className="text-xs font-mono text-zinc-500 uppercase mt-1">EVALUATED AGAINST // {boss.name}</p>

              <div className="my-8">
                <p className="text-6xl font-mono font-black text-cyan-400">
                  {evaluation.score}
                </p>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-1">TOTAL CONFORMANCE SCORE / 10.0</p>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-6 text-left max-w-2xl mx-auto font-mono text-xs">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-900 mb-6">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase">EVIDENCE TARGET</p>
                    <h2 className="text-sm font-bold uppercase mt-0.5">
                      {evaluation.skillEvidence.skill}
                    </h2>
                  </div>
                  <span className="text-lg font-bold text-cyan-400">
                    LEVEL: {evaluation.skillEvidence.demonstratedLevel}/10
                  </span>
                </div>

                {evaluation.strengths.length > 0 && (
                  <div className="mb-6">
                    <p className="font-bold text-emerald-400 mb-2">
                      [+] CONFORMANCE CRITERIA MET
                    </p>
                    <ul className="space-y-1.5 text-zinc-400">
                      {evaluation.strengths.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluation.weaknesses.length > 0 && (
                  <div className="mb-6">
                    <p className="font-bold text-amber-500 mb-2">
                      [-] DEFICIENCIES IDENTIFIED
                    </p>
                    <ul className="space-y-1.5 text-zinc-400">
                      {evaluation.weaknesses.map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-zinc-900 pt-4 mt-4">
                  <p className="font-bold text-zinc-500 mb-2">EVALUATOR FEEDBACK LOG</p>
                  <p className="leading-relaxed text-zinc-400">
                    {evaluation.feedback}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center mt-8">
                {!evaluation.passed && (
                  <Button onClick={() => { setPhase("battle"); setAnswer(""); setError(""); }} className="font-mono uppercase text-xs tracking-wider">
                    <Swords className="w-4 h-4 mr-1.5" /> Re-engage Battle
                  </Button>
                )}
                <Button href="/roadmap" variant="secondary" className="font-mono uppercase text-xs tracking-wider">
                  View Roadmap
                </Button>
                <Button href="/dashboard" variant="ghost" className="font-mono uppercase text-xs tracking-wider">
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
