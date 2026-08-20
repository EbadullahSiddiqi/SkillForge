"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/ai";

type RoadmapSkill = {
  name: string;
  why: string;
  topics: string[];
  project: {
    title: string;
    description: string;
  };
  completionCriteria: string[];
};

type Phase = {
  phase: number;
  title: string;
  description: string;
  skills: RoadmapSkill[];
};

export default function RoadmapPage() {
  const [phases, setPhases] = useState<Phase[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch("/api/career/roadmap", {"method": "POST"});

        setPhases(data.roadmap?.phases || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Building your roadmap...
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="text-sm opacity-50">YOUR CAREER PATH</p>

          <h1 className="text-5xl font-black mt-2">AI Engineer Roadmap</h1>

          <p className="mt-4 opacity-60">
            A roadmap generated from your actual skill gaps, dependencies and
            grounded knowledge.
          </p>
        </div>

        <div className="space-y-12">
          {phases.map((phase) => (
            <section key={phase.phase}>
              {/* Phase header */}

              <div className="flex gap-5 mb-6">
                <div className="text-4xl font-black opacity-20">
                  {String(phase.phase).padStart(2, "0")}
                </div>

                <div>
                  <h2 className="text-2xl font-bold">{phase.title}</h2>

                  <p className="mt-2 opacity-60">{phase.description}</p>
                </div>
              </div>

              {/* Skills */}

              <div className="space-y-4 ml-0 md:ml-16">
                {phase.skills.map((skill) => (
                  <div key={skill.name} className="border rounded-3xl p-7">
                    <h3 className="text-xl font-bold">{skill.name}</h3>

                    <p className="mt-3 opacity-60 leading-relaxed">
                      {skill.why}
                    </p>

                    <div className="mt-6">
                      <p className="text-sm font-semibold mb-3">
                        WHAT YOU'LL LEARN
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {skill.topics.map((topic) => (
                          <span
                            key={topic}
                            className="px-3 py-2 border rounded-xl text-sm"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project */}

                    <div className="mt-7 p-5 rounded-2xl bg-black/5">
                      <p className="text-xs opacity-50">PRACTICAL PROJECT</p>

                      <h4 className="font-bold mt-2">{skill.project.title}</h4>

                      <p className="text-sm opacity-60 mt-2">
                        {skill.project.description}
                      </p>
                    </div>

                    {/* Completion */}

                    <div className="mt-7">
                      <p className="text-sm font-semibold mb-3">
                        COMPLETION CRITERIA
                      </p>

                      <div className="space-y-2">
                        {skill.completionCriteria.map((criterion) => (
                          <div key={criterion} className="text-sm opacity-70">
                            ○ {criterion}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
