import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import dbConnect from "./db";

let auth: ReturnType<typeof betterAuth>;

const initAuth = async () => {
  await dbConnect();
  
  if (!auth) {
    auth = betterAuth({
      database: mongodbAdapter(mongoose.connection.db!),
      emailAndPassword: {
        enabled: true,
      },
      user: {
        modelName: "User",
        collectionName: "user",
        additionalFields: {
          avatar: { type: "string" },
        },
      },
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID! as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
        },
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
  
  return auth;
};

export { initAuth };
export const getAuth = async () => {
  if (!auth) {
    return await initAuth();
  }
  return auth;
};

