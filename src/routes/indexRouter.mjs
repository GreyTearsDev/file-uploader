import express from "express";
const router = express.Router();
import { home } from "../controllers/indexController.mjs";

router.get("/", (req, res, next) => {
  res.redirect("/home");
});

router.get("/home", home.get);

export const indexRouter = router;
