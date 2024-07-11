import asyncHandler from "express-async-handler";
import Cancel from "../models/cancellModel.js";

export const getAllCancelOrder = asyncHandler( async(req, res) => {
    const cancelledOrders = await Cancel.find({})
    .sort({ createdAt: -1 })
    .lean();

  if (cancelledOrders) {
    res.json(cancelledOrders);
  } else {
    return res.status(400).json({ message: "No cancelledOrders found" });
  }
}) 