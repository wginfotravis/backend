import asyncHandler from "express-async-handler";
import sendEmail from "../helpers/sendEmail.js";
import Billing from "../models/billingModel.js";
import Customer from "../models/customerModel.js";
import Email from "../models/emailModel.js";
import JewelleryOrder from "../models/jewelleryOrderModel.js";
import Loyalty from "../models/loyaltyModel.js";
import Process from "../models/processModel.js";
import { createOrUpdateLoyalty } from "./loyaltyController.js";

export const createBilling = asyncHandler(async (req, res) => {
  const {
    invoice,
    processId,
    name,
    tola,
    weight,
    currency,
    goldSilverRate,
    makingCharge,
    wastage,
    subTotal,
    total,
    advanceGiven,
    discount,
    grandTotal,
    karat,
    customerId,
    orderId,
    factoryId,
    vatApplied,
    stonePrice,
  } = req.body;

  if (!tola || !weight || !goldSilverRate) {
    res.status(400);
    throw new Error("Fill required fields");
  }

  const loyalty = await Loyalty.findOne({ customerId });
  let makingChargeDiscount = 0;

  if (loyalty) {
    if (loyalty.points >= 100 && makingCharge > 0) {
      makingChargeDiscount = Number(makingCharge) * 0.2;
      const count = loyalty.redeemCount + 1;
      loyalty.points = 0;
      loyalty.amount = 0;
      loyalty.redeemCount = count;
      loyalty.save();
    }
  }

  const created = await Billing.create({
    invoice,
    processId,
    name,
    tola,
    weight,
    currency,
    goldSilverRate,
    makingCharge,
    wastage,
    subTotal,
    total,
    advanceGiven,
    discount: Number(discount) + makingChargeDiscount,
    grandTotal: grandTotal - makingChargeDiscount,
    karat,
    customerId,
    orderId,
    factoryId,
    vatApplied,
    stonePrice,
  });
  const jewelleryOrder = await JewelleryOrder.findById(orderId);
  const process = await Process.findById(processId);
  const customer = await Customer.findById(customerId);
  customer.orderedJewellery = true;
  customer.save();

  // console.log({ jewelleryOrder, process });

  if (created) {
    jewelleryOrder.status = "Transaction Completed";
    process.status = "Transaction Completed";

    jewelleryOrder.save();
    process.save();
    // console.log("created", created);

    res.status(201).json({
      _id: created._id,
      processId,
      name,
      tola,
      weight,
      currency,
      goldSilverRate,
      makingCharge,
      wastage,
      subTotal,
      total,
      advanceGiven,
      discount,
      grandTotal,
      karat,
      customerId,
      orderId,
      factoryId,
      vatApplied,
      stonePrice,
    });

    createOrUpdateLoyalty(customerId, "jewellery", grandTotal);
    //sending email to administrator
    const adminEmailsList = await Email.find({});
    let adminEmails = [];
    adminEmailsList.forEach((element) => {
      adminEmails.push(element.email);
    });
    const adminEmailBody = `Jewellery order transaction completed for customer ${process?.customerName}.\n\nWith Invoice no. ${process?.invoice} and is ready for billing`;
    const adminEmailSubject = "Jewellery order transaction completed";

    await sendEmail(adminEmails, adminEmailSubject, adminEmailBody);
  } else {
    res.status(401);
    throw new Error("Cannot create");
  }
});

export const getAllBilling = asyncHandler(async (req, res) => {
  const customer = await Customer.find({ orderedJewellery: true, isDeleted: false });
  const billing = await Billing.find({isDeleted: false}).sort({ createdAt: -1 }).lean();
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

export const getAllBillingByCustomer = asyncHandler(async (req, res) => {
  const customerIdBilling = await Billing.find({
    isDeleted: false,
    customerId: req.params.customer,
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

export const getBillingById = asyncHandler(async (req, res) => {
  const billing = await Billing.findById(req.params.id);
  if (billing) {
    res.json(billing);
  } else {
    res.status(404);
    throw new Error("billing not found");
  }
});

export const updateBilling = asyncHandler(async (req, res) => {
  const billing = await Billing.findById(req.params.id);

  if (billing) {
    billing.tola = req.body.tola || billing.tola;
    billing.weight = req.body.weight || billing.weight;
    billing.wastage = req.body.wastage || billing.wastage;
    billing.goldSilverRate = req.body.goldSilverRate || billing.goldSilverRate;
    billing.makingCharge = req.body.makingCharge || billing.makingCharge;
    billing.subTotal = req.body.subTotal || billing.subTotal;
    billing.total = req.body.total || billing.total;
    billing.advanceGiven = req.body.advanceGiven || billing.advanceGiven;
    billing.discount = req.body.discount || billing.discount;
    billing.grandTotal = req.body.grandTotal || billing.grandTotal;
    billing.vatApplied = req.body.vatApplied || billing.vatApplied;
    billing.stonePrice = req.body.stonePrice || billing.stonePrice;
    billing.karat = req.body.karat || billing.karat;

    const updateBilling = await billing.save();

    res.json({
      updateBilling,
    });
  } else {
    res.status(401);
    throw new Error("Bill not found");
  }
});

export const deleteBilling = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const billing = await Billing.findById(id).exec();

  if (!billing) {
    res.status(400);
    throw new Error("billing not found");
  }

  const result = await billing.deleteOne();

  const reply = `deleted`;

  res.json(reply);
});
