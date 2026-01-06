const { DocumentProcessorServiceClient } = require("@google-cloud/documentai");

const client = new DocumentProcessorServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const LOCATION = process.env.GCP_LOCATION;
const PROCESSOR_ID = process.env.DOCUMENT_AI_PROCESSOR_ID;

const formatDate = (date) => {
  if (!date) return null;
  const { year, month, day } = date;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const processInvoice = async (fileBuffer, mimeType) => {
  if (!PROJECT_ID || !LOCATION || !PROCESSOR_ID) {
    throw new Error("Document AI env vars missing");
  }

  const name = `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${PROCESSOR_ID}`;

  const request = {
    name,
    rawDocument: {
      content: fileBuffer,
      mimeType,
    },
  };

  const [result] = await client.processDocument(request);
  const document = result.document;

  const getEntity = (type) =>
    document.entities.find(e => e.type === type);

  return {
    invoiceNumber: getEntity("invoice_id")?.mentionText || null,

    sellerDetails: {
      businessName: getEntity("supplier_name")?.mentionText || null,
      gstin: getEntity("supplier_tax_id")?.mentionText || null,
      address: getEntity("supplier_address")?.mentionText || null,
    },

    buyerDetails: {
      name: getEntity("customer_name")?.mentionText || null,
      gstin: getEntity("customer_tax_id")?.mentionText || null,
      address: getEntity("customer_address")?.mentionText || null,
    },

    financialDetails: {
      currency: "INR",
      subtotal: Number(getEntity("subtotal")?.normalizedValue?.moneyValue?.amount) || null,
      taxAmount: Number(getEntity("total_tax_amount")?.normalizedValue?.moneyValue?.amount) || null,
      totalAmount: Number(getEntity("total_amount")?.normalizedValue?.moneyValue?.amount) || null,
    },

    dates: {
      issueDate: formatDate(getEntity("invoice_date")?.normalizedValue?.dateValue),
      dueDate: formatDate(getEntity("due_date")?.normalizedValue?.dateValue),
    },

    confidence: {
      overall: document.entities.length
        ? document.entities.reduce((a, b) => a + b.confidence, 0) / document.entities.length
        : 0
    }
  };
};

module.exports = { processInvoice };
