const Tesseract = require('tesseract.js');
const pdfParseLib = require('pdf-parse');

const normalizeDate = (dateStr) => {
  if (!dateStr) return null;
  
  try {
    dateStr = dateStr.replace(/[,.]/g, ' ').trim();
    
    const dateObj = new Date(dateStr);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toISOString().split('T')[0];
    }
    
    const dmyMatch = dateStr.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dmyMatch) {
      const [_, day, month, year] = dmyMatch;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return null;
  } catch (e) {
    return null;
  }
};

const parseAmount = (str) => {
  if (!str) return null;
  const cleaned = str.replace(/[^\d.-]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? null : val;
};

const extractFields = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  const data = {
    invoiceNumber: null,
    issueDate: null,
    dueDate: null,
    sellerGstin: null,
    buyerGstin: null,
    buyerName: null,
    subtotal: null,
    taxAmount: null,
    totalAmount: null
  };

  const dateRegex = /\b(?:\d{1,2}[-./]\d{1,2}[-./]\d{2,4})|(?:\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b/ig;
  
  const strictGstinRegex = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/g;
  const looseGstinRegex = /\d{2}[A-Z0-9]{13}/g;

  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase();

    const lineDates = line.match(dateRegex);
    if (lineDates) {
      if (lowerLine.includes('due')) {
        data.dueDate = normalizeDate(lineDates[0]);
      } else if (lowerLine.includes('date') || lowerLine.includes('dated')) {
        if (!data.issueDate) data.issueDate = normalizeDate(lineDates[0]);
      }
    }

    if (lowerLine.includes('total') || lowerLine.includes('amount') || lowerLine.includes('payable')) {
       const lastNumberMatch = line.match(/[\d,]+\.\d{2}\b/);
       if (lastNumberMatch) {
         const val = parseAmount(lastNumberMatch[0]);
         
         if (lowerLine.includes('tax') || lowerLine.includes('gst') || lowerLine.includes('vat')) {
            if(!data.taxAmount) data.taxAmount = val;
         } else if (lowerLine.includes('sub') || lowerLine.includes('taxable')) {
            if(!data.subtotal) data.subtotal = val;
         } else if (lowerLine.includes('grand') || lowerLine.includes('net') || lowerLine.includes('due') || lowerLine.startsWith('total')) {
            data.totalAmount = val;
         }
       }
    }

    if (!data.invoiceNumber && (lowerLine.includes('invoice no') || lowerLine.includes('inv no') || lowerLine.includes('bill no'))) {
        const parts = line.split(/[:#]/);
        if (parts.length > 1) {
             data.invoiceNumber = parts[1].trim().split(' ')[0];
        } else {
             const match = line.match(/(?:No\.?|#)\s*([A-Za-z0-9/-]+)/i);
             if (match) data.invoiceNumber = match[1];
        }
    }
    
    if (!data.buyerName && (lowerLine.includes('bill to') || lowerLine.includes('billed to') || lowerLine.includes('buyer'))) {
        if (index + 1 < lines.length) {
            data.buyerName = lines[index + 1];
        }
    }
  });

  const allText = lines.join(' ');
  const gstinMatches = allText.match(strictGstinRegex) || allText.match(looseGstinRegex) || [];
  const uniqueGstins = [...new Set(gstinMatches)];
  
  if (uniqueGstins.length > 0) data.sellerGstin = uniqueGstins[0];
  if (uniqueGstins.length > 1) data.buyerGstin = uniqueGstins[1];

  if (!data.issueDate) {
    const allDates = allText.match(dateRegex);
    if (allDates && allDates.length > 0) data.issueDate = normalizeDate(allDates[0]);
  }

  if (!data.totalAmount) {
     const strictTotal = allText.match(/(?:Total|Grand Total)[\s\S]{0,20}?([\d,]+\.\d{2})/i);
     if (strictTotal) data.totalAmount = parseAmount(strictTotal[1]);
  }

  return data;
};

const processInvoice = async (fileBuffer, mimeType) => {
  try {
    let rawText = '';

    if (mimeType === 'application/pdf') {
      try {
        let pdfParser = pdfParseLib;
        if (typeof pdfParser !== 'function' && pdfParser.default) {
            pdfParser = pdfParser.default;
        }

        if (typeof pdfParser === 'function') {
            const pdfData = await pdfParser(fileBuffer);
            rawText = pdfData.text;
        } 
      } catch (err) {
        console.warn("⚠️ PDF Text extraction failed:", err.message);
      }
    }

    if (mimeType.startsWith('image/')) {
       console.log("📷 Image detected. Starting Tesseract OCR...");
       const result = await Tesseract.recognize(fileBuffer, 'eng', {
       });
       rawText = result.data.text;
    }

    console.log("\n--- 📝 RAW OCR TEXT START ---");
    console.log(rawText.substring(0, 500) + "..."); 
    console.log("--- 📝 RAW OCR TEXT END ---\n");

    // --- CHECK RESULTS ---
    if (!rawText || rawText.trim().length < 10) {
      throw new Error("Could not extract text from document");
    }

    console.log("✅ Text Extraction Complete. Parsing fields...");
    const extracted = extractFields(rawText);

    return {
      invoiceNumber: extracted.invoiceNumber,
      sellerDetails: {
        businessName: null,
        gstin: extracted.sellerGstin,
        address: null,
      },
      buyerDetails: {
        name: extracted.buyerName,
        gstin: extracted.buyerGstin,
        address: null,
      },
      financialDetails: {
        currency: "INR",
        subtotal: extracted.subtotal,
        taxAmount: extracted.taxAmount,
        totalAmount: extracted.totalAmount,
      },
      dates: {
        issueDate: extracted.issueDate,
        dueDate: extracted.dueDate,
      },
      confidence: {
        overall: 0.8
      }
    };

  } catch (error) {
    console.error("❌ FreeOCR Service Error:", error.message);
    return null;
  }
};

module.exports = { processInvoice };