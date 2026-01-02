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
  try {
    const business = await Business.findOne({
      userId: req.user.userId,
    });

    if (!business) {
      return res
        .status(400)
        .json({ message: "Business profile required" });
    }

    // 1. Create Initial Invoice Record
    const invoice = await Invoice.create({
      businessId: business._id,
      invoiceNumber: req.body.invoiceNumber,
      buyerName: req.body.buyerName,
      invoiceAmount: req.body.invoiceAmount,
      issueDate: req.body.issueDate,
      dueDate: req.body.dueDate,
      pdfUrl: req.file ? req.file.path : "demo_url.pdf", // Handle file path safely
    });

    await logEvent({
      userId: req.user.userId,
      action: "INVOICE_UPLOADED",
      entityType: "invoice",
      entityId: invoice._id,
      message: "Invoice uploaded by business",
    });

    // 2. 🚨 FRAUD EVALUATION (First Step)
    const fraudResult = await detectFraud(invoice, business);
    
    invoice.fraudStatus = fraudResult.status;
    invoice.fraudNotes = fraudResult.notes;

    if (fraudResult.status === "fraud" || fraudResult.status === "flagged") {
      // STOP HERE: Block financing
      invoice.financingStatus = "blocked";
      invoice.status = "blocked";
      invoice.decisionNotes = ["Blocked due to fraud/suspicious activity"];
      
      await invoice.save();

      // Log the Block
      await logEvent({
        userId: req.user.userId,
        action: "FRAUD_BLOCKED",
        entityType: "invoice",
        entityId: invoice._id,
        message: `Blocked: ${fraudResult.notes.join(", ")}`,
      });

      return res.status(201).json(invoice); // Return early
    }

    // 3. Validation (If not fraud)
    const validation = validateInvoice(invoice, business);
    invoice.validationStatus = validation.isValid ? "valid" : "invalid";
    invoice.validationNotes = validation.errors;

    if (!validation.isValid) {
      invoice.financingStatus = "rejected";
      invoice.decisionNotes = ["Invoice validation failed"];
      await invoice.save();
      return res.status(201).json(invoice);
    }

    // 4. Credit Scoring
    const scoring = calculateCreditScore(invoice, business);
    invoice.creditScore = scoring.score;
    invoice.creditGrade = scoring.grade;
    invoice.scoreNotes = scoring.notes;

    // 5. 🧠 RISK CLASSIFICATION (Second Step)
    const risk = classifyRisk(invoice, business);
    invoice.riskLevel = risk.riskLevel;
    invoice.riskNotes = risk.notes;

    // 6. Financing Decision (Based on Risk)
    const decision = decideFinancing(invoice);
    invoice.financingStatus = decision.status;
    invoice.financedAmount = decision.financedAmount || 0;
    invoice.platformFee = decision.platformFee || 0;
    invoice.decisionNotes = decision.notes;

    // Final Save
    await invoice.save();

    // Notifications
    if (invoice.financingStatus === "approved") {
      await sendNotification({
        userId: req.user.userId,
        title: "Financing Approved",
        message: `₹${invoice.financedAmount} eligible for invoice ${invoice.invoiceNumber}`,
      });
    }

    res.status(201).json(invoice);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during upload" });
  }
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