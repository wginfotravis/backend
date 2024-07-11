import asyncHandler from "express-async-handler";
// import Dispatch from "../models/dispatchModel.js";
import Trash from "../models/trashModel.js";
import User from "../models/userModel.js";

export const createUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    userName,
    password,
    phone,
    profilePicture,
    role,
    gender,
  } = req.body;

  if (!userName || !password || !email || !name || !gender) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const userNameExists = await User.findOne({ userName }).lean().exec();
  if (userNameExists) {
    res.status(400);
    throw new Error("Username already exists");
  }

  const userEmailExists = await User.findOne({ email }).lean().exec();
  if (userEmailExists) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const user = await User.create({
    name,
    email,
    userName,
    password,
    phone: phone || "",
    profilePicture: profilePicture || "",
    role,
    gender,
  });
  if (user) {
    res.status(201);
    res.json({
      _id: user._id,
      name,
      email,
      userName,
      password,
      phone,
      profilePicture,
      role,
      gender,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create user");
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  // const users = await User.find({}).sort({ createdAt: -1 });
  const users = await User.find({ isDeleted: false })
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  // If no users
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
});

export const getAllUsersList = asyncHandler(async (req, res) => {
  // const users = await User.find({}).sort({ createdAt: -1 });
  const users = await User.find({ isDeleted: false, role: "user" })
    .select("name")
    .sort({ createdAt: -1 })
    .lean();

  if (users) {
    res.json(users);
  } else {
    return res.status(400).json({ message: "No users found" });
  }

});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    // user.userName = req.body.userName || user.userName;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;
    user.gender = req.body.gender || user.gender;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      // email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      profilePicture: updatedUser.profilePicture,
      gender: updatedUser.gender,
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userDetails = req.body

  // Does the user exist to delete?
  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  user.isDeleted = true;
  user.deletedDate = new Date()

  const success = await user.save()

  if(success){
    await Trash.create({
      user: userDetails.fullName,
      deletedAt: new Date(),
      heading: "User",
      headingId: id,
      name: user.name
    })
  }

  const reply = ` deleted`;

  res.json(reply);
});

export const deleteMultipleUsers = asyncHandler(async (req, res) => {
  const  {ids, user}  = req.body;

  const userIds = ids.map((item) => item.id);

  const result = await User.updateMany(
    { _id: { $in: [...userIds] } },
    {
      $set: {
        isDeleted: true,
        deletedDate: new Date(),
      },
    }
  );

  if (result.matchedCount > 0) {
    const trashRecords = ids.map(id => ({
      user: user.fullName,
      deletedAt: new Date(),
      heading: "User",
      headingId: id.id,
      name: id.name, 
    }));

    await Trash.insertMany(trashRecords);

    res.json({ message: `${result.deletedCount} users deleted successfully` });
  } else {
    res.status(404).json({ message: 'No users found with the provided IDs' });
  }
});

export const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  user.password = req.body.password;

  await user.save();

  const reply = `Password changed successfully`;

  res.json(reply);
});


// export const addIsDeleted = asyncHandler(async (req, res) => {

//   const result = await Dispatch.updateMany({}, {
//     $set: {
//       isDeleted: false
//     },
//   });


//   if (result.matchedCount > 0) {
//     res.json({ message: `${result.matchedCount} is Delete added` });
//   } else {
//     res.status(404).json({ message: 'No users found in the collection' });
//   }
// });