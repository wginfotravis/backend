import mongoose from "mongoose";

const FactorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      unique: "Name already exists",
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: "",
    },
    contactPerson: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    landline: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
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

export default mongoose.model("Factory", FactorySchema);
