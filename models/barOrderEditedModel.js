import mongoose from "mongoose";

const BarOrderEditedSchema = new mongoose.Schema({
  barId: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  metalType: {
    type: String,
    required: true,
  },
  itemType: {
    type: String,
    required: true,
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
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "Pound",
  },
  goldSilverRate: {
    type: Number,
    default: 0,
  },
  makingCharge: {
    type: Number,
    default: 0,
  },
  itemQuantity: {
    type: Number,
    default: 0,
  },
  itemUnitPrice: {
    type: Number,
    default: 0,
  },
  estimateAmount: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
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
    required: true,
  },
  orderDate: {
    type: String,
    required: true,
  },
  deadlineDate: {
    type: String,
    required: true,
  },
  deliveryLocation: {
    type: String,
    default: "",
  },
  priority: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    default: "",
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
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedDate: {
    type: Date
  }
});

export default mongoose.model("BarOrderEdited", BarOrderEditedSchema);
