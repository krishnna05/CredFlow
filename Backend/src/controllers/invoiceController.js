const Invoice = require("../models/Invoice");
const Business = require("../models/Business");
const { validateInvoice } = require("../services/invoiceValidationService");
const {
  calculateCreditScore,
} = require("../services/creditScoringService");
const {
  classifyRisk,
} = require("../services/riskClassificationService");




exports.uploadInvoice = async (req, res) => {
  const business = await Business.findOne({
    userId: req.user.userId,
  });

  if (!business) {
    return res
      .status(400)
      .json({ message: "Business profile required" });
  }

  const invoice = await Invoice.create({
    businessId: business._id,
    invoiceNumber: req.body.invoiceNumber,
    buyerName: req.body.buyerName,
    invoiceAmount: req.body.invoiceAmount,
    issueDate: req.body.issueDate,
    dueDate: req.body.dueDate,
    pdfUrl: req.file.path,
  });

  const validation = validateInvoice(invoice, business);

  invoice.validationStatus = validation.isValid ? "valid" : "invalid";
  invoice.validationNotes = validation.errors;

  await invoice.save();

  const scoring = calculateCreditScore(invoice, business);

  invoice.creditScore = scoring.score;
  invoice.creditGrade = scoring.grade;
  invoice.scoreNotes = scoring.notes;

  await invoice.save();

  const risk = classifyRisk(invoice, business);

  invoice.riskLevel = risk.riskLevel;
  invoice.riskNotes = risk.notes;

  await invoice.save();

  res.status(201).json(invoice);
};

exports.getInvoices = async (req, res) => {
  const business = await Business.findOne({
    userId: req.user.userId,
  });

  const invoices = await Invoice.find({
    businessId: business._id,
  }).sort({ createdAt: -1 });

  res.json(invoices);
};
