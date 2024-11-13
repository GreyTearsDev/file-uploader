import express from "express";
const router = express.Router();

router.get("/", (req, res, next) => {
  res.redirect("/home");
});

router.get("/home", (req, res, next) => {
  res.render("home", { title: "Horder Heaven" });
  next();
});

export const indexRouter = router;
