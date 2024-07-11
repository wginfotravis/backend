import asyncHandler from "express-async-handler";
import xlsx from "xlsx";
import { generateInvoice } from "../helpers/generateInvoice.js";
import sendEmail from "../helpers/sendEmail.js";
import BarBilling from "../models/barBillingModel.js";
import BarOrder from "../models/barOderModel.js";
import BarOrderEdited from "../models/barOrderEditedModel.js";
import Cancel from "../models/cancellModel.js";
import Customer from "../models/customerModel.js";
import Email from "../models/emailModel.js";
import Invoice from "../models/invoiceModel.js";
import Trash from "../models/trashModel.js";
import User from "../models/userModel.js";


export const createBarOrder = asyncHandler(async (req, res) => {
  const { customer, orders } = req.body;
  let customerId;
  let customerName;
  let customerEmail;
  let userEmail = [];

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

  // orders.order.forEach((element) => {
  //   element.customerId = customerId;
  //   element.customerName = customerName;
  //   element.invoice = invoiceNo;
  // });

  for (const element of orders.order) {
    element.customerId = customerId;
    element.customerName = customerName;
    element.invoice = invoiceNo;

    const user = await User.findById(element?.assignedTo?._id);
    if (user) {
      userEmail.push(user.email);
    }
  }

  const created = await BarOrder.create(orders.order);

  if (created) {
    await Invoice.create({ invoiceNumber: newInvoiceNumber });
    res.status(201);
    res.json({
      message: "successfully created",
    });

    const adminEmailsList = await Email.find({});
    let adminEmails = [];
    adminEmailsList.forEach((element) => {
      adminEmails.push(element.email);
    });

    // sending email to admin

    const adminEmailBody = `New order created for customer ${customerName}.\n\nWith Invoice no. ${invoiceNo}`;
    const adminEmailSubject = "New Bar Order";

    await sendEmail(adminEmails, adminEmailSubject, adminEmailBody);

    // sending  email to customer
    if (customerEmail) {
      const customerEmailList = [];
      customerEmailList.push(customerEmail);
      const customerEmailBody = `Hi ${customerName},\n\nYou have successfully created a new Bar Order.\n\nYour order number is ${invoiceNo}.\n\nThank you for your order.\n\nRemarks" ${orders.order[0]?.remarks}`;
      const customerEmailSubject = "New Bar Order";

      await sendEmail(
        customerEmailList,
        customerEmailSubject,
        customerEmailBody
      );
    }

    //sending email to user for task completion
    const userEmailBody = `New order created for customer ${customerName}.\n\nWith Invoice no. ${invoiceNo}`;
    const customerEmailSubject = "New Bar Order Task";

    await sendEmail(userEmail, customerEmailSubject, userEmailBody);
  } else {
    res.status(401);
    throw new Error("Cannot create order");
  }
});

export const getAllBarOrders = asyncHandler(async (req, res) => {
  const barOrder = await BarOrder.find({isDeleted: false}).sort({ createdAt: -1 }).lean();

  if (barOrder) {
    res.json(barOrder);
  } else {
    return res.status(400).json({ message: "No JewelleryOrder found" });
  }
});

export const getBarOrderById = asyncHandler(async (req, res) => {
  const barOrder = await BarOrder.findById(req.params.id);
  if (barOrder) {
    res.json(barOrder);
  } else {
    res.status(404);
    throw new Error("jewelleryOrder not found");
  }
});

export const getBarOrderEditedById = asyncHandler(async (req, res) => {
  const barOrder = await BarOrderEdited.findOne({ barId: req.params.id });
  if (barOrder) {
    res.json(barOrder);
  } else {
    res.json({});
  }
});

export const cancelBarOrder = asyncHandler(async (req, res) => {
  const barOrder = await BarOrder.findById(req.params.id);

  if (barOrder) {
    barOrder.status = "Cancelled";
    await barOrder.save();

    await Cancel.create({
      itemId: barOrder._id,
      invoice: barOrder.invoice,
      name: barOrder.name,
      cancelType: "Bar Order",
      amount: barOrder.estimateAmount,
      cancelledBy: req.body.fullName
    });

    const billing = await BarBilling.findOne({ barOrderId: req.params.id });
    if (billing) {
      await billing.deleteOne();
    }
    res.json({ message: "order cancelled" });
  } else {
    res.status(404);
    throw new Error("order not found");
  }
});

