import mongoose from "mongoose";

const CancellSchema = new mongoose.Schema(
  {
    itemId: {
        type: String,
        required: true
    },
    invoice: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    cancelType: {
        type: String,
        require: true
    },
    amount: {
        type: Number
    },
    cancelledBy: {
     type: String,
     required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedDate: {
      type: Date
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cancel", CancellSchema);
