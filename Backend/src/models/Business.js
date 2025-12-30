const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    businessName: {
      type: String,
      required: true,
    },

    industry: {
      type: String,
      required: true,
    },

    registrationNumber: {
      type: String,
      required: true,
    },

    annualRevenue: {
      type: Number,
      required: true,
    },

    yearsInOperation: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
