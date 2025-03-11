import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import User from "@/lib/models/User";

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
});
