import mongoose from "mongoose";

const WatchSchema = new mongoose.Schema(
  {
    modelNo: {
      type: String,
      unique: "model no already exists",
      required: "Model number is required",
    },
    name: {
      type: String,
      required: "name is required",
    },
    currency: {
      type: String,
      default: "Nepalese Rupee",
    },
    price: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    manufacturer: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
    remarks: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
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

export default mongoose.model("Watch", WatchSchema);
