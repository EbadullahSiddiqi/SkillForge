import mongoose, { Schema, Document } from "mongoose";

interface ISkill {
  name: string;
  selfScore: number;
  assessmentScore?: number;
}

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;

  education?: string;

  targetRole: string;

  skills: ISkill[];

  projects: string[];

  certifications: string[];
}

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
    },

    selfScore: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },

    assessmentScore: {
      type: Number,
      min: 0,
      max: 10,
    },
  },
  { _id: false },
);

const studentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    education: String,

    targetRole: {
      type: String,
      required: true,
    },

    skills: [skillSchema],

    projects: [String],

    certifications: [String],
  },
  {
    timestamps: true,
  },
);

export const StudentProfile = mongoose.model<IStudentProfile>(
  "StudentProfile",
  studentProfileSchema,
);
