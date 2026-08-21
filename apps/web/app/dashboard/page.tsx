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
import { 
  BarChart3, 
  Layers, 
  Target, 
  TrendingUp, 
  Swords, 
  Compass, 
  BrainCircuit,
  ArrowRight,
  ArrowUpRight,
  Hammer
} from "lucide-react";

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
          <div className="text-center max-w-md bg-[#101012] border border-zinc-850 p-8 shadow-2xl">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-cyan-400 mb-6">
              <Hammer className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-mono font-bold uppercase tracking-tight">Welcome to SkillForge</h1>
            <p className="text-xs text-zinc-400 mt-3 font-mono leading-relaxed">
              Let&apos;s start by building your profile and assessing your
              skills.
            </p>
            <Button href="/profile" size="lg" className="mt-8 font-mono uppercase text-xs tracking-wider w-full">
              Create your profile <ArrowRight className="w-4 h-4 ml-1" />
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
          <div className="text-center max-w-md bg-[#101012] border border-zinc-850 p-8 shadow-2xl">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-cyan-400 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-mono font-bold uppercase tracking-tight">Complete your assessment</h1>
            <p className="text-xs text-zinc-400 mt-3 font-mono leading-relaxed">
              Your profile is set up. Take the skill assessment to unlock your
              dashboard, roadmap, and boss battles.
            </p>
            <Button href="/assessment" size="lg" className="mt-8 font-mono uppercase text-xs tracking-wider w-full">
              Take assessment <ArrowRight className="w-4 h-4 ml-1" />
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

  const stats = [
    { label: "AVERAGE SCORE", value: `${average}/10`, icon: BarChart3, color: "text-cyan-400" },
    { label: "TRACKED SKILLS", value: skills.length, icon: Layers, color: "text-zinc-400" },
    { label: "GAPS TO CLOSE", value: gapsToClose, icon: Target, color: "text-amber-500" },
    { label: "CRITICAL GAP", value: biggestGap?.name ?? "NONE", icon: TrendingUp, color: "text-red-400" },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-10 pb-8 border-b border-zinc-850">
            <p className="text-xs font-mono text-cyan-400 tracking-[0.2em] uppercase">
              CAREER TRACKING CONSOLE
            </p>
            <h1 className="text-3xl md:text-5xl font-mono font-bold uppercase tracking-tight mt-2">
              Path to{" "}
              <span className="gradient-text font-mono">{analysis.targetRole}</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-3 max-w-2xl font-mono leading-relaxed">
              Your skill cards reveal current benchmark gaps. Click any card to inspect detailed metrics. Close the gaps to level up.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-[#101012] border border-zinc-850 p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className="text-xl font-mono font-bold text-foreground truncate">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Skill Cards Grid Section */}
          <section className="mb-16">
            <div className="flex justify-between items-end mb-6 pb-4 border-b border-zinc-900">
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  PORTFOLIO MATRIX
                </p>
                <h2 className="text-lg font-mono font-bold uppercase mt-1">
                  Active Skill Cards
                </h2>
              </div>
              <Link
                href="/roadmap"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 uppercase"
              >
                Inspect roadmap <ArrowUpRight className="w-4.5 h-4.5" />
              </Link>
            </div>
            <SkillCardGrid skills={skills} />
          </section>

          {/* Action Cards Section */}
          <section className="border-t border-zinc-850 pt-12">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              OPERATIONAL HUB
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <ActionCard
                icon={Swords}
                title="BOSS BATTLE"
                description="Face a technical challenge based on your weakest skill. Prove you've closed the gap."
                href="/boss"
                accentColor="border-red-950 hover:border-red-800 bg-red-950/5 text-red-400"
              />
              <ActionCard
                icon={Compass}
                title="CAREER ROADMAP"
                description="Inspect your custom phase-by-phase learning path grounded in industry datasets."
                href="/roadmap"
                accentColor="border-violet-950 hover:border-violet-800 bg-violet-950/5 text-violet-400"
              />
              <ActionCard
                icon={BrainCircuit}
                title="AI MENTOR"
                description="Ask technical or career questions. Get answers searched from our secure RAG index."
                href="/mentor"
                accentColor="border-cyan-950 hover:border-cyan-800 bg-cyan-950/5 text-cyan-400"
              />
            </div>
          </section>
        </motion.div>
      </div>
    </AppShell>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
  href,
  accentColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  accentColor: string;
}) {
  return (
    <Link href={href} className="block group">
      <motion.div
        whileHover={{ y: -2 }}
        className={`border p-6 h-full transition-all duration-200 flex flex-col justify-between ${accentColor}`}
      >
        <div>
          <div className="flex justify-between items-start mb-6">
            <Icon className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase mb-2">{title}</h3>
          <p className="text-xs text-zinc-400 font-mono leading-relaxed mb-6">{description}</p>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider underline">
          EXPLORE CONSOLE
        </span>
      </motion.div>
    </Link>
  );
}
