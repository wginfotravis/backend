import mongoose from "mongoose";

const JewelleryOrderEditedSchema = new mongoose.Schema({
  jewelleryId: {
    type: String,
  },
  name: {
    type: String,
  },
  metalType: {
    type: String,
  },
  lengthInCm: {
    type: Number,
    default: 0,
  },
  width: {
    type: Number,
    default: 0,
  },
  karat: {
    type: Number,
    default: "18",
  },
  tola: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  stoneType: {
    type: String,
    default: "",
  },
  currency: {
    type: String,
    default: "Pound",
  },
  goldSilverRate: {
    type: Number,
  },
  makingCharge: {
    type: Number,
    default: 0,
  },
  wastage: {
    type: Number,
    default: 0,
  },
  stonePrice: {
    type: Number,
    default: 0,
  },
  estimateAmount: {
    type: Number,
  },
  paymentType: {
    type: String,
  },
  paidAmount: {
    type: String,
    default: 0,
  },
  checkDetails: {
    type: String,
    default: "",
  },
  goldWeight: {
    type: String,
    default: "",
  },
  remainingAmount: {
    type: String,
  },
  orderDate: {
    type: String,
  },
  deadlineDate: {
    type: String,
  },
  deliveryLocation: {
    type: String,
  },
  priority: {
    type: String,
  },
  assignedTo: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
  },
  remarks: {
    type: String,
    default: "",
  },
});

export default mongoose.model(
  "JewelleryOrderEdited",
  JewelleryOrderEditedSchema
);
