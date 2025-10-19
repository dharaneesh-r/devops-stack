// PACKAGES
const mongoose = require("mongoose");
const { isStrongPassword, isEmail } = require("validator");

// SCHEMA FOR MONGODB REGISTER PAGE
const registerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true,
    required: true,
  },
  lastname: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    validate: {
      validator: isEmail,
      message: "Invalid email format",
    },
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    maxLength: 10,
    minLength: 10,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: isStrongPassword,
      message: "Password should be strong!",
    },
  },
});

// EXPORT MODEL
const Register = mongoose.model("Register", registerSchema);

module.exports = Register;
