require("dotenv").config();
const fs = require("fs");
const { processInvoice } = require("./src/services/documentAiService");

(async () => {
  const fileBuffer = fs.readFileSync("./invoice-test.pdf");
  try {
    const data = await processInvoice(fileBuffer, "application/pdf");
    console.log("OCR RESULT:", data);
  } catch (err) {
    console.error("OCR FAILED:", err.message);
  }
})();