export const updateBarOrder = asyncHandler(async (req, res) => {
  const barOrder = await BarOrder.findById(req.params.id);

  const editedExists = await BarOrderEdited.findOne({
    barId: barOrder._id,
  });

  if (editedExists) {
    editedExists.name = barOrder.name;
    editedExists.metalType = barOrder.metalType;
    editedExists.itemType = barOrder.itemType;
    editedExists.itemQuantity = barOrder.itemQuantity;
    editedExists.itemUnitPrice = barOrder.itemUnitPrice;
    editedExists.karat = barOrder.karat;
    editedExists.lengthInCm = barOrder.lengthInCm;
    editedExists.width = barOrder.width;
    editedExists.stoneType = barOrder.stoneType;
    editedExists.tola = barOrder.tola;
    editedExists.weight = barOrder.weight;
    editedExists.currency = barOrder.currency;
    editedExists.goldSilverRate = barOrder.goldSilverRate;
    editedExists.goldPaymentRate = barOrder.goldPaymentRate;
    editedExists.goldWeight = barOrder.goldWeight;
    editedExists.makingCharge = barOrder.makingCharge;
    editedExists.estimateAmount = barOrder.estimateAmount;
    editedExists.paymentType = barOrder.paymentType;
    editedExists.paidAmount = barOrder.paidAmount;
    editedExists.checkDetails = barOrder.checkDetails;
    editedExists.remainingAmount = barOrder.remainingAmount;
    editedExists.orderDate = barOrder.orderDate;
    editedExists.deadlineDate = barOrder.deadlineDate;
    editedExists.deliveryLocation = barOrder.deliveryLocation;
    editedExists.remarks = barOrder.remarks;
    editedExists.assignedTo = barOrder.assignedTo;
    editedExists.priority = barOrder.priority;
    editedExists.goldWeight = barOrder.goldWeight;
    await editedExists.save();
  } else {
    await BarOrderEdited.create({
      barId: barOrder._id,
      name: barOrder.name,
      metalType: barOrder.metalType,
      itemType: barOrder.itemType,
      itemQuantity: barOrder.itemQuantity,
      itemUnitPrice: barOrder.itemUnitPrice,
      karat: barOrder.karat,
      lengthInCm: barOrder.lengthInCm,
      width: barOrder.width,
      stoneType: barOrder.stoneType,
      tola: barOrder.tola,
      weight: barOrder.weight,
      currency: barOrder.currency,
      goldSilverRate: barOrder.goldSilverRate,
      goldPaymentRate: barOrder.goldPaymentRate,
      goldWeight: barOrder.goldWeight,
      makingCharge: barOrder.makingCharge,
      estimateAmount: barOrder.estimateAmount,
      paymentType: barOrder.paymentType,
      paidAmount: barOrder.paidAmount,
      checkDetails: barOrder.checkDetails,
      remainingAmount: barOrder.remainingAmount,
      orderDate: barOrder.orderDate,
      deadlineDate: barOrder.deadlineDate,
      deliveryLocation: barOrder.deliveryLocation,
      remarks: barOrder.remarks,
      assignedTo: barOrder.assignedTo,
      priority: barOrder.priority,
      goldWeight: barOrder.goldWeight,
    });
  }

  if (barOrder) {
    barOrder.name = req.body.name;
    barOrder.metalType = req.body.metalType;
    barOrder.itemType = req.body.itemType;
    barOrder.itemQuantity = req.body.itemQuantity;
    barOrder.itemUnitPrice = req.body.itemUnitPrice;
    barOrder.karat = req.body.karat;
    barOrder.lengthInCm = req.body.lengthInCm;
    barOrder.width = req.body.width;
    barOrder.stoneType = req.body.stoneType;
    barOrder.tola = req.body.tola;
    barOrder.weight = req.body.weight;
    barOrder.currency = req.body.currency;
    barOrder.goldSilverRate = req.body.goldSilverRate;
    barOrder.makingCharge = req.body.makingCharge;
    barOrder.estimateAmount = req.body.estimateAmount;
    barOrder.paymentType = req.body.paymentType;
    barOrder.paidAmount = req.body.paidAmount;
    barOrder.checkDetails = req.body.checkDetails;
    barOrder.remainingAmount = req.body.remainingAmount;
    barOrder.orderDate = req.body.orderDate;
    barOrder.deadlineDate = req.body.deadlineDate;
    barOrder.deliveryLocation = req.body.deliveryLocation;
    barOrder.remarks = req.body.remarks;
    barOrder.assignedTo = req.body.assignedTo;
    barOrder.priority = req.body.priority;
    barOrder.profilePicture = req.body.profilePicture;
    barOrder.goldWeight = req.body.goldWeight;
    barOrder.updatedBy = req.body.updatedBy;

    await barOrder.save();

    res.json({
      message: "successfully updated",
    });
  } else {
    res.status(401);
    throw new Error("order not found");
  }
});

export const deleteBarOrder = async (req, res) => {
  const { id } = req.params;
  const userDetails = req.body

  // Does the user exist to delete?
  const order = await BarOrder.findById(id).exec();

  if (!order) {
    res.status(400);
    throw new Error("bar not found");
  }

  const billing = BarBilling.findOne({ barOrderId: id }).exec();

  

  if (billing) {
    await BarBilling.updateOne({ barOrderId: id }, { isDeleted: true, deletedDate: new Date() });
  }

  order.isDeleted = true;
  order.deletedDate = new Date()
  const success = await order.save()

  if(success){
    await Trash.create({
      user: userDetails.fullName,
      deletedAt: new Date(),
      heading: "Bar Order",
      headingId: id,
      name: order.name
    })
  }

  if(order.status === "Cancelled"){
    const cancelledTrue = await Cancel.findOne({itemId:id}).exec()
   if(cancelledTrue){
    await Cancel.updateOne({ itemId: id }, { isDeleted: true, deletedDate: new Date() });
   }
  }

  const reply = `deleted`;

  res.json(reply);
};

export const getBarOrderExcel = asyncHandler(async (req, res) => {

  const { from, to, status } = req.query;

  const barOrder = await BarOrder.find({
    isDeleted: false,
    status: status,
    createdAt: { $gte: from, $lte: to },
  }).exec();

  if (barOrder.length > 0) {
    const transformedData = barOrder.map((item) => ({
      Invoice: item?.invoice,
      ItemName: item?.name,
      MetalType: item?.metalType,
      Karat: item?.karat,
      tola: item?.tola,
      weight: item?.weight,
      goldSilverRate: item?.goldSilverRate,
      makingCharge: item?.makingCharge,
      wastage: item?.wastage,
      lengthInCm: item?.lengthInCm,
      width: item?.width,
      estimateAmount: item?.estimateAmount,
      paymentType: item?.paymentType,
      advancePayment: item?.paidAmount,
      orderDate: item?.orderDate?.slice(0,10),
      deadlineDate: item?.deadlineDate?.slice(0,10),
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