import asyncHandler from "express-async-handler";
import xlsx from "xlsx";
import { generateInvoice } from "../helpers/generateInvoice.js";
import sendEmail from "../helpers/sendEmail.js";
import Billing from "../models/billingModel.js";
import Cancel from "../models/cancellModel.js";
import Customer from "../models/customerModel.js";
import Email from "../models/emailModel.js";
import Invoice from "../models/invoiceModel.js";
import JewelleryOrderEdited from "../models/jewelleryOrderEditedModel.js";
import JewelleryOrder from "../models/jewelleryOrderModel.js";
import Process from "../models/processModel.js";
import Trash from "../models/trashModel.js";
import User from "../models/userModel.js";

export const createJewelleryOrder = asyncHandler(async (req, res) => {
  const { customer, orders } = req.body;
  let customerId;
  let customerName;
  let customerEmail;
  let userEmail = "";

  if (customer.hasOwnProperty("_id")) {
    customerId = customer._id;
    customerName = customer.fullName;

    //getting customer email if customer exists
    const existingCustomer = await Customer.findById(customerId);
    if (existingCustomer) {
      customerEmail = existingCustomer?.email || "";
    }
  } else {
    const { fullName, address, email, phone, profilePicture } = customer;

    customerEmail = email || "";

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

    const created = await Customer.create({
      fullName,
      email,
      address,
      phone,
      profilePicture,
      membershipNo,
    });

    if (created) {
      customerId = created._id;
      customerName = created.fullName;
    } else {
      res.status(401);
      throw new Error("Cannot create Customer");
    }
  }

  const lastInvoice = await Invoice.findOne(
    {},
    {},
    { sort: { invoiceNumber: -1 } }
  );

  const lastInvoiceNumber = lastInvoice ? lastInvoice.invoiceNumber : 0;
  const newInvoiceNumber = lastInvoiceNumber + 1;
  const invoiceNo = generateInvoice("AJ", newInvoiceNumber);

  // const trackId = createTrackId(12);

  for (const element of orders.order) {
    element.customerId = customerId;
    element.customerName = customerName;
    element.invoice = invoiceNo;

    const user = await User.findById(element?.assignedTo?._id);
    if (user) {
      userEmail = user.email;
    }
  }
  //----------------------------------------------------------------
  const created = await JewelleryOrder.create(orders.order);
  // const created = true;
  if (created) {
    await Invoice.create({ invoiceNumber: newInvoiceNumber });

    const adminEmailsList = await Email.find({});
    let adminEmails = [];
    adminEmailsList.forEach((element) => {
      adminEmails.push(element.email);
    });
    res.status(201).json({
      message: "successfully created",
    });
    // sending email to admin
    const emailWeight = orders?.order[0]?.weight ?? 0;
    const emailPaymentType = orders?.order[0]?.paymentType ?? "cash";
    const adminEmailBody = `New order created for customer ${customerName}.\n\nWith Invoice no. ${invoiceNo}, weight: ${emailWeight} and paymentType: ${emailPaymentType}`;
    const adminEmailSubject = "New Jewellery Order";

    try {
      await sendEmail(adminEmails, adminEmailSubject, adminEmailBody);
    } catch (error) {
      console.error("Failed to send admin email:", error);
    }

    // sending  email to customer
    if (customerEmail) {
      const customerEmailBody = `Hi ${customerName},\n\nYou have successfully created a new Jewellery Order.\n\nYour order number is ${invoiceNo}.\n\nThank you for your order.\n\nRemarks: ${orders.order[0]?.remarks}.`;
      const customerEmailSubject = "New Jewellery Order";

      try {
        await sendEmail(customerEmail, customerEmailSubject, customerEmailBody);
      } catch (error) {
        console.error("Failed to send customer email:", error);
      }
    }

    //sending email to user for task completion
    const userEmailBody = `New order created for customer ${customerName}.\n\nWith Invoice no. ${invoiceNo}`;
    const customerEmailSubject = "New Jewellery Order Task";

    try {
      await sendEmail(userEmail, customerEmailSubject, userEmailBody);
    } catch (error) {
      console.error("Failed to send user email:", error);
    }

    return;
  } else {
    res.status(401);
    throw new Error("Cannot create order");
  }
});

export const getAllJewelleryOrders = asyncHandler(async (req, res) => {
  const jewelleryOrders = await JewelleryOrder.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .lean();
  if (jewelleryOrders) {
    const customerIds = jewelleryOrders.map((order) => order.customerId);
    const customers = await Customer.find({
      _id: { $in: customerIds },
    }).select("_id fullName");

    const customerNamesMap = new Map(
      customers.map(({ _id, fullName }) => [_id, fullName])
    );

    const updatedJewelleryOrders = jewelleryOrders.map((order) => ({
      ...order,
      customerName:
        customerNamesMap.get(order.customerId) || order.customerName,
    }));

    res.json(updatedJewelleryOrders);
  } else {
    return res.status(400).json({ message: "No JewelleryOrder found" });
  }
});

