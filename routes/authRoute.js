import express from "express";
import { authUser } from "../controller/authController.js";

const router = express.Router();

router.post("/", authUser);

export default router;
