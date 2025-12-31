exports.processRepayment = (invoice, paymentDate) => {
  const notes = [];

  if (paymentDate <= new Date(invoice.dueDate)) {
    invoice.repaymentStatus = "paid";
    notes.push("Repaid on time");
  } else {
    invoice.repaymentStatus = "paid";
    notes.push("Repaid late");
  }

  invoice.repaymentDate = paymentDate;
  return notes;
};

exports.checkDefault = (invoice) => {
  const today = new Date();
  const gracePeriod = 30 * 24 * 60 * 60 * 1000; // 30 days

  if (
    invoice.repaymentStatus === "pending" &&
    today - new Date(invoice.dueDate) > gracePeriod
  ) {
    invoice.repaymentStatus = "defaulted";
    invoice.defaultLoss = invoice.financedAmount;
    return ["Invoice defaulted after grace period"];
  }

  return [];
};
