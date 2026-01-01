const Invoice = require("../models/Invoice");
const {
  explainInvoiceDecision,
} = require("../services/aiAssistantService");

exports.explainInvoice = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  const explanation = explainInvoiceDecision(invoice);

  res.json({ explanation });
};