export const getJewelleryOrderById = asyncHandler(async (req, res) => {
  const jewelleryOrder = await JewelleryOrder.findById(req.params.id);
  if (jewelleryOrder) {
    res.json(jewelleryOrder);
  } else {
    res.status(404);
    throw new Error("jewelleryOrder not found");
  }
});

export const getJewelleryOrderEditedById = asyncHandler(async (req, res) => {
  const jewelleryOrder = await JewelleryOrderEdited.findOne({
    jewelleryId: req.params.id,
  });
  if (jewelleryOrder) {
    res.json(jewelleryOrder);
  } else {
    res.json({});
  }
});

export const cancelJewelleryOrder = asyncHandler(async (req, res) => {
  const jewelleryOrder = await JewelleryOrder.findById(req.params.id);

  if (jewelleryOrder) {
    jewelleryOrder.status = "Cancelled";
    jewelleryOrder.save();

    await Cancel.create({
      itemId: jewelleryOrder._id,
      invoice: jewelleryOrder.invoice,
      name: jewelleryOrder.name,
      cancelType: "Jewellery Order",
      amount: jewelleryOrder.estimateAmount,
      cancelledBy: req.body.fullName,
    });

    const orderInProcess = await Process.findOne({ orderId: req.params.id });
    if (orderInProcess) {
      orderInProcess.status = "Cancelled";
      await orderInProcess.save();
    }

    const billing = await Billing.findOne({ orderId: req.params.id });
    if (billing) {
      await billing.deleteOne();
    }

    res.json({ message: "order cancelled" });
  } else {
    res.status(404);
    throw new Error("jewelleryOrder not found");
  }
});

export const updateJewelleryOrder = asyncHandler(async (req, res) => {
  const jewelleryOrder = await JewelleryOrder.findById(req.params.id);

  const editedExists = await JewelleryOrderEdited.findOne({
    jewelleryId: jewelleryOrder._id,
  });
  if (editedExists) {
    editedExists.name = jewelleryOrder.name;
    editedExists.metalType = jewelleryOrder.metalType;
    editedExists.karat = jewelleryOrder.karat;
    editedExists.lengthInCm = jewelleryOrder.lengthInCm;
    editedExists.width = jewelleryOrder.width;
    editedExists.stoneType = jewelleryOrder.stoneType;
    editedExists.tola = jewelleryOrder.tola;
    editedExists.weight = jewelleryOrder.weight;
    editedExists.stonePrice = jewelleryOrder.stonePrice;
    editedExists.currency = jewelleryOrder.currency;
    editedExists.goldSilverRate = jewelleryOrder.goldSilverRate;
    editedExists.makingCharge = jewelleryOrder.makingCharge;
    editedExists.estimateAmount = jewelleryOrder.estimateAmount;
    editedExists.paymentType = jewelleryOrder.paymentType;
    editedExists.paidAmount = jewelleryOrder.paidAmount;
    editedExists.checkDetails = jewelleryOrder.checkDetails;
    editedExists.remainingAmount = jewelleryOrder.remainingAmount;
    editedExists.orderDate = jewelleryOrder.orderDate;
    editedExists.deadlineDate = jewelleryOrder.deadlineDate;
    editedExists.deliveryLocation = jewelleryOrder.deliveryLocation;
    editedExists.remarks = jewelleryOrder.remarks;
    editedExists.assignedTo = jewelleryOrder.assignedTo;
    editedExists.priority = jewelleryOrder.priority;
    editedExists.wastage = jewelleryOrder.wastage;
    editedExists.goldWeight = jewelleryOrder.goldWeight;

    await editedExists.save();
  } else {
    await JewelleryOrderEdited.create({
      jewelleryId: jewelleryOrder._id,
      name: jewelleryOrder.name,
      metalType: jewelleryOrder.metalType,
      karat: jewelleryOrder.karat,
      lengthInCm: jewelleryOrder.lengthInCm,
      width: jewelleryOrder.width,
      stoneType: jewelleryOrder.stoneType,
      tola: jewelleryOrder.tola,
      weight: jewelleryOrder.weight,
      stonePrice: jewelleryOrder.stonePrice,
      currency: jewelleryOrder.currency,
      goldSilverRate: jewelleryOrder.goldSilverRate,
      makingCharge: jewelleryOrder.makingCharge,
      estimateAmount: jewelleryOrder.estimateAmount,
      paymentType: jewelleryOrder.paymentType,
      paidAmount: jewelleryOrder.paidAmount,
      checkDetails: jewelleryOrder.checkDetails,
      remainingAmount: jewelleryOrder.remainingAmount,
      orderDate: jewelleryOrder.orderDate,
      deadlineDate: jewelleryOrder.deadlineDate,
      deliveryLocation: jewelleryOrder.deliveryLocation,
      remarks: jewelleryOrder.remarks,
      assignedTo: jewelleryOrder.assignedTo,
      priority: jewelleryOrder.priority,
      wastage: jewelleryOrder.wastage,
      goldWeight: jewelleryOrder.goldWeight,
    });
  }

  if (jewelleryOrder) {
    jewelleryOrder.name = req.body.name;
    jewelleryOrder.metalType = req.body.metalType;
    jewelleryOrder.karat = req.body.karat;
    jewelleryOrder.lengthInCm = req.body.lengthInCm;
    jewelleryOrder.width = req.body.width;
    jewelleryOrder.stoneType = req.body.stoneType;
    jewelleryOrder.tola = req.body.tola;
    jewelleryOrder.weight = req.body.weight;
    jewelleryOrder.stonePrice = req.body.stonePrice;
    jewelleryOrder.currency = req.body.currency;
    jewelleryOrder.goldSilverRate = req.body.goldSilverRate;
    jewelleryOrder.makingCharge = req.body.makingCharge;
    jewelleryOrder.estimateAmount = req.body.estimateAmount;
    jewelleryOrder.paymentType = req.body.paymentType;
    jewelleryOrder.paidAmount = req.body.paidAmount;
    jewelleryOrder.checkDetails = req.body.checkDetails;
    jewelleryOrder.remainingAmount = req.body.remainingAmount;
    jewelleryOrder.orderDate = req.body.orderDate;
    jewelleryOrder.deadlineDate = req.body.deadlineDate;
    jewelleryOrder.deliveryLocation = req.body.deliveryLocation;
    jewelleryOrder.remarks = req.body.remarks;
    jewelleryOrder.assignedTo = req.body.assignedTo;
    jewelleryOrder.priority = req.body.priority;
    jewelleryOrder.wastage = req.body.wastage;
    jewelleryOrder.profilePicture = req.body.profilePicture;
    jewelleryOrder.goldWeight = req.body.goldWeight;
    jewelleryOrder.updatedBy = req.body.updatedBy;

    await jewelleryOrder.save();

    res.json({
      message: "successfully updated",
    });
  } else {
    res.status(401);
    throw new Error("jewelleryOrder not found");
  }
});

