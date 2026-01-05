const { validateInvoice } = require('./invoiceValidationService');

describe('Invoice Validation Service', () => {
  const createValidMock = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      invoice: {
        invoiceAmount: 10000,
        issueDate: today.toISOString(),
        dueDate: tomorrow.toISOString(),
      },
      business: {
        annualRevenue: 100000 
      }
    };
  };

  test('should return valid for a perfect invoice', () => {
    const { invoice, business } = createValidMock();
    const result = validateInvoice(invoice, business);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject zero or negative amounts', () => {
    const { invoice, business } = createValidMock();
    invoice.invoiceAmount = 0;
    
    const result = validateInvoice(invoice, business);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Invoice amount must be greater than zero");
  });

  test('should reject if due date is before issue date', () => {
    const { invoice, business } = createValidMock();
    invoice.issueDate = invoice.dueDate; 
    invoice.dueDate = new Date().toISOString(); 

    const result = validateInvoice(invoice, business);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Due date must be after issue date");
  });

  test('should reject if invoice exceeds 30% of annual revenue', () => {
    const { invoice, business } = createValidMock();
    business.annualRevenue = 100000;
    invoice.invoiceAmount = 35000;
    
    const result = validateInvoice(invoice, business);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Invoice amount exceeds 30% of annual revenue");
  });

  test('should reject amounts over the platform limit (5M)', () => {
    const { invoice, business } = createValidMock();
    business.annualRevenue = 100000000; 
    invoice.invoiceAmount = 5000001; 
    
    const result = validateInvoice(invoice, business);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Invoice amount exceeds platform limit");
  });
});