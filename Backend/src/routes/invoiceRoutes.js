const express = require("express");
const router = express.Router();
const { uploadCloud, uploadMemory } = require("../middleware/uploadMiddleware");
const { uploadInvoice, getInvoices, analyzeInvoice } = require("../controllers/invoiceController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.post(
  "/analyze",
  protect,
  allowRoles("business"),
  uploadMemory.single('invoicePdf'),
  analyzeInvoice
);

router.post(
  "/",
  protect,
  allowRoles("business"),
  uploadCloud.fields([
    { name: 'invoicePdf', maxCount: 1 },
    { name: 'supportingDocs', maxCount: 3 }
  ]),
  uploadInvoice
);

router.get("/", protect, allowRoles("business"), getInvoices);

module.exports = router;