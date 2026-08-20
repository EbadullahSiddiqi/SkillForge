"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";

const features = [
  {
    icon: "🎯",
    title: "Skill Gap Analysis",
    description:
      "Compare what you think you know vs. what you actually know. Our engine finds the real gaps holding you back.",
  },
  {
    icon: "🗺️",
    title: "AI Career Roadmap",
    description:
      "Get a personalized, phase-by-phase learning path grounded in real industry knowledge — not generic advice.",
  },
  {
    icon: "⚔️",
    title: "Boss Battles",
    description:
      "Face challenges tied to your weakest skills. Prove you've learned by defeating bosses with real solutions.",
  },
  {
    icon: "🧠",
    title: "RAG-Powered Mentor",
    description:
      "Ask anything about your career path. Our AI mentor searches a curated knowledge base for grounded answers.",
  },
];

const steps = [
  {
    step: "01",
    title: "Build your profile",
    description: "Pick your target role and rate your skills honestly.",
  },
  {
    step: "02",
    title: "Take the assessment",
    description: "Quick MCQ quiz validates your actual knowledge level.",
  },
  {
    step: "03",
    title: "Analyze & forge",
    description: "See your skill cards, roadmap, and next boss challenge.",
  },
];

export default function HomePage() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse-glow" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-cyan-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              AI-powered career forging
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
              Forge the career
              <br />
              <span className="gradient-text">you deserve</span>
            </h1>

            <p className="mt-6 text-lg text-muted max-w-lg leading-relaxed">
              Stop guessing what to learn next. SkillForge maps your real skill
              gaps, builds a personalized roadmap, and challenges you to prove
              you&apos;ve got what it takes.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/signup" size="lg">
                Start forging free →
              </Button>
              <Button href="/login" variant="secondary" size="lg">
                Log in
              </Button>
            </div>

            <div className="mt-12 flex gap-8 text-sm text-muted">
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p>Career paths</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">AI</p>
                <p>Powered analysis</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">RAG</p>
                <p>Grounded knowledge</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative animate-float">
              <div className="glass rounded-3xl p-6 gradient-border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted tracking-widest">
                      SKILL CARD
                    </span>
                    <span className="text-amber-400 text-xs font-bold">
                      LEGENDARY GAP
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">🐍</span>
                    <div>
                      <h3 className="text-2xl font-black">Python</h3>
                      <p className="text-muted text-sm">Gap: 3.5 points</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-black/30">
                    <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="glass rounded-xl p-3">
                      <p className="text-muted">Score</p>
                      <p className="font-bold text-lg">6.5</p>
                    </div>
                    <div className="glass rounded-xl p-3">
                      <p className="text-muted">Required</p>
                      <p className="font-bold text-lg">8.0</p>
                    </div>
                    <div className="glass rounded-xl p-3">
                      <p className="text-muted">Gap</p>
                      <p className="font-bold text-lg text-amber-400">1.5</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 glass rounded-2xl px-4 py-3 text-sm">
                <span className="text-cyan-400">⚔️</span> Boss ready
              </div>
              <div className="absolute -bottom-4 -left-6 glass rounded-2xl px-4 py-3 text-sm">
                <span className="text-violet-400">🗺️</span> Roadmap generated
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-cyan-400 tracking-widest mb-3">
              FEATURES
            </p>
            <h2 className="text-4xl md:text-5xl font-black">
              Everything you need to level up
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass glass-hover rounded-3xl p-8 transition-all duration-300"
              >
                <span className="text-4xl">{feature.icon}</span>
                <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
                <p className="text-muted mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-amber-400 tracking-widest mb-3">
              HOW IT WORKS
            </p>
            <h2 className="text-4xl md:text-5xl font-black">
              Three steps to your dream role
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <span className="text-6xl font-black text-white/5">
                  {step.step}
                </span>
                <h3 className="text-xl font-bold mt-2">{step.title}</h3>
                <p className="text-muted mt-2">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 md:p-16 gradient-border relative overflow-hidden">
          <div className="absolute inset-0 mesh-bg opacity-50" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-black">
              Ready to forge your future?
            </h2>
            <p className="text-muted mt-4 text-lg max-w-xl mx-auto">
              Join SkillForge and turn your skill gaps into your greatest
              strengths.
            </p>
            <div className="mt-8">
              <Button href="/signup" size="lg">
                Create your free account →
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-6 text-center text-sm text-muted">
        <p>
          Built for hackathon greatness ·{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Log in
          </Link>
        </p>
      </footer>
    </AppShell>
  );
}
