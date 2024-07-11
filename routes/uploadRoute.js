import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Define storage for the uploaded files
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
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error(
      "Invalid file type. Only JPEG, PNG, and PDF files are allowed."
    );
    error.code = "LIMIT_FILE_TYPES";
    return cb(error, false);
  }
  cb(null, true);
};

// Initialize multer with storage and validation functions
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // limits: { fileSize: 2 * 1024 * 1024 }, //2MB
});

// router.post("/", upload.single("image"), (req, res) => {
//   res.send(`/${req.file.path}`);
// });

router.post("/", upload.single("image"), async (req, res) => {
  const filePath = req.file.path;
  const resizedFilePath = path.join(
    path.dirname(filePath),
    `resized-${Date.now()}-${req.file.originalname}`
  );

  try {
    // Resize the image using sharp module
    // await sharp(filePath).resize({ width: 600 }).toFile(resizedFilePath);

    res.send(`/${resizedFilePath}`);
  } catch (error) {
    // Handle any errors that occur during resizing or saving the file
    res.status(500).send("Error processing the file.");
  }
});

export default router;
