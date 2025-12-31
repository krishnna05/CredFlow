const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const repaymentRoutes = require("./routes/repaymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/repayment", repaymentRoutes);

module.exports = app;
