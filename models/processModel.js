import mongoose from "mongoose";

const ProcessSchema = new mongoose.Schema(
  {
    invoice: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    stoneShop: {
      type: String,
      default: "",
    },
    tola: {
      type: Number,
      required: "tola is required",
    },
    weight: {
      type: Number,
      required: "weight is required",
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
      required: "rate is required",
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
    poundToNpr: {
      type: Number,
      default: 0,
    },
    poundEstimate: {
      type: Number,
      default: 0,
    },
    estimateAmount: {
      type: Number,
      default: 0,
    },
    paymentType: {
      type: String,
      required: "payment Type is required",
    },
    paidAmount: {
      type: String,
      default: 0,
    },
    checkDetails: {
      type: String,
      default: "",
    },
    remainingAmount: {
      type: String,
      required: "remaining amount is required",
    },
    deadlineDate: {
      type: String,
      required: "dead line date is required",
    },
    priority: {
      type: String,
      required: "priority is required",
    },
    remarks: {
      type: String,
      default: "",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerName: {
      type: String,
    },
    status: {
      type: String,
      default: "Start Process",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JewelleryOrder",
    },
    factoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Factory",
    },
    factoryName: {
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

export default mongoose.model("Process", ProcessSchema);
