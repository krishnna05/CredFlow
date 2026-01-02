const Invoice = require("../models/Invoice");

exports.detectFraud = async (invoice, business) => {
  const notes = [];
  let status = "clean"; // clean, flagged, fraud

  // --- 🔴 FRAUD SIGNALS (Block Immediately) ---

  // Signal 1: Duplicate Invoice Number (Intentional Manipulation)
  const duplicateCheck = await Invoice.findOne({
    businessId: business._id,
    invoiceNumber: invoice.invoiceNumber,
    _id: { $ne: invoice._id } // Exclude current invoice if it's already saved
  });

  if (duplicateCheck) {
    status = "fraud";
    notes.push("Duplicate invoice number detected");
  }

  // --- 🟡 FLAGGED SIGNALS (Suspicious Behavior) ---

  // Signal 2: Abnormal Spike (Invoice > 40% of Annual Revenue)
  // Only flag if it's not already fraud
  if (status !== "fraud") {
    if (invoice.invoiceAmount > business.annualRevenue * 0.4) {
      status = "flagged";
      notes.push("Abnormal invoice amount spike (>40% revenue)");
    }
  }

  // Signal 3: High Frequency (Too many invoices in 24 hours)
  if (status !== "fraud") {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCount = await Invoice.countDocuments({
      businessId: business._id,
      createdAt: { $gte: oneDayAgo },
    });

    if (recentCount >= 5) { // Threshold: 5 invoices in 1 day
      status = "flagged";
      notes.push("High upload frequency detected (5+ in 24h)");
    }
  }

  // Signal 4: Repeated Client Patterns (Same buyer > 3 times is suspicious if rapid)
  // This is a softer signal, usually Risk, but per your request, we flag it.
  if (status === "clean") {
     const sameBuyerCount = await Invoice.countDocuments({
      businessId: business._id,
      buyerName: invoice.buyerName,
    });
    
    // If a new business (less than 1 year) has many invoices to same buyer
    if (business.yearsInOperation < 1 && sameBuyerCount >= 3) {
        status = "flagged";
        notes.push("Repeated client pattern for new business");
    }
  }

  return {
    status, // "clean", "flagged", "fraud"
    isFraud: status === "fraud", // For backward compatibility if needed
    notes,
  };
};