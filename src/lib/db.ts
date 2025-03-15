import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) throw new Error("MONGO_URL is not defined.");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null };
}

export const dbConnect = async () => {
  if (cached.conn) return cached.conn;

  try{
  cached.conn = await mongoose.connect(MONGODB_URI);
  }
  catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }


  return cached.conn;
};

export default dbConnect;
