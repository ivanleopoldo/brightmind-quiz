import mongoose from "mongoose";

export type TChoice = {
  title: string;
  isAnswer: boolean;
};

export type TQuestion = {
  title: string;
  points?: number;
  duration?: number;
  choices: TChoice[];
};

export type TQuiz = {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string | null;
  published?: boolean;
  overall_points?: number;
  duration?: number;
  questions: TQuestion[];
};

export type TParticipant = {
  _id: mongoose.Types.ObjectId;
  username: string;
  avatar: string;
  joinedAt: Date;
  hasAnswered: boolean;
  score?: number;
};
