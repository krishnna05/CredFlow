import "./Invoices.css";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    API.get("/invoices").then((res) =>
      setInvoices(res.data)
    );
  }, []);

  return (
    <div className="invoice-container">
      <h1>My Invoices</h1>

      {invoices.map((inv) => (
        <div className="invoice-card" key={inv._id}>
          <p><b>{inv.invoiceNumber}</b></p>
          <p>Status: {inv.validationStatus}</p>

          {inv.validationNotes?.length > 0 && (
            <ul className="errors">
              {inv.validationNotes.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
