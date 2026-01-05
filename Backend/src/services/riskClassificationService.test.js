const { classifyRisk } = require('./riskClassificationService');

describe('Risk Classification Service', () => {
  const createMockData = (overrides = {}) => {
    const defaultInvoice = {
      creditGrade: 'A',
      invoiceAmount: 1000,
      issueDate: '2023-01-01',
      dueDate: '2023-01-30',
      ...overrides.invoice
    };
    const defaultBusiness = {
      annualRevenue: 100000,
      yearsInOperation: 5,
      ...overrides.business
    };
    return { invoice: defaultInvoice, business: defaultBusiness };
  };

  test('should return LOW risk for an ideal invoice (Grade A, low exposure, established business)', () => {
    const { invoice, business } = createMockData();
    
    const result = classifyRisk(invoice, business);
    
    expect(result.riskLevel).toBe('LOW');
    expect(result.notes).toContain('Excellent credit grade');
    expect(result.notes.length).toBe(1);
  });

  test('should return MEDIUM risk for Grade B (+1) and New Business (+2) [Score: 3]', () => {
    const { invoice, business } = createMockData({
      invoice: { creditGrade: 'B' },
      business: { yearsInOperation: 1 }
    });

    const result = classifyRisk(invoice, business);

    expect(result.riskLevel).toBe('MEDIUM');
    expect(result.notes).toEqual(expect.arrayContaining([
      'Moderate credit grade',
      'New business'
    ]));
  });

  test('should return HIGH risk for Grade C (+3) and High Exposure (+3) [Score: 6]', () => {
    const { invoice, business } = createMockData({
      invoice: { creditGrade: 'C', invoiceAmount: 50000 },
      business: { annualRevenue: 100000 }
    });

    const result = classifyRisk(invoice, business);

    expect(result.riskLevel).toBe('HIGH');
    expect(result.notes).toEqual(expect.arrayContaining([
      'Poor credit grade',
      'High invoice exposure'
    ]));
  });

  test('should detect Long Payment Cycle > 60 days (+2)', () => {
    const { invoice, business } = createMockData({
      invoice: { 
        issueDate: '2023-01-01', 
        dueDate: '2023-04-01' 
      }
    });

    const result = classifyRisk(invoice, business);

    expect(result.notes).toContain('Long payment cycle');
  });

  test('should handle boundary condition: Exact 60 days duration (No Penalty)', () => {
    const { invoice, business } = createMockData({
      invoice: { 
        issueDate: '2023-01-01', 
        dueDate: '2023-03-02' 
      }
    });

    const result = classifyRisk(invoice, business);
    expect(result.notes).not.toContain('Long payment cycle');
  });
  
  test('should accumulate multiple risk factors correctly', () => {
    const { invoice, business } = createMockData({
      invoice: { 
        creditGrade: 'C', 
        invoiceAmount: 30000, 
      },
      business: { 
        annualRevenue: 100000, 
        yearsInOperation: 1 
      }
    });

    const result = classifyRisk(invoice, business);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.notes.length).toBe(3);
  });
});