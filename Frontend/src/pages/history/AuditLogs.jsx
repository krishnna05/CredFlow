import { FileText, ShieldAlert, Wallet, Activity, Search, Filter } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useState } from 'react';

const getIcon = (type) => {
  switch (type) {
    case 'invoice':
      return <FileText className="w-4 h-4" />;
    case 'fraud':
      return <ShieldAlert className="w-4 h-4" />;
    case 'repayment':
      return <Wallet className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

const getBadgeVariant = (action) => {
  if (action.includes('UPLOAD')) return 'info';
  if (action.includes('APPROVED')) return 'success';
  if (action.includes('REJECTED') || action.includes('FAILED')) return 'danger';
  if (action.includes('WARNING')) return 'warning';
  return 'neutral';
};

const AuditLogs = () => {
  const { data: logs, loading, error, refetch } = useFetch('/audit-logs');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Failed to load audit logs.</p>
        <Button onClick={refetch}>Try Again</Button>
      </div>
    );
  }

  const filteredLogs = logs?.filter((log) => {
    const matchesFilter = filter === 'all' || log.entityType === filter;
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) || 
                          log.action.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-500 mt-1">
            Track all activities and system events for your account.
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {['all', 'invoice', 'repayment', 'fraud'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                  filter === type
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Badge variant={getBadgeVariant(log.action)}>
                          {log.action.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600 capitalize">
                        {getIcon(log.entityType)}
                        {log.entityType}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Filter className="w-8 h-8 text-gray-300 mb-2" />
                      <p>No logs found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AuditLogs;