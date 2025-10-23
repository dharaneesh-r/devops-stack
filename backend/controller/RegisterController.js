// controllers/registerController.js

const Register = require("../model/RegisterModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ------------------------
// WINSTON LOGGER WITH DAILY ROTATION
// ------------------------

const logger = require("../utils/WinstonLogger");

// ------------------------
// POST REGISTER CONTROLLER
// ------------------------
const postRegister = async (req, res, next) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;

    // Validate required fields
    if (!firstname || !lastname || !email || !phone || !password) {
      logger.warn("Mandatory fields are missing!");
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }

    // Check if user already exists
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      logger.warn(`Email already exists: ${email}`);
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await Register.create({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
    });

    logger.info(`New user registered: ${email}`);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set secure HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send response
    res.status(201).json({
      status: "created",
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    logger.error(`Registration failed: ${err.message}`);
    res.status(400).json({
      status: "failed",
      message: err.message,
      error: err,
    });
    next(err);
  }
};

// GET REGISTERS

const getRegister = async (req, res) => {
  try {
    const data = await Register.find();
    res.status(200).json({
      status: "success",
      message: "Got All the records",
      data,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = { postRegister, getRegister };
