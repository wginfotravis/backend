import asyncHandler from "express-async-handler";
import Email from "../models/emailModel.js";

export const createEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const created = await Email.create({
    email,
  });

  if (created) {
    res.status(201);
    res.json({
      _id: created._id,
      email,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create email");
  }
});

export const getEmail = asyncHandler(async (req, res) => {
  const email = await Email.find({}).sort({ createdAt: -1 }).lean();

  if (email) {
    res.json(email);
  } else {
    res.status(401);
    throw new Error("Cannot find email");
  }
});

export const getEmailById = asyncHandler(async (req, res) => {
  const email = await Email.findById(req.params.id);

  if (email) {
    res.json(email);
  } else {
    res.status(401);
    throw new Error("Cannot find email");
  }
});

export const updateEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const updated = await Email.findById(req.params.id);
  if (updated) {
    updated.email = email;
    updated.save();

    res.status(200);
    res.json({
      email,
    });
  } else {
    res.status(401);
    throw new Error("Cannot edit email");
  }
});

export const deleteEmail = async (req, res) => {
  const { id } = req.params;

  const email = await Email.findById(id).exec();

  if (!email) {
    res.status(400);
    throw new Error("customer not found");
  }

  await email.deleteOne();

  const reply = `deleted`;

  res.json(reply);
};
