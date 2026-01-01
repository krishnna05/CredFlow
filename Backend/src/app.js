const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const repaymentRoutes = require("./routes/repaymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const assistantRoutes = require("./routes/assistantRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/repayment", repaymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/assistant", assistantRoutes);

module.exports = app;
