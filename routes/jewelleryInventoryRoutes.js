import express from "express";
import {
  createJewelleryInventory,
  deleteJewelleryInventory,
  deleteMultipleInventory,
  getAllJewelleryInventory,
  getAllJewelleryInventoryById,
  getJewelleryInventoryExcel,
  updateJewelleryInventory,
} from "../controller/jewelleryInventoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createJewelleryInventory).get(getAllJewelleryInventory);
router.route("/getJewelleryInventoryExcel").get(getJewelleryInventoryExcel);
router.route("/deleteMany").post(deleteMultipleInventory);
router
  .route("/:id")
  .get(getAllJewelleryInventoryById)
  .put(updateJewelleryInventory)
  router.route("/:id/deleteJewelleryInventory").post(deleteJewelleryInventory);

export default router;
