import asyncHandler from "express-async-handler";
import BarBilling from "../models/barBillingModel.js";
import BarOrder from "../models/barOderModel.js";
import Customer from "../models/customerModel.js";
import { createOrUpdateLoyalty } from "./loyaltyController.js";

export const createBarBilling = asyncHandler(async (req, res) => {
  const {
    invoice,
    name,
    tola,
    weight,
    goldSilverRate,
    makingCharge,
    itemType,
    itemQuantity,
    itemUnitPrice,
    estimateAmount,
    total,
    advanceGiven,
    discount,
    grandTotal,
    currency,
    customerId,
    status,
    vatApplied,
    vatAmount,
    karat,
    barOrderId,
    paymentType
  } = req.body;

  const created = await BarBilling.create({
    invoice,
    name,
    tola,
    weight,
    goldSilverRate,
    itemType,
    itemQuantity,
    itemUnitPrice,
    makingCharge,
    estimateAmount,
    total,
    advanceGiven,
    discount,
    grandTotal,
    currency,
    customerId,
    status,
    vatApplied,
    vatAmount,
    karat,
    barOrderId,
    paymentType
  });
  const barOrder = await BarOrder.findById(barOrderId);

  const customer = await Customer.findById(customerId);
  customer.orderedBar = true;
  customer.save();

  // console.log({ jewelleryOrder, process });

  if (created) {
    barOrder.status = "Transaction Completed";

    barOrder.save();

    res.status(201).json({
      _id: created._id,
      invoice,
      name,
      tola,
      weight,
      goldSilverRate,
      itemType,
      itemQuantity,
      itemUnitPrice,
      makingCharge,
      estimateAmount,
      total,
      advanceGiven,
      discount,
      grandTotal,
      currency,
      customerId,
      status,
      vatApplied,
      vatAmount,
      karat,
      barOrderId,
      paymentType
    });

    createOrUpdateLoyalty(customerId, "bar", total, itemQuantity);
    //sending email to administrator
    const adminEmailsList = await Email.find({});
    let adminEmails = [];
    adminEmailsList.forEach((element) => {
      adminEmails.push(element.email);
    });
    const adminEmailBody = `Bar order transaction completed for customer ${barOrder?.customerName}.\n\nWith Invoice no. ${barOrder?.invoice} and is ready for billing`;
    const adminEmailSubject = "Barorder transaction completed";

    await sendEmail(adminEmails, adminEmailSubject, adminEmailBody);
  } else {
    res.status(401);
    throw new Error("Cannot create");
  }
});

export const getAllBarBilling = asyncHandler(async (req, res) => {
  const customer = await Customer.find({ orderedBar: true , isDeleted: false});
  const billing = await BarBilling.find({isDeleted: false}).sort({ createdAt: -1 }).lean();
  const billingWithCustomerName = [];

  if (billing) {
    billing.map((bill) => {
      const currentCustomer = customer.find(
        (c) => c._id?.toString() == bill.customerId
      );
      let newObj;
      if (currentCustomer) {
        newObj = { ...bill, customerName: currentCustomer?.fullName };
        billingWithCustomerName.push(newObj);
      } else {
        newObj = { ...bill };
        billingWithCustomerName.push(newObj);
      }
    });
    res.json(billingWithCustomerName);
  } else {
    res.status(404);
    throw new Error("billing not found");
  }
});

export const getBarBillingById = asyncHandler(async (req, res) => {
  const inventory = await BarBilling.findById(req.params.id);
  if (inventory) {
    res.json(inventory);
  } else {
    return res.status(404).json({ message: "No Billing found" });
  }
});

export const getBarBillingByCustomerId = asyncHandler(async (req, res) => {
  const customerIdBilling = await BarBilling.find({
    customerId: req.params.customer,
    isDeleted: false
  })
    .sort({ createdAt: -1 })
    .lean();

  const customer = await Customer.findById(req.params.customer);
  if (customer && customerIdBilling) {
    let dataWithName = [];
    customerIdBilling.map((data) => {
      dataWithName.push({ ...data, customerName: customer?.fullName });
    });
    res.json(dataWithName);
  } else {
    res.status(404);
    throw new Error("no data found");
  }
});

export const updateBarBilling = asyncHandler(async (req, res) => {
  const inventory = await BarBilling.findById(req.params.id);

  if (inventory) {
    inventory.name = req.body.name;
    inventory.tola = req.body.tola;
    inventory.weight = req.body.weight;
    inventory.goldSilverRate = req.body.goldSilverRate;
    inventory.makingCharge = req.body.makingCharge;
    inventory.estimateAmount = req.body.estimateAmount;
    inventory.total = req.body.total;
    inventory.advanceGiven = req.body.advanceGiven;
    inventory.discount = req.body.discount;
    inventory.grandTotal = req.body.grandTotal;
    inventory.currency = req.body.currency;
    inventory.vatApplied = req.body.vatApplied;
    inventory.vatAmount = req.body.vatAmount;
    inventory.karat = req.body.karat;
    inventory.itemType = req.body.itemType;
    inventory.itemQuantity = req.body.itemQuantity;
    inventory.itemUnitPrice = req.body.itemUnitPrice;
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

export const deleteBarBilling = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const barbilling = await BarBilling.findById(id).exec();

  if (!barbilling) {
    res.status(400);
    throw new Error("barbilling not found");
  }

  barbilling.isDeleted = true;
  barbilling.deletedDate = new Date()

  await barbilling.save()

  const reply = `deleted`;

  res.json(reply);
});
