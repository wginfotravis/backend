import asyncHandler from "express-async-handler";
import BarBilling from "../models/barBillingModel.js";
import BarOrder from "../models/barOderModel.js";
import Billing from "../models/billingModel.js";
import Customer from "../models/customerModel.js";
import Dispatch from "../models/dispatchModel.js";
import Factory from "../models/factoryModel.js";
import JewelleryInventoryBilling from "../models/jewelleryInventoryBilling.js";
import JewelleryInventory from "../models/jewelleryInventoryModel.js";
import JewelleryOrder from "../models/jewelleryOrderModel.js";
import Process from "../models/processModel.js";
import SilverInventoryBilling from "../models/silverInventoryBilling.js";
import Silver from "../models/silverModel.js";
import Trash from "../models/trashModel.js";
import User from "../models/userModel.js";
import WatchInventoryBilling from "../models/watchInventoryBilling.js";
import Watch from "../models/watchModel.js";

export const getAllTrash = asyncHandler(async (req, res) => {
  const trash = await Trash.find({});
  if (trash) {
    res.json(trash);
  } else {
    res.status(404).json({ message: "not found" });
  }
});

export const recoverSingle = asyncHandler(async (req, res) => {
  try {
    const data = await Trash.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Item not found in trash" });
    }

    const modelToRecover = getModelToRecover(data.heading);

    if (!modelToRecover) {
      return res.status(400).json({ message: "Invalid heading" });
    }

    const item = await modelToRecover.findById(data.headingId);

    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found in original model" });
    }

    item.isDeleted = false;
    delete item.deletedDate;

    await item.save();

    if (data.heading === "Bar Order") {
      const billing = await BarBilling.findOne({ barOrderId: item._id });

      billing.isDeleted = false;
      delete billing.deletedDate;
      await billing.save();
    }

    if (data.heading === "Jewellery Order") {
      const process = await Process.findOne({ orderId: item._id });

      if (process) {
        process.isDeleted = false;
        delete process.deletedDate;
        await process.save();
      }

      const orderBill = await Billing.findOne({ orderId: item._id });
      orderBill.isDeleted = false;
      delete orderBill.deletedDate;
      await orderBill.save();
    }

    await data.deleteOne();

    res.json({ message: "Recovered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to recover item" });
  }
});

function getModelToRecover(heading) {
  switch (heading) {
    case "User":
      return User;
    case "Factory":
      return Factory;
    case "Customer":
      return Customer;
    case "Jewellery Inventory":
      return JewelleryInventory;
    case "Watch":
      return Watch;
    case "Silver":
      return Silver;
    case "Bar Order":
      return BarOrder;
    case "Jewellery Order":
      return JewelleryOrder;
    case "JewelleryInventory Billing":
      return JewelleryInventoryBilling;
    case "WatchInventory Billing":
      return WatchInventoryBilling;
    case "SilverInventory Billing":
      return SilverInventoryBilling;
    case "Dispatch":
      return Dispatch;
    default:
      return null;
  }
}

const recoverItem = async (data) => {
  const modelToRecover = getModelToRecover(data.heading);

  if (!modelToRecover) {
    throw new Error("Invalid heading");
  }

  const item = await modelToRecover.findById(data.headingId);

  if (!item) {
    throw new Error(`Item not found in original model: ${data.headingId}`);
  }

  item.isDeleted = false;
  delete item.deletedDate;

  await item.save();

  if (data.heading === "Bar Order") {
    const billing = await BarBilling.findOne({ barOrderId: item._id });
    billing.isDeleted = false;
    delete billing.deletedDate;
    await billing.save();
  }

  if (data.heading === "Jewellery Order") {
    const process = await Process.findOne({ orderId: item._id });

    if (process) {
      process.isDeleted = false;
      delete process.deletedDate;
      await process.save();
    }

    const orderBill = await Billing.findOne({ orderId: item._id });
    orderBill.isDeleted = false;
    delete orderBill.deletedDate;
    await orderBill.save();
  }

  await data.deleteOne();

  return data.headingId;
};

export const recoverMultiple = asyncHandler(async (req, res) => {
  try {
    const ids = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const recoveredItems = []; // Store recovered item IDs for response

    for (const { id, name } of ids) {
      const data = await Trash.findById(id);

      if (!data) {
        continue;
      }

      const recoveredItemId = await recoverItem(data);
      recoveredItems.push(recoveredItemId);
    }

    res.json({ message: "Items recovered successfully", recoveredItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to recover items" });
  }
});

const deleteItem = async (data) => {
  const modelToDelete = getModelToRecover(data.heading);

  if (!modelToDelete) {
    throw new Error("Invalid heading");
  }

  const item = await modelToDelete.findById(data.headingId);

  if (!item) {
    throw new Error(`Item not found in original model: ${data.headingId}`);
  }

  await item.deleteOne();

  if (data.heading === "Bar Order") {
    const billing = await BarBilling.findOne({ barOrderId: item.headingId });

    if (billing) {
      await billing.deleteOne();
    }
  }

  if (data.heading === "Jewellery Order") {
    const process = await Process.findOne({ orderId: item.headingId });

    if (process) {
      await process.deleteOne();
    }

    const orderBill = await Billing.findOne({ orderId: item.headingId });
    if (orderBill) {
      await orderBill.deleteOne();
    }
  }
};

export const deleteAfterThirtyDays = asyncHandler(async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const trash = await Trash.find({ deletedAt: { $lt: thirtyDaysAgo } });

    for (const item of trash) {
      try {
        await deleteItem(item);
        await item.deleteOne();
      } catch (error) {
        console.error(
          `Error deleting item for ${item.heading} with ID ${item.headingId}`,
          error
        );
      }
    }

    res.json({ message: "Successfully deleted old data" });
  } catch (error) {
    console.error("Error fetching or deleting trash data", error);
    res.status(500).json({ message: "Error deleting old data" });
  }
});
