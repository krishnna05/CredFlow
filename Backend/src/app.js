const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/invoices", invoiceRoutes);

module.exports = app;
