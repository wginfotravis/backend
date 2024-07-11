import express from "express";
import {
  createSilver,
  deleteMultipleSilver,
  deleteSilver,
  getAllSilver,
  getSilverById,
  getSilverExcel,
  updateSilver,
} from "../controller/silverController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createSilver).get(getAllSilver);
router.route("/getSilverExcel").get(getSilverExcel);
router.route("/deleteMany").post(deleteMultipleSilver);
router.route("/:id").get(getSilverById).put(updateSilver);
router.route("/:id/deleteSilver").post(deleteSilver);

export default router;
