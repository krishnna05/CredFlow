const Invoice = require("../models/Invoice");
const {
  processRepayment,
  checkDefault,
} = require("../services/repaymentService");

// Business marks invoice as paid
exports.markPaid = async (req, res) => {
  const { invoiceId, paymentDate } = req.body;

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice || invoice.financingStatus !== "approved") {
    return res.status(400).json({ message: "Invalid invoice" });
  }

  const notes = processRepayment(
    invoice,
    new Date(paymentDate)
  );

  await invoice.save();
  res.json({ message: "Repayment recorded", notes });
};

// Admin checks defaults
exports.checkDefaults = async (req, res) => {
  const invoices = await Invoice.find({
    financingStatus: "approved",
  });

  let updated = [];

  for (let inv of invoices) {
    const notes = checkDefault(inv);
    if (notes.length > 0) {
      await inv.save();
      updated.push({ id: inv._id, notes });
    }
  }

  res.json({ updated });
};
