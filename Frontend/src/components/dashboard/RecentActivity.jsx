import { FileText, CheckCircle, AlertTriangle, Clock, ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';

const ActivityIcon = ({ type }) => {
  const baseClass = "w-3.5 h-3.5";
  switch (type) {
    case 'INVOICE_UPLOAD':
      return <div className="bg-blue-100 p-1.5 rounded-md"><FileText className={`${baseClass} text-blue-600`} /></div>;
    case 'RISK_ASSESSMENT':
      return <div className="bg-orange-100 p-1.5 rounded-md"><AlertTriangle className={`${baseClass} text-orange-600`} /></div>;
    case 'FINANCING_APPROVED':
      return <div className="bg-emerald-100 p-1.5 rounded-md"><CheckCircle className={`${baseClass} text-emerald-600`} /></div>;
    case 'PAYMENT_RECEIVED':
      return <div className="bg-purple-100 p-1.5 rounded-md"><ArrowUpRight className={`${baseClass} text-purple-600`} /></div>;
    default:
      return <div className="bg-slate-100 p-1.5 rounded-md"><Clock className={`${baseClass} text-slate-500`} /></div>;
  }
};

const RecentActivity = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-2">
          <Clock className="w-5 h-5 text-slate-300" />
        </div>
        <p className="text-xs font-medium">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
        <button className="text-[10px] uppercase tracking-wide font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
          View All
        </button>
      </div>
      
      <div className="divide-y divide-slate-50 overflow-y-auto custom-scrollbar">
        {activities.map((activity) => (
          <div key={activity.id} className="px-5 py-3 hover:bg-slate-50/80 transition-colors flex gap-3 group cursor-default">
            <div className="shrink-0 pt-0.5">
              <ActivityIcon type={activity.type} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors truncate pr-2">
                  {activity.title}
                </p>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;