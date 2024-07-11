import express from "express";
import {
  createArya,
  getAllArya,
  getAryaById,
  updateArya,
} from "../controller/aryaController.js";

const router = express.Router();

router.route("/").post(createArya).get(getAllArya);
router.route("/:id").get(getAryaById).put(updateArya);

export default router;
