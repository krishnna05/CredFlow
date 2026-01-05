exports.decideFinancing = (invoice) => {
  const notes = [];

  if (invoice.validationStatus !== "valid") {
    return {
      status: "rejected",
      notes: ["Invoice is invalid"],
    };
  }

  if (invoice.riskLevel === "HIGH") {
    return {
      status: "rejected",
      notes: ["High risk invoice"],
    };
  }

  let percentage = 0;

  if (invoice.riskLevel === "LOW") {
    percentage = 0.8;
    notes.push("Low risk invoice (80% financing)");
  } else if (invoice.riskLevel === "MEDIUM") {
    percentage = 0.6;
    notes.push("Medium risk invoice (60% financing)");
  }

  if (invoice.creditGrade === "A") {
    percentage += 0.05;
    notes.push("Excellent credit bonus (+5%)");
  }

  let financedAmount =
    invoice.invoiceAmount * percentage;

  if (financedAmount > 4000000) {
    financedAmount = 4000000;
    notes.push("Capped by platform exposure limit");
  }

  const platformFee = financedAmount * 0.02;

  return {
    status: "approved",
    financedAmount: Number(financedAmount.toFixed(2)),
    platformFee,
    notes,
  };
};
