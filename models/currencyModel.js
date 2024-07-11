import mongoose from "mongoose";

const CurrencySchema = new mongoose.Schema(
  {
    dollar: {
      type: Number,
      required: true,
    },
    rupees: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Currency", CurrencySchema);
