import mongoose from "mongoose";

const { Schema, model } = mongoose;

const QuizSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: { type: String, required: true, unique: true },
    description: { type: String },
    published: { type: Boolean, default: false },
    overall_points: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    questions: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String },
          points: { type: Number, default: 1 },
          duration: { type: Number, default: 0 },
          choices: {
            type: [
              {
                title: { type: String, required: true },
                isAnswer: { type: Boolean },
              },
            ],
            default: [
              { title: "Choice 1", isAnswer: false },
              { title: "Choice 2", isAnswer: true },
              { title: "Choice 3", isAnswer: false },
              { title: "Choice 4", isAnswer: false },
            ],
          },
        },
      ],
      default: [
        {
          title: "What is my name?",
          description: "This is a sample question.",
          points: 1,
          duration: 2,
          choices: [
            { title: "Choice 1", isAnswer: false },
            { title: "Choice 2", isAnswer: true },
            { title: "Choice 3", isAnswer: false },
            { title: "Choice 4", isAnswer: false },
          ],
        },
        {
          title: "Who is yellow?",
          description: "This is a sample question.",
          points: 1,
          duration: 2,
          choices: [
            { title: "Choice 1", isAnswer: false },
            { title: "Choice 2", isAnswer: false },
            { title: "Choice 3", isAnswer: true },
            { title: "Choice 4", isAnswer: false },
          ],
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

const Quiz = model("Quiz", QuizSchema, "quizzes");

export default Quiz;
