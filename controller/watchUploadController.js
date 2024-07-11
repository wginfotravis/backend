import multer from "multer";
import xlsx from "xlsx";
import Watch from "../models/watchModel.js";

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

const uploadWatchExcel = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const filePath = req.file.path;

    // Read the uploaded Excel file
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Insert data into the database
    Watch.insertMany(jsonData)
      .then(() => {
        res.status(200).json({ message: "Excel data uploaded successfully" });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });
};

export { uploadWatchExcel };
