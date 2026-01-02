import "./RiskBadge.css";

export default function RiskBadge({ level }) {
  if (!level) return <span className="risk-unknown">-</span>;

  const status = level.toUpperCase();
  
  return (
    <span className={`risk-badge ${status.toLowerCase()}`}>
      <span className="dot">●</span> {status} RISK
    </span>
  );
}