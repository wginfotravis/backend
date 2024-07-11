import asyncHandler from "express-async-handler";
import xlsx from "xlsx";
import sendEmail from "../helpers/sendEmail.js";
import Email from "../models/emailModel.js";
import JewelleryOrder from "../models/jewelleryOrderModel.js";
import Process from "../models/processModel.js";

export const createProcess = asyncHandler(async (req, res) => {
  const {
    invoice,
    stoneShop,
    name,
    tola,
    weight,
    stoneType,
    currency,
    goldSilverRate,
    makingCharge,
    wastage,
    stonePrice,
    poundToNpr,
    poundEstimate,
    estimateAmount,
    paymentType,
    paidAmount,
    checkDetails,
    remainingAmount,
    deadlineDate,
    priority,
    remarks,
    customerId,
    customerName,
    orderId,
    factoryId,
    factoryName,
  } = req.body;

  if (!tola || !weight || !goldSilverRate || !orderId) {
    res.status(400);
    throw new Error("Fill required fields");
  }

  const created = await Process.create({
    invoice,
    stoneShop,
    name,
    tola,
    weight,
    stoneType,
    currency,
    goldSilverRate,
    makingCharge,
    wastage,
    stonePrice,
    poundToNpr,
    poundEstimate,
    estimateAmount,
    paymentType,
    paidAmount,
    checkDetails,
    remainingAmount,
    deadlineDate,
    priority,
    remarks,
    customerId,
    customerName,
    orderId,
    factoryId,
    factoryName,
  });

  const jewelleryOrder = await JewelleryOrder.findById(orderId);

  if (created) {
    jewelleryOrder.status = "Process started";

    jewelleryOrder.save();

    res.status(201).json({
      _id: created._id,
      invoice,
      stoneShop,
      name,
      tola,
      weight,
      stoneType,
      currency,
      goldSilverRate,
      makingCharge,
      wastage,
      stonePrice,
      poundToNpr,
      poundEstimate,
      estimateAmount,
      paymentType,
      paidAmount,
      checkDetails,
      remainingAmount,
      deadlineDate,
      priority,
      remarks,
      customerId,
      customerName,
      orderId,
      factoryId,
      factoryName,
    });

    //sending email to administrator
    const adminEmailsList = await Email.find({});
    let adminEmails = [];
    adminEmailsList.forEach((element) => {
      adminEmails.push(element.email);
    });
    const adminEmailBody = `Jewellery Order Process started for customer ${customerName}.\n\nWith Invoice no. ${invoice}`;
    const adminEmailSubject = "Process started";

    await sendEmail(adminEmails, adminEmailSubject, adminEmailBody);
  } else {
    res.status(401);
    throw new Error("Cannot create");
  }
});

export const getAllProcess = asyncHandler(async (req, res) => {
  const process = await Process.find({isDeleted: false}).sort({ createdAt: -1 }).lean();

  if (process) {
    res.status(200).json(process);
  } else {
    return res.status(400).json({ message: "No process found" });
  }
});

export const getProcessById = asyncHandler(async (req, res) => {
  const process = await Process.findById(req.params.id);
  if (process) {
    const order = await JewelleryOrder.findById(process.orderId);
    if (order) {
      res.json({ process, order });
    } else {
      throw new Error("This process doesnot have order id. Please check");
    }
  } else {
    res.status(404);
    throw new Error("process not found");
  }
});

export const updateprocess = asyncHandler(async (req, res) => {
  const process = await Process.findById(req.params.id);

  if (process) {
    process.stoneShop = req.body.stoneShop || process.stoneShop;
    process.tola = req.body.tola || process.tola;
    process.weight = req.body.weight || process.weight;
    process.stoneType = req.body.stoneType || process.stoneType;
    process.currency = req.body.currency || process.currency;
    process.goldSilverRate = req.body.goldSilverRate || process.goldSilverRate;
    process.makingCharge = req.body.makingCharge || process.makingCharge;
    process.wastage = req.body.wastage || process.wastage;
    process.stonePrice = req.body.stonePrice || process.stonePrice;
    process.poundToNpr = req.body.poundToNpr || process.poundToNpr;
    process.poundEstimate = req.body.poundEstimate || process.poundEstimate;
    process.estimateAmount = req.body.estimateAmount || process.estimateAmount;
    process.paymentType = req.body.paymentType || process.paymentType;
    process.paidAmount = req.body.paidAmount || process.paidAmount;
    process.checkDetails = req.body.checkDetails || process.checkDetails;
    process.remainingAmount =
      req.body.remainingAmount || process.remainingAmount;
    process.deadlineDate = req.body.deadlineDate || process.deadlineDate;
    process.priority = req.body.priority || process.priority;
    process.remarks = req.body.remarks || process.remarks;
    process.factoryId = req.body.factoryId || process.factoryId;
    process.factoryName = req.body.factoryName || process.factoryName;

    const updatedProcess = await process.save();

    res.json({
      updatedProcess,
    });
  } else {
    res.status(401);
    throw new Error("process not found");
  }
});

export const getProcessExcel = asyncHandler(async (req, res) => {

  const {factory} = req.query

  const process = await Process.find({factoryName: factory, isDeleted: false})
    .sort({ createdAt: -1 })
    .lean();

  if (process.length > 0) {
    const transformedData = process.map((item) => ({
      invoice: item?.invoice,
      createdAt: item?.createdAt,
      deadlineDate: item?.deadlineDate,
      stoneShop: item?.stoneShop,
      stonePrice: item?.stonePrice,
      customerName: item?.customerName,
      factoryName: item?.factoryName,
      name: item?.name,
      tola: item?.tola,
      weight: item?.weight,
      stoneType: item?.stoneType,
      goldSilverRate: item?.goldSilverRate,
      makingCharge: item?.makingCharge,
      wastage: item?.wastage,
      total: item?.estimateAmount,
      paymentType: item?.paymentType,
      advencePayment: item?.paidAmount,
      checkDetails: item?.checkDetails,
      remainingAmount: item?.remainingAmount,
      priority: item?.priority,
      remarks: item?.remarks,
    }));

    const worksheet = xlsx.utils.json_to_sheet(transformedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "process");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.status(200).send(excelBuffer);
  } else {
    throw new Error(`No data for report`);
  }
});