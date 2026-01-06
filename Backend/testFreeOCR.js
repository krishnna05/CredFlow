const fs = require('fs');
const path = require('path');
const { processInvoice } = require('./src/services/freeOcrInvoiceService');

const SAMPLE_FILE = path.join(__dirname, 'invoice-test.png'); 

const test = async () => {
  try {
    console.log("🔍 Loading file:", SAMPLE_FILE);
    
    if (!fs.existsSync(SAMPLE_FILE)) {
      console.error("❌ Test file not found at:", SAMPLE_FILE);
      console.log("👉 Please add an image file (invoice-test.png) to the Backend directory to test the OCR.");
      return;
    }

    const buffer = fs.readFileSync(SAMPLE_FILE);
    
    const ext = path.extname(SAMPLE_FILE).toLowerCase();
    let mimeType = 'application/octet-stream';
    if (ext === '.pdf') {
        mimeType = 'application/pdf';
    } else if (ext === '.png') {
        mimeType = 'image/png';
    } else if (ext === '.jpg' || ext === '.jpeg') {
        mimeType = 'image/jpeg';
    }

    console.log(`⚙️  Processing as ${mimeType}...`);
    const start = Date.now();
    
    const result = await processInvoice(buffer, mimeType);
    
    const duration = (Date.now() - start) / 1000;
    console.log(`✅ Finished in ${duration}s`);
    
    console.log("\n--- EXTRACTED DATA ---");
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error("❌ Error:", error);
  }
};

test();