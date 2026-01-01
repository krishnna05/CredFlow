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
const { logEvent } = require("../utils/auditLogger");
const { sendNotification } =
  require("../services/notificationService");
const Notification = require("../models/Notification");

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

  await logEvent({
    userId: req.user.userId,
    action: "INVOICE_UPLOADED",
    entityType: "invoice",
    entityId: invoice._id,
    message: "Invoice uploaded by business",
  });

  await logEvent({
    userId: req.user.userId,
    action:
      invoice.financingStatus === "approved"
        ? "FINANCING_APPROVED"
        : "FINANCING_REJECTED",
    entityType: "invoice",
    entityId: invoice._id,
    message: invoice.decisionNotes.join(", "),
  });

  await logEvent({
    userId: req.user.userId,
    action: "FRAUD_FLAGGED",
    entityType: "invoice",
    entityId: invoice._id,
    message: invoice.fraudNotes.join(", "),
  });

  await logEvent({
    userId: req.user.userId,
    action: "DEFAULT_OCCURRED",
    entityType: "invoice",
    entityId: invoice._id,
    message: "Invoice defaulted after grace period",
  });

  await sendNotification({
    userId: req.user.userId,
    title: "Financing Approved",
    message: `₹${invoice.financedAmount} has been credited for invoice ${invoice.invoiceNumber}`,
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

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user.userId,
  }).sort({ createdAt: -1 });

  res.json(notifications);
};