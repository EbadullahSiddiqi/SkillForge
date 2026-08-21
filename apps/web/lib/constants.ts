import type { TargetRole } from "./types";

export const TARGET_ROLES: TargetRole[] = [
  "AI Engineer",
  "Full Stack Developer",
  "DevOps Engineer",
];

export const ROLE_SKILLS: Record<TargetRole, string[]> = {
  "AI Engineer": [
    "Python",
    "AI",
    "Machine Learning",
    "Databases",
    "Docker",
    "Git",
  ],
  "Full Stack Developer": [
    "JavaScript",
    "React",
    "Web Development",
    "Databases",
    "Docker",
    "Git",
  ],
  "DevOps Engineer": [
    "Linux",
    "Git",
    "Docker",
    "Kubernetes",
    "Databases",
  ],
};

export const ROLE_DESCRIPTIONS: Record<TargetRole, string> = {
  "AI Engineer":
    "Build intelligent systems with Python, ML, and modern AI tooling.",
  "Full Stack Developer":
    "Ship full products from React frontends to robust backend APIs.",
  "DevOps Engineer":
    "Automate, containerize, and scale infrastructure with confidence.",
};

export const SKILL_ICONS: Record<string, string> = {
  Python: "Terminal",
  AI: "BrainCircuit",
  "Machine Learning": "Binary",
  JavaScript: "Zap",
  React: "Atom",
  "Web Development": "Globe",
  Linux: "Cpu",
  Git: "GitBranch",
  Docker: "Container",
  Kubernetes: "Network",
  Databases: "Database",
  DevOps: "Settings",
};

export const SKILL_COLORS: Record<string, string> = {
  Python: "from-emerald-500 to-teal-600",
  AI: "from-violet-500 to-purple-600",
  "Machine Learning": "from-blue-500 to-indigo-600",
  JavaScript: "from-yellow-400 to-amber-500",
  React: "from-cyan-400 to-blue-500",
  "Web Development": "from-sky-400 to-blue-600",
  Linux: "from-slate-400 to-slate-600",
  Git: "from-orange-400 to-red-500",
  Docker: "from-blue-400 to-cyan-500",
  Kubernetes: "from-indigo-400 to-violet-600",
  Databases: "from-green-400 to-emerald-600",
  DevOps: "from-rose-400 to-pink-600",
};

export const MENTOR_SUGGESTIONS = [
  "What skills do I need to become an AI Engineer?",
  "How should I learn Docker from scratch?",
  "What project should I build to learn React?",
  "How do I close my biggest skill gap?",
  "What are the prerequisites for Kubernetes?",
];
