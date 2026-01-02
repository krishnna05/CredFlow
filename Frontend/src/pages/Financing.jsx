import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./Financing.css";

export default function Financing() {
  const [invoices, setInvoices] = useState([]);

  // Calculator State
  const [calcAmount, setCalcAmount] = useState(100000);
  const [advancePercent, setAdvancePercent] = useState(80);
  const [tenure, setTenure] = useState(30);

  useEffect(() => {
    // Dummy data for display
    setInvoices([
        { _id: 1, invoiceNumber: "INV-001", dueDate: "2025-02-15", amount: 50000, status: "approved", financingStatus: "pending" },
        { _id: 2, invoiceNumber: "INV-002", dueDate: "2025-03-01", amount: 120000, status: "approved", financingStatus: "financed", financedAmount: 96000, repaymentAmount: 98000, repaymentDate: "2025-04-01" }
    ]);
  }, []);

  const eligibleInvoices = invoices.filter(
    (inv) => inv.status === "approved" && inv.financingStatus !== "financed"
  );

  const activeFinancing = invoices.filter(
    (inv) => inv.financingStatus === "financed"
  );

  // Calculator Logic
  const calculatedDisbursed = Math.round(calcAmount * (advancePercent / 100));
  const platformFee = Math.round(calculatedDisbursed * 0.02);
  const repaymentAmount = calculatedDisbursed + platformFee;

  return (
    <div className="financing-container">
      {/* HEADER SECTION */}
      <div className="page-header">
        <h1>Financing Center</h1>
        <p className="subtitle">
          Unlock cash from your unpaid invoices instantly.
        </p>
      </div>

      {/* --- Section 1: Financing Calculator --- */}
      <section className="calculator-box">
        <h3>💰 Financing Calculator</h3>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Estimate how much you can receive today.
        </p>

        <div className="calc-grid">
          <div className="input-group">
            <label>Invoice Amount (₹)</label>
            <input
              type="number"
              value={calcAmount}
              onChange={(e) => setCalcAmount(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label>Advance Percentage</label>
            <select
              value={advancePercent}
              onChange={(e) => setAdvancePercent(Number(e.target.value))}
            >
              <option value={70}>70%</option>
              <option value={80}>80%</option>
              <option value={90}>90%</option>
            </select>
          </div>

          <div className="input-group">
            <label>Tenure (Days)</label>
            <select
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
            >
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
            </select>
          </div>
        </div>

        <div className="calc-result-row">
          <div className="result-card">
            <h4>You Receive Now</h4>
            <span className="value">
              ₹{calculatedDisbursed.toLocaleString()}
            </span>
          </div>
          <div className="result-card">
            <h4>Platform Fee (2%)</h4>
            <span className="value">₹{platformFee.toLocaleString()}</span>
          </div>
          <div className="result-card">
            <h4>Total Repayment</h4>
            <span className="value">
              ₹{repaymentAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      {/* --- Section 2: Eligible Invoices --- */}
      <h2>✅ Eligible for Financing</h2>
      {eligibleInvoices.length === 0 ? (
        <p className="empty-state">No eligible invoices found.</p>
      ) : (
        <div className="table-container">
          <table className="finance-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Eligible (80%)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {eligibleInvoices.map((inv) => (
                <tr key={inv._id}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td>₹{inv.amount.toLocaleString()}</td>
                  <td className="highlight-text">
                    ₹{(inv.amount * 0.8).toLocaleString()}
                  </td>
                  <td>
                    <button className="btn-request">Request Cash</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Section 3: Active Financing --- */}
      <h2>🚀 Active Financing</h2>
      {activeFinancing.length === 0 ? (
        <p className="empty-state">No active loans.</p>
      ) : (
        <div className="table-container">
          <table className="finance-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Disbursed</th>
                <th>Repayment</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeFinancing.map((inv) => (
                <tr key={inv._id}>
                  <td>{inv.invoiceNumber}</td>
                  <td>₹{inv.financedAmount.toLocaleString()}</td>
                  <td>₹{inv.repaymentAmount.toLocaleString()}</td>
                  <td>{new Date(inv.repaymentDate).toLocaleDateString()}</td>
                  <td>
                    <span className="status-badge active">Active Loan</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}