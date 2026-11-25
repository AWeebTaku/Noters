import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true } // createdAt, updatedAt (updatedAt is what a sync client needs)
);

export default mongoose.model("Note", noteSchema);
