export type TargetRole =
  | "AI Engineer"
  | "Full Stack Developer"
  | "DevOps Engineer";

export type ProfileSkill = {
  name: string;
  selfScore: number;
  assessmentScore?: number;
};

export type StudentProfile = {
  _id?: string;
  education?: string;
  targetRole: TargetRole;
  skills: ProfileSkill[];
  projects: string[];
  certifications: string[];
};

export type SkillAnalysisItem = {
  name: string;
  selfScore: number;
  assessmentScore: number;
  requiredScore: number;
  skillGap: number;
  confidenceGap: number;
};

export type SkillAnalysis = {
  _id?: string;
  targetRole: TargetRole;
  skills: SkillAnalysisItem[];
  analyzedAt?: string;
};

export type AssessmentQuestion = {
  id: string;
  skill: string;
  difficulty: "easy" | "medium";
  question: string;
  options: string[];
};

export type RoadmapSkill = {
  name: string;
  why: string;
  topics: string[];
  project: {
    title: string;
    description: string;
  };
  completionCriteria: string[];
};

export type RoadmapPhase = {
  phase: number;
  title: string;
  description: string;
  skills: RoadmapSkill[];
};

export type CareerRoadmap = {
  summary: string;
  phases: RoadmapPhase[];
};

export type Boss = {
  name: string;
  skill: string;
  difficulty: number;
  story: string;
  challenge: string;
  tasks: string[];
  hints?: string[];
};

export type BossEvaluation = {
  score: number;
  passed: boolean;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  skillEvidence: {
    skill: string;
    demonstratedLevel: number;
  };
};

export type RagSource = {
  file: string;
  similarity: number;
};

export type RagResponse = {
  success: boolean;
  question: string;
  answer: string;
  sources: RagSource[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};
