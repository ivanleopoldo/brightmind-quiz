import mongoose from "mongoose";

export type TChoice = {
  title: String;
  isAnswer: Boolean;
};

export type TQuestion = {
  title: String;
  points?: Number;
  duration?: Number;
  choices: TChoice[];
};

export type TQuiz = {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  published?: boolean;
  overall_points?: number;
  questions: TQuestion[];
};
