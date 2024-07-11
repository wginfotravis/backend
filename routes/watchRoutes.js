import express from "express";
import {
  createWatch,
  deleteMultipleWatches,
  deleteWatch,
  getAllWatch,
  getWatchById,
  getWatchExcel,
  updateWatch,
} from "../controller/watchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createWatch).get(getAllWatch);
router.route("/getWatchrExcel").get(getWatchExcel);
router.route("/deleteMany").post(deleteMultipleWatches);
router.route("/:id").get(getWatchById).put(updateWatch);
router.route("/:id/deleteWatch").post(deleteWatch);
export default router;
