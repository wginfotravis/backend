import mongoose from "mongoose";

const DispatchSchema = new mongoose.Schema(
  {
    invoice: {
      type: String,
      required: true,
    },
    dispatchedTo: {
      type: String,
      default: "Cargo",
    },
    name: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dispatchDate: {
      type: String,
    },
    arrivalDate: {
      type: String,
    },
    remarks: {
      type: String,
    },
    itemTrackId: {
      type: String,
      default: "",
    },
    billingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Billing",
    },
    origin: {
      type: String,
      required: true,
      //can be from jewellery or bar/coin
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JewelleryOrder",
      //will make bar order id in future for bar dispatch
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

export default mongoose.model("Dispatch", DispatchSchema);
