import express from "express";
const router = express.Router();
import { user } from "../controllers/userController.mjs";

router.get("/log-in", user.log_in);

export const userRouter = router;
