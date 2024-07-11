import asyncHandler from "express-async-handler";
import { generateToken } from "../helpers/generateToken.js";
import User from "../models/userModel.js";

export const authUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  const user = await User.findOne({ userName, isDeleted: false });
  // const user = await User.findOne({ userName, isDeleted: false });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fullName: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});
