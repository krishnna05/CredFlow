import "./RepaymentStatus.css";

export default function RepaymentStatus({ invoice }) {
  return (
    <div className={`repayment ${invoice.repaymentStatus}`}>
      <p>Status: {invoice.repaymentStatus}</p>

      {invoice.defaultLoss && (
        <p className="loss">
          Loss: ₹{invoice.defaultLoss}
        </p>
      )}
    </div>
  );
}
