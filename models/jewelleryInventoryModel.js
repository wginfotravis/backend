import mongoose from "mongoose";

const JewelleryInventorySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: "code is required",
    },
    name: {
      type: String,
      required: "Name is required",
    },
    weight: {
      type: Number,
      default: 0,
    },
    karat: {
      type: String,
      default: "18",
    },
    jartiWaste: {
      type: Number,
      default: 0,
    },
    jartiWeight: {
      type: Number,
      default: 0,
    },
    currencyType: {
      type: String,
      default: "Nepalese Rupee",
      required: "currency is required",
    },
    rate: {
      type: Number,
      required: "rate is required",
    },
    purchasePrice: {
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
    manufacturer: {
      type: String,
      default: "",
    },
    makingCharge: {
      type: Number,
      default: 0,
    },
    remarks: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
    },
    createdBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
      },
    },
    editedBy: {
      userId: {
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

export default mongoose.model("JewelleryInventory", JewelleryInventorySchema);
