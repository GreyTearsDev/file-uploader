import { CustomErrors } from "../util/customErrorHandler.mjs";
import { body, validationResult } from "express-validator";
import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import { db } from "../db/db.mjs";

function log_in_get(req, res, next) {
  const userIsLoggedIn = res.locals.currentUser ? true : false;
  if (userIsLoggedIn) return next(CustomErrors.alreadyLoggedIn());

  res.render("login_form", { title: "Log in", errors: undefined, user: undefined});
}

const log_in_post = [
  body("username", "Invalid username").trim().notEmpty().escape(),
  body("password", "Invalid password").trim().notEmpty().escape(),

  expressAsyncHandler(async (req, res, next) => {
    const userIsLoggedIn = res.locals.currentUser ? true : false;
    if (userIsLoggedIn) return next(CustomErrors.alreadyLoggedIn());

    const errors = validationResult(req);
    const userInfo = {
      username: req.body.username || "",
      password: req.body.password || "",
    };

    if (!errors.isEmpty()) {
      res.render("login_form", {
        title: "Log in",
        errors: errors,
        user: userInfo,
      });
      return next();
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        // Handle unexpected errors
        return res.render("login_form", {
          title: "Oops... Something went wrong!",
          user: userInfo,
          errors: [{ msg: "An unexpected error occurred. Please try again." }],
        });
      }

      if (!user) {
        // Handle authentication errors
        return res.render("login_form", {
          title: "Oops... Something went wrong!",
          user: userInfo,
          errors: [{ msg: info.message || "Authentication failed." }],
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          // Handle login errors
          return res.render("login_form", {
            title: "Oops... Something went wrong!",
            user: userInfo,
            errors: [
              { msg: "An unexpected error occurred. Please try again later." },
            ],
          });
        }

        res.redirect("/");
      });
    })(req, res, next);
  }),
];


// handler for logging the user out
function log_out_get(req, res, next) {
  const userIsLoggedIn = res.locals.currentUser ? true : false;
  if (!userIsLoggedIn) return next(Error.notLoggedIn());

  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
}

function sign_up_get(req, res, next) {
  const newUserInfo = {
    username: req.body.username || "",
    password: req.body.password || "",
  };

  const userIsLoggedIn = res.locals.currentUser ? true : false;
  if (userIsLoggedIn) return next(CustomErrors.alreadyLoggedIn());

  return res.render("signup_form", {
    title: "Sign Up",
    user: newUserInfo,
    errors: undefined,
  });
}

// handler for validating and adding user to the datatbase
const sign_up_post = [
  body("username", "You must create a username").trim().notEmpty().escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("You must add a password")
    .isLength({ min: 3 })
    .withMessage("Passwords should be at least 3 characters long")
    .escape(),
  body("password_confirmation")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords did not match");
      }
      return true;
    }),

  expressAsyncHandler(async (req, res, next) => {
    const userIsLoggedIn = res.locals.currentUser ? true : false;
    if (userIsLoggedIn) return next(CustomErrors.alreadyLoggedIn());

    const errors = validationResult(req);
    const newUserInfo = {
      username: req.body.username || "",
      password: req.body.password || "",
    };

    if (!errors.isEmpty()) {
      return res.render("signup_form", {
        title: "Sign Up",
        user: newUserInfo,
        errors: errors.array(),
      });
    }

    // Check if a user with the same username already exists
    const existingUser =
      (await db.user.getByUsername(newUserInfo.username)) || undefined;

    if (existingUser) {
      const errMessage = `Username '${newUserInfo.username}' is already taken. Try another one.`;
      res.render("signup-form", {
        title: "Sign up",
        errors: [{ msg: errMessage }],
        user: newUserInfo,
      });
      return;
    }

    await db.user.create(newUserInfo);
    res.redirect("/user/log-in");
  }),
];

export const user = {
  log_in_get,
  log_in_post,
  log_out_get,  
  sign_up_get,
  sign_up_post,
};
