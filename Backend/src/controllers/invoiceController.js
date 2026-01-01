const Invoice = require("../models/Invoice");
const Business = require("../models/Business");
const { validateInvoice } = require("../services/invoiceValidationService");
const {
  calculateCreditScore,
} = require("../services/creditScoringService");
const {
  classifyRisk,
} = require("../services/riskClassificationService");
const {
  decideFinancing,
} = require("../services/financingDecisionService");
const {
  detectFraud,
} = require("../services/fraudDetectionService");

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

  const decision = decideFinancing(invoice);

  invoice.financingStatus = decision.status;
  invoice.financedAmount = decision.financedAmount || 0;
  invoice.platformFee = decision.platformFee || 0;
  invoice.decisionNotes = decision.notes;

  await invoice.save();

  const fraud = await detectFraud(invoice, business);

if (fraud.isFraud) {
  invoice.fraudStatus = "suspected";
  invoice.fraudNotes = fraud.notes;

  // Override financing if fraud detected
  invoice.financingStatus = "rejected";
  invoice.decisionNotes.push("Rejected due to fraud suspicion");
}

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
