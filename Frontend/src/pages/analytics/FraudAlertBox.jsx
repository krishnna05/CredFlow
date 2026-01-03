import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

const FraudAlertBox = ({ fraudCheck }) => {
  if (!fraudCheck) return null;

  const { status, riskScore, flaggedFields = [] } = fraudCheck;
  
  const isSafe = status === 'PASS';
  const isHighRisk = status === 'FAIL' || riskScore > 75;

  return (
    <div className={clsx(
      "rounded-xl border p-6 transition-all duration-200",
      isSafe ? "bg-green-50/50 border-green-200" : 
      isHighRisk ? "bg-red-50/50 border-red-200" : "bg-orange-50/50 border-orange-200"
    )}>
      <div className="flex items-start gap-4">
        <div className={clsx(
          "p-3 rounded-full shrink-0",
          isSafe ? "bg-green-100 text-green-600" : 
          isHighRisk ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
        )}>
          {isSafe ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={clsx(
              "text-lg font-bold",
              isSafe ? "text-green-900" : 
              isHighRisk ? "text-red-900" : "text-orange-900"
            )}>
              {isSafe ? 'Fraud Check Passed' : 'Fraud Alert Detected'}
            </h3>
            <span className={clsx(
              "text-sm font-bold px-3 py-1 rounded-full",
              isSafe ? "bg-green-200 text-green-800" : 
              isHighRisk ? "bg-red-200 text-red-800" : "bg-orange-200 text-orange-800"
            )}>
              Score: {100 - riskScore}/100
            </span>
          </div>

          <p className={clsx(
            "mt-1 text-sm",
            isSafe ? "text-green-700" : 
            isHighRisk ? "text-red-700" : "text-orange-700"
          )}>
            {isSafe 
              ? "This document appears authentic. No significant irregularities were found." 
              : "Potential security risks have been identified. Please review the flagged items below."}
          </p>

          {!isSafe && flaggedFields.length > 0 && (
            <div className="mt-4 bg-white/60 rounded-lg p-4 border border-black/5">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Risk Factors
              </h4>
              <ul className="space-y-2">
                {flaggedFields.map((field, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FraudAlertBox;