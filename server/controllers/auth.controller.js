const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { sendWelcomeEmail } = require("../services/email.service");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0]?.msg || "Invalid input",
      errors: errors.array(),
    });
  }

  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing)
    return res
      .status(400)
      .json({ success: false, message: "Email already registered" });

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  sendWelcomeEmail(user.email, user.name).catch(() => null);

  return res.status(201).json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
  const token = generateToken(user._id);
  return res.json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email },
  });
};

const getMe = async (req, res) => res.json({ success: true, user: req.user });

module.exports = { register, login, getMe };
