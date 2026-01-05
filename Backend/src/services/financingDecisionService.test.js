const { decideFinancing } = require('./financingDecisionService');

describe('Financing Decision Service', () => {
  test('should REJECT invalid invoices immediately', () => {
    const invoice = { validationStatus: 'invalid' };
    const result = decideFinancing(invoice);
    
    expect(result.status).toBe('rejected');
    expect(result.notes).toContain('Invoice is invalid');
  });

  test('should REJECT High Risk invoices', () => {
    const invoice = { 
      validationStatus: 'valid',
      riskLevel: 'HIGH' 
    };
    const result = decideFinancing(invoice);
    
    expect(result.status).toBe('rejected');
    expect(result.notes).toContain('High risk invoice');
  });

  test('should APPROVE Low Risk invoices at 80%', () => {
    const invoice = { 
      validationStatus: 'valid',
      riskLevel: 'LOW',
      invoiceAmount: 100000,
      creditGrade: 'B' 
    };
    const result = decideFinancing(invoice);
    
    expect(result.status).toBe('approved');
    expect(result.financedAmount).toBe(80000); 
    expect(result.platformFee).toBe(1600); 
  });

  test('should APPROVE Medium Risk invoices at 60%', () => {
    const invoice = { 
      validationStatus: 'valid',
      riskLevel: 'MEDIUM',
      invoiceAmount: 100000,
      creditGrade: 'C' 
    };
    const result = decideFinancing(invoice);
    
    expect(result.financedAmount).toBe(60000); 
  });

  test('should apply Grade A Bonus (+5%)', () => {
    const invoice = { 
      validationStatus: 'valid',
      riskLevel: 'LOW', 
      creditGrade: 'A', 
      invoiceAmount: 100000 
    };
    const result = decideFinancing(invoice);
    
    expect(result.financedAmount).toBe(85000); 
    expect(result.notes).toContain('Excellent credit bonus (+5%)');
  });

  test('should CAP financing at 4 Million', () => {
    const invoice = { 
      validationStatus: 'valid',
      riskLevel: 'LOW', 
      invoiceAmount: 10000000 
    };
    const result = decideFinancing(invoice);
    
    expect(result.financedAmount).toBe(4000000); 
    expect(result.notes).toContain('Capped by platform exposure limit');
  });
});