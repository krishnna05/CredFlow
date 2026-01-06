import { FileText, ShieldAlert, Wallet, Activity, Search, Filter, ArrowDownUp, Download, Sparkles, RefreshCw } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { useState } from 'react';

// Helper to get vibrant styling based on log type
const getTypeStyles = (type) => {
  switch (type) {
    case 'invoice':
      return {
        icon: <FileText className="w-4 h-4 text-blue-600" />,
        bg: 'bg-blue-50 border-blue-100',
        text: 'text-blue-700'
      };
    case 'fraud':
      return {
        icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
        bg: 'bg-rose-50 border-rose-100',
        text: 'text-rose-700'
      };
    case 'repayment':
      return {
        icon: <Wallet className="w-4 h-4 text-emerald-600" />,
        bg: 'bg-emerald-50 border-emerald-100',
        text: 'text-emerald-700'
      };
    default:
      return {
        icon: <Activity className="w-4 h-4 text-violet-600" />,
        bg: 'bg-violet-50 border-violet-100',
        text: 'text-violet-700'
      };
  }
};

// Helper for modern badge styling
const getStatusStyles = (action) => {
  if (action.includes('UPLOAD') || action.includes('CREATED'))
    return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10';
  if (action.includes('APPROVED') || action.includes('SUCCESS'))
    return 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20';
  if (action.includes('REJECTED') || action.includes('FAILED') || action.includes('FRAUD'))
    return 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10';
  if (action.includes('WARNING') || action.includes('PENDING'))
    return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20';

  return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10';
};

const AuditLogs = () => {
  const { data: logs, loading, error, refetch } = useFetch('/audit-logs');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredLogs = logs?.filter((log) => {
    const matchesFilter = filter === 'all' || log.entityType === filter;
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const categories = ['all', 'invoice', 'repayment', 'fraud'];

  // RENDER CONTENT HELPER
  const renderTableContent = () => {
    // 1. LOADING STATE
    if (loading) {
      return (
        <tr>
          <td colSpan="4" className="p-4">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />
              ))}
            </div>
          </td>
        </tr>
      );
    }

    // 2. ERROR STATE (User Friendly Version)
    if (error) {
      return (
        <tr>
          <td colSpan="4" className="px-6 py-16 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="p-3 bg-gray-50 rounded-full mb-3 border border-gray-100">
                <ShieldAlert className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Unable to load history</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Your activity history will appear here once you start using the app.
              </p>
              <button
                onClick={refetch}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Refresh Page
              </button>
            </div>
          </td>
        </tr>
      );
    }

    // 3. EMPTY STATE (No Logs)
    if (filteredLogs.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="px-6 py-16 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="p-3 bg-gray-50 rounded-full mb-3 border border-gray-100">
                <Filter className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">No logs found</h3>
              <p className="text-xs text-gray-500 mt-1">
                There are no events matching your criteria.
              </p>
              <button
                onClick={() => { setFilter('all'); setSearch(''); }}
                className="mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                Clear filters
              </button>
            </div>
          </td>
        </tr>
      );
    }

    // 4. DATA STATE
    return filteredLogs.map((log) => {
      const typeStyle = getTypeStyles(log.entityType);
      const statusClass = getStatusStyles(log.action);

      return (
        <tr
          key={log._id}
          className="group hover:bg-indigo-50/30 transition-colors duration-150"
        >
          {/* Timestamp */}
          <td className="px-4 py-2.5 whitespace-nowrap">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-900">
                {new Date(log.createdAt).toLocaleDateString()}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </td>

          {/* Action Badge */}
          <td className="px-4 py-2.5 whitespace-nowrap">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${statusClass}`}>
              {log.action.replace(/_/g, ' ')}
            </span>
          </td>

          {/* Message/Details */}
          <td className="px-4 py-2.5">
            <p className="text-xs text-gray-700 leading-snug font-medium line-clamp-2">
              {log.message}
            </p>
          </td>

          {/* Category Icon */}
          <td className="px-4 py-2.5 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md border ${typeStyle.bg} ${typeStyle.text}`}>
                {typeStyle.icon}
              </div>
              <span className={`text-xs font-semibold capitalize ${typeStyle.text}`}>
                {log.entityType}
              </span>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-5 animate-in fade-in duration-500">

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h1 className="text-2xl font-bold text-white tracking-tight">
                Event Log
             </h1>
          </div>
          
          <p className="text-xs text-gray-200 mt-1 max-w-lg font-medium flex items-center gap-2">
             <span>Monitor sensitive actions and system events.</span>
             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 text-[10px]">
                <Sparkles className="w-2.5 h-2.5 text-indigo-300" />
                {logs?.length || 0} Events
             </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => refetch()} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium rounded-lg transition-all shadow-sm">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* CONTROLS BAR */}
        <div className="p-3 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-3 justify-between items-center">
          {/* TAB FILTERS */}
          <div className="flex p-1 w-full md:w-auto overflow-x-auto no-scrollbar gap-1">
            {categories.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`
                  relative px-4 py-2 text-xs font-bold rounded-lg capitalize whitespace-nowrap transition-all duration-200 ease-out
                  ${filter === type
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}
                `}
              >
                {type}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by action or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-40">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 group">
                    Timestamp
                    <ArrowDownUp className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                  </div>
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-48">
                  Action
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-40">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {renderTableContent()}
            </tbody>
          </table>
        </div>

        {/* FOOTER PAGINATION */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-[10px] text-gray-500">
            Showing {filteredLogs.length} results
          </span>
          <div className="flex gap-1">
            <button disabled={loading || !logs?.length} className="px-2 py-1 text-[10px] font-medium text-gray-400 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
            <button disabled={loading || !logs?.length} className="px-2 py-1 text-[10px] font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;