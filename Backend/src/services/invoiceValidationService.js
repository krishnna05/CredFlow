exports.validateInvoice = (invoice, business) => {
  const errors = [];

  if (invoice.invoiceAmount <= 0) {
    errors.push("Invoice amount must be greater than zero");
  }

  if (new Date(invoice.dueDate) <= new Date(invoice.issueDate)) {
    errors.push("Due date must be after issue date");
  }

  if (new Date(invoice.dueDate) < new Date()) {
    errors.push("Invoice due date is already past");
  }

  const maxAllowed = business.annualRevenue * 0.3;
  if (invoice.invoiceAmount > maxAllowed) {
    errors.push("Invoice amount exceeds 30% of annual revenue");
  }

  if (invoice.invoiceAmount > 5000000) {
    errors.push("Invoice amount exceeds platform limit");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
