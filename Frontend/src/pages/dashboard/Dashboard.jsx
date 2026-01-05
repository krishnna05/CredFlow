import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Building, Activity, FileCheck, TrendingUp, Plus, Filter } from 'lucide-react';
import businessService from '../../services/businessService';
import StatCard from '../../components/dashboard/StatCard';
import RecentActivity from '../../components/dashboard/RecentActivity'; 
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [filterPeriod, setFilterPeriod] = useState('12m');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        let profileData = null;
        let activityData = [];

        try {
           profileData = await businessService.getProfile();
        } catch (err) {
           console.warn("Using fallback data", err);
           profileData = {
             businessName: user?.businessName || "K-Tech Innovations",
             annualRevenue: 0,
             yearsInOperation: 0,
             activeInvoicesCount: 0,
             creditUtilization: 0,
             revenueTrend: 0
           };
        }

        try {
           if (businessService.getRecentActivities) {
               activityData = await businessService.getRecentActivities();
           }
        } catch (err) { console.warn(err); }

        setProfile(profileData);
        setActivities(activityData);
        
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, user]);

  const handleFilterChange = (e) => {
    setFilterPeriod(e.target.value);
    console.log(`Filter changed to: ${e.target.value}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-8 w-8">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-8 w-8 bg-indigo-500"></span>
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Loading Dashboard</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-600 pb-10">
      
      {/* RICH HEADER BACKGROUND */}
      <div className="bg-slate-900 pb-20 pt-8 px-4 sm:px-6 lg:px-8 shadow-sm relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-violet-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-indigo-200 text-xs mt-1 font-medium">
              Welcome back, <span className="text-white">{profile?.businessName}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              className="bg-white/10 backdrop-blur-sm border-white/10 text-white hover:bg-white/20 h-8 text-xs px-3 font-medium transition-all" 
              onClick={() => navigate('/invoices')}
            >
              View Invoices
            </Button>
            <Button 
              variant="primary" 
              className="bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-900/50 h-8 text-xs px-4 font-semibold border border-indigo-400/50" 
              onClick={() => navigate('/upload')}
            >
              <span className="flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                New Upload
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-6 -mt-12 relative z-20 space-y-4">
        
        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="Annual Revenue"
            value={`₹${profile?.annualRevenue?.toLocaleString() ?? '0'}`}
            icon={Wallet}
            trend={profile?.revenueTrend > 0 ? "up" : "neutral"}
            trendValue={profile?.revenueTrend ? `${profile.revenueTrend}%` : null}
            trendLabel="vs last year"
          />
          <StatCard
            title="Business Age"
            value={`${profile?.yearsInOperation ?? 0} Years`}
            icon={Building}
            trendLabel="Operational stability"
          />
          <StatCard
            title="Active Invoices"
            value={profile?.activeInvoicesCount ?? "0"}
            icon={FileCheck}
            trendLabel="Pending processing"
          />
          <StatCard
            title="Credit Utilization"
            value={`${profile?.creditUtilization ?? 0}%`}
            icon={Activity}
            trend="down"
            trendValue="0%"
            trendLabel="Available limit"
          />
        </div>

        {/* ANALYTICS & ACTIVITY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* CHART SECTION */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] border border-slate-100 p-4 flex flex-col min-h-[340px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  Revenue Analytics
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Financial performance over time</p>
              </div>
              
              {/* Functional Filter Dropdown */}
              <div className="relative w-full sm:w-auto">
                <select 
                  value={filterPeriod}
                  onChange={handleFilterChange}
                  className="appearance-none w-full sm:w-auto pl-8 pr-6 py-1.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-medium text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <option value="12m">Last 12 Months</option>
                  <option value="6m">Last 6 Months</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="ytd">Year to Date</option>
                </select>
                <Filter className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            
            {/* Empty State / Placeholder for Chart */}
            <div className="flex-1 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 flex flex-col justify-center items-center relative overflow-hidden group">
               {/* Decorative grid pattern */}
               <div className="absolute inset-0 opacity-[0.03]" 
                    style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
               </div>
               
               <div className="text-center z-10 p-6 transition-transform duration-500 group-hover:scale-105">
                 <div className="bg-white p-3 rounded-full shadow-sm inline-flex mb-3">
                   <Activity className="h-6 w-6 text-indigo-300" />
                 </div>
                 <h4 className="text-sm font-semibold text-slate-900">No data available</h4>
                 <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto leading-relaxed">
                   Upload your first batch of invoices to unlock real-time financial insights and credit projections.
                 </p>
                 
                 {/* Functional Start Upload Button */}
                 <Button 
                    variant="ghost" 
                    onClick={() => navigate('/upload')}
                    className="mt-3 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs h-8"
                 >
                    Start Upload
                 </Button>
               </div>
            </div>
          </div>
          
          {/* RECENT ACTIVITY SECTION */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col overflow-hidden h-full max-h-[340px]">
             <RecentActivity activities={activities || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;