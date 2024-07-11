import asyncHandler from "express-async-handler";
import xlsx from "xlsx";
import Trash from "../models/trashModel.js";
import Watch from "../models/watchModel.js";

export const createWatch = asyncHandler(async (req, res) => {
  const {
    modelNo,
    name,
    currency,
    price,
    quantity,
    manufacturer,
    remarks,
    profilePicture,
    color,
  } = req.body;

  if (!modelNo || !name) {
    res.status(400);
    throw new Error("Fill required fields");
  }

  const watchExists = await Watch.findOne({ modelNo }).lean().exec();

  if (watchExists) {
    res.status(400);
    throw new Error("Watch model already exists");
  }

  const created = await Watch.create({
    modelNo,
    name,
    currency,
    price,
    quantity,
    manufacturer,
    remarks,
    profilePicture,
    color,
  });

  if (created) {
    res.status(201);
    res.json({
      _id: created._id,
      modelNo,
      name,
      currency,
      price,
      quantity,
      manufacturer,
      remarks,
      profilePicture,
      color,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create Watch");
  }
});

export const getAllWatch = asyncHandler(async (req, res) => {
  const watch = await Watch.find({isDeleted: false}).sort({ createdAt: -1 }).lean();

  if (watch) {
    res.status(200).json(watch);
  } else {
    return res.status(400).json({ message: "No watch found" });
  }
});

export const getWatchById = asyncHandler(async (req, res) => {
  const watch = await Watch.findById(req.params.id);
  if (watch) {
    res.json(watch);
  } else {
    res.status(404);
    throw new Error("watch not found");
  }
});

export const updateWatch = asyncHandler(async (req, res) => {
  const watch = await Watch.findById(req.params.id);

  if (watch) {
    watch.modelNo = req.body.modelNo;
    watch.name = req.body.name;
    watch.currency = req.body.currency;
    watch.price = req.body.price;
    watch.quantity = req.body.quantity;
    watch.manufacturer = req.body.manufacturer;
    watch.remarks = req.body.remarks;
    watch.profilePicture = req.body.profilePicture;
    watch.color = req.body.color;

    const updatedwatch = await watch.save();

    res.json({
      _id: updatedwatch._id,
      modelNo: updatedwatch.modelNo,
      name: updatedwatch.name,
      currency: updatedwatch.currency,
      price: updatedwatch.price,
      quantity: updatedwatch.quantity,
      manufacturer: updatedwatch.manufacturer,
      remarks: updatedwatch.remarks,
      profilePicture: updatedwatch.profilePicture,
      color: updatedwatch.color,
    });
  } else {
    res.status(401);
    throw new Error("watch not found");
  }
});

export const deleteWatch = async (req, res) => {
  const { id } = req.params;
  const userDetails = req.body

  const watch = await Watch.findById(id);

  if (!watch) {
    res.status(400);
    throw new Error("watch not found");
  }

  watch.isDeleted = true;
  watch.deletedDate = new Date()

  const success = await watch.save()

  if(success){
    await Trash.create({
      user: userDetails.fullName,
      deletedAt: new Date(),
      heading: "Watch",
      headingId: id,
      name: watch.name
    })
  }

  const reply = `deleted`;

  res.json(reply);
};

export const deleteMultipleWatches = asyncHandler(async (req, res) => {
  const  {ids, user}  = req.body;

  const userIds = ids.map((item) => item.id);

  const result = await Watch.updateMany(
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
      heading: "Watch",
      headingId: id.id,
      name: id.name, 
    }));

    await Trash.insertMany(trashRecords);
    res.json({ message: `${result.deletedCount} Watch deleted successfully` });
  } else {
    res.status(404).json({ message: 'No Watch found with the provided IDs' });
  }
});

export const getWatchReport = async (req, res) => {
  const { id } = req.params;

  const user = await Watch.findById(id).exec();

  if (!user) {
    res.status(400);
    throw new Error("watch not found");
  }

  const result = await user.deleteOne();

  const reply = `deleted`;

  res.json(reply);
};

export const getWatchExcel = asyncHandler(async (req, res) => {
  const watch = await Watch.find({})
    .sort({ createdAt: -1 })
    .lean();

  if (watch.length > 0) {
    const transformedData = watch.map((item) => ({
    modelNo: item?.modelNo,
    name: item?.name,
    currency: item?.currency,
    price: item?.price,
    quantity: item?.quantity,
    manufacturer: item?.manufacturer,
    remarks: item?.remarks,
    color: item?.color,
    }));

    const worksheet = xlsx.utils.json_to_sheet(transformedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "watch");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.status(200).send(excelBuffer);
  } else {
    throw new Error(`No data for report from ${from} to ${to}`);
  }
});