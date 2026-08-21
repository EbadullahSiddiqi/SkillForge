"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SkillAnalysisItem } from "@/lib/types";
import { SKILL_COLORS, SKILL_ICONS } from "@/lib/constants";
import * as LucideIcons from "lucide-react";

type SkillCardProps = {
  skill: SkillAnalysisItem;
};

export function SkillCard({ skill }: SkillCardProps) {
  const [flipped, setFlipped] = useState(false);

  const iconName = SKILL_ICONS[skill.name] ?? "HelpCircle";
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
  const gradient = SKILL_COLORS[skill.name] ?? "from-zinc-700 to-zinc-800";
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
      ? "text-emerald-400 border-emerald-950 bg-emerald-950/20"
      : skill.skillGap <= 2
        ? "text-cyan-400 border-cyan-950 bg-cyan-950/20"
        : skill.skillGap <= 4
          ? "text-amber-400 border-amber-950 bg-amber-950/20"
          : "text-red-400 border-red-950 bg-red-950/20";

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
          className="absolute inset-0 rounded-sm overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="h-full bg-zinc-850 p-[1px] rounded-sm border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="h-full bg-zinc-950 p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="flex justify-between items-center relative z-10">
                <span className={`text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 border ${rarityColor}`}>
                  {rarity}
                </span>
                <IconComponent className="w-5 h-5 text-zinc-400" />
              </div>

              <div className="my-6 relative z-10">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                  SKILL IDENTIFIER
                </p>
                <h3 className="text-2xl font-mono font-bold tracking-tight uppercase">
                  {skill.name}
                </h3>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    SCORE LEVEL
                  </span>
                  <span className="font-mono text-xs font-bold text-zinc-300">
                    {skill.assessmentScore}/10
                  </span>
                </div>
                <div className="h-1 bg-zinc-800 overflow-hidden rounded-none">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full bg-cyan-400"
                  />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
                    [ CLICK TO INSPECT DATA // FLIP CARD ]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-sm overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="h-full bg-zinc-950 border border-zinc-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono font-bold text-sm uppercase tracking-wider">
                    {skill.name}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  METRICS
                </span>
              </div>

              <div className="space-y-2.5">
                <StatRow label="ASSESSMENT SCORE" value={`${skill.assessmentScore}/10`} />
                <StatRow label="BENCHMARK REQUIRED" value={`${skill.requiredScore}/10`} />
                <StatRow
                  label="GAP DIFFERENCE"
                  value={`${skill.skillGap}`}
                  highlight={skill.skillGap > 0}
                />
                <StatRow
                  label="ALIGNMENT GAP"
                  value={
                    skill.confidenceGap > 0
                      ? `+${skill.confidenceGap} (OVER)`
                      : skill.confidenceGap < 0
                        ? `${skill.confidenceGap} (UNDER)`
                        : "0 (ALIGNED)"
                  }
                  highlight={skill.confidenceGap !== 0}
                />
              </div>
            </div>

            <div>
              {skill.skillGap > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-900">
                  <div className="flex justify-between text-[10px] font-mono mb-1.5">
                    <span className="text-zinc-500 uppercase">GAP PROGRESS</span>
                    <span className="text-amber-500 font-bold">
                      -{skill.skillGap} PTS
                    </span>
                  </div>
                  <div className="h-1 bg-zinc-850">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${gapPercent}%` }}
                    />
                  </div>
                </div>
              )}
              <p className="text-[9px] font-mono text-zinc-600 text-center mt-3 uppercase tracking-wider">
                [ CLICK TO DISMISS // FLIP BACK ]
              </p>
            </div>
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
    <div className="flex justify-between items-center py-1 border-b border-zinc-900">
      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight">{label}</span>
      <span className={`font-mono text-xs ${highlight ? "text-amber-500 font-semibold" : "text-zinc-300"}`}>
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <SkillCard skill={skill} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
