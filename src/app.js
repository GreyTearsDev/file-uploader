import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
const app = express();
import http from "http";

app.use((req, res, next) => {
  res.send("hello");
  next();
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
