import "./Dashboard.css";
import { useEffect, useState } from "react";
import API from "../services/api";

import RiskBadge from "../components/RiskBadge";
import FraudBadge from "../components/FraudBadge";
import RepaymentStatus from "../components/RepaymentStatus";
import FinancingDecision from "../components/FinancingDecision";
import AIAssistant from "../components/AIAssistant";

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

      <div className="invoice-list">
        {invoices.map((inv) => (
          <div key={inv._id} className="invoice-item">
            <div className="invoice-header">
              <div className="row">
                <b>{inv.invoiceNumber}</b>
                <RiskBadge level={inv.riskLevel} />
                <FraudBadge status={inv.fraudStatus} />
              </div>
            </div>

            <div className="invoice-details">
              <p>Amount: ₹{inv.invoiceAmount}</p>
              <p>Credit Grade: {inv.creditGrade}</p>
            </div>

            <FinancingDecision invoice={inv} />
            
            <AIAssistant invoiceId={inv._id} />
            
            <RepaymentStatus invoice={inv} />
          </div>
        ))}
      </div>
    </div>
  );
}