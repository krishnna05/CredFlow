import { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, RefreshCw, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import RiskTrendChart from './RiskTrendChart';
import CreditScoreGauge from './CreditScoreGauge';
import Card from '../../components/common/Card';
import axiosInstance from '../../api/axiosInstance'; 

const StatCard = ({ title, value, DQ, trend, trendValue, icon: Icon, color }) => {
  const isPositive = trend === 'up';

  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className={clsx("p-2.5 rounded-xl border", colorStyles[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={clsx(
          "px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1",
          isPositive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trendValue}
        </span>
        <span className="text-xs text-slate-400 font-medium">vs last month</span>
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
      <div className="flex items-center justify-center h-screen w-full bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center flex justify-center items-center h-full">
        <div className="bg-rose-50 text-rose-600 p-6 rounded-xl border border-rose-100 inline-block max-w-md">
          <AlertTriangle className="w-8 h-8 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">Error Loading Data</h3>
          <p className="text-sm text-rose-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs bg-white px-4 py-2 rounded-lg border border-rose-200 hover:bg-rose-100 shadow-sm font-semibold transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-6 md:p-8" style={{ zoom: '80%' }}>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-800">
            Analytics & Risk Overview
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Real-time insights into your credit health and transaction volume.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-sm">
            Last Updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Average Risk Score"
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
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Risk Score Trend</h3>
            <select className="text-xs border-none bg-slate-50 text-slate-600 font-semibold rounded-lg py-1 px-3 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-100">
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <RiskTrendChart data={data?.trendData || []} />
          </div>
        </div>

        {/* Credit Score Gauge Container */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 mb-4 self-start w-full">Current Health</h3>
          <CreditScoreGauge
            score={data?.avgRiskScore || 0}
            grade={data?.creditGrade || 'B'}
            loading={false}
          />
          <p className="text-center text-xs text-slate-400 mt-4 px-4">
            Your credit health is calculated based on payment history and invoice risks.
          </p>
        </div>
      </div>

      {/* Bottom Section: Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Critical Alerts</h3>
          {data?.alerts && data.alerts.length > 0 ? (
            <ul className="space-y-3">
              {data.alerts.map((alert, idx) => (
                <li key={idx} className="flex gap-3 items-start p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                  <span className="text-sm text-rose-700 font-medium">{alert.message}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-sm">No critical alerts requiring attention.</span>
            </div>
          )}
        </div>

        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-100/50 relative overflow-hidden">
          {/* Glossy Effect */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/50 rounded-full blur-3xl pointer-events-none"></div>

          <h3 className="text-lg font-bold mb-4 text-indigo-900 relative z-10">AI Recommendations</h3>
          <ul className="space-y-4 relative z-10">
            {data?.recommendations?.map((rec, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-indigo-800 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                <span className="leading-relaxed font-medium">{rec}</span>
              </li>
            )) || (
                <li className="text-sm text-indigo-400">Generating AI insights based on your recent activity...</li>
              )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;