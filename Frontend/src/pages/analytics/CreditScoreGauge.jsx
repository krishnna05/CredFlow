import clsx from 'clsx';
import { motion } from 'framer-motion';

const CreditScoreGauge = ({ score, grade, loading }) => {
  const normalizedScore = Math.min(Math.max(score || 0, 0), 100);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((normalizedScore / 100) * (circumference / 2));

  const getColor = (s) => {
    if (s >= 75) return '#22c55e';
    if (s >= 50) return '#eab308';
    return '#ef4444';
  };

  const color = getColor(normalizedScore);

  return (
    <div className="flex flex-col items-center justify-center py-6 relative">
      <div className="relative w-48 h-32 overflow-hidden">
        <svg className="w-full h-full transform translate-y-2" viewBox="0 0 200 110">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {!loading && (
            <motion.path
              initial={{ strokeDashoffset: circumference / 2 }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={color}
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={circumference}
            />
          )}
        </svg>

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-2">
          <span className="text-4xl font-bold text-gray-900">
            {loading ? '...' : normalizedScore}
          </span>
          <span className={clsx("text-sm font-medium", loading ? "text-gray-400" : "text-gray-500")}>
            Credit Score
          </span>
        </div>
      </div>

      {/* Grade Badge */}
      {!loading && grade && (
        <div className={clsx(
          "mt-4 px-4 py-1 rounded-full text-sm font-bold border",
          grade === 'A' ? "bg-green-100 text-green-700 border-green-200" :
            grade === 'B' ? "bg-blue-100 text-blue-700 border-blue-200" :
              grade === 'C' ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                "bg-red-100 text-red-700 border-red-200"
        )}>
          Grade {grade}
        </div>
      )}
    </div>
  );
};

export default CreditScoreGauge;