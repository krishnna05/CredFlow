import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { clsx } from 'clsx';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, trendLabel }) => {
  const isPositive = trend === 'up';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 bg-gray-50 rounded-xl">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        {trend && (
          <div className={clsx(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            isPositive ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <div className="text-2xl font-bold text-gray-900 tracking-tight">{value}</div>
        {trendLabel && (
          <p className="text-gray-400 text-xs mt-1">{trendLabel}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;