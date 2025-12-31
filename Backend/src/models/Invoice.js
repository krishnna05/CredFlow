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
