const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const {
  uploadInvoice,
  getInvoices,
} = require("../controllers/invoiceController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  allowRoles("business"),
  upload.single("invoicePdf"),
  uploadInvoice
);

router.get(
  "/",
  protect,
  allowRoles("business"),
  getInvoices
);

router.get(
  "/",
  protect,
  getNotifications
);

module.exports = router;
