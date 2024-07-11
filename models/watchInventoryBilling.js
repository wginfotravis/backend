import mongoose from "mongoose";

const WatchInventoryBilling = new mongoose.Schema(
  {
    invoice: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    watchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Watch",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    customerName: {
      type: String,
      default: "",
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    vatApplied: {
      type: Boolean,
      default: false,
    },
    vatAmount: {
      type: Number,
      default: 0,
    },
    currencyType: {
      type: String,
      default: "UK Pound",
    },
    discount: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    modelNo: {
      type: String,
      default: "",
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

export default mongoose.model("WatchInventoryBilling", WatchInventoryBilling);
