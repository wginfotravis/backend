import mongoose from "mongoose";

const JewelleryInventoryBilling = new mongoose.Schema(
  {
    invoice: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    karat: {
      type: String,
      default: "18",
    },
    weight: {
      type: Number,
      default: 0,
    },
    jewelleryOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JewelleryInventory",
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
    stonePrice: {
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

export default mongoose.model(
  "JewelleryInventoryBilling",
  JewelleryInventoryBilling
);
