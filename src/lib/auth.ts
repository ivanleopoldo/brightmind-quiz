import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import dbConnect from "./db";

let auth: ReturnType<typeof betterAuth>;
let connectionPromise: Promise<typeof mongoose> | null = null;

const waitForConnection = async (): Promise<typeof mongoose> => {
  if (!connectionPromise) {
    connectionPromise = dbConnect().then(async (conn) => {
      // readyState 1 means connected
      if ((conn.connection.readyState as number) !== 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if ((conn.connection.readyState as number) !== 1) {
          throw new Error("Database connection failed");
        }
      }
      return conn;
    }).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }
  return connectionPromise;
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

let authPromise: Promise<ReturnType<typeof betterAuth>> | null = null;

export const getAuth = async () => {
  if (!authPromise) {
    authPromise = initAuth().catch((error) => {
      authPromise = null;
      throw error;
    });
  }
  return authPromise;
};

