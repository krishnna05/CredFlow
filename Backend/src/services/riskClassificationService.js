exports.classifyRisk = (invoice, business) => {
  const notes = [];
  let riskScore = 0;

  // Credit grade
  if (invoice.creditGrade === "A") {
    notes.push("Excellent credit grade");
  } else if (invoice.creditGrade === "B") {
    riskScore += 1;
    notes.push("Moderate credit grade");
  } else {
    riskScore += 3;
    notes.push("Poor credit grade");
  }

  // Exposure risk
  const exposure =
    invoice.invoiceAmount / business.annualRevenue;

  if (exposure > 0.25) {
    riskScore += 3;
    notes.push("High invoice exposure");
  }

  // Payment delay risk
  const days =
    (new Date(invoice.dueDate) - new Date(invoice.issueDate)) /
    (1000 * 60 * 60 * 24);

  if (days > 60) {
    riskScore += 2;
    notes.push("Long payment cycle");
  }

  // Business age risk
  if (business.yearsInOperation < 2) {
    riskScore += 2;
    notes.push("New business");
  }

  // Final risk level
  let riskLevel = "LOW";
  if (riskScore >= 5) riskLevel = "HIGH";
  else if (riskScore >= 3) riskLevel = "MEDIUM";

  return { riskLevel, notes };
};
