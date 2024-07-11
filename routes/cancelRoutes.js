import express from "express";
import { getAllCancelOrder } from "../controller/cancellController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllCancelOrder);

export default router;
