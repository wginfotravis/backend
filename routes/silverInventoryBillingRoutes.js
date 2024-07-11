import express from "express";

import {
  createSilverBilling,
  deleteSilverBilling,
  getAllSilverInventoryBilling,
  getSilverInventoryBillingByCustomerId,
  getSilvernventoryBillingById,
  updateSilverInventoryBilling,
} from "../controller/SilverInventoryBillingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createSilverBilling).get(getAllSilverInventoryBilling);
router
  .route("/:id")
  .get(getSilvernventoryBillingById)
  .put(updateSilverInventoryBilling)
  .post(deleteSilverBilling);
router.route("/:id/customer").get(getSilverInventoryBillingByCustomerId);

export default router;
