exports.explainInvoiceDecision = (invoice) => {
  let explanation = [];

  explanation.push(
    `Invoice ${invoice.invoiceNumber} analysis summary:`
  );

  // Validation
  if (invoice.validationStatus === "invalid") {
    explanation.push(
      "The invoice was rejected because it failed validation checks."
    );
    invoice.validationNotes.forEach((n) =>
      explanation.push(`• ${n}`)
    );
    return explanation;
  }

  // Fraud
  if (invoice.fraudStatus === "suspected") {
    explanation.push(
      "The invoice was flagged as potentially fraudulent."
    );
    invoice.fraudNotes.forEach((n) =>
      explanation.push(`• ${n}`)
    );
    return explanation;
  }

  // Credit score
  explanation.push(
    `Credit Score: ${invoice.creditScore} (Grade ${invoice.creditGrade})`
  );
  invoice.scoreNotes.forEach((n) =>
    explanation.push(`• ${n}`)
  );

  // Risk
  explanation.push(`Risk Level: ${invoice.riskLevel}`);
  invoice.riskNotes.forEach((n) =>
    explanation.push(`• ${n}`)
  );

  // Financing decision
  if (invoice.financingStatus === "approved") {
    explanation.push(
      `Financing approved for ₹${invoice.financedAmount}.`
    );
    explanation.push(
      `Platform fee charged: ₹${invoice.platformFee}.`
    );
  } else {
    explanation.push("Financing was rejected.");
  }

  invoice.decisionNotes.forEach((n) =>
    explanation.push(`• ${n}`)
  );

  return explanation;
};
