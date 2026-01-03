import { FileText, CheckCircle, AlertTriangle, Clock, ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';

const ActivityIcon = ({ type }) => {
  switch (type) {
    case 'INVOICE_UPLOAD':
      return <FileText className="w-5 h-5 text-blue-500" />;
    case 'RISK_ASSESSMENT':
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case 'FINANCING_APPROVED':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'PAYMENT_RECEIVED':
      return <ArrowUpRight className="w-5 h-5 text-purple-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
};

const RecentActivity = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">No recent activity</h3>
        <p className="text-sm text-gray-500 mt-1">
          New actions will appear here as they happen.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-primary hover:text-accent font-medium transition-colors">
          View All
        </button>
      </div>
      
      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors flex gap-4">
            <div className={clsx(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              "bg-gray-50 border border-gray-100"
            )}>
              <ActivityIcon type={activity.type} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.title}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {activity.description}
              </p>
            </div>
            
            <div className="text-xs text-gray-400 whitespace-nowrap pt-1">
              {new Date(activity.timestamp).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;