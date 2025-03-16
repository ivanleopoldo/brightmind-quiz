import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, immutable: true },
    emailVerified: { type: Boolean, immutable: true },
    email: { type: String, immutable: true },
  },
  {
    timestamps: true,
  },
);

const User = model("User", UserSchema, "user");

export default User;
