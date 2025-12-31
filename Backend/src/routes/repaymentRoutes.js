const express = require("express");
const router = express.Router();
const {
  markPaid,
  checkDefaults,
} = require("../controllers/repaymentController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

// Business marks payment
router.post(
  "/pay",
  protect,
  allowRoles("business"),
  markPaid
);

// Admin default check
router.post(
  "/check-defaults",
  protect,
  allowRoles("admin"),
  checkDefaults
);

module.exports = router;
