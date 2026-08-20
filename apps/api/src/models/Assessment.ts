import mongoose, { Document, Schema } from "mongoose";

interface IAnswer {
  questionId: string;
  skill: string;
  answer: string;
  correct: boolean;
}

export interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;

  answers: IAnswer[];

  scores: {
    skill: string;
    score: number;
  }[];

  completedAt?: Date;
}

const answerSchema = new Schema<IAnswer>(
  {
    questionId: {
      type: String,
      required: true,
    },

    skill: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    correct: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false },
);

const assessmentSchema = new Schema<IAssessment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: [answerSchema],

    scores: [
      {
        skill: String,
        score: Number,
      },
    ],

    completedAt: Date,
  },
  {
    timestamps: true,
  },
);

export const Assessment = mongoose.model<IAssessment>(
  "Assessment",
  assessmentSchema,
);
