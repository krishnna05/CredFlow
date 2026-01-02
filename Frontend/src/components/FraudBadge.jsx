import "./FraudBadge.css";
import { ShieldCheck, AlertTriangle, Ban } from "lucide-react";

export default function FraudBadge({ status }) {
  const currentStatus = status ? status.toLowerCase() : "clean";

  if (currentStatus === "clean") {
    return (
      <span className="fraud-badge clean" title="No fraud detected">
        <ShieldCheck size={12} /> CLEAN
      </span>
    );
  }

  if (currentStatus === "flagged") {
    return (
      <span className="fraud-badge flagged" title="Suspicious activity detected">
        <AlertTriangle size={12} /> FLAGGED
      </span>
    );
  }

  if (currentStatus === "fraud") {
    return (
      <span className="fraud-badge fraud" title="Fraud confirmed - Blocked">
        <Ban size={12} /> FRAUD
      </span>
    );
  }

  return null;
}