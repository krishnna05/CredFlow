const Invoice = require("../models/Invoice");
const Business = require("../models/Business");
const { validateInvoice } = require("../services/invoiceValidationService");
const { calculateCreditScore } = require("../services/creditScoringService");
const { classifyRisk } = require("../services/riskClassificationService");
const { decideFinancing } = require("../services/financingDecisionService");
const { detectFraud } = require("../services/fraudDetectionService");
const { logEvent } = require("../utils/auditLogger");
const { processInvoice } = require("../services/freeOcrInvoiceService");

exports.analyzeInvoice = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded for analysis" });
    }

    console.log(`Processing file: ${req.file.originalname} (${req.file.mimetype})`);

    const extractedData = await processInvoice(req.file.buffer, req.file.mimetype);

    if (!extractedData) {
      throw new Error("Empty data returned from AI service");
    }

    res.json({
      success: true,
      message: "Invoice analyzed successfully",
      data: extractedData
    });

  } catch (error) {
    console.error("Analysis Error:", error.message);
    res.status(500).json({
      message: "Failed to analyze invoice. Please fill details manually.",
      error: error.message
    });
  }
};

exports.uploadInvoice = async (req, res) => {
  try {
    if (!req.files || !req.files.invoicePdf) {
      return res.status(400).json({ message: "Invoice PDF is required" });
    }

    const business = await Business.findOne({ userId: req.user.userId });
    if (!business) {
      return res.status(400).json({ message: "Business profile required" });
    }

    const invoicePdfPath = req.files.invoicePdf[0].path;
    const supportingDocsPaths = req.files.supportingDocs
      ? req.files.supportingDocs.map(f => f.path)
      : [];
    const invoiceData = {
      businessId: business._id,
      invoiceNumber: req.body.invoiceNumber,

      sellerDetails: {
        businessName: business.businessName,
        gstin: business.registrationNumber,
        address: business.address,
        email: req.user.email
      },

      buyerDetails: {
        name: req.body.buyerName,
        gstin: req.body.buyerGstin,
        address: req.body.buyerAddress,
        country: req.body.buyerCountry || 'India',
        phoneNumber: req.body.buyerPhone,
        email: req.body.buyerEmail
      },

      financialDetails: {
        currency: req.body.currency || 'INR',
        subtotal: Number(req.body.subtotal) || 0,
        taxAmount: Number(req.body.taxAmount) || 0,
        totalAmount: Number(req.body.totalAmount)
      },

      issueDate: req.body.issueDate,
      dueDate: req.body.dueDate,
      paymentTerms: req.body.paymentTerms,

      invoiceDetails: {
        category: req.body.category,
        description: req.body.description,
        purchaseOrderNumber: req.body.purchaseOrderNumber
      },

      documents: {
        invoicePdf: invoicePdfPath,
        supportingDocs: supportingDocsPaths
      },

      compliance: {
        isGenuine: req.body.isGenuine === 'true',
        isNotFinanced: req.body.isNotFinanced === 'true',
        termsAccepted: req.body.termsAccepted === 'true'
      }
    };

    const invoice = await Invoice.create(invoiceData);

    const flatInvoiceForValidation = {
      ...invoice.toObject(),
      invoiceAmount: invoice.financialDetails.totalAmount,
      buyerName: invoice.buyerDetails.name
    };

    const validation = validateInvoice(flatInvoiceForValidation, business);
    invoice.validationStatus = validation.isValid ? "valid" : "invalid";
    invoice.validationNotes = validation.errors;

    if (validation.isValid) {
      const scoring = calculateCreditScore(flatInvoiceForValidation, business);
      invoice.creditScore = scoring.score;
      invoice.creditGrade = scoring.grade;
      invoice.scoreNotes = scoring.notes;

      const risk = classifyRisk(flatInvoiceForValidation, business);
      invoice.riskLevel = risk.riskLevel;
      invoice.riskNotes = risk.notes;

      const decision = decideFinancing(flatInvoiceForValidation);
      invoice.financingStatus = decision.status;
      invoice.financedAmount = decision.financedAmount || 0;
      invoice.platformFee = decision.platformFee || 0;
      invoice.decisionNotes = decision.notes;

      const fraud = await detectFraud(flatInvoiceForValidation, business);
      if (fraud.isFraud) {
        invoice.fraudStatus = "suspected";
        invoice.fraudNotes = fraud.notes;
        invoice.financingStatus = "rejected";
        invoice.decisionNotes.push("Rejected due to fraud suspicion");
      }
    } else {
      invoice.financingStatus = "rejected";
      invoice.decisionNotes.push("Invoice failed validation checks");
    }

    await invoice.save();

    await logEvent({
      userId: req.user.userId,
      action: "INVOICE_UPLOADED",
      entityType: "invoice",
      entityId: invoice._id,
      message: `Invoice ${invoice.invoiceNumber} uploaded`,
    });

    res.status(201).json(invoice);

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error processing invoice" });
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