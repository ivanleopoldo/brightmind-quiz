import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import Quiz from "@/lib/models/Quiz";
import mongoose from "mongoose";
import { z } from "zod";

export const quizRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const quizzes = await Quiz.find();
    return quizzes;
  }),
  getById: publicProcedure.input(z.string()).query(async ({ input }) => {
    const quizzes = await Quiz.find({
      userId: new mongoose.Types.ObjectId(input),
    }).sort({ updatedAt: -1 });
    return quizzes;
  }),
  addQuiz: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const newQuiz = new Quiz({
        userId: new mongoose.Types.ObjectId(input.userId),
        title: input.title,
        description: input.description,
      });

      const quiz = await newQuiz.save();
      return quiz.toObject();
    }),
  getOne: publicProcedure.input(z.string()).query(async ({ input }) => {
    const quiz = await Quiz.findById(new mongoose.Types.ObjectId(input));

    return quiz && quiz.toObject();
  }),
  addQuestion: publicProcedure
    .input(
      z.object({
        quizId: z.string(),
        title: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const updated = await Quiz.updateOne(
        { _id: new mongoose.Types.ObjectId(input.quizId) },
        {
          $push: {
            questions: {
              title: input.title,
              description: input.description,
            },
          },
        },
      );
    }),
  updateQuestion: publicProcedure
    .input(
      z.object({
        quizId: z.string(),
        questionId: z.string(),
        description: z.string(),
        title: z.string(),
        choices: z.array(
          z.object({ title: z.string(), isAnswer: z.boolean() }),
        ),
        duration: z.number().optional(),
        points: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const updated = await Quiz.updateOne(
        {
          _id: input.quizId,
          "questions._id": input.questionId,
        },
        {
          $set: {
            "questions.$.title": input.title,
            "questions.$.description": input.description,
            "questions.$.choices": input.choices,
            "questions.$.duration": input.duration,
            "questions.$.points": input.points,
          },
        },
      );
    }),
  deleteQuestion: publicProcedure
    .input(z.object({ quizId: z.string(), questionId: z.string() }))
    .mutation(async ({ input }) => {
      const result = await Quiz.updateOne(
        {
          _id: input.quizId,
        },
        {
          $pull: {
            questions: { _id: input.questionId },
          },
        },
      );
    }),
  deleteQuiz: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const result = await Quiz.deleteOne({ _id: input });
  }),
});
