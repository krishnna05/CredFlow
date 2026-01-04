const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const repaymentRoutes = require("./routes/repaymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] 
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/repayment", repaymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/audit-logs", auditLogRoutes);     
app.use("/api/notifications", notificationRoutes); 
app.use("/api/analytics", analyticsRoutes);

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;