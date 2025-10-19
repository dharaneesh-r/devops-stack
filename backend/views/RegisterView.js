// routes/registerView.js

const express = require("express");
const RegisterRouter = express.Router();
const cors = require("cors");
const logger = require("../utils/WinstonLogger");
const {
  getRegister,
  postRegister,
} = require("../controller/RegisterController");

RegisterRouter.use(cors());

// GET all users
RegisterRouter.get("/register", async (req, res, next) => {
  try {
    await getRegister(req, res, next);
    logger.info("GET /register called");
  } catch (err) {
    logger.error(`GET /register error: ${err.message}`);
    next(err);
  }
});

// POST new user
RegisterRouter.post("/register", async (req, res, next) => {
  try {
    await postRegister(req, res, next);
    logger.info("POST /register called");
  } catch (err) {
    logger.error(`POST /register error: ${err.message}`);
    next(err);
  }
});

module.exports = RegisterRouter;
