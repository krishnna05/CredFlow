import "./InvoiceScore.css";

export default function InvoiceScore({ invoice }) {
  return (
    <div className="score-card">
      <h3>Credit Score: {invoice.creditScore}</h3>
      <span className={`grade ${invoice.creditGrade}`}>
        Grade {invoice.creditGrade}
      </span>

      <ul>
        {invoice.scoreNotes?.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
