import asyncHandler from "express-async-handler";
import xlsx from "xlsx";
import JewelleryInventory from "../models/jewelleryInventoryModel.js";
import Trash from "../models/trashModel.js";

export const createJewelleryInventory = asyncHandler(async (req, res) => {
  const {
    code,
    name,
    weight,
    karat,
    jartiWaste,
    jartiWeight,
    currencyType,
    rate,
    stonePrice,
    purchasePrice,
    quantity,
    manufacturer,
    makingCharge,
    remarks,
    createdBy,
    editedBy,
    profilePicture,
  } = req.body;

  if (!name || !code || !rate) {
    res.status(400);
    throw new Error("Fill up required fields");
  }

  const codeExists = await JewelleryInventory.findOne({ code }).lean().exec();

  if (codeExists) {
    res.status(400);
    throw new Error("Jewellery code  already exists");
  }

  const created = await JewelleryInventory.create({
    code,
    name,
    weight,
    karat,
    jartiWaste,
    jartiWeight,
    currencyType,
    rate,
    purchasePrice,
    stonePrice,
    quantity,
    manufacturer,
    makingCharge,
    remarks,
    createdBy,
    editedBy,
    profilePicture,
  });

  if (created) {
    res.status(201).json({
      _id: created._id,
      code,
      name,
      weight,
      karat,
      jartiWaste,
      jartiWeight,
      currencyType,
      rate,
      purchasePrice,
      stonePrice,
      quantity,
      manufacturer,
      makingCharge,
      remarks,
      createdBy,
      editedBy,
      profilePicture,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create Jewellery Inventory");
  }
});

export const getAllJewelleryInventory = asyncHandler(async (req, res) => {
  const jewelleryInventory = await JewelleryInventory.find({isDeleted: false})
    .sort({ createdAt: -1 })
    .lean();

  if (jewelleryInventory) {
    res.json(jewelleryInventory);
  } else {
    return res.status(400).json({ message: "No jewellery Inventory found" });
  }
});

export const getAllJewelleryInventoryById = asyncHandler(async (req, res) => {
  const jewelleryInventory = await JewelleryInventory.findById(req.params.id);
  if (jewelleryInventory) {
    res.json(jewelleryInventory);
  } else {
    res.status(404);
    throw new Error("Jewellery Inventory not found");
  }
});

export const updateJewelleryInventory = asyncHandler(async (req, res) => {
  const jewelleryInventory = await JewelleryInventory.findById(req.params.id);

  if (jewelleryInventory) {
    jewelleryInventory.name = req.body.name || jewelleryInventory.name;
    jewelleryInventory.code = req.body.code || jewelleryInventory.code;
    jewelleryInventory.weight = req.body.weight || jewelleryInventory.weight;
    jewelleryInventory.karat = req.body.karat || jewelleryInventory.karat;
    jewelleryInventory.stonePrice =
      req.body.stonePrice || jewelleryInventory.stonePrice;
    jewelleryInventory.jartiWaste =
      req.body.jartiWaste || jewelleryInventory.jartiWaste;
    jewelleryInventory.jartiWeight =
      req.body.jartiWeight || jewelleryInventory.jartiWeight;
    jewelleryInventory.currencyType =
      req.body.currencyType || jewelleryInventory.currencyType;
    jewelleryInventory.rate = req.body.rate || jewelleryInventory.rate;
    jewelleryInventory.purchasePrice =
      req.body.purchasePrice || jewelleryInventory.purchasePrice;
    jewelleryInventory.quantity =
      req.body.quantity || jewelleryInventory.quantity;
    jewelleryInventory.makingCharge =
      req.body.makingCharge || jewelleryInventory.makingCharge;
    jewelleryInventory.remarks = req.body.remarks || jewelleryInventory.remarks;
    jewelleryInventory.editedBy =
      req.body.editedBy || jewelleryInventory.editedBy;
    jewelleryInventory.profilePicture =
      req.body.profilePicture || jewelleryInventory.profilePicture;

    const updatedJewelleryInventory = await jewelleryInventory.save();

    res.json({
      _id: updatedJewelleryInventory._id,
      name: updatedJewelleryInventory.name,
      weight: updatedJewelleryInventory.weight,
      karat: updatedJewelleryInventory.karat,
      stonePrice: updatedJewelleryInventory.stonePrice,
      jartiWaste: updatedJewelleryInventory.jartiWaste,
      jartiWeight: updatedJewelleryInventory.jartiWeight,
      currencyType: updatedJewelleryInventory.currencyType,
      rate: updatedJewelleryInventory.rate,
      purchasePrice: updatedJewelleryInventory.purchasePrice,
      quantity: updatedJewelleryInventory.quantity,
      manufacturer: updatedJewelleryInventory.manufacturer,
      makingCharge: updatedJewelleryInventory.makingCharge,
      remarks: updatedJewelleryInventory.remarks,
      editedBy: updatedJewelleryInventory.editedBy,
      profilePicture: updatedJewelleryInventory.profilePicture,
    });
  } else {
    res.status(401);
    throw new Error("Jewellery not found");
  }
});

export const deleteJewelleryInventory = async (req, res) => {
  const { id } = req.params;
  const userDetails = req.body

  const inventory = await JewelleryInventory.findById(id).exec();

  if (!inventory) {
    res.status(400);
    throw new Error("jewellery not found");
  }

  inventory.isDeleted = true;
  inventory.deletedDate = new Date()

  const success = await inventory.save()

  if(success){
    await Trash.create({
      user: userDetails.fullName,
      deletedAt: new Date(),
      heading: "Jewellery Inventory",
      headingId: id,
      name: inventory.name
    })
  }

  const reply = `deleted`;

  res.json(reply);
};

export const deleteMultipleInventory = asyncHandler(async (req, res) => {
  const  {ids, user}  = req.body;

  const userIds = ids.map((item) => item.id);

  const result = await JewelleryInventory.updateMany(
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
      heading: "Jewellery Inventory",
      headingId: id.id,
      name: id.name, 
    }));

    await Trash.insertMany(trashRecords);
    res.json({ message: `${result.deletedCount} inventory deleted successfully` });
  } else {
    res.status(404).json({ message: 'No inventory found with the provided IDs' });
  }
});

export const getJewelleryInventoryExcel = asyncHandler(async (req, res) => {
  const jewelleryInventory = await JewelleryInventory.find({})
    .sort({ createdAt: -1 })
    .lean();

  if (jewelleryInventory.length > 0) {
    const transformedData = jewelleryInventory.map((item) => ({
      code: item?.code,
      name: item?.name,
      weight: item?.weight,
      karat: item?.karat,
      jartiWaste: item?.jartiWaste,
      jartiWeight: item?.jartiWeight,
      rate: item?.rate,
      stonePrice: item?.stonePrice,
      purchasePrice: item?.purchasePrice,
      quantity: item?.quantity,
      manufacturer :item?.manufacturer,
      makingCharge: item?.makingCharge,
      remarks : item?.remarks,
      createdBy: item?.createdBy?.name,
    }));

    const worksheet = xlsx.utils.json_to_sheet(transformedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "jewelleryInventory");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.status(200).send(excelBuffer);
  } else {
    throw new Error(`No data for report from ${from} to ${to}`);
  }
});