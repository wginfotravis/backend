import mongoose from "mongoose";

const SilverInventoryBilling = new mongoose.Schema(
  {
    invoice: {
      type: String,
      required: true,
    },
    itemCode: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      default: 0,
    },
    silverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Silver",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    customerName: {
      type: String,
      default: "",
    },
    rate: {
      type: Number,
      required: true,
    },
    jartiWaste: {
      type: Number,
      default: 0,
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
    makingCharge: {
      type: Number,
      default: 0,
    },
    paymentType: {
      type: String,
      default: "Cash",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SilverInventoryBilling", SilverInventoryBilling);
