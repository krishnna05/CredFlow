const Invoice = require("../models/Invoice");

exports.detectFraud = async (invoice, business) => {
  const notes = [];

  // Rule 1: Same buyer repetition
  const sameBuyerCount = await Invoice.countDocuments({
    businessId: business._id,
    buyerName: invoice.buyerName,
  });

  if (sameBuyerCount >= 3) {
    notes.push("Repeated invoices to same buyer");
  }

  // Rule 2: Sudden invoice spike
  if (invoice.invoiceAmount > business.annualRevenue * 0.4) {
    notes.push("Unusually large invoice compared to revenue");
  }

  // Rule 3: New business + large invoice
  if (
    business.yearsInOperation < 1 &&
    invoice.invoiceAmount > 1000000
  ) {
    notes.push("Large invoice from very new business");
  }

  // Rule 4: Too many invoices in short time
  const recentInvoices = await Invoice.countDocuments({
    businessId: business._id,
    createdAt: {
      $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  if (recentInvoices >= 5) {
    notes.push("High invoice submission frequency");
  }

  return {
    isFraud: notes.length > 0,
    notes,
  };
};
