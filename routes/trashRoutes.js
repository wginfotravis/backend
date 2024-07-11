import express from "express";
import { getAllTrash, recoverMultiple, recoverSingle } from "../controller/trashController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllTrash);
router.route("/:id").get(recoverSingle);
router.route("/revocermultiple").post(recoverMultiple);

export default router;