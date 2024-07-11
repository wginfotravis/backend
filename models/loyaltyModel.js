import mongoose from "mongoose";

const LoyaltyModel = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      unique: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },
    purchasedJewellery: {
      type: Boolean,
      default: false,
    },
    purchasedBar: {
      type: Boolean,
      default: false,
    },
    purchasedWatch: {
      type: Boolean,
      default: false,
    },
    purchasedSilver: {
      type: Boolean,
      default: false,
    },
    purchasedJewelleryInventory: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      default: 0,
    },
    amountTracker: {
      type: Number,
      default: 0,
    },
    redeemCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("LoyaltyModel", LoyaltyModel);
