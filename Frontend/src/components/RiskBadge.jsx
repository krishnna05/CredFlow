import "./RiskBadge.css";

export default function RiskBadge({ level }) {
  return (
    <span className={`risk ${level}`}>
      {level} RISK
    </span>
  );
}