import dotenv from "dotenv";
dotenv.config();
import express from "express";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import LocalStrategy from "passport-local";
import { CustomErrors } from "./util/customErrorHandler.mjs";
import http from "http";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import expressLayouts from "express-ejs-layouts";
import { indexRouter } from "./routes/indexRouter.mjs";
import { userRouter } from "./routes/userRouter.mjs";
import { db } from "./db/db.mjs";
import bcryptjs from "bcryptjs";
const app = express();
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**----------SET UP EXPRESS-SESSION MIDDLEWARE-----------------*/

// Store user sessions
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

/**
----------------------- SET UP THE VIEW ENGINE------------------------
*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

/**
----------------------- USE MIDDLEWARE FUNCTIONS ------------------------
*/

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.user.getByUsername(username);

      if (!user) return done(null, false, { message: "Incorrect username" });

      const match = await bcryptjs.compare(password, user.password);

      if (!match) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (e) {
      return done(e);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.user.getByID(id);
    done(null, user);
  } catch (e) {
    done(err);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

/**
 *Routes
 */
app.use("/", indexRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  return next(CustomErrors.pageNotFound());
});

// error handler
app.use(function (err, req, res, next) {
  return res.render("error", {
    code: err.status,
    title: err.title,
    message: err.message,
  });
});

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || "3000";
app.set("port", port);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
