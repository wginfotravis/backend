import express from "express";

import {
  getDashBoardCount,
  getTasks,
  getTotalSales,
} from "../controller/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.use(protect);

router.route("/count").get(getDashBoardCount);
router.route("/sales").get(getTotalSales);
router.route("/tasks").get(getTasks);

export default router;