export const deleteJewelleryOrder = async (req, res) => {
  const { id } = req.params;
  const userDetails = req.body;

  // Does the user exist to delete?
  const order = await JewelleryOrder.findById(id).exec();

  if (!order) {
    res.status(400);
    throw new Error("order not found");
  }

  const process = await Process.findOne({ orderId: id });

  if (process) {
    process.isDeleted = true;
    process.deletedDate = new Date();

    await process.save();
  }

  const billing = await Billing.findOne({ orderId: id });

  if (billing) {
    billing.isDeleted = true;
    billing.deletedDate = new Date();

    await billing.save();
  }

  order.isDeleted = true;
  order.deletedDate = new Date();
  const success = await order.save();
  if (success) {
    await Trash.create({
      user: userDetails.fullName,
      deletedAt: new Date(),
      heading: "Jewellery Order",
      headingId: id,
      name: order.name,
    });
  }

  if (order.status === "Cancelled") {
    const cancelledTrue = await Cancel.findOne({ itemId: id });
    if (cancelledTrue) {
      cancelledTrue.isDeleted = true;
      cancelledTrue.deletedDate = new Date();

      await cancelledTrue.save();
    }
  }

  const reply = `deleted`;

  res.json(reply);
};

export const getJewelleryOrderExcel = asyncHandler(async (req, res) => {
  const { from, to, status } = req.query;

  const jewelleryOrder = await JewelleryOrder.find({
    isDeleted: false,
    status: status,
    orderDate: { $gte: from, $lte: to },
  }).exec();

  if (jewelleryOrder.length > 0) {
    const transformedData = jewelleryOrder.map((item) => ({
      Invoice: item?.invoice,
      ItemName: item?.name,
      MetalType: item?.metalType,
      Jarat: item?.karat,
      tola: item?.tola,
      weight: item?.weight,
      stoneType: item?.stoneType,
      goldSilverRate: item?.goldSilverRate,
      makingCharge: item?.makingCharge,
      wastage: item?.wastage,
      stonePrice: item?.stonePrice,
      lengthInCm: item?.lengthInCm,
      width: item?.width,
      estimateAmount: item?.estimateAmount,
      paymentType: item?.paymentType,
      advancePayment: item?.paidAmount,
      orderDate: item?.orderDate?.slice(0, 10),
      deadlineDate: item?.deadlineDate?.slice(0, 10),
      deliveryLocation: item?.deliveryLocation,
      priority: item?.priority,
      remarks: item?.remarks,
      customerName: item?.customerName,
      status: item?.status,
      createdBy: item?.createdBy,
    }));

    const worksheet = xlsx.utils.json_to_sheet(transformedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "JewelleryOrder");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.status(200).send(excelBuffer);
  } else {
    throw new Error(`No data for report from ${from} to ${to}`);
  }
});
