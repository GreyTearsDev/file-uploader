import dotenv from "dotenv";
dotenv.config();
import express from "express";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import http from "http";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const app = express();

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
----------------------- USE MIDDLEWARE FUNCTIONS ------------------------
*/

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  next();
  res.send("hello");
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
