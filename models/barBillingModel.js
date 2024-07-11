import mongoose from "mongoose";

const BarBillingSchema = new mongoose.Schema(
  {
    invoice: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    tola: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 0,
    },
    goldSilverRate: {
      type: Number,
      default: 0,
    },
    makingCharge: {
      type: Number,
      default: 0,
    },
    itemType: {
      type: String,
      default: "",
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
    currency: {
      type: String,
      default: "",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    status: {
      type: String,
      default: "Billing Completed.",
    },
    vatApplied: {
      type: Boolean,
      default: false,
    },
    vatAmount: {
      type: Number,
      default: 0,
    },
    karat: {
      type: String,
      default: "18",
    },
    barOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BarOrder",
    },
    paymentType: {
      type: String,
      default: "Cash"
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

export default mongoose.model("BarBilling", BarBillingSchema);
