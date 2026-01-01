import "./Dashboard.css";
import { useEffect, useState } from "react";
import API from "../services/api";

import RiskBadge from "../components/RiskBadge";
import FraudBadge from "../components/FraudBadge";
import RepaymentStatus from "../components/RepaymentStatus";
import FinancingDecision from "../components/FinancingDecision";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    API.get("/invoices").then((res) =>
      setInvoices(res.data)
    );
  }, []);

  const totalFinanced = invoices.reduce(
    (sum, i) => sum + (i.financedAmount || 0),
    0
  );

  const defaults = invoices.filter(
    (i) => i.repaymentStatus === "defaulted"
  ).length;

  return (
    <div className="dashboard">
      <h1>Business Dashboard</h1>

      {/* Summary Cards */}
      <div className="summary">
        <div className="card">
          <h3>Total Invoices</h3>
          <p>{invoices.length}</p>
        </div>

        <div className="card">
          <h3>Total Financed</h3>
          <p>₹{totalFinanced}</p>
        </div>

        <div className="card">
          <h3>Defaults</h3>
          <p>{defaults}</p>
        </div>
      </div>

      {/* Invoice List */}
      <div className="invoice-list">
        {invoices.map((inv) => (
          <div key={inv._id} className="invoice-item">
            <div className="row">
              <b>{inv.invoiceNumber}</b>
              <RiskBadge level={inv.riskLevel} />
              <FraudBadge status={inv.fraudStatus} />
            </div>

            <p>Amount: ₹{inv.invoiceAmount}</p>
            <p>Credit Grade: {inv.creditGrade}</p>

            <FinancingDecision invoice={inv} />
            <RepaymentStatus invoice={inv} />
          </div>
        ))}
      </div>
    </div>
  );
}
