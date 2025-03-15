import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PublishedSchema = new Schema({
  quizId: { type: mongoose.Types.ObjectId, ref: "Quiz", unique: true },
  start_status: { type: Boolean, default: false },
  participants: {
    type: [
      {
        username: { type: String, required: true, unique: true },
        avatar: { type: String },
        score: { type: Number, default: 0 },
        hasAnswered: { type: Boolean, default: false },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
  },
});

const Published = model("Published", PublishedSchema, "published");

export default Published;
