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
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/analytics/overview');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Analytics Fetch Error:", err);
        const msg = err.response?.data?.message || err.message || "Failed to load data";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-semibold text-gray-500">Syncing Financial Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl border border-rose-100 shadow-xl inline-block max-w-md">
          <div className="bg-rose-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
             <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to Load Analytics</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#EEF2FF] p-6 md:p-10 font-sans" style={{ zoom: '85%' }}>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Financial Analytics
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            Real-time assessment of credit risk and transaction stability.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
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
          value={`₹${(data?.volume / 1000000).toFixed(2)}M`}
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
              grade={data?.creditGrade || 'B'}
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
              {data?.recommendations?.map((rec, idx) => (
                <li key={idx} className="flex gap-4 text-sm text-gray-600 items-start bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                  <span className="leading-relaxed font-medium">{rec}</span>
                </li>
              )) || (
                <div className="flex items-center gap-3 text-sm text-gray-400 animate-pulse">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  Generating smart insights based on recent data...
                </div>
              )}
            </ul>
            
            {/* UPDATED BUTTON: Transparent Text View */}
            <button className="mt-6 w-full py-2.5 bg-transparent text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-indigo-50 hover:text-indigo-800 transition-colors">
              View Detailed Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;