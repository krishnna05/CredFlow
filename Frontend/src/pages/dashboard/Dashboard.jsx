import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Building, Activity, FileCheck } from 'lucide-react';
import businessService from '../../services/businessService';
import StatCard from '../../components/dashboard/StatCard';
import RecentActivity from '../../components/dashboard/RecentActivity'; // Import added
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock activity data (replace with API call later)
  const recentActivities = [
    { id: 1, type: 'INVOICE_UPLOAD', title: 'Invoice #INV-2024-001 Uploaded', description: 'Analysis pending', timestamp: new Date().toISOString() },
    { id: 2, type: 'RISK_ASSESSMENT', title: 'Risk Analysis Complete', description: 'Low risk detected for Inv #001', timestamp: new Date(Date.now() - 86400000).toISOString() }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await businessService.getProfile();
        setProfile(data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          navigate('/onboarding');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  if (!profile) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Dashboard
          </h1>
          <p className="text-secondary mt-1">
            Welcome back, <span className="font-semibold text-gray-900">{profile.businessName}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/invoices')}>
            View Invoices
          </Button>
          <Button variant="primary" onClick={() => navigate('/upload')}>
            New Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Annual Revenue"
          value={`₹${profile.annualRevenue?.toLocaleString()}`}
          icon={Wallet}
          trend="up"
          trendValue="+12%"
          trendLabel="vs last year"
        />
        <StatCard
          title="Business Age"
          value={`${profile.yearsInOperation} Years`}
          icon={Building}
          trendLabel="Operational stability"
        />
        <StatCard
          title="Active Invoices"
          value="0"
          icon={FileCheck}
          trendLabel="Pending processing"
        />
        <StatCard
          title="Credit Utilization"
          value="0%"
          icon={Activity}
          trend="down"
          trendValue="0%"
          trendLabel="Available limit"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
             {/* Main Chart Area could go here */}
             <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center h-full flex flex-col justify-center">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
                  <p className="text-gray-500 mt-2 mb-6">
                    Chart data will appear here once you have sufficient history.
                  </p>
                </div>
              </div>
        </div>
        
        <div className="lg:col-span-1">
           <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;