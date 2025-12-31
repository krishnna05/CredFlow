import "./FinancingDecision.css";

export default function FinancingDecision({ invoice }) {
  if (invoice.financingStatus === "rejected") {
    return (
      <div className="decision rejected">
        <h3>Financing Rejected</h3>
        <ul>
          {invoice.decisionNotes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="decision approved">
      <h3>Financing Approved</h3>
      <p>Amount: ₹{invoice.financedAmount}</p>
      <p>Platform Fee: ₹{invoice.platformFee}</p>

      <ul>
        {invoice.decisionNotes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
