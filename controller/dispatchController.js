import asyncHandler from "express-async-handler";
import Billing from "../models/billingModel.js";
import Dispatch from "../models/dispatchModel.js";
import Trash from "../models/trashModel.js";

export const createDispatch = asyncHandler(async (req, res) => {
  const { dispatch, billingDetails } = req.body;
  const created = await Dispatch.create(dispatch);

  if (created) {
    // Iterate over each dispatch object
    for (const item of billingDetails) {
      const { _id } = item;

      // Retrieve the Bill and Order based on billId and orderId
      const bill = await Billing.findById(_id);
      console.log(bill.name);

      // Update the status of Bill and Order to "finished"
      bill.status = "Already Dispatched";

      // Save the updated Bill and Order
      await bill.save();
    }
    res.status(201);
    res.json({
      message: "dispatch done",
    });
  } else {
    res.status(401);
    throw new Error("Cannot create Dispatch");
  }
  // const {
  //   invoice,
  //   dispatchedTo,
  //   name,
  //   itemName,
  //   phone,
  //   dispatchDate,
  //   arrivalDate,
  //   remarks,
  //   trackdId,
  //   billingId,
  //   origin,
  //   orderId,
  // } = req.body;
  // //will have to add barorder id in future

  // if (!invoice || !name || !phone || !trackdId || !origin) {
  //   res.status(400);
  //   throw new Error("All fields are required");
  // }

  // const created = await Dispatch.create({
  //   invoice,
  //   dispatchedTo,
  //   name,
  //   itemName,
  //   phone,
  //   dispatchDate,
  //   arrivalDate,
  //   remarks,
  //   trackdId,
  //   billingId,
  //   origin,
  //   orderId,
  // });

  // if (created) {
  //   if (billingId) {
  //     const billing = await Billing.findById(billingId);
  //     billing.status = "Already Dispatched";
  //     billing.save();
  //   }
  //   res.status(201);
  //   res.json({
  //     _id: created._id,
  //     invoice,
  //     dispatchedTo,
  //     name,
  //     itemName,
  //     phone,
  //     dispatchDate,
  //     arrivalDate,
  //     remarks,
  //     trackdId,
  //     billingId,
  //     origin,
  //     orderId,
  //   });
  // } else {
  //   res.status(401);
  //   throw new Error("Cannot create Dispatch");
  // }
});

export const getAllDispatch = asyncHandler(async (req, res) => {
  const dispatch = await Dispatch.find({isDeleted: false}).sort({ createdAt: -1 }).lean();

  if (dispatch) {
    res.status(200).json(dispatch);
  } else {
    return res.status(400).json({ message: "No dispatch found" });
  }
});


export const getDispatchById = asyncHandler(async (req, res) => {
  const dispatch = await Dispatch.findById(req.params.id);
  if (dispatch) {
    res.json(dispatch);
  } else {
    res.status(404);
    throw new Error("dispatch not found");
  }
});

export const updateDispatch = asyncHandler(async (req, res) => {
  const dispatch = await Dispatch.findById(req.params.id);

  if (dispatch) {
    dispatch.dispatchedTo = req.body.dispatchedTo || dispatch.dispatchedTo;
    dispatch.name = req.body.name || dispatch.name;
    dispatch.phone = req.body.phone || dispatch.phone;
    dispatch.dispatchDate = req.body.dispatchDate || dispatch.dispatchDate;
    dispatch.arrivalDate = req.body.arrivalDate || dispatch.arrivalDate;
    dispatch.remarks = req.body.remarks || dispatch.remarks;
    dispatch.itemTrackId = req.body.itemTrackId || dispatch.itemTrackId;

    const updatedDispatch = await dispatch.save();

    res.json({
      updatedDispatch,
    });
  } else {
    res.status(401);
    throw new Error("Dispatch not found");
  }
});

export const deleteDispatch = async (req, res) => {
  const { id } = req.params;
  const userDetails = req.body

  const user = await Dispatch.findById(id).exec();

  if (!user) {
    res.status(400);
    throw new Error("Dispatch not found");
  }

  user.isDeleted = true;
  user.deletedDate = new Date()

  const success = await user.save()

  if(success){
    await Trash.create({
      user: userDetails.fullName,
      deletedAt: new Date(),
      heading: "Dispatch",
      headingId: id,
      name: user.name
    })
  }

  const reply = `deleted`;

  res.json(reply);
};
