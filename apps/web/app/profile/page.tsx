"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import {
  ROLE_DESCRIPTIONS,
  ROLE_SKILLS,
  SKILL_ICONS,
  TARGET_ROLES,
} from "@/lib/constants";
import type { ProfileSkill, StudentProfile, TargetRole } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import * as LucideIcons from "lucide-react";
import { User, ShieldCheck, ChevronRight, HelpCircle } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [targetRole, setTargetRole] = useState<TargetRole>("AI Engineer");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState<ProfileSkill[]>([]);
  const [step, setStep] = useState(1);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiFetch<{ profile: StudentProfile | null }>(
          "/api/profile",
        );
        if (data.profile) {
          setTargetRole(data.profile.targetRole);
          setEducation(data.profile.education || "");
          setSkills(data.profile.skills);
        } else {
          initSkills("AI Engineer");
        }
      } catch {
        initSkills("AI Engineer");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  function initSkills(role: TargetRole) {
    setSkills(
      ROLE_SKILLS[role].map((name) => ({
        name,
        selfScore: 5,
      })),
    );
  }

  function handleRoleChange(role: TargetRole) {
    setTargetRole(role);
    initSkills(role);
  }

  function updateSkillScore(name: string, score: number) {
    setSkills((prev) =>
      prev.map((s) => (s.name === name ? { ...s, selfScore: score } : s)),
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await apiFetch("/api/profile", {
        method: "POST",
        body: JSON.stringify({
          targetRole,
          education,
          skills,
          projects: [],
          certifications: [],
        }),
      });
      router.push("/assessment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <LoadingSpinner message="Loading your profile data..." />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-10 pb-6 border-b border-zinc-850">
            <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase">STEP 01 // PROFILE BUILDER</p>
            <h1 className="text-3xl font-mono font-bold uppercase tracking-tight mt-2">Build your profile</h1>
            <p className="text-xs text-zinc-400 mt-2 font-mono leading-relaxed">
              Tell us your target role and rate your skills honestly. This
              powers everything — your analysis, roadmap, and boss battles.
            </p>
          </div>

          {/* Step Progress indicators */}
          <div className="flex gap-3 mb-8">
            <div className="h-1 flex-1 bg-cyan-400" />
            <div
              className={`h-1 flex-1 transition-colors ${step >= 2 ? "bg-cyan-400" : "bg-zinc-800"}`}
            />
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <Input
                    label="Education / Experience Level (Optional)"
                    value={education}
                    onChange={setEducation}
                    placeholder="e.g. BS Computer Science, Self-taught 2 years"
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    TARGET CAREER ROLE
                  </label>
                  <div className="grid gap-3">
                    {TARGET_ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleChange(role)}
                        className={`text-left p-5 font-mono border transition-all rounded-sm flex flex-col justify-between ${
                          targetRole === role
                            ? "border-cyan-500 bg-cyan-950/20"
                            : "border-zinc-900 bg-[#101012] hover:border-zinc-800"
                        }`}
                      >
                        <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">{role}</h3>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-mono">
                          {ROLE_DESCRIPTIONS[role]}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full font-mono uppercase text-xs tracking-wider"
                >
                  Continue to skill rating <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-mono font-bold uppercase tracking-tight mb-1">Rate your skills</h2>
                  <p className="text-xs text-zinc-400 mb-6 font-mono uppercase">
                    Rate confidence from 0 (beginner) to 10 (expert)
                  </p>

                  <div className="space-y-4">
                    {skills.map((skill) => {
                      const iconName = SKILL_ICONS[skill.name] ?? "HelpCircle";
                      const SkillIcon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;

                      return (
                        <div
                          key={skill.name}
                          className="bg-[#101012] border border-zinc-850 p-5 font-mono"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                              <SkillIcon className="w-4 h-4 text-cyan-400" />
                              <span className="font-bold text-xs uppercase tracking-wider text-foreground">{skill.name}</span>
                            </div>
                            <span className="font-bold text-sm text-cyan-400">
                              {skill.selfScore}
                            </span>
                          </div>
                          
                          <input
                            type="range"
                            min={0}
                            max={10}
                            step={1}
                            value={skill.selfScore}
                            onChange={(e) =>
                              updateSkillScore(
                                skill.name,
                                Number(e.target.value),
                              )
                            }
                            className="w-full accent-cyan-400 cursor-pointer bg-zinc-800 h-1 rounded-none appearance-none"
                          />
                          <div className="flex justify-between text-[10px] text-zinc-600 mt-1 uppercase">
                            <span>Beginner</span>
                            <span>Expert</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <p className="text-xs font-mono text-red-500 uppercase bg-red-950/20 border border-red-950 p-3">
                    {error}
                  </p>
                )}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep(1)}
                    className="flex-1 font-mono uppercase text-xs tracking-wider"
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={saving} className="flex-1 font-mono uppercase text-xs tracking-wider">
                    {saving ? "Saving..." : "Save & Continue"}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </AppShell>
  );
}
