import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import dbConnect from "./db";

let auth: ReturnType<typeof betterAuth>;

const waitForConnection = async (maxAttempts = 5, delayMs = 1000): Promise<typeof mongoose> => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const conn = await dbConnect();
    if (conn.connection.readyState === 1 && conn.connection.db) {
      return conn;
    }
    attempts++;
    if (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  throw new Error(`Database connection not ready after ${maxAttempts} attempts`);
};

const initAuth = async () => {
  try {
    const conn = await waitForConnection();
    
    if (!auth && conn.connection.db) {
      auth = betterAuth({
        database: mongodbAdapter(conn.connection.db),
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
    
    if (!auth) {
      throw new Error("Failed to initialize auth - database not available");
    }
    
    return auth;
  } catch (error) {
    console.error("Auth initialization error:", error);
    throw error;
  }
};

export { initAuth };
export const getAuth = async () => {
  if (!auth) {
    return await initAuth();
  }
  return auth;
};

