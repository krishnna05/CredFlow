const Invoice = require("../models/Invoice");
const Business = require("../models/Business");
const { validateInvoice } = require("../services/invoiceValidationService");
const { calculateCreditScore } = require("../services/creditScoringService");
const { classifyRisk } = require("../services/riskClassificationService");
const { decideFinancing } = require("../services/financingDecisionService");
const { detectFraud } = require("../services/fraudDetectionService");
const { logEvent } = require("../utils/auditLogger");
const { sendNotification } = require("../services/notificationService");
const Notification = require("../models/Notification");

exports.uploadInvoice = async (req, res) => {
  // 1. Validate File Existence
  if (!req.file) {
    return res.status(400).json({ message: "No invoice PDF uploaded" });
  }

  const business = await Business.findOne({
    userId: req.user.userId,
  });

  if (!business) {
    return res.status(400).json({ message: "Business profile required before uploading invoices" });
  }

  // 2. Create Invoice Record
  const invoice = await Invoice.create({
    businessId: business._id,
    invoiceNumber: req.body.invoiceNumber,
    buyerName: req.body.buyerName,
    invoiceAmount: Number(req.body.invoiceAmount), 
    issueDate: req.body.issueDate,
    dueDate: req.body.dueDate,
    pdfUrl: req.file.path,
  });

  // 3. Validation Service
  const validation = validateInvoice(invoice, business);
  invoice.validationStatus = validation.isValid ? "valid" : "invalid";
  invoice.validationNotes = validation.errors;
  await invoice.save();

  // 4. Scoring & Risk Analysis
  const scoring = calculateCreditScore(invoice, business);
  invoice.creditScore = scoring.score;
  invoice.creditGrade = scoring.grade;
  invoice.scoreNotes = scoring.notes;
  await invoice.save();

  const risk = classifyRisk(invoice, business);
  invoice.riskLevel = risk.riskLevel;
  invoice.riskNotes = risk.notes;
  await invoice.save();

  // 5. Financing Decision
  const decision = decideFinancing(invoice);
  invoice.financingStatus = decision.status;
  invoice.financedAmount = decision.financedAmount || 0;
  invoice.platformFee = decision.platformFee || 0;
  invoice.decisionNotes = decision.notes;
  await invoice.save();

  // 6. Fraud Detection
  const fraud = await detectFraud(invoice, business);
  if (fraud.isFraud) {
    invoice.fraudStatus = "suspected";
    invoice.fraudNotes = fraud.notes;
    invoice.financingStatus = "rejected";
    invoice.decisionNotes.push("Rejected due to fraud suspicion");
    await invoice.save();
  }

  const auditPromises = [
    logEvent({
      userId: req.user.userId,
      action: "INVOICE_UPLOADED",
      entityType: "invoice",
      entityId: invoice._id,
      message: "Invoice uploaded by business",
    }),
    logEvent({
      userId: req.user.userId,
      action: invoice.financingStatus === "approved" ? "FINANCING_APPROVED" : "FINANCING_REJECTED",
      entityType: "invoice",
      entityId: invoice._id,
      message: invoice.decisionNotes.join(", "),
    }),
    sendNotification({
      userId: req.user.userId,
      title: "Financing Update",
      message: invoice.financingStatus === "approved" 
        ? `₹${invoice.financedAmount} approved for invoice ${invoice.invoiceNumber}`
        : `Financing rejected for invoice ${invoice.invoiceNumber}`,
    })
  ];

  if (fraud.isFraud) {
    auditPromises.push(
      logEvent({
        userId: req.user.userId,
        action: "FRAUD_FLAGGED",
        entityType: "invoice",
        entityId: invoice._id,
        message: invoice.fraudNotes.join(", "),
      })
    );
  }

  await Promise.all(auditPromises);

  res.status(201).json(invoice);
};

exports.getInvoices = async (req, res) => {
  const business = await Business.findOne({
    userId: req.user.userId,
  });

  if (!business) {
    return res.status(400).json({ message: "Business profile required" });
  }

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