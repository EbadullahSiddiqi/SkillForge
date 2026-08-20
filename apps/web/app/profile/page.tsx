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
          <LoadingSpinner message="Loading your profile..." />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-10">
            <p className="text-sm text-cyan-400 tracking-widest">STEP 1 OF 2</p>
            <h1 className="text-4xl font-black mt-2">Build your profile</h1>
            <p className="text-muted mt-3">
              Tell us your target role and rate your skills honestly. This
              powers everything — your analysis, roadmap, and boss battles.
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            <div className="h-1 flex-1 rounded-full bg-cyan-400" />
            <div
              className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-cyan-400" : "bg-white/10"}`}
            />
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Input
                  label="Education (optional)"
                  value={education}
                  onChange={setEducation}
                  placeholder="e.g. BS Computer Science, Self-taught"
                />

                <div>
                  <label className="block text-sm font-medium text-muted mb-3">
                    Target role
                  </label>
                  <div className="grid gap-3">
                    {TARGET_ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleChange(role)}
                        className={`text-left p-5 rounded-2xl border transition-all ${
                          targetRole === role
                            ? "border-cyan-500/50 bg-cyan-500/10"
                            : "border-white/10 glass glass-hover"
                        }`}
                      >
                        <h3 className="font-bold">{role}</h3>
                        <p className="text-sm text-muted mt-1">
                          {ROLE_DESCRIPTIONS[role]}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full"
                >
                  Continue to skill rating →
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold mb-1">Rate your skills</h2>
                  <p className="text-sm text-muted mb-6">
                    How confident are you in each skill? (0 = beginner, 10 =
                    expert)
                  </p>

                  <div className="space-y-5">
                    {skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="glass rounded-2xl p-5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {SKILL_ICONS[skill.name] ?? "💎"}
                            </span>
                            <span className="font-semibold">{skill.name}</span>
                          </div>
                          <span className="font-mono font-bold text-cyan-400 text-lg">
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
                          className="w-full accent-cyan-400"
                        />
                        <div className="flex justify-between text-xs text-muted mt-1">
                          <span>Beginner</span>
                          <span>Expert</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    ← Back
                  </Button>
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? "Saving..." : "Save & take assessment →"}
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
