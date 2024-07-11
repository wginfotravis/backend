import express from "express";

import {
  getCurrency,
  updateCurrency,
} from "../controller/currencyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getCurrency);
router.route("/:id").put(updateCurrency);

export default router;
