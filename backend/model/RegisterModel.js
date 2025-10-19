// PACKAGES
const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");
const isMobilePhone = require("validator/lib/isMobilePhone");

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
    validate: {
      validator: (value) => isMobilePhone(value, "any", { strictMode: false }),
      message: "Invalid phone number",
    },
  },
});

// EXPORT MODEL
const Register = mongoose.model("Register", registerSchema);

module.exports = Register;
