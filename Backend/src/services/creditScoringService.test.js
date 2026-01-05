const { calculateCreditScore } = require('./creditScoringService');

describe('Credit Scoring Service', () => {
  const createMock = (overrides = {}) => ({
    invoice: {
      validationStatus: 'valid',
      invoiceAmount: 5000, 
      issueDate: '2023-01-01',
      dueDate: '2023-01-20', 
      ...overrides.invoice
    },
    business: {
      yearsInOperation: 6,
      annualRevenue: 100000, 
      ...overrides.business
    }
  });

  test('should return Grade D (Score 0) if validation failed', () => {
    const { invoice, business } = createMock({
      invoice: { validationStatus: 'invalid' }
    });
    const result = calculateCreditScore(invoice, business);
    expect(result.score).toBe(0);
    expect(result.grade).toBe('D');
  });

  test('should calculate MAX possible score correctly', () => {
    const { invoice, business } = createMock({
      invoice: {
        invoiceAmount: 1000, 
        issueDate: '2023-01-01',
        dueDate: '2023-01-15', 
      },
      business: {
        yearsInOperation: 10,
        annualRevenue: 15000000 
      }
    });
    
    const result = calculateCreditScore(invoice, business);
    expect(result.score).toBe(110);
    expect(result.grade).toBe('A');
  });

  test('should penalize High Exposure and Long Payment Cycles', () => {
    const { invoice, business } = createMock({
      invoice: {
        invoiceAmount: 60000, 
        issueDate: '2023-01-01',
        dueDate: '2023-04-01', 
      },
      business: {
        annualRevenue: 100000, 
        yearsInOperation: 1 
      }
    });
    
    const result = calculateCreditScore(invoice, business);
    expect(result.score).toBe(45);
    expect(result.grade).toBe('D'); 
  });

  test('should return Grade B for mid-range scores (65-79)', () => {
    const { invoice, business } = createMock({
      business: {
        yearsInOperation: 3, 
        annualRevenue: 3000000 
      },
      invoice: {
        invoiceAmount: 600000, 
        issueDate: '2023-01-01',
        dueDate: '2023-01-15' 
      }
    });
   
    const result = calculateCreditScore({
        ...invoice,
        invoiceAmount: 20000, 
        issueDate: '2023-01-01',
        dueDate: '2023-01-15',
        validationStatus: 'valid'
    }, {
        yearsInOperation: 1, 
        annualRevenue: 100000
    });

    expect(result.score).toBe(75);
    expect(result.grade).toBe('B');
  });
});