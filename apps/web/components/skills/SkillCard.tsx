"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SkillAnalysisItem } from "@/lib/types";
import { SKILL_COLORS, SKILL_ICONS } from "@/lib/constants";

type SkillCardProps = {
  skill: SkillAnalysisItem;
};

export function SkillCard({ skill }: SkillCardProps) {
  const [flipped, setFlipped] = useState(false);

  const icon = SKILL_ICONS[skill.name] ?? "💎";
  const gradient = SKILL_COLORS[skill.name] ?? "from-cyan-500 to-blue-600";
  const progress = Math.min((skill.assessmentScore / 10) * 100, 100);
  const gapPercent = Math.min((skill.skillGap / 10) * 100, 100);
  const rarity =
    skill.skillGap === 0
      ? "MASTERED"
      : skill.skillGap <= 2
        ? "RARE"
        : skill.skillGap <= 4
          ? "EPIC"
          : "LEGENDARY";

  const rarityColor =
    skill.skillGap === 0
      ? "text-emerald-400"
      : skill.skillGap <= 2
        ? "text-cyan-400"
        : skill.skillGap <= 4
          ? "text-amber-400"
          : "text-red-400";

  return (
    <div
      className="perspective-[1000px] w-full h-[320px] cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className={`h-full bg-gradient-to-br ${gradient} p-[1px] rounded-2xl`}
          >
            <div className="h-full bg-surface rounded-2xl p-5 flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 card-shine opacity-50" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="flex justify-between items-start relative z-10">
                <span className={`text-xs font-bold tracking-widest ${rarityColor}`}>
                  {rarity}
                </span>
                <span className="text-3xl">{icon}</span>
              </div>

              <div className="flex-1 flex flex-col justify-center relative z-10">
                <h3 className="text-2xl font-black tracking-tight">
                  {skill.name}
                </h3>
                <p className="text-sm text-muted mt-1">Tap to inspect stats</p>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted">Level</span>
                  <span className="font-mono font-bold">
                    {skill.assessmentScore}/10
                  </span>
                </div>
                <div className="h-2 rounded-full bg-black/30 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="h-full glass rounded-2xl p-5 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{icon}</span>
              <div>
                <h3 className="font-bold">{skill.name}</h3>
                <p className="text-xs text-muted">Detailed analysis</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 text-sm">
              <StatRow label="Your score" value={`${skill.assessmentScore}/10`} />
              <StatRow label="Required" value={`${skill.requiredScore}/10`} />
              <StatRow
                label="Skill gap"
                value={`${skill.skillGap}`}
                highlight={skill.skillGap > 0}
              />
              <StatRow
                label="Confidence gap"
                value={
                  skill.confidenceGap > 0
                    ? `+${skill.confidenceGap} (overconfident)`
                    : skill.confidenceGap < 0
                      ? `${skill.confidenceGap} (underestimated)`
                      : "0 (aligned)"
                }
              />
            </div>

            {skill.skillGap > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">Gap to close</span>
                  <span className="text-amber-400 font-mono">
                    {skill.skillGap} pts
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-black/30">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${gapPercent}%` }}
                  />
                </div>
              </div>
            )}

            <p className="text-xs text-muted text-center mt-3">
              Tap to flip back
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/5">
      <span className="text-muted">{label}</span>
      <span className={highlight ? "text-amber-400 font-semibold" : ""}>
        {value}
      </span>
    </div>
  );
}

export function SkillCardGrid({ skills }: { skills: SkillAnalysisItem[] }) {
  const sorted = [...skills].sort((a, b) => b.skillGap - a.skillGap);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {sorted.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <SkillCard skill={skill} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
