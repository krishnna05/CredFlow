const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiry } = require("../config/jwt");

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    jwtSecret,
    { expiresIn: jwtExpiry }
  );
};

// Register business user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email, and password" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "business",
  });

  res.status(201).json({
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
  });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  const user = await User.findOne({ email });
  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
  });
};