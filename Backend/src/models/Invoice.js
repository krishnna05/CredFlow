const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    
    invoiceNumber: { type: String, required: true },
    
    sellerDetails: {
      businessName: String,
      gstin: String,
      address: String,
      email: String
    },

    buyerDetails: {
      name: { type: String, required: true },
      gstin: { type: String },
      address: { type: String },
      country: { type: String, default: 'India' },
      phoneNumber: String,
      email: String
    },

    financialDetails: {
      currency: { type: String, default: 'INR', required: true },
      subtotal: { type: Number, required: true },
      taxAmount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },

    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    paymentTerms: { 
      type: String, 
      enum: ['Due on Receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'Custom'],
      default: 'Net 30'
    },

    invoiceDetails: {
      category: { type: String, enum: ['Goods', 'Services', 'Mixed'], default: 'Goods' },
      description: { type: String },
      purchaseOrderNumber: { type: String }
    },

    documents: {
      invoicePdf: { type: String, required: true },
      supportingDocs: [{ type: String }]
    },

    compliance: {
      isGenuine: { type: Boolean, default: false },
      isNotFinanced: { type: Boolean, default: false },
      termsAccepted: { type: Boolean, default: false }
    },

    validationStatus: { type: String, enum: ["pending", "valid", "invalid"], default: "pending" },
    validationNotes: { type: [String] },
    creditScore: { type: Number },
    creditGrade: { type: String, enum: ["A", "B", "C", "D"] },
    scoreNotes: { type: [String] },
    riskLevel: { type: String, enum: ["LOW", "MEDIUM", "HIGH"] },
    riskNotes: { type: [String] },
    financingStatus: { type: String, enum: ["pending", "approved", "rejected", "blocked"], default: "pending" },
    financedAmount: { type: Number },
    platformFee: { type: Number },
    decisionNotes: { type: [String] },
    repaymentStatus: { type: String, enum: ["pending", "paid", "overdue", "defaulted"], default: "pending" },
    repaymentDate: { type: Date },
    defaultLoss: { type: Number },
    fraudStatus: { type: String, enum: ["clean", "flagged", "fraud"], default: "clean" },
    fraudNotes: { type: [String] },
    status: { type: String, enum: ["uploaded", "validated", "financed", "repaid", "defaulted", "blocked"], default: "uploaded" },
  },
  { timestamps: true }
);

invoiceSchema.virtual('invoiceAmount').get(function() {
  return this.financialDetails.totalAmount;
});
invoiceSchema.virtual('buyerName').get(function() {
  return this.buyerDetails.name;
});

module.exports = mongoose.model("Invoice", invoiceSchema);