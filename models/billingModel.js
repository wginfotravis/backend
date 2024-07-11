import mongoose from "mongoose";

const BillingSchema = new mongoose.Schema(
  {
    invoice: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    tola: {
      type: Number,
      required: "tola is required",
    },
    weight: {
      type: Number,
      required: "weight is required",
    },
    wastage: {
      type: Number,
      required: 0,
    },
    goldSilverRate: {
      type: Number,
      required: "rate is required",
    },
    makingCharge: {
      type: Number,
      default: 0,
    },
    subTotal: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    advanceGiven: {
      type: String,
      default: 0,
    },
    discount: {
      type: String,
      default: 0,
    },
    grandTotal: {
      type: Number,
      default: 0,
    },
    stonePrice: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Make Dispatch?",
    },
    vatApplied: {
      type: Boolean,
      default: false,
    },
    karat: {
      type: String,
      default: "18",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JewelleryOrder",
    },
    processId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Process",
    },
    factoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Factory",
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

export default mongoose.model("Billing", BillingSchema);
