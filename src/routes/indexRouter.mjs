import express from "express";
const router = express.Router();

router.get("/", (req, res, next) => {
  res.redirect("/home");
});

router.get("/home", (req, res, next) => {
  const userIsLoggedIn = res.locals.currentUser ? true : false;
  res.render("home", { title: "Horder Heaven", user: userIsLoggedIn });
});

export const indexRouter = router;
