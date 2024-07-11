import express from "express";
import {
  createBilling,
  deleteBilling,
  getAllBilling,
  getAllBillingByCustomer,
  getBillingById,
  updateBilling,
} from "../controller/billingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllBilling).post(createBilling);
router
  .route("/:id")
  .get(getBillingById)
  .put(updateBilling)
  .delete(deleteBilling);
router.route("/:customer/getBilling").get(getAllBillingByCustomer);

export default router;
