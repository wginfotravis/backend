import express from "express";
import {
  createDispatch,
  deleteDispatch,
  getAllDispatch,
  getDispatchById,
  updateDispatch,
} from "../controller/dispatchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createDispatch).get(getAllDispatch);
router
  .route("/:id")
  .get(getDispatchById)
  .put(updateDispatch)
  .post(deleteDispatch);

export default router;
