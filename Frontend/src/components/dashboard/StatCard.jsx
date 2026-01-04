import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { clsx } from 'clsx';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, trendLabel }) => {
  const isPositive = trend === 'up';

  return (
    <div className="group bg-white p-4 rounded-xl shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] border border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
        <Icon className="w-16 h-16 text-indigo-600 -rotate-12 transform translate-x-4 -translate-y-4" />
      </div>

      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="p-2 bg-indigo-50/80 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
          <Icon className="w-4 h-4 text-indigo-600 group-hover:text-white transition-colors" />
        </div>
        {trend && (
          <div className={clsx(
            "flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border",
            isPositive 
              ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
              : "text-rose-700 bg-rose-50 border-rose-100"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
        <div className="text-xl font-bold text-slate-800 tracking-tight">{value}</div>
        {trendLabel && (
          <p className="text-slate-400 text-[10px] mt-1 font-medium">{trendLabel}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;