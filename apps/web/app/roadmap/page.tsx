"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiFetch, ApiError } from "@/lib/api";
import type { CareerRoadmap, SkillAnalysis } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { SKILL_ICONS } from "@/lib/constants";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorAction, setErrorAction] = useState<{
    label: string;
    href: string;
  } | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  useEffect(() => {
    loadRoadmap();
  }, []);

  async function loadRoadmap() {
    setLoading(true);
    setError("");
    setErrorAction(null);

    try {
      const analysisData = await apiFetch<{ analysis: SkillAnalysis }>(
        "/api/skills/latest",
      );
      setTargetRole(analysisData.analysis.targetRole);

      const data = await apiFetch<{ roadmap: CareerRoadmap }>(
        "/api/career/roadmap",
        { method: "POST" },
      );

      setRoadmap(data.roadmap);
      if (data.roadmap.phases.length > 0) {
        setExpandedPhase(data.roadmap.phases[0].phase);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404 || err.message.includes("profile")) {
          setError("You need to create a profile first.");
          setErrorAction({ label: "Create profile", href: "/profile" });
        } else if (
          err.status === 400 ||
          err.message.includes("analysis")
        ) {
          setError("Complete your skill assessment and analysis first.");
          setErrorAction({ label: "Take assessment", href: "/assessment" });
        } else {
          setError(err.message);
          setErrorAction({ label: "Go to dashboard", href: "/dashboard" });
        }
      } else {
        setError("Failed to generate roadmap. Ensure all services are running.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-6">
          <LoadingSpinner message="Generating your personalized roadmap..." />
          <p className="text-sm text-muted max-w-md text-center">
            Our AI is analyzing your skill gaps and searching the knowledge base
            for the best learning path. This may take a moment.
          </p>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
          <ErrorState
            title="Roadmap unavailable"
            message={error}
            actionLabel={errorAction?.label}
            actionHref={errorAction?.href}
          />
        </div>
      </AppShell>
    );
  }

  if (!roadmap || roadmap.phases.length === 0) {
    return (
      <AppShell>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
          <ErrorState
            title="No roadmap generated"
            message="We couldn't generate a roadmap. Try again or check that the RAG and Gemini services are running."
            actionLabel="Try again"
            onAction={loadRoadmap}
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-12">
            <p className="text-sm text-violet-400 tracking-widest">
              YOUR CAREER PATH
            </p>
            <h1 className="text-4xl md:text-5xl font-black mt-2">
              {targetRole}{" "}
              <span className="gradient-text">Roadmap</span>
            </h1>
            {roadmap.summary && (
              <p className="text-muted mt-4 text-lg leading-relaxed max-w-3xl">
                {roadmap.summary}
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-violet-500/30 to-transparent hidden md:block" />

            <div className="space-y-8">
              {roadmap.phases.map((phase, phaseIndex) => {
                const isExpanded = expandedPhase === phase.phase;

                return (
                  <motion.div
                    key={phase.phase}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: phaseIndex * 0.1 }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedPhase(isExpanded ? null : phase.phase)
                      }
                      className="w-full text-left"
                    >
                      <div className="flex gap-5 items-start">
                        <div className="hidden md:flex w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 items-center justify-center font-black text-sm shrink-0 z-10">
                          {String(phase.phase).padStart(2, "0")}
                        </div>
                        <div
                          className={`flex-1 glass rounded-2xl p-6 transition-all ${
                            isExpanded ? "border-cyan-500/30" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h2 className="text-xl font-bold">
                                {phase.title}
                              </h2>
                              <p className="text-muted mt-2 text-sm">
                                {phase.description}
                              </p>
                            </div>
                            <span className="text-muted text-sm">
                              {isExpanded ? "▲" : "▼"}
                            </span>
                          </div>

                          <div className="flex gap-2 mt-3">
                            {phase.skills.map((s) => (
                              <span
                                key={s.name}
                                className="text-xs px-2 py-1 rounded-full bg-white/5 text-muted"
                              >
                                {SKILL_ICONS[s.name] ?? "💎"} {s.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="ml-0 md:ml-16 mt-4 space-y-4"
                      >
                        {phase.skills.map((skill) => {
                          const skillOpen = expandedSkill === skill.name;

                          return (
                            <div
                              key={skill.name}
                              className="glass rounded-2xl overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedSkill(
                                    skillOpen ? null : skill.name,
                                  )
                                }
                                className="w-full text-left p-6 flex items-center gap-4"
                              >
                                <span className="text-3xl">
                                  {SKILL_ICONS[skill.name] ?? "💎"}
                                </span>
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg">
                                    {skill.name}
                                  </h3>
                                  <p className="text-sm text-muted mt-1 line-clamp-2">
                                    {skill.why}
                                  </p>
                                </div>
                                <span className="text-muted">
                                  {skillOpen ? "−" : "+"}
                                </span>
                              </button>

                              {skillOpen && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="px-6 pb-6 space-y-5 border-t border-white/5 pt-5"
                                >
                                  <div>
                                    <p className="text-xs text-cyan-400 tracking-widest mb-3">
                                      TOPICS TO LEARN
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {skill.topics.map((topic) => (
                                        <span
                                          key={topic}
                                          className="px-3 py-1.5 rounded-lg bg-white/5 text-sm"
                                        >
                                          {topic}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="glass rounded-xl p-5 bg-amber-500/5 border-amber-500/20">
                                    <p className="text-xs text-amber-400 tracking-widest">
                                      🛠️ PROJECT
                                    </p>
                                    <h4 className="font-bold mt-2">
                                      {skill.project.title}
                                    </h4>
                                    <p className="text-sm text-muted mt-2">
                                      {skill.project.description}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-muted tracking-widest mb-3">
                                      COMPLETION CRITERIA
                                    </p>
                                    <ul className="space-y-2">
                                      {skill.completionCriteria.map(
                                        (criterion) => (
                                          <li
                                            key={criterion}
                                            className="flex gap-3 text-sm"
                                          >
                                            <span className="text-emerald-400">
                                              ○
                                            </span>
                                            {criterion}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Button href="/boss" variant="secondary">
              ⚔️ Face a boss battle
            </Button>
            <Button href="/mentor" variant="secondary">
              🧠 Ask AI mentor
            </Button>
            <Button onClick={loadRoadmap} variant="ghost">
              ↻ Regenerate roadmap
            </Button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
