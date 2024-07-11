import multer from "multer";
import xlsx from "xlsx";
import JewelleryInventory from "../models/jewelleryInventoryModel.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create a function to validate file types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only Excel files are allowed."), false);
  }
};

const upload = multer({ storage, fileFilter }).single("recfile");

const uploadJewelleryExcel = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const filePath = req.file.path;

    // Read the uploaded Excel file
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    const jsonDataWithPrice = [];
    jsonData.forEach((data) => {
      const weight = data?.weight || 0;
      const rate = data?.rate || 0;
      const makingCharge = data?.makingCharge || 0;
      const stonePrice = data?.stonePrice || 0;
      const jartiWaste = data?.jartiWeight || 0;
      const percentage = (Number(weight) / 100) * Number(jartiWaste);
      const rateWithWeight =
        Number(rate) * (Number(weight) + Number(percentage));
      const purchasePrice =
        Number(rateWithWeight) + Number(makingCharge) + Number(stonePrice);

      jsonDataWithPrice.push({
        ...data,
        purchasePrice: purchasePrice.toFixed(3),
      });
    });

    // console.log(jsonDataWithPrice);
    // Insert data into the database
    JewelleryInventory.insertMany(jsonDataWithPrice)
      .then(() => {
        res.status(200).json({ message: "Excel data uploaded successfully" });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });
};

export { uploadJewelleryExcel };
