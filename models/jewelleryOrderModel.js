import mongoose from "mongoose";

const JewelleryOrderSchema = new mongoose.Schema(
  {
    invoice: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: "item name is required",
    },
    metalType: {
      type: String,
      required: "metalType is required",
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
    estimateAmount: {
      type: Number,
      required: "estimate Amount is required",
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
    goldWeight: {
      type: String,
      default: "",
    },
    remainingAmount: {
      type: String,
      required: "remaining amount is required",
    },
    orderDate: {
      type: String,
      required: "order date is required",
    },
    deadlineDate: {
      type: String,
      required: "dead line date is required",
    },
    deliveryLocation: {
      type: String,
      required: "delivery location is required",
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
    profilePicture: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Not Processed",
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("JewelleryOrder", JewelleryOrderSchema);
