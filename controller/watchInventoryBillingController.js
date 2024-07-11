import asyncHandler from "express-async-handler";
import { generateInvoice } from "../helpers/generateInvoice.js";
import sendEmail from "../helpers/sendEmail.js";
import Customer from "../models/customerModel.js";
import Email from "../models/emailModel.js";
import Invoice from "../models/invoiceModel.js";
import Loyalty from "../models/loyaltyModel.js";
import Trash from "../models/trashModel.js";
import WatchInventoryBilling from "../models/watchInventoryBilling.js";
import Watch from "../models/watchModel.js";
import { createOrUpdateLoyalty } from "./loyaltyController.js";

export const createWatchBilling = asyncHandler(async (req, res) => {
  const { customer, cartDetails } = req.body;
  let customerId;
  let customerName;

  if (customer.hasOwnProperty("_id")) {
    customerId = customer._id;
    customerName = customer.fullName;

    const existingCustomer = await Customer.findById(customerId);
    existingCustomer.boughtWatch = true;
    existingCustomer.save();
  } else {
    const { fullName, address, email, phone, profilePicture } = customer;

    // creating user
    const lastCustomer = await Customer.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    );

    let membershipNo = "";

    if (lastCustomer && lastCustomer.membershipNo) {
      const lastMembershipNo = lastCustomer.membershipNo;
      const lastNumber = parseInt(lastMembershipNo.slice(-4), 10);
      const newNumber = lastNumber + 1;
      membershipNo = newNumber.toString().padStart(4, "0");
    } else {
      membershipNo = "0001";
    }

    const boughtWatch = true;
    const created = await Customer.create({
      fullName,
      email,
      address,
      phone,
      profilePicture,
      membershipNo,
      boughtWatch,
    });

    if (created) {
      customerId = created._id;
      customerName = created.fullName;
    } else {
      res.status(401);
      throw new Error("Cannot create Customer");
    }
  }

  // getting last incoice by invoice number
  const lastInvoice = await Invoice.findOne(
    {},
    {},
    { sort: { invoiceNumber: -1 } }
  );

  const lastInvoiceNumber = lastInvoice ? lastInvoice.invoiceNumber : 0;
  const newInvoiceNumber = lastInvoiceNumber + 1;
  const invoiceNo = generateInvoice("AJ", newInvoiceNumber);

  cartDetails.forEach((element) => {
    element.customerId = customerId;
    element.customerName = customerName;
    element.invoice = invoiceNo;
  });

  const loyalty = await Loyalty.findOne({ customerId });
  let loyaltyDiscount = 0;
  if (loyalty) {
    if (loyalty.points >= 100) {
      loyaltyDiscount = Number(cartDetails[0].totalPrice) * 0.2;
      const count = loyalty.redeemCount + 1;
      loyalty.points = 0;
      loyalty.amount = 0;
      loyalty.redeemCount = count;
      loyalty.save();
      const discountTracker = Number(cartDetails[0].discount) + loyaltyDiscount;
      const totalTracker = cartDetails[0].totalPrice - loyaltyDiscount;
      cartDetails[0].discount = discountTracker;
      cartDetails[0].totalPrice = totalTracker;
    }
  }

  const watchBilling = await WatchInventoryBilling.create(cartDetails);

  let quantityForLoyalty = 0;
  let total = 0;
  if (watchBilling) {
    for (const element of cartDetails) {
      const inventory = await Watch.findById(element.watchId);
      inventory.quantity = inventory.quantity - Number(element.quantity);
      await inventory.save();
      quantityForLoyalty += Number(element.quantity);
      total += Number(element.totalPrice);
    }
    await Invoice.create({ invoiceNumber: newInvoiceNumber });
    res.status(201).json(watchBilling);

    createOrUpdateLoyalty(
      cartDetails[0]?.customerId,
      "watch",
      total,
      quantityForLoyalty
    );
    //sending email to administrator
    const adminEmailsList = await Email.find({});
    let adminEmails = [];
    adminEmailsList.forEach((element) => {
      adminEmails.push(element.email);
    });
    const adminEmailBody = `Watch named ${cartDetails[0]?.name} sold from inventory to  ${customerName}.\n\nWith Invoice no. ${invoiceNo} and is ready for billing`;
    const adminEmailSubject = "Watch sold";

    await sendEmail(adminEmails, adminEmailSubject, adminEmailBody);
  } else {
    res.status(401);
    throw new Error("Cannot create order");
  }
});

export const getAllWatchInventoryBilling = asyncHandler(async (req, res) => {
  const inventory = await WatchInventoryBilling.find({isDeleted: false})
    .sort({ createdAt: -1 })
    .lean();

  if (inventory) {
    res.json(inventory);
  } else {
    return res.status(400).json({ message: "No inventory found" });
  }
});

export const getWatchInventoryBillingById = asyncHandler(async (req, res) => {
  const inventory = await WatchInventoryBilling.findById(req.params.id);
  if (inventory) {
    res.json(inventory);
  } else {
    return res.status(404).json({ message: "No Billing found" });
  }
});

export const getWatchInventoryBillingByCustomerId = asyncHandler(
  async (req, res) => {
    const inventory = await WatchInventoryBilling.find({
      customerId: req.params.id,
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .lean();
    if (inventory) {
      res.json(inventory);
    } else {
      res.status(404);
      throw new Error("inventory not found");
    }
  }
);

export const updateWatchInventoryBilling = asyncHandler(async (req, res) => {
  const inventory = await WatchInventoryBilling.findById(req.params.id);

  if (inventory) {
    inventory.name = req.body.name;
    inventory.sellingPrice = req.body.sellingPrice;
    inventory.totalPrice = req.body.totalPrice;
    inventory.vatApplied = req.body.vatApplied;
    inventory.discount = req.body.discount;
    inventory.quantity = req.body.quantity;
    inventory.paymentType = req.body.paymentType;

    await inventory.save();

    res.json({
      message: "successfully updated",
    });
  } else {
    res.status(401);
    throw new Error("inventory not found");
  }
});

export const deleteWatchInventoryBilling = async (req, res) => {
  const { id } = req.params;
  const userDetails = req.body

  const inventory = await WatchInventoryBilling.findById(id);

  if (!inventory) {
    res.status(400);
    throw new Error("WatchInventoryBilling not found");
  }

  inventory.isDeleted = true;
  inventory.deletedDate = new Date()

  const success = await inventory.save()

  if(success){
    await Trash.create({
      user: userDetails.fullName,
      deletedAt: new Date(),
      heading: "WatchInventory Billing",
      headingId: id,
      name: inventory.name
    })
  }

  const reply = `deleted`;

  res.json(reply);
};

export const  updatePaymentType = async () =>  {
  try {
    // Update all documents that don't have the paymentType field already set
    const result = await WatchInventoryBilling.updateMany(
      { paymentType: { $exists: false } },
      { $set: { paymentType: 'Cash' } }
    );

    // Log the number of documents updated
    console.log(`${result.nModified} documents updated successfully.`);
  } catch (error) {
    console.error('Error updating documents:', error);
  }
}