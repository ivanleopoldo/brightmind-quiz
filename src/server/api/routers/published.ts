import { createTRPCRouter, publicProcedure } from "../trpc";
import Published from "@/lib/models/Published";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const publishedRouter = createTRPCRouter({
  addParticipant: publicProcedure
    .input(
      z.object({
        quizId: z.string(),
        username: z.string(),
        score: z.number().optional(),
        avatar: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await Published.findOneAndUpdate(
        {
          quizId: input.quizId,
        },
        {
          $push: {
            participants: {
              username: input.username,
              score: input.score,
              avatar: input.avatar,
            },
          },
        },
        {
          new: true,
          projection: { participants: { $slice: -1 } },
        },
      ).lean();

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      console.log(result);

      return result?.participants[0];
    }),

  publishQuiz: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const result = new Published({ quizId: input });
    await result.save();
    return result;
  }),
  unpublishQuiz: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const result = await Published.deleteOne({
        quizId: input,
      }).lean();
      return result;
    }),
  getById: publicProcedure.input(z.string()).query(async ({ input }) => {
    const result = await Published.findOne({
      quizId: input,
    }).lean();
    return result;
  }),
  startQuiz: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const result = await Published.findOneAndUpdate(
      {
        quizId: input,
      },
      {
        $set: {
          start_status: true,
        },
      },
    ).lean();
    return result;
  }),
});
