import asyncHandler from "express-async-handler";
import Logo from "../models/logoModel.js";

export const createLogo = asyncHandler(async (req, res) => {
  const { logo } = req.body;

  if (!logo) {
    res.status(400);
    throw new Error("Logo is required");
  }

  const created = await Logo.create({ logo });
  if (created) {
    res.status(201).json(created);
  } else {
    res.status(400);
    throw new Error("cannot create logo");
  }
});

export const getLogo = asyncHandler(async (req, res) => {
  const logo = await Logo.find({}).lean();

  if (logo) {
    res.json(logo[0]);
  } else {
    return res.status(400).json({ message: "No logo found" });
  }
});

export const updateLogo = asyncHandler(async (req, res) => {
  const logo = await Logo.findById(req.params.id);

  if (logo) {
    logo.logo = req.body.logo;
    await logo.save();
    res.json("updated");
  } else {
    res.status(401);
    throw new Error("logo not found");
  }
});
