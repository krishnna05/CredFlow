import { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, RefreshCw, DollarSign, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import RiskTrendChart from './RiskTrendChart';
import CreditScoreGauge from './CreditScoreGauge';
import axiosInstance from '../../api/axiosInstance'; 

// --- Components ---

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color }) => {
  const isPositive = trend === 'up';

  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</p>
          <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={clsx("p-3 rounded-xl", colorStyles[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={clsx(
          "px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1",
          isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trendValue}
        </span>
        <span className="text-xs text-gray-400 font-medium">vs last month</span>
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/analytics/overview');
        setData(response.data);
      } catch (err) {
        console.error("Analytics Fetch Error:", err);
        // We do not redirect or show error, we just show empty data state
        setData(null); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh] w-full bg-[#0f172a]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-sm font-semibold text-gray-400">Syncing Financial Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[85vh] bg-[#0f172a] font-sans overflow-hidden" style={{ zoom: '85%' }}>
      
      {/* --- ADDED: Background Effects --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-1000" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      {/* --- Content Wrapper (z-10 to sit above background) --- */}
      <div className="relative z-10 p-6 md:p-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            {/* Changed text color to white for dark background */}
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Financial Analytics
            </h1>
            <p className="text-gray-400 mt-1 font-medium text-sm">
              Real-time assessment of credit risk and transaction stability.
            </p>
          </div>
          <div className="flex gap-2">
            {/* Always show "Live Updated" Badge regardless of data state */}
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold text-white shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.6)]"></span>
              Live Updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Avg. Risk Score"
            value={data?.avgRiskScore || 0}
            trend={data?.riskTrend >= 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(data?.riskTrend || 0)}%`}
            icon={Activity}
            color="indigo"
          />
          <StatCard
            title="High Risk Invoices"
            value={data?.highRiskCount || 0}
            trend="down"
            trendValue={data?.highRiskChange || "0"}
            icon={AlertTriangle}
            color="rose"
          />
          <StatCard
            title="Processed Volume"
            value={`₹${((data?.volume || 0) / 1000000).toFixed(2)}M`}
            trend="up"
            trendValue="0%"
            icon={DollarSign}
            color="emerald"
          />
        </div>

        {/* Charts & Gauges Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Risk Score Trend</h3>
              <select className="text-xs border-none bg-gray-50 text-gray-600 font-semibold rounded-lg py-2 px-3 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-100 transition-all">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <RiskTrendChart data={data?.trendData || []} />
            </div>
          </div>

          {/* Credit Score Gauge Container */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center">
            <h3 className="text-lg font-bold text-gray-800 mb-6 self-start w-full border-b border-gray-50 pb-4">Current Health</h3>
            <div className="py-2">
              <CreditScoreGauge
                score={data?.avgRiskScore || 0}
                grade={data?.creditGrade || '-'}
                loading={false}
              />
            </div>
            <p className="text-center text-xs text-gray-400 mt-6 px-4 leading-relaxed">
              Calculated via proprietary algorithms analyzing payment history and invoice volatility.
            </p>
          </div>
        </div>

        {/* Bottom Section: Recommendations & Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Alerts Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-bold text-gray-800">Critical Alerts</h3>
            </div>
            
            {data?.alerts && data.alerts.length > 0 ? (
              <ul className="space-y-3">
                {data.alerts.map((alert, idx) => (
                  <li key={idx} className="flex gap-4 items-start p-4 bg-rose-50 rounded-xl border border-rose-100 group hover:bg-rose-100 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                    <span className="text-sm text-rose-800 font-medium leading-relaxed">{alert.message}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                <span className="text-sm font-medium">System Clear. No critical alerts.</span>
              </div>
            )}
          </div>

          {/* AI Recommendations */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] relative overflow-hidden">
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-800">AI Insights</h3>
              </div>

              <ul className="space-y-4">
                {data?.recommendations && data.recommendations.length > 0 ? (
                    data.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-4 text-sm text-gray-600 items-start bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                        <span className="leading-relaxed font-medium">{rec}</span>
                      </li>
                    ))
                ) : (
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    No insights available at this time.
                  </div>
                )}
              </ul>
              
              <button className="mt-6 w-full py-2.5 bg-transparent text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-indigo-50 hover:text-indigo-800 transition-colors">
                View Detailed Report
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;