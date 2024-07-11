import express from "express";

import {
  cancelBarOrder,
  createBarOrder,
  deleteBarOrder,
  getAllBarOrders,
  getBarOrderById,
  getBarOrderEditedById,
  getBarOrderExcel,
  updateBarOrder,
} from "../controller/barOrderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createBarOrder).get(getAllBarOrders);
router.route("/getBarOrderExcel").get(getBarOrderExcel);
router
  .route("/:id")
  .get(getBarOrderById)
  .put(updateBarOrder)
router.route("/:id/cancel").post(cancelBarOrder);
router.route("/:id/edited").get(getBarOrderEditedById);
router.route("/:id/deleteOrder").post(deleteBarOrder);

export default router;
