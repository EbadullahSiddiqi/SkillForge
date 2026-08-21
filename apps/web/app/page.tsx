"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { 
  Target, 
  Compass, 
  Swords, 
  BrainCircuit, 
  ArrowRight, 
  Terminal, 
  Zap, 
  Workflow, 
  FileCode,
  ShieldCheck
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "SKILL GAP ANALYSIS",
    description:
      "Compare what you think you know vs. what you actually know. Our engine finds the real gaps holding you back.",
  },
  {
    icon: Compass,
    title: "AI CAREER ROADMAP",
    description:
      "Get a personalized, phase-by-phase learning path grounded in real industry knowledge — not generic advice.",
  },
  {
    icon: Swords,
    title: "BOSS BATTLES",
    description:
      "Face challenges tied to your weakest skills. Prove you've learned by defeating bosses with real solutions.",
  },
  {
    icon: BrainCircuit,
    title: "RAG-POWERED MENTOR",
    description:
      "Ask anything about your career path. Our AI mentor searches a curated knowledge base for grounded answers.",
  },
];

const steps = [
  {
    step: "01",
    title: "BUILD PROFILE",
    description: "Pick your target role and rate your skills honestly.",
  },
  {
    step: "02",
    title: "TAKE ASSESSMENT",
    description: "Quick MCQ quiz validates your actual knowledge level.",
  },
  {
    step: "03",
    title: "ANALYZE & FORGE",
    description: "See your skill cards, roadmap, and next boss challenge.",
  },
];

export default function HomePage() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-[#09090b]/50" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-800 bg-zinc-950 font-mono text-[10px] text-cyan-400 uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 bg-cyan-400 animate-pulse" />
              SYSTEM ACTIVE // CAREER FORGING ENGINE
            </div>

            <h1 className="text-4xl md:text-6xl font-mono font-bold leading-[1.1] uppercase tracking-tight">
              Forge the career
              <br />
              <span className="gradient-text font-mono">you deserve</span>
            </h1>

            <p className="mt-6 text-sm text-zinc-400 max-w-lg leading-relaxed font-mono">
              Stop guessing what to learn next. SkillForge maps your real skill
              gaps, builds a personalized roadmap, and challenges you to prove
              you&apos;ve got what it takes.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/signup" size="lg" className="font-mono uppercase text-xs tracking-wider">
                Start forging free <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button href="/login" variant="secondary" size="lg" className="font-mono uppercase text-xs tracking-wider">
                Log in
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-6 border-t border-zinc-800 pt-8 max-w-lg">
              <div>
                <p className="text-lg font-mono font-bold text-foreground">03</p>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Paths supported</p>
              </div>
              <div>
                <p className="text-lg font-mono font-bold text-foreground">AI</p>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Engine analysis</p>
              </div>
              <div>
                <p className="text-lg font-mono font-bold text-foreground">RAG</p>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Knowledge base</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <div className="relative animate-float">
              <div className="bg-[#101012] border border-zinc-850 p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                    <span className="text-[9px] font-mono text-zinc-500 tracking-widest">
                      [ METRIC CARD ]
                    </span>
                    <span className="text-amber-500 text-[9px] font-mono font-bold uppercase tracking-widest border border-amber-900/50 bg-amber-950/20 px-2 py-0.5">
                      LEGENDARY GAP
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 border border-zinc-800">
                      <Terminal className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-mono font-bold uppercase">Python</h3>
                      <p className="text-zinc-500 text-[10px] font-mono">GAP DIFFERENCE: -3.5 POINTS</p>
                    </div>
                  </div>
                  <div className="h-1 bg-zinc-850">
                    <div className="h-full w-[65%] bg-gradient-to-r from-emerald-500 to-teal-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-xs pt-2">
                    <div className="bg-zinc-950 border border-zinc-900 p-2.5">
                      <p className="text-[9px] font-mono text-zinc-500 uppercase">SCORE</p>
                      <p className="font-mono font-bold text-sm text-foreground">6.5</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-900 p-2.5">
                      <p className="text-[9px] font-mono text-zinc-500 uppercase">REQUIRED</p>
                      <p className="font-mono font-bold text-sm text-foreground">8.0</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-900 p-2.5">
                      <p className="text-[9px] font-mono text-zinc-500 uppercase">GAP</p>
                      <p className="font-mono font-bold text-sm text-amber-500">1.5</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest flex items-center gap-1.5 text-cyan-400">
                <Swords className="w-3.5 h-3.5" /> BOSS READY
              </div>
              <div className="absolute -bottom-4 -left-4 bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest flex items-center gap-1.5 text-violet-400">
                <Compass className="w-3.5 h-3.5" /> ROADMAP ACTIVE
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-b border-zinc-850">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-cyan-400 tracking-[0.25em] uppercase mb-3">
              [ 01 // OVERVIEW ]
            </p>
            <h2 className="text-3xl font-mono font-bold uppercase tracking-tight">
              Core Capabilities
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[#101012] border border-zinc-850 p-8 hover:border-zinc-700 transition-colors"
                >
                  <div className="p-3 bg-zinc-900 border border-zinc-800 w-fit mb-6 text-cyan-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-mono font-bold tracking-wider uppercase text-foreground">{feature.title}</h3>
                  <p className="text-xs text-zinc-400 mt-3 leading-relaxed font-mono">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-b border-zinc-850">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-amber-500 tracking-[0.25em] uppercase mb-3">
              [ 02 // PROCESS ]
            </p>
            <h2 className="text-3xl font-mono font-bold uppercase tracking-tight">
              Three Steps To Your Target Role
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-[#101012] border border-zinc-850 p-6"
              >
                <span className="absolute top-4 right-4 text-sm font-mono font-bold text-zinc-800">
                  [{step.step}]
                </span>
                <h3 className="text-xs font-mono font-bold text-foreground uppercase tracking-widest mb-3 pt-4">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-mono">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center bg-[#101012] border border-zinc-850 p-12 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl font-mono font-bold uppercase tracking-tight">
              Ready to forge your future?
            </h2>
            <p className="text-zinc-400 mt-4 text-xs font-mono max-w-xl mx-auto leading-relaxed">
              Join SkillForge today and turn your skill gaps into verified technical strengths.
            </p>
            <div className="mt-8">
              <Button href="/signup" size="lg" className="font-mono uppercase text-xs tracking-wider">
                Create your account <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-850 py-8 px-6 text-center text-xs font-mono text-zinc-500">
        <p>
          [ SKILLFORGE // HACKATHON BUILD ] ·{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            LOG IN
          </Link>
        </p>
      </footer>
    </AppShell>
  );
}
