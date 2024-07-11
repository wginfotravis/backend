import asyncHandler from "express-async-handler";
import xlsx from "xlsx";
import Factory from "../models/factoryModel.js";
import Trash from "../models/trashModel.js";

export const createFactory = asyncHandler(async (req, res) => {
  const { name, address, email, contactPerson, phone, landline } = req.body;

  if (!name || !address) {
    res.status(400);
    throw new Error("All fields are required");
  }

  //   const nameExists = await Factory.findOne({ name }).lean().exec();

  //   if (nameExists) {
  //     res.status(400);
  //     throw new Error("Factory  already exists");
  //   }

  const created = await Factory.create({
    name,
    email,
    address,
    contactPerson,
    phone,
    landline: landline || "",
  });

  if (created) {
    res.status(201);
    res.json({
      _id: created._id,
      name,
      email,
      address,
      contactPerson,
      phone,
      landline,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create Factory");
  }
});

export const getAllFactory = asyncHandler(async (req, res) => {
  const factory = await Factory.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .lean();

  // If no factory
  if (factory) {
    res.status(200).json(factory);
  } else {
    return res.status(400).json({ message: "No factory found" });
  }
});

export const getFactoryById = asyncHandler(async (req, res) => {
  const factory = await Factory.findById(req.params.id);
  if (factory) {
    res.json(factory);
  } else {
    res.status(404);
    throw new Error("Factory not found");
  }
});

export const updateFactory = asyncHandler(async (req, res) => {
  const factory = await Factory.findById(req.params.id);

  if (factory) {
    factory.name = req.body.name || factory.name;
    factory.email = req.body.email || factory.email;
    factory.phone = req.body.phone || factory.phone;
    factory.address = req.body.address || factory.address;
    factory.landline = req.body.landline || factory.landline;
    factory.contactPerson = req.body.contactPerson || factory.contactPerson;

    const updatedFactory = await factory.save();

    res.json({
      _id: updatedFactory._id,
      name: updatedFactory.name,
      email: updatedFactory.email,
      phone: updatedFactory.phone,
      address: updatedFactory.address,
      landline: updatedFactory.landline,
      contactPerson: updatedFactory.contactPerson,
    });
  } else {
    res.status(401);
    throw new Error("factory not found");
  }
});

export const getFactoryList = asyncHandler(async (req, res) => {
  const factory = await Factory.find({ active: true }).select("name").lean();
  res.json(factory);
});

export const deleteFactory = async (req, res) => {
  const { id } = req.params;
  const userDetails = req.body

  // Does the user exist to delete?
  const factory = await Factory.findById(id);

  if (!factory) {
    res.status(400);
    throw new Error("factory not found");
  }

  factory.isDeleted = true;
  factory.deletedDate = new Date()

  const success = await factory.save()

  if(success){
    await Trash.create({
      user: userDetails.fullName,
      deletedAt: new Date(),
      heading: "Factory",
      headingId: id,
      name: factory.name
    })
  }

  const reply = `deleted`;

  res.json(reply);
};

export const deleteMultipleFactory = asyncHandler(async (req, res) => {
  const  {ids, user}  = req.body;
  const factoryIds = ids.map((item) => item.id);

  const result = await Factory.updateMany(
    { _id: { $in: [...factoryIds] } },
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
      heading: "Factory",
      headingId: id.id,
      name: id.name, 
    }));

    await Trash.insertMany(trashRecords);
    
    res.json({ message: `${result.deletedCount} factory deleted successfully` });
  } else {
    res.status(404).json({ message: 'No factory found with the provided IDs' });
  }
});

export const getFactoryExcel = asyncHandler(async (req, res) => {
  const report = await Factory.find({isDeleted: false});

  // console.log(report);

  if (report.length > 0) {
    const transformedData = report.map((item) => ({
      name: item?.name,
      address: item?.address,
      email: item?.email,
      contactPerson: item?.contactPerson,
      phone: item?.phone,
      landline: item?.landline,
    }));

    const worksheet = xlsx.utils.json_to_sheet(transformedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.status(200).send(excelBuffer);
  } else {
    throw new Error(`No Factory in database`);
  }
});
