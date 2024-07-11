import express from "express";

import { getLogo, updateLogo } from "../controller/logoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// we dont need post for logo
// router.route("/").get(getLogo).post(createLogo);
router.route("/").get(getLogo);
router.route("/:id").put(protect, updateLogo);

export default router;
