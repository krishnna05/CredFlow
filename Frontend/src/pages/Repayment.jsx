import "./Repayments.css";
import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

export default function Repayments() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    API.get("/invoices").then((res) => {
      setInvoices(res.data);
    });
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <main className="content">
        <h1>Repayments</h1>
        <p className="subtitle">
          Track invoice repayment and default status
        </p>

        <table className="repayment-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Financed Amount</th>
              <th>Status</th>
              <th>Loss</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td>{inv.invoiceNumber}</td>
                <td>₹{inv.financedAmount || 0}</td>
                <td
                  className={`status ${inv.repaymentStatus}`}
                >
                  {inv.repaymentStatus}
                </td>
                <td>
                  {inv.defaultLoss
                    ? `₹${inv.defaultLoss}`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
