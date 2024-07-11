import express from "express";
import {
  getBarOrderExcel,
  getBarOrderInventoryReport,
  getJewelleryInventoryExcel,
  getJewelleryInventoryReport,
  getJewelleryOrderExcel,
  getJewelleryOrderInventoryReport,
  getSilverExcel,
  getSilverInventoryReport,
  getWatchExcel,
  getWatchInventoryReport,
} from "../controller/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/getJewelleryInventoryReport").get(getJewelleryInventoryReport);
router.route("/getWatchInventoryReport").get(getWatchInventoryReport);
router.route("/getSilverInventoryReport").get(getSilverInventoryReport);
router
  .route("/getJewelleryOrderInventoryReport")
  .get(getJewelleryOrderInventoryReport);
router.route("/getBarOrderInventoryReport").get(getBarOrderInventoryReport);
router
  .route("/excel/getJewelleryInventoryExcel")
  .get(getJewelleryInventoryExcel);

router.route("/excel/getWatchExcel").get(getWatchExcel);
router.route("/excel/getSilverExcel").get(getSilverExcel);
router.route("/excel/getJewelleryOrderExcel").get(getJewelleryOrderExcel);
router.route("/excel/getBarOrderExcel").get(getBarOrderExcel);

export default router;
