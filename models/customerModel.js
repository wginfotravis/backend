import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: "fullName is required",
    },
    address: {
      type: String,
      required: "Address is required",
    },
    email: {
      type: String,
      trim: true,
    },
    dob: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: "Phone is required",
    },
    membershipNo: {
      type: String,
      default: "",
    },
    dateOfMembership: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
    boughtWatch: {
      type: Boolean,
      default: false,
    },
    boughtJewellery: {
      type: Boolean,
      default: false,
    },
    boughtSilver: {
      type: Boolean,
      default: false,
    },
    orderedJewellery: {
      type: Boolean,
      default: false,
    },
    orderedBar: {
      type: Boolean,
      default: false,
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

export default mongoose.model("Customer", CustomerSchema);
