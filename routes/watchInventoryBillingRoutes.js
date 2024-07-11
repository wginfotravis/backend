import express from "express";

import {
  createWatchBilling,
  deleteWatchInventoryBilling,
  getAllWatchInventoryBilling,
  getWatchInventoryBillingByCustomerId,
  getWatchInventoryBillingById,
  updateWatchInventoryBilling,
} from "../controller/watchInventoryBillingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createWatchBilling).get(getAllWatchInventoryBilling);
router
  .route("/:id")
  .get(getWatchInventoryBillingById)
  .put(updateWatchInventoryBilling)
  .post(deleteWatchInventoryBilling);
router.route("/:id/customer").get(getWatchInventoryBillingByCustomerId);

export default router;
