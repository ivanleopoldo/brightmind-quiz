import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import dbConnect from "./db";

export const auth = async function getAuth(){ 
  await dbConnect();
  return betterAuth({
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
}