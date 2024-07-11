import express from "express";

import { uploadJewelleryExcel } from "../controller/jewelleryUploadController.js";
import { uploadSilverExcel } from "../controller/silverUploadController.js";
import { uploadWatchExcel } from "../controller/watchUploadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/watch", uploadWatchExcel);
router.post("/jewellery", uploadJewelleryExcel);
router.post("/silver", uploadSilverExcel);

export default router;
