import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import Card from '../../components/common/Card';

const RiskReport = ({ invoice }) => {
  const isFraud = invoice.fraudStatus === 'suspected';
  const riskNotes = invoice.riskNotes || [];
  const fraudNotes = invoice.fraudNotes || [];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header Strip */}
        <div className={clsx(
          "h-1.5 w-full",
          isFraud ? "bg-rose-500" : "bg-emerald-500"
        )} />
        
        <div className="p-5">
            <div className="flex items-start justify-between mb-5">
            <div>
                <h3 className="text-base font-bold text-slate-800">AI Risk Analysis</h3>
                <p className="text-xs text-slate-500 font-medium">Automated assessment based on buyer history.</p>
            </div>
            <span className={clsx(
                "px-3 py-1 rounded-full text-xs font-bold border capitalize",
                isFraud ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
            )}>
                {invoice.riskLevel} Risk
            </span>
            </div>

            <div className={clsx(
            "p-4 rounded-xl flex items-start gap-4 mb-6 border transition-colors",
            isFraud ? "bg-rose-50/50 border-rose-100" : "bg-emerald-50/50 border-emerald-100"
            )}>
            <div className={clsx(
                "p-2 rounded-lg shrink-0",
                isFraud ? "bg-white text-rose-600 shadow-sm" : "bg-white text-emerald-600 shadow-sm"
            )}>
                {isFraud ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
                <p className={clsx("font-bold text-sm", isFraud ? "text-rose-900" : "text-emerald-900")}>
                {isFraud ? "Fraud Detected" : "Passed Fraud Checks"}
                </p>
                <p className={clsx("text-xs mt-1 leading-relaxed", isFraud ? "text-rose-700" : "text-emerald-700")}>
                {isFraud
                    ? "Suspicious patterns detected in this invoice."
                    : "No manipulation or duplicate records found."}
                </p>
            </div>
            </div>

            <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Key Findings
            </h4>

            {riskNotes.length === 0 && fraudNotes.length === 0 ? (
                <p className="text-sm text-slate-400 italic pl-1">No specific risk flags found.</p>
            ) : (
                <ul className="space-y-2">
                {fraudNotes.map((note, idx) => (
                    <li key={`fraud-${idx}`} className="flex items-start gap-2.5 text-sm text-rose-700 bg-rose-50/30 p-2 rounded-lg">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="font-medium">{note}</span>
                    </li>
                ))}
                {riskNotes.map((note, idx) => (
                    <li key={`risk-${idx}`} className="flex items-start gap-2.5 text-sm text-slate-600 p-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                    <span>{note}</span>
                    </li>
                ))}
                </ul>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RiskReport;