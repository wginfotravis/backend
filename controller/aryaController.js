import asyncHandler from "express-async-handler";
import Arya from "../models/aryaModel.js";

export const createArya = asyncHandler(async (req, res) => {
  const {
    itemCode,
    name,
    currency,
    purchasePrice,
    quantity,
    remarks,
    profilePicture,
  } = req.body;

  if (!itemCode || !name) {
    res.status(400);
    throw new Error("Fill required fields");
  }

  const aryaExists = await Arya.findOne({ itemCode }).lean().exec();

  if (aryaExists) {
    res.status(400);
    throw new Error("Arya itemcode already exists");
  }

  const created = await Arya.create({
    itemCode,
    name,
    currency,
    purchasePrice,
    quantity,
    remarks,
    profilePicture,
  });

  if (created) {
    res.status(201);
    res.json({
      _id: created._id,
      itemCode,
      name,
      currency,
      purchasePrice,
      quantity,
      remarks,
      profilePicture,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create Arya");
  }
});

export const getAllArya = asyncHandler(async (req, res) => {
  const arya = await Arya.find({}).lean();

  // If no Customer
  if (!arya?.length) {
    return res.status(400).json({ message: "No arya found" });
  }

  res.json(arya);
});

export const getAryaById = asyncHandler(async (req, res) => {
  const arya = await Arya.findById(req.params.id);
  if (arya) {
    res.json(arya);
  } else {
    res.status(404);
    throw new Error("arya not found");
  }
});

export const updateArya = asyncHandler(async (req, res) => {
  const arya = await Arya.findById(req.params.id);

  if (arya) {
    arya.itemCode = req.body.itemCode;
    arya.name = req.body.name;
    arya.currency = req.body.currency;
    arya.purchasePrice = req.body.purchasePrice;
    arya.quantity = req.body.quantity;
    arya.remarks = req.body.remarks;
    arya.profilePicture = req.body.profilePicture;

    const updateArya = await arya.save();

    res.json({
      _id: updateArya._id,
      itemCode: updateArya.itemCode,
      name: updateArya.name,
      currency: updateArya.currency,
      purchasePrice: updateArya.purchasePrice,
      quantity: updateArya.quantity,
      remarks: updateArya.remarks,
      profilePicture: updateArya.profilePicture,
    });
  } else {
    res.status(401);
    throw new Error("arya not found");
  }
});
