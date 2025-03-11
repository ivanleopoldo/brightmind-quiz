import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    accountId: { type: String, required: true, unique: true },
    email: { type: String },
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
  },
  {
    timestamps: true,
  },
);

const User = model("User", UserSchema, "users");

export default User;
