import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import BarBilling from "../models/barBillingModel.js";
import Billing from "../models/billingModel.js";
import JewelleryInventoryBilling from "../models/jewelleryInventoryBilling.js";
import Loyalty from "../models/loyaltyModel.js";
import SilverInventoryBilling from "../models/silverInventoryBilling.js";
import WatchInventoryBilling from "../models/watchInventoryBilling.js";

export const createOrUpdateLoyalty = expressAsyncHandler(
  async (customerId, type, amount, quantity = 1) => {
    if (customerId) {
      const loyalty = await Loyalty.findOne({ customerId });

      if (loyalty) {
        const count = loyalty.purchaseCount;
        const totalAmount = Number(loyalty.amount) + Number(amount);
        loyalty.purchaseCount = Number(count) + Number(quantity);

        loyalty.amount = totalAmount;
        //to track amount after redeem
        loyalty.amountTracker = totalAmount;

        if (totalAmount >= 500 && totalAmount <= 1000) {
          loyalty.points = 10;
        }
        if (totalAmount >= 1000 && totalAmount <= 3000) {
          // adding prev 10 and 20
          loyalty.points = 30;
        }
        if (totalAmount >= 3000 && totalAmount <= 6000) {
          // adding prev 30 and 30
          loyalty.points = 60;
        }
        if (totalAmount >= 6000) {
          // adding prev 60 and 40
          loyalty.points = 100;
        }

        if (type === "jewellery") {
          loyalty.purchasedJewellery = true;
        }
        if (type === "bar") {
          loyalty.purchasedBar = true;
        }
        if (type === "watch") {
          loyalty.purchasedWatch = true;
        }
        if (type === "silver") {
          loyalty.purchasedSilver = true;
        }
        if (type === "jewelleryinventory") {
          loyalty.purchasedJewelleryInventory = true;
        }

        await loyalty.save();
      } else {
        let points = 0;
        if (amount >= 500 && amount <= 1000) {
          points = 10;
        }
        if (amount >= 1000 && amount <= 3000) {
          // adding prev 10 and 20
          points = 30;
        }
        if (amount >= 3000 && amount <= 6000) {
          // adding prev 30 and 30
          points = 60;
        }
        if (amount >= 6000) {
          // adding prev 60 and 40
          points = 100;
        }

        const loyaltyObject = {
          customerId,
          purchaseCount: 1,
          amount,
          points,
          amountTracker: amount,
          purchasedJewellery: type === "jewellery" ? true : false,
          purchasedBar: type === "bar" ? true : false,
          purchasedWatch: type === "watch" ? true : false,
          purchasedSilver: type === "silver" ? true : false,
          purchasedJewelleryInventory:
            type === "jewelleryinventory" ? true : false,
          amount,
        };

        await Loyalty.create(loyaltyObject);
      }
    }
  }
);

export const customerLoyaltyPoint = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const loyalty = await Loyalty.findOne({ customerId: id });
  if (loyalty) {
    res.status(200).json(loyalty);
  } else {
    res.status(404).json({ message: "No purchase made" });
  }
});

export const customerLoyaltyDetails = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;

  const exists = await Loyalty.findOne({ customerId: id });

  if (exists) {
    let customerBill = [];

    if (exists.purchasedJewellery) {
      const jewelleryBill = await Billing.find({
        customerId: id,
      })
        .sort({ createdAt: -1 })
        .lean();

      if (jewelleryBill.length > 0) {
        const newBill = [];
        jewelleryBill.forEach((bill) => {
          // setting up type and total to show in customer hisoty as total is different
          // in different selling type
          bill.type = "Jewellery";
          bill.totalPrice = bill.grandTotal;
          newBill.push(bill);
        });
        customerBill.push(...newBill);
      }
    }

    if (exists.purchasedBar) {
      const barBill = await BarBilling.find({
        customerId: id,
      })
        .sort({ createdAt: -1 })
        .lean();

      if (barBill.length > 0) {
        const newBill = [];
        barBill.forEach((bill) => {
          // setting up type and total to show in customer hisoty as total is different
          // in different selling type
          bill.type = "Bar";
          bill.totalPrice = bill.total;
          newBill.push(bill);
        });
        customerBill.push(...newBill);
      }
    }

    if (exists.purchasedWatch) {
      const watchBill = await WatchInventoryBilling.find({
        customerId: id,
      })
        .sort({ createdAt: -1 })
        .lean();

      if (watchBill.length > 0) {
        const newBill = [];
        watchBill.forEach((bill) => {
          bill.type = "Watch";
          newBill.push(bill);
        });
        customerBill.push(...newBill);
      }
    }

    if (exists.purchasedSilver) {
      const silverBill = await SilverInventoryBilling.find({
        customerId: id,
      })
        .sort({ createdAt: -1 })
        .lean();

      if (silverBill.length > 0) {
        const newBill = [];
        silverBill.forEach((bill) => {
          bill.type = "Silver";
          newBill.push(bill);
        });
        customerBill.push(...newBill);
      }
    }

    if (exists.purchasedJewelleryInventory) {
      const jewelleryInventoryBill = await JewelleryInventoryBilling.find({
        customerId: id,
      })
        .sort({ createdAt: -1 })
        .lean();

      if (jewelleryInventoryBill.length > 0) {
        const newBill = [];
        jewelleryInventoryBill.forEach((bill) => {
          bill.type = "Jewellery Inventory";
          newBill.push(bill);
        });
        customerBill.push(...newBill);
      }
    }

    return res.status(200).json(customerBill);
  } else {
    return res.status(404).json({ message: "No Billing found" });
  }
});


