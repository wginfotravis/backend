//this function is made to add isDelete: false in all the models for anugracrm jewellers
// reson for so many different
import asyncHandler from "express-async-handler";
import Factory from "../models/factoryModel.js";
import User from "../models/userModel.js";

export const addIsDeletedUser = asyncHandler(async (req, res) => {
    const {model} = req.body
    const users = await User.find({})
    const result = await User.updateMany({}, {
      $set: {
        isDeleted: false
      },
    });

    if (result.matchedCount > 0) {
      res.json({ message: `${result.matchedCount} is Delete added` });
    } else {
      res.status(404).json({ message: 'No users found in the collection' });
    }
  });

 