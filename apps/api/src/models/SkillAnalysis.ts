import mongoose, { Document, Schema } from "mongoose";

interface IAnalyzedSkill {
  name: string;
  selfScore: number;
  assessmentScore: number;
  requiredScore: number;
  skillGap: number;
  confidenceGap: number;
}

export interface ISkillAnalysis extends Document {
  userId: mongoose.Types.ObjectId;

  targetRole: string;

  skills: IAnalyzedSkill[];

  analyzedAt: Date;
}

const skillAnalysisSchema = new Schema<ISkillAnalysis>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  targetRole: {
    type: String,
    required: true,
  },

  skills: [
    {
      name: String,
      selfScore: Number,
      assessmentScore: Number,
      requiredScore: Number,
      skillGap: Number,
      confidenceGap: Number,
    },
  ],

  analyzedAt: {
    type: Date,
    default: Date.now,
  },
});

export const SkillAnalysis = mongoose.model<ISkillAnalysis>(
  "SkillAnalysis",
  skillAnalysisSchema,
);
