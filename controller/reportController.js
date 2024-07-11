import asyncHandler from "express-async-handler";
import xlsx from "xlsx";
import BarBilling from "../models/barBillingModel.js";
import Billing from "../models/billingModel.js";
import Customer from "../models/customerModel.js";
import JewelleryInventoryBilling from "../models/jewelleryInventoryBilling.js";
import SilverInventoryBilling from "../models/silverInventoryBilling.js";
import WatchInventoryBilling from "../models/watchInventoryBilling.js";

export const getJewelleryInventoryReport = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const report = await JewelleryInventoryBilling.find({
    createdAt: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
    isDeleted: false,
  });

  if (report) {
    res.json(report);
  } else {
    throw new Error(`No data for report from ${from} to ${to}`);
  }
});

export const getJewelleryInventoryExcel = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const report = await JewelleryInventoryBilling.find({
    createdAt: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
    isDeleted: false,
  });

  if (report.length > 0) {
    const transformedData = report.map((item) => ({
      Date: item?.createdAt?.toString()?.slice(0, 15),
      Invoice: item?.invoice,
      ItemName: item?.name,
      customerName: item?.customerName,
      Rate: item?.rate,
      Weight: item?.weight,
      Jarti: item?.jartiWaste,
      SellingPrice: item?.sellingPrice,
      discount: item?.discount,
      quantity: item?.quantity,
      makingCharge: item?.makingCharge,
      vatAmount: item?.vatAmount,
      totalPrice: item?.totalPrice,
    }));

    const worksheet = xlsx.utils.json_to_sheet(transformedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.status(200).send(excelBuffer);
  } else {
    throw new Error(`No data for report from ${from} to ${to}`);
  }
});

export const getWatchInventoryReport = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const report = await WatchInventoryBilling.find({
    createdAt: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
    isDeleted: false,
  });

  if (report) {
    res.json(report);
  } else {
    throw new Error(`No data for report from ${from} to ${to}`);
  }
});

export const getWatchExcel = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const report = await WatchInventoryBilling.find({
    createdAt: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
    isDeleted: false,
  });

  if (report.length > 0) {
    const transformedData = report.map((item) => ({
      Date: item?.createdAt?.toString()?.slice(0, 15),
      Invoice: item?.invoice,
      ItemName: item?.name,
      modelNo: item?.modelNo,
      customerName: item?.customerName,
      quantity: item?.quantity,
      discount: item?.discount,
      totalPrice: item?.totalPrice,
    }));

    const worksheet = xlsx.utils.json_to_sheet(transformedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.status(200).send(excelBuffer);
  } else {
    throw new Error(`No data for report from ${from} to ${to}`);
  }
});

export const getSilverInventoryReport = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const report = await SilverInventoryBilling.find({
    createdAt: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
    isDeleted: false,
  });

  if (report) {
    res.json(report);
  } else {
    throw new Error(`No data for report from ${from} to ${to}`);
  }
});

export const getSilverExcel = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const report = await SilverInventoryBilling.find({
    createdAt: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
    isDeleted: false,
  });

  if (report.length > 0) {
    const transformedData = report.map((item) => ({
      Date: item?.createdAt?.toString()?.slice(0, 15),
      Invoice: item?.invoice,
      ItemName: item?.name,
      weight: item?.weight,
      customerName: item?.customerName,
      quantity: item?.quantity,
      makingCharge: item?.makingCharge,
      discount: item?.discount,
      vatAmount: item?.vatAmount,
      totalPrice: item?.totalPrice,
    }));

    const worksheet = xlsx.utils.json_to_sheet(transformedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.status(200).send(excelBuffer);
  } else {
    throw new Error(`No data for report from ${from} to ${to}`);
  }
});

export const getJewelleryOrderInventoryReport = asyncHandler(
  async (req, res) => {
    const { from, to } = req.query;
    const report = await Billing.find({
      createdAt: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
      isDeleted: false,
    });

    if (report) {
      res.json(report);
    } else {
      throw new Error(`No data for report from ${from} to ${to}`);
    }
  }
);

export const getJewelleryOrderExcel = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const report = await Billing.find({
    createdAt: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
    isDeleted: false,
  });

  let reportWithCustomer = [];

  const customerList = await Customer.find({}).lean();

  report.forEach((item) => {
    const customerName = customerList.find(
      (customer) => customer._id?.toString() == item.customerId
    );

    // report has weired doc name inside it if you console it.
    reportWithCustomer.push({
      customerName: customerName?.fullName,
      ...item._doc,
    });
  });

  if (reportWithCustomer.length > 0) {
    const transformedData = reportWithCustomer.map((item) => ({
      Date: item?.createdAt?.toString()?.slice(0, 15),
      Invoice: item?.invoice,
      ItemName: item?.name,
      Customer: item?.customerName,
      tola: item?.tola,
      karat: item?.karat,
      Rate: item?.goldSilverRate,
      Weight: item?.weight,
      Jarti: item?.jartiWaste,
      SellingPrice: item?.sellingPrice,
      discount: item?.discount,
      quantity: item?.quantity,
      makingCharge: item?.makingCharge,
      vatAmount: item?.vatAmount,
      advanceGiven: item?.advanceGiven,
      totalPrice: item?.grandTotal,
    }));

    const worksheet = xlsx.utils.json_to_sheet(transformedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.status(200).send(excelBuffer);
  } else {
    throw new Error(`No data for report from ${from} to ${to}`);
  }
});

export const getBarOrderInventoryReport = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const report = await BarBilling.find({
    createdAt: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
    isDeleted: false,
  });

  if (report) {
    res.json(report);
  } else {
    throw new Error(`No data for report from ${from} to ${to}`);
  }
});

export const getBarOrderExcel = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const report = await BarBilling.find({
    createdAt: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
    isDeleted: false,
  });

  let reportWithCustomer = [];

  const customerList = await Customer.find({}).lean();

  report.forEach((item) => {
    const customerName = customerList.find(
      (customer) => customer._id?.toString() == item.customerId
    );

    // report has weired doc name inside it if you console it.
    reportWithCustomer.push({
      customerName: customerName?.fullName,
      ...item._doc,
    });
  });

  if (reportWithCustomer.length > 0) {
    const transformedData = reportWithCustomer.map((item) => ({
      Date: item?.createdAt?.toString()?.slice(0, 15),
      Invoice: item?.invoice,
      ItemName: item?.name,
      customerName: item?.customerName,
      itemType: item?.itemType,
      itemUnitPrice: item?.itemUnitPrice,
      tola: item?.tola,
      karat: item?.karat,
      wastage: item?.wastage,
      Rate: item?.goldSilverRate,
      Weight: item?.weight,
      discount: item?.discount,
      quantity: item?.quantity,
      makingCharge: item?.makingCharge,
      vatAmount: item?.vatAmount,
      advanceGiven: item?.advanceGiven,
      totalPrice: item?.total,
    }));

    const worksheet = xlsx.utils.json_to_sheet(transformedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.status(200).send(excelBuffer);
  } else {
    throw new Error(`No data for report from ${from} to ${to}`);
  }
});
