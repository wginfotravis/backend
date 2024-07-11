import asyncHandler from "express-async-handler";
import BarBilling from "../models/barBillingModel.js";
import BarOrder from "../models/barOderModel.js";
import Billing from "../models/billingModel.js";
import Customer from "../models/customerModel.js";
import JewelleryInventoryBilling from "../models/jewelleryInventoryBilling.js";
import JewelleryInventory from "../models/jewelleryInventoryModel.js";
import JewelleryOrder from "../models/jewelleryOrderModel.js";
import SilverInventoryBilling from "../models/silverInventoryBilling.js";
import Silver from "../models/silverModel.js";
import WatchInventoryBilling from "../models/watchInventoryBilling.js";
import Watch from "../models/watchModel.js";

export const getDashBoardCount = asyncHandler(async (req, res) => {
  const jewelleryInventoryCount = await JewelleryInventory.countDocuments({ isDeleted: false });
  const silverCount = await Silver.countDocuments({ isDeleted: false });
  const watchCount = await Watch.countDocuments({ isDeleted: false });
  const customerCount = await Customer.countDocuments({ isDeleted: false });

  const totalCounts = {
    JewelleryInventory: jewelleryInventoryCount,
    Silver: silverCount,
    Watch: watchCount,
    Customer: customerCount,
  };

  res.status(200).json(totalCounts);
});

export const getTotalSales = asyncHandler(async (req, res) => {
  const billingTotal = await Billing.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: null, total: { $sum: "$grandTotal" } } },
  ]);
  const barBillingTotal = await BarBilling.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);
  const jewelleryInventoryBillingTotal =
    await JewelleryInventoryBilling.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
  const watchInventoryBillingTotal = await WatchInventoryBilling.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const silverInventoryBillingTotal = await SilverInventoryBilling.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const sales = {
    billingTotal,
    barBillingTotal,
    jewelleryInventoryBillingTotal,
    watchInventoryBillingTotal,
    silverInventoryBillingTotal,
  };

  res.status(200).json(sales);
});

export const getTasks = asyncHandler(async (req, res) => {
  const jewelleryOrderTask = await JewelleryOrder.countDocuments({isDeleted: false});
  const jewelleryOrderCompleted = await JewelleryOrder.countDocuments({
    status: "Transaction Completed",
    isDeleted: false
  });
  const barOrderTask = await BarOrder.countDocuments({isDeleted: false});
  const barOrderCompleted = await BarOrder.countDocuments({
    status: "Transaction Completed",
    isDeleted: false
  });

  const tasks = {
    jewelleryOrderTask,
    jewelleryOrderCompleted,
    barOrderTask,
    barOrderCompleted,
  };

  res.status(200).json(tasks);
});
