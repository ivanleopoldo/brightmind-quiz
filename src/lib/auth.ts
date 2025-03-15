import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import dbConnect from "./db";

await dbConnect();

export const auth = betterAuth({
  database: mongodbAdapter(mongoose.connection.db!),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "User",
    collectionName: "user",
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://brightmind-quiz.vercel.app",
  ],
});
