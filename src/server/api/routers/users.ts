import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import User from "@/lib/models/User";
import Quiz from "@/lib/models/Quiz";
import mongoose from "mongoose";

// Mocked DB
interface User {
  username: String;
  age: Number;
}

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const users = await User.find();
    return users;
  }),
  addQuiz: publicProcedure.query(async () => {
    const newQuiz = new Quiz({
      userId: new mongoose.Types.ObjectId("67d050fc4ef7de2acaffe75e"),
      title: "hello",
    });
    const quiz = await newQuiz.save();

    console.log(quiz);
  }),
});
