import mongoose from "mongoose";

const AryaSchema = new mongoose.Schema(
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
    purchasePrice: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    remarks: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Arya", AryaSchema);
