import "./FraudBadge.css";

export default function FraudBadge({ status }) {
  if (status !== "suspected") return null;

  return (
    <span className="fraud">
      FRAUD SUSPECTED
    </span>
  );
}
