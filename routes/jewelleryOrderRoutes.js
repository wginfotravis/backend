import express from "express";
import {
  cancelJewelleryOrder,
  createJewelleryOrder,
  deleteJewelleryOrder,
  getAllJewelleryOrders,
  getJewelleryOrderById,
  getJewelleryOrderEditedById,
  getJewelleryOrderExcel,
  updateJewelleryOrder,
} from "../controller/jewelleryOrderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createJewelleryOrder).get(getAllJewelleryOrders);
router.route("/getJewelleryOrderExcel").get(getJewelleryOrderExcel);
router
  .route("/:id")
  .get(getJewelleryOrderById)
  .put(updateJewelleryOrder)
router.route("/:id/cancel").post(cancelJewelleryOrder);
router.route("/:id/edited").get(getJewelleryOrderEditedById);
router.route("/:id/deleteOrder").post(deleteJewelleryOrder);

export default router;
