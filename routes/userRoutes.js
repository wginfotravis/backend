import express from "express";
import {
  changePassword,
  createUser,
  deleteMultipleUsers,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createUser).get(getAllUsers);
router.route("/deleteMany").post(deleteMultipleUsers);
router.route("/:id").get(getUserById).put(updateUser);
router.route("/:id/deleteUser").post(deleteUser);
router.route("/:id/changePassword").post(changePassword);


export default router;
