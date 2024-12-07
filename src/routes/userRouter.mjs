import express from "express";
const router = express.Router();
import { user } from "../controllers/userController.mjs";

router.get("/log-in", user.log_in_get);
router.post("/log-in", user.log_in_post);

router.get("/log-out", user.log_out_get);

router.get("/sign-up", user.sign_up_get);
router.post("/sign-up", user.sign_up_post);

export const userRouter = router;
