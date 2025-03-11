import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    username: String,
    age: Number,
  },
  {
    timestamps: true,
  },
);

const User = model("User", UserSchema, "users");

export default User;
