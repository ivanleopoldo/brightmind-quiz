import mongoose from "mongoose";

const { Schema, model } = mongoose;

const QuizSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, unique: true },
    description: { type: String },
    published: { type: Boolean, default: false },
    overall_points: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    questions: [
      {
        title: { type: String },
        points: { type: Number, default: 1 },
        duration: { type: Number, default: 0 },
        choices: [
          {
            title: { type: String },
            isAnswer: { type: Boolean },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Quiz = model("Quiz", QuizSchema, "quizzes");

export default Quiz;
