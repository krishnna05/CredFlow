const request = require('supertest');
const app = require('../app'); 
const Business = require('../models/Business');
const Invoice = require('../models/Invoice');
const { detectFraud } = require('../services/fraudDetectionService');

jest.mock('../middleware/authMiddleware', () => ({
    protect: (req, res, next) => {
        req.user = { userId: 'test-user-123', role: 'business' };
        next();
    },
    allowRoles: () => (req, res, next) => next(),
}));

jest.mock('../middleware/uploadMiddleware', () => ({
    single: () => (req, res, next) => {
        req.file = { path: 'https://cloudinary.com/fake-pdf-url' };
        req.body = req.body || {};

        if (!req.body.invoiceNumber) {
            Object.assign(req.body, {
                invoiceNumber: 'INV-001',
                buyerName: 'Test Corp',
                invoiceAmount: '100000',
                issueDate: '2030-01-01',
                dueDate: '2030-02-01'
            });
        }
        next();
    },
}));

jest.mock('../models/Business');
jest.mock('../models/Invoice');
jest.mock('../services/fraudDetectionService');
jest.mock('../utils/auditLogger');
jest.mock('../services/notificationService');

describe('POST /api/invoices (Integration)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should successfully upload and process an invoice', async () => {
        const mockBusiness = {
            _id: 'business-123',
            userId: 'test-user-123',
            annualRevenue: 5000000,
            yearsInOperation: 5
        };

        const mockInvoiceInstance = {
            _id: 'invoice-new-123',
            invoiceAmount: 100000,
            save: jest.fn().mockResolvedValue(true), 
            invoiceNumber: 'INV-001',
            buyerName: 'Test Corp',
            issueDate: '2030-01-01',
            dueDate: '2030-02-01',
            validationStatus: 'valid',
            decisionNotes: []
        };

        Business.findOne.mockResolvedValue(mockBusiness);
        Invoice.create.mockResolvedValue(mockInvoiceInstance);
        detectFraud.mockResolvedValue({ isFraud: false, notes: [] });
        const response = await request(app)
            .post('/api/invoices')
            .field('invoiceNumber', 'INV-001')
            .field('buyerName', 'Test Corp')
            .field('invoiceAmount', '100000')
            .field('issueDate', '2030-01-01')
            .field('dueDate', '2030-02-01')
            .attach('invoicePdf', Buffer.from('fake pdf content'), 'test.pdf'); 

        expect(response.status).toBe(201); 
        expect(response.body).toHaveProperty('_id', 'invoice-new-123');

        expect(mockInvoiceInstance.save).toHaveBeenCalled();

        expect(mockInvoiceInstance.financingStatus).toBe('approved');
        expect(mockInvoiceInstance.financedAmount).toBeGreaterThan(0);
    });

    test('should reject upload if Business Profile is missing', async () => {
        Business.findOne.mockResolvedValue(null);

        const response = await request(app)
            .post('/api/invoices')
            .attach('invoicePdf', Buffer.from('data'), 'test.pdf');

        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/Business profile required/);
    });
});