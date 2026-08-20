"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import type { SkillAnalysis } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { SkillCardGrid } from "@/components/skills/SkillCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<SkillAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch<{ analysis: SkillAnalysis | null }>(
          "/api/skills/latest",
        );
        setAnalysis(data.analysis);
      } catch (err) {
        if (err instanceof Error && err.message.includes("404")) {
          try {
            const profileData = await apiFetch<{
              profile: { targetRole: string } | null;
            }>("/api/profile");
            if (!profileData.profile) {
              setHasProfile(false);
            }
          } catch {
            setHasProfile(false);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <LoadingSpinner message="Loading your skill profile..." />
        </div>
      </AppShell>
    );
  }

  if (!hasProfile) {
    return (
      <AppShell>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <span className="text-5xl">⚒️</span>
            <h1 className="text-3xl font-black mt-6">Welcome to SkillForge</h1>
            <p className="text-muted mt-3">
              Let&apos;s start by building your profile and assessing your
              skills.
            </p>
            <Button href="/profile" size="lg" className="mt-8">
              Create your profile →
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!analysis) {
    return (
      <AppShell>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <span className="text-5xl">🎯</span>
            <h1 className="text-3xl font-black mt-6">Complete your assessment</h1>
            <p className="text-muted mt-3">
              Your profile is set up. Take the skill assessment to unlock your
              dashboard, roadmap, and boss battles.
            </p>
            <Button href="/assessment" size="lg" className="mt-8">
              Take assessment →
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const skills = analysis.skills || [];
  const average =
    skills.length > 0
      ? (
          skills.reduce((sum, s) => sum + s.assessmentScore, 0) / skills.length
        ).toFixed(1)
      : "0";
  const biggestGap = [...skills].sort((a, b) => b.skillGap - a.skillGap)[0];
  const gapsToClose = skills.filter((s) => s.skillGap > 0).length;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-10">
            <p className="text-sm text-cyan-400 tracking-widest">
              YOUR CAREER JOURNEY
            </p>
            <h1 className="text-4xl md:text-5xl font-black mt-2">
              Path to{" "}
              <span className="gradient-text">{analysis.targetRole}</span>
            </h1>
            <p className="text-muted mt-3 max-w-2xl">
              Your skill cards reveal the truth. Click any card to flip it and
              see detailed stats. Close the gaps to level up.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Average Score", value: `${average}/10`, icon: "📊" },
              { label: "Skills Tracked", value: skills.length, icon: "🃏" },
              {
                label: "Gaps to Close",
                value: gapsToClose,
                icon: "🎯",
              },
              {
                label: "Biggest Gap",
                value: biggestGap?.name ?? "None",
                icon: "⚡",
              },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-5">
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-xs text-muted mt-2">{stat.label}</p>
                <p className="text-xl font-bold mt-1 truncate">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Skill Cards */}
          <section className="mb-12">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-sm text-muted tracking-widest">
                  YOUR SKILL CARDS
                </p>
                <h2 className="text-2xl font-bold mt-1">
                  Tap to inspect each skill
                </h2>
              </div>
              <Link
                href="/roadmap"
                className="text-sm text-cyan-400 hover:underline"
              >
                View roadmap →
              </Link>
            </div>
            <SkillCardGrid skills={skills} />
          </section>

          {/* Action cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <ActionCard
              icon="⚔️"
              title="Boss Battle"
              description="Face a challenge based on your weakest skill. Prove you've learned."
              href="/boss"
              accent="from-red-500/20 to-orange-500/20"
            />
            <ActionCard
              icon="🗺️"
              title="Career Roadmap"
              description="AI-generated learning path grounded in real industry knowledge."
              href="/roadmap"
              accent="from-violet-500/20 to-purple-500/20"
            />
            <ActionCard
              icon="🧠"
              title="AI Mentor"
              description="Ask career questions. Get answers from our RAG knowledge base."
              href="/mentor"
              accent="from-cyan-500/20 to-blue-500/20"
            />
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}

function ActionCard({
  icon,
  title,
  description,
  href,
  accent,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  accent: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -4 }}
        className={`glass glass-hover rounded-2xl p-6 h-full bg-gradient-to-br ${accent} transition-all`}
      >
        <span className="text-3xl">{icon}</span>
        <h3 className="text-lg font-bold mt-4">{title}</h3>
        <p className="text-sm text-muted mt-2">{description}</p>
        <span className="inline-block mt-4 text-sm text-cyan-400">
          Explore →
        </span>
      </motion.div>
    </Link>
  );
}
