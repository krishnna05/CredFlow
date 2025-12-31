exports.calculateCreditScore = (invoice, business) => {
  const notes = [];
  let score = 50;

  // Hard stop
  if (invoice.validationStatus !== "valid") {
    return {
      score: 0,
      grade: "D",
      notes: ["Invoice is invalid"],
    };
  }

  // Business age
  if (business.yearsInOperation >= 5) {
    score += 15;
    notes.push("Established business (+15)");
  } else if (business.yearsInOperation >= 2) {
    score += 10;
    notes.push("Moderately established business (+10)");
  } else {
    score += 5;
    notes.push("New business (+5)");
  }

  // Revenue
  if (business.annualRevenue >= 10000000) {
    score += 20;
    notes.push("High annual revenue (+20)");
  } else if (business.annualRevenue >= 2500000) {
    score += 10;
    notes.push("Medium annual revenue (+10)");
  } else {
    score += 5;
    notes.push("Low annual revenue (+5)");
  }

  // Exposure
  const exposurePercent =
    (invoice.invoiceAmount / business.annualRevenue) * 100;

  if (exposurePercent <= 10) {
    score += 15;
    notes.push("Low invoice exposure (+15)");
  } else if (exposurePercent <= 30) {
    score += 5;
    notes.push("Moderate invoice exposure (+5)");
  } else {
    score -= 10;
    notes.push("High invoice exposure (-10)");
  }

  // Due period
  const days =
    (new Date(invoice.dueDate) - new Date(invoice.issueDate)) /
    (1000 * 60 * 60 * 24);

  if (days <= 30) {
    score += 10;
    notes.push("Short payment cycle (+10)");
  } else if (days <= 60) {
    score += 5;
    notes.push("Medium payment cycle (+5)");
  } else {
    score -= 5;
    notes.push("Long payment cycle (-5)");
  }

  // Grade mapping
  let grade = "D";
  if (score >= 80) grade = "A";
  else if (score >= 65) grade = "B";
  else if (score >= 50) grade = "C";

  return { score, grade, notes };
};
