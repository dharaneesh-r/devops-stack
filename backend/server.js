// IMPORT PACKAGES

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const winston = require("winston");
const client = require("prom-client");

// CONFIGURATIONS

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URL = process.env.MONGODB_URL;

// SECURITY AND MIDDLEWARES

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));

// -------------------------------------
// RATE LIMITING
// -------------------------------------

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
});

// --------------------------------------
// ✅ FIXED: WINSTON LOGGER
// --------------------------------------

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/server.log" }),
  ],
});

// ----------------------------------
// PROMETHEUS MONITORING
// ----------------------------------

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_request_total",
  help: "Total Number HTTP requests",
  labelNames: ["method", "route", "status"],
});

// MIDDLEWARE FOR TRACKING REQUESTS

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.originalUrl,
      status: res.statusCode,
    });
  });
  next();
});

// METRICS ENDPOINT FOR PROMETHEUS

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// DATABASE CONNECTION

mongoose
  .connect(MONGODB_URL)
  .then(() => logger.info("MongoDB Connected Successfully"))
  .catch((err) => logger.error("MongoDB Connection Failed:", err.message));

// --------------------------------------
// API ROUTES
// --------------------------------------

app.use("/home", (req, res) => {
  res.status(200).json({
    message: "Welcome to DevOps Backend",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});
app.use("/api", limiter);

// ERROR HANDLING

app.use((err, req, res, next) => {
  logger.error(`${err.stack}`);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ---------------------------
// 🚀 START SERVER
// ---------------------------
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
