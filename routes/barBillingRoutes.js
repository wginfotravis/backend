import express from "express";

import {
  createBarBilling,
  deleteBarBilling,
  getAllBarBilling,
  getBarBillingByCustomerId,
  getBarBillingById,
  updateBarBilling,
} from "../controller/barBillingController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.use(protect);

router.route("/").post(createBarBilling).get(getAllBarBilling);
router
  .route("/:id")
  .get(getBarBillingById)
  .put(updateBarBilling)
  .delete(deleteBarBilling);
router.route("/:customer/getBilling").get(getBarBillingByCustomerId);

export default router;
