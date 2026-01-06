exports.validateInvoice = (invoice, business) => {
  const errors = [];
  const amount = invoice.financialDetails ? invoice.financialDetails.totalAmount : invoice.invoiceAmount;
  const issueDate = new Date(invoice.issueDate);
  const dueDate = new Date(invoice.dueDate);

  // 1. Basic Amount Checks
  if (!amount || amount <= 0) {
    errors.push("Invoice amount must be greater than zero");
  }

  // 2. Date Logic
  if (dueDate <= issueDate) {
    errors.push("Due date must be after issue date");
  }

  const today = new Date();
  today.setHours(0,0,0,0);
  if (dueDate < today) {
    errors.push("Invoice is already overdue");
  }

  // 3. Tax Logic (Simple sanity check)
  if (invoice.financialDetails) {
     const calcTotal = invoice.financialDetails.subtotal + invoice.financialDetails.taxAmount;
     if (Math.abs(calcTotal - amount) > 1.0) {
         errors.push("Subtotal + Tax does not match Total Amount");
     }
  }

  // 4. Business Rules
  const maxAllowed = business.annualRevenue * 0.3;
  if (amount > maxAllowed) {
    errors.push("Invoice amount exceeds 30% of annual revenue");
  }

  if (amount > 5000000) {
    errors.push("Invoice amount exceeds platform limit");
  }
  
  // 5. Critical Data Presence
  if (invoice.buyerDetails && !invoice.buyerDetails.gstin) {
      errors.push("Buyer GSTIN is required for financing"); 
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};