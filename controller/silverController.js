import asyncHandler from "express-async-handler";
import xlsx from "xlsx";
import Silver from "../models/silverModel.js";
import Trash from "../models/trashModel.js";

export const createSilver = asyncHandler(async (req, res) => {
  const {
    itemCode,
    name,
    currency,
    weight,
    makingPrice,
    purchasePrice,
    quantity,
    manufacturer,
    remarks,
    profilePicture,
  } = req.body;

  if (!itemCode || !name) {
    res.status(400);
    throw new Error("Fill required fields");
  }

  const silverExists = await Silver.findOne({ itemCode }).lean().exec();

  if (silverExists) {
    res.status(400);
    throw new Error("Silver itemcode already exists");
  }

  const created = Silver.create({
    itemCode,
    name,
    currency,
    weight,
    makingPrice,
    purchasePrice,
    quantity,
    manufacturer,
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
      weight,
      makingPrice,
      purchasePrice,
      quantity,
      manufacturer,
      remarks,
      profilePicture,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create Silver");
  }
});

export const getAllSilver = asyncHandler(async (req, res) => {
  const silver = await Silver.find({isDeleted: false}).sort({ createdAt: -1 }).lean();

  if (silver) {
    res.status(200).json(silver);
  } else {
    return res.status(400).json({ message: "No silver found" });
  }
});

export const getSilverById = asyncHandler(async (req, res) => {
  const silver = await Silver.findById(req.params.id);
  if (silver) {
    res.json(silver);
  } else {
    res.status(404);
    throw new Error("silver not found");
  }
});

export const updateSilver = asyncHandler(async (req, res) => {
  const silver = await Silver.findById(req.params.id);

  if (silver) {
    silver.itemCode = req.body.itemCode;
    silver.name = req.body.name;
    silver.currency = req.body.currency;
    silver.makingPrice = req.body.makingPrice;
    silver.purchasePrice = req.body.purchasePrice;
    silver.weight = req.body.weight;
    silver.quantity = req.body.quantity;
    silver.manufacturer = req.body.manufacturer;
    silver.remarks = req.body.remarks;
    silver.profilePicture = req.body.profilePicture;

    const updateSilver = await silver.save();

    res.json({
      _id: updateSilver._id,
      itemCode: updateSilver.itemCode,
      name: updateSilver.name,
      currency: updateSilver.currency,
      makingPrice: updateSilver.makingPrice,
      purchasePrice: updateSilver.purchasePrice,
      weight: updateSilver.weight,
      quantity: updateSilver.quantity,
      manufacturer: updateSilver.manufacturer,
      remarks: updateSilver.remarks,
      profilePicture: updateSilver.profilePicture,
    });
  } else {
    res.status(401);
    throw new Error("silver not found");
  }
});

export const deleteSilver = async (req, res) => {
  const { id } = req.params;
  const userDetails = req.body

  const silver = await Silver.findById(id).exec();

  if (!silver) {
    res.status(400);
    throw new Error("Silver not found");
  }

  silver.isDeleted = true;
  silver.deletedDate = new Date()

  const success = await silver.save()

  if(success){
    await Trash.create({
      user: userDetails.fullName,
      deletedAt: new Date(),
      heading: "Silver",
      headingId: id,
      name: silver.name
    })
  }

  const reply = `deleted`;

  res.json(reply);
};

export const deleteMultipleSilver = asyncHandler(async (req, res) => {
  const  {ids, user}  = req.body;

  const userIds = ids.map((item) => item.id);

  const result = await Silver.updateMany(
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
      heading: "Silver",
      headingId: id.id,
      name: id.name, 
    }));

    await Trash.insertMany(trashRecords);
    res.json({ message: `${result.deletedCount} Silver deleted successfully` });
  } else {
    res.status(404).json({ message: 'No Silver found with the provided IDs' });
  }
});

export const getSilverExcel = asyncHandler(async (req, res) => {
  const silver = await Silver.find({isDeleted: false})
    .sort({ createdAt: -1 })
    .lean();

  if (silver.length > 0) {
    const transformedData = silver.map((item) => ({
      itemCode: item?.itemCode,
      name:  item?.name,
      currency:  item?.currency,
      weight:  item?.weight,
      makingPrice:  item?.makingPrice,
      purchasePrice:  item?.purchasePrice,
      quantity:  item?.quantity,
      manufacturer:  item?.manufacturer,
      remarks:  item?.remarks,
    }));

    const worksheet = xlsx.utils.json_to_sheet(transformedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "silver");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.status(200).send(excelBuffer);
  } else {
    throw new Error(`No data for report from ${from} to ${to}`);
  }
});