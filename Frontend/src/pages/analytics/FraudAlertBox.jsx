import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

const FraudAlertBox = ({ fraudCheck }) => {
  if (!fraudCheck) return null;

  const { status, riskScore, flaggedFields = [] } = fraudCheck;
  
  const isSafe = status === 'PASS';
  const isHighRisk = status === 'FAIL' || riskScore > 75;

  return (
    <div className={clsx(
      "rounded-2xl border p-5 transition-all duration-300 hover:shadow-md",
      isSafe ? "bg-emerald-50/40 border-emerald-100" : 
      isHighRisk ? "bg-rose-50/40 border-rose-100" : "bg-amber-50/40 border-amber-100"
    )}>
      <div className="flex items-start gap-4">
        <div className={clsx(
          "p-3 rounded-xl shrink-0 shadow-sm border",
          isSafe ? "bg-emerald-100 text-emerald-600 border-emerald-200" : 
          isHighRisk ? "bg-rose-100 text-rose-600 border-rose-200" : "bg-amber-100 text-amber-600 border-amber-200"
        )}>
          {isSafe ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={clsx(
              "text-base font-bold",
              isSafe ? "text-emerald-900" : 
              isHighRisk ? "text-rose-900" : "text-amber-900"
            )}>
              {isSafe ? 'Fraud Check Passed' : 'Fraud Alert Detected'}
            </h3>
            <span className={clsx(
              "text-xs font-bold px-2.5 py-0.5 rounded-full border",
              isSafe ? "bg-emerald-100 text-emerald-700 border-emerald-200" : 
              isHighRisk ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-amber-100 text-amber-700 border-amber-200"
            )}>
              Safe Score: {100 - riskScore}/100
            </span>
          </div>

          <p className={clsx(
            "mt-1 text-sm leading-relaxed",
            isSafe ? "text-emerald-700" : 
            isHighRisk ? "text-rose-700" : "text-amber-700"
          )}>
            {isSafe 
              ? "Authenticity verified. No irregularities detected." 
              : "Security risks identified. Review flagged items below."}
          </p>

          {!isSafe && flaggedFields.length > 0 && (
            <div className="mt-4 bg-white/80 rounded-xl p-3 border border-rose-100 shadow-sm">
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                Risk Factors
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {flaggedFields.map((field, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-rose-50 px-2 py-1 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 shadow-[0_0_4px_rgba(244,63,94,0.5)]" />
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