import mongoose from "mongoose";

const trashSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    headingId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Trash", trashSchema);
