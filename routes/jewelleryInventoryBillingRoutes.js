import express from "express";
import {
  createJewelleryOrderBilling,
  deleteJewelleryInventoryBilling,
  getAllJewelleryInventoryBilling,
  getJewelleryInventoryBillingByCustomerId,
  getJewelleryInventoryBillingById,
  updateJewelleryInventoryBilling,
} from "../controller/jewelleryInventoryBillingController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(createJewelleryOrderBilling)
  .get(getAllJewelleryInventoryBilling);
router
  .route("/:id")
  .get(getJewelleryInventoryBillingById)
  .put(updateJewelleryInventoryBilling)
  .post(deleteJewelleryInventoryBilling);
router.route("/:id/customer").get(getJewelleryInventoryBillingByCustomerId);

export default router;
