import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const RiskReport = ({ invoice }) => {
  const isFraud = invoice.fraudStatus === 'suspected';
  const riskNotes = invoice.riskNotes || [];
  const fraudNotes = invoice.fraudNotes || [];

  return (
    <div className="space-y-4">
      <Card className="border-l-4 border-l-primary">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Risk Analysis</h3>
            <p className="text-sm text-gray-500">Automated assessment based on buyer history.</p>
          </div>
          <Badge variant={invoice.riskLevel}>{invoice.riskLevel}</Badge>
        </div>

        <div className={clsx(
          "p-3 rounded-lg flex items-start gap-3 mb-6",
          isFraud ? "bg-red-50 text-red-900" : "bg-green-50 text-green-900"
        )}>
          {isFraud ? (
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold text-sm">
              {isFraud ? "Fraud Detected" : "Passed Fraud Checks"}
            </p>
            <p className="text-xs opacity-80 mt-1">
              {isFraud
                ? "Suspicious patterns detected in this invoice."
                : "No manipulation or duplicate records found."}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Key Findings
          </h4>

          {riskNotes.length === 0 && fraudNotes.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No specific risk flags found.</p>
          ) : (
            <ul className="space-y-2">
              {fraudNotes.map((note, idx) => (
                <li key={`fraud-${idx}`} className="flex items-start gap-2 text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
              {riskNotes.map((note, idx) => (
                <li key={`risk-${idx}`} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RiskReport;