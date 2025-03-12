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
    });
    return quizzes;
  }),
  addQuiz: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const newQuiz = new Quiz({
        userId: new mongoose.Types.ObjectId(input.userId),
        title: input.title,
      });

      const quiz = await newQuiz.save();
      return quiz;
    }),
});
