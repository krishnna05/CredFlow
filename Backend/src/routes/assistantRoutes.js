const express = require("express");
const router = express.Router();
const {
  explainInvoice,
} = require("../controllers/assistantController");
const { protect } = require("../middleware/authMiddleware");

router.get(
  "/invoice/:id",
  protect,
  explainInvoice
);

module.exports = router;
