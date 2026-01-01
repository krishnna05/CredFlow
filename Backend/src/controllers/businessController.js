const Business = require("../models/Business");
   
exports.createProfile = async (req, res) => {
  const existing = await Business.findOne({ userId: req.user.userId });

  if (existing) {
    return res.status(400).json({ message: "Profile already exists" });
  }

  const {
    businessName,
    industry,
    registrationNumber,
    annualRevenue,
    yearsInOperation,
    address
  } = req.body;

  const business = await Business.create({
    userId: req.user.userId,
    businessName,
    industry,
    registrationNumber,
    annualRevenue,
    yearsInOperation,
    address
  });

  res.status(201).json(business);
};

exports.getProfile = async (req, res) => {
  const business = await Business.findOne({ userId: req.user.userId });

  if (!business) {
    return res.status(404).json({ message: "Profile not found" });
  }

  res.json(business);
};