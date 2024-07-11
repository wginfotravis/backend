import mongoose from "mongoose";

const LogoSchema = new mongoose.Schema(
  {
    logo: {
      type: "string",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Logo", LogoSchema);
