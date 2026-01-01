import "./AdminDashboard.css";
import { useEffect, useState } from "react";
import API from "../services/api";

import RiskBadge from "../components/RiskBadge";
import FraudBadge from "../components/FraudBadge";

export default function AdminDashboard() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    API.get("/admin/portfolio").then((res) =>
      setInvoices(res.data)
    );
  }, []);

  const totalExposure = invoices.reduce(
    (sum, i) => sum + (i.financedAmount || 0),
    0
  );

  const totalLoss = invoices.reduce(
    (sum, i) => sum + (i.defaultLoss || 0),
    0
  );

  const defaults = invoices.filter(
    (i) => i.repaymentStatus === "defaulted"
  ).length;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Portfolio Summary */}
      <div className="summary">
        <div className="card">
          <h3>Total Invoices</h3>
          <p>{invoices.length}</p>
        </div>

        <div className="card">
          <h3>Total Exposure</h3>
          <p>₹{totalExposure}</p>
        </div>

        <div className="card danger">
          <h3>Total Loss</h3>
          <p>₹{totalLoss}</p>
        </div>

        <div className="card">
          <h3>Defaults</h3>
          <p>{defaults}</p>
        </div>
      </div>

      {/* Fraud & Risk List */}
      <div className="invoice-list">
        {invoices.map((inv) => (
          <div key={inv._id} className="invoice-item">
            <div className="row">
              <b>{inv.invoiceNumber}</b>
              <RiskBadge level={inv.riskLevel} />
              <FraudBadge status={inv.fraudStatus} />
            </div>

            <p>
              Business: {inv.businessId?.businessName}
            </p>

            <p>Amount: ₹{inv.invoiceAmount}</p>
            <p>Status: {inv.financingStatus}</p>

            {inv.fraudNotes?.length > 0 && (
              <ul className="notes">
                {inv.fraudNotes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
