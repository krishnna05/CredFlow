const Invoice = require("../models/Invoice");

exports.getPortfolio = async (req, res) => {
  const invoices = await Invoice.find().populate(
    "businessId",
    "businessName"
  );

  res.json(invoices);
};
