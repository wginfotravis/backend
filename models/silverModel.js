import mongoose from "mongoose";

const SilverSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      unique: "itemcode already exists",
      required: "item code is required",
    },
    name: {
      type: String,
      required: "name is required",
    },
    currency: {
      type: String,
      default: "Nepalese Rupee",
    },
    weight: {
      type: Number,
      default: 0,
    },
    makingPrice: {
      type: Number,
      default: 0,
    },
    purchasePrice: {
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

export default mongoose.model("Silver", SilverSchema);
