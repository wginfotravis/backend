import express from "express";

import {
  createEmail,
  deleteEmail,
  getEmail,
  getEmailById,
  updateEmail,
} from "../controller/emailController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getEmail).post(createEmail);
router.route("/:id").get(getEmailById).put(updateEmail).delete(deleteEmail);

export default router;
