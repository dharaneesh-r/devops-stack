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
require("winston-daily-rotate-file"); // daily log rotation
const client = require("prom-client");

// CONFIGURATIONS
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URL = process.env.MONGODB_URL;

// --------------------------------------
// WINSTON LOGGER WITH DAILY ROTATION
// --------------------------------------

const logger = require("./utils/WinstonLogger");
const RegisterRouter = require("./views/RegisterView");
const ProductRouter = require("./views/ProductView");

// --------------------------------------
// MIDDLEWARES
// --------------------------------------
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));

// -------------------------------------
// RATE LIMITING
// -------------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests, please try again later",
});
app.use("/api", limiter);
// ----------------------------------
// PROMETHEUS MONITORING
// ----------------------------------
client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_request_total",
  help: "Total Number HTTP requests",
  labelNames: ["method", "route", "status"],
});

// track requests
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

// metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// ----------------------------------
// DATABASE CONNECTION
// ----------------------------------
mongoose
  .connect(MONGODB_URL)
  .then(() => logger.info("MongoDB Connected Successfully"))
  .catch((err) => logger.error("MongoDB Connection Failed:", err.message));

// ----------------------------------
// API ROUTES
// ----------------------------------

// MAIN ROUTE
app.get("/home", (req, res) => {
  logger.info("Home route accessed");
  res.status(200).json({
    message: "Welcome to DevOps Backend",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// REGISTER API ROUTE
app.use("/", RegisterRouter);
app.use("/", ProductRouter)

// ----------------------------------
// GLOBAL ERROR HANDLER
// ----------------------------------
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ----------------------------------
// START SERVER
// ----------------------------------
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
