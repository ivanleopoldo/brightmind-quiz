import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null };
}

export const dbConnect = async () => {
  if (cached.conn) return cached.conn;

  try {
    cached.conn = await mongoose.connect(process.env.MONGODB_URI!, {
      autoIndex: true,
    });
    mongoose.set("bufferCommands", false);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }

  return cached.conn;
};

export default dbConnect;
