const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
    },

    buyerName: {
      type: String,
      required: true,
    },

    invoiceAmount: {
      type: Number,
      required: true,
    },

    issueDate: {
      type: Date,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    pdfUrl: {
      type: String,
      required: true,
    },

    validationStatus: {
      type: String,
      enum: ["pending", "valid", "invalid"],
      default: "pending",
    },

    validationNotes: {
      type: [String],
    },

    creditScore: {
      type: Number,
    },

    creditGrade: {
      type: String,
      enum: ["A", "B", "C", "D"],
    },

    scoreNotes: {
      type: [String],
    },

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
    },

    riskNotes: {
      type: [String],
    },

    financingStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    financedAmount: {
      type: Number,
    },

    platformFee: {
      type: Number,
    },

    decisionNotes: {
      type: [String],
    },

    repaymentStatus: {
      type: String,
      enum: ["pending", "paid", "overdue", "defaulted"],
      default: "pending",
    },

    repaymentDate: {
      type: Date,
    },

    defaultLoss: {
      type: Number,
    },

    fraudStatus: {
      type: String,
      enum: ["clean", "suspected"],
      default: "clean",
    },

    fraudNotes: {
      type: [String],
    },

    status: {
      type: String,
      enum: [
        "uploaded",
        "validated",
        "financed",
        "repaid",
        "defaulted",
      ],
      default: "uploaded",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
