import asyncHandler from "express-async-handler";
import Currency from "../models/currencyModel.js";

export const createCurrency = asyncHandler(async (req, res) => {
  const { dollar, rupees } = req.body;

  const created = await Currency.create({
    dollar,
    rupees,
  });

  if (created) {
    res.status(201);
    res.json({
      _id: created._id,
      dollar,
      rupees,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create currency");
  }
});

export const getCurrency = asyncHandler(async (req, res) => {
  const currency = await Currency.find({}).lean();

  if (currency) {
    res.json(currency[0]);
  } else {
    res.status(401);
    throw new Error("Cannot find email");
  }
});

export const updateCurrency = asyncHandler(async (req, res) => {
  const { dollar, rupees } = req.body;

  const updated = await Currency.findById(req.params.id);
  if (updated) {
    updated.dollar = dollar;
    updated.rupees = rupees;
    updated.save();

    res.status(200);
    res.json({
      dollar,
      rupees,
    });
  } else {
    res.status(401);
    throw new Error("Cannot edit currency");
  }
});
