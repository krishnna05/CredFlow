import { useState } from 'react';
import RiskTrendChart from './RiskTrendChart';
import Card from '../../components/common/Card';
import { Activity, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const AnalyticsPage = () => {
    // Mock data for the risk trend chart
    const [trendData] = useState([
        { date: '2024-01-01', score: 85 },
        { date: '2024-01-08', score: 82 },
        { date: '2024-01-15', score: 88 },
        { date: '2024-01-22', score: 79 },
        { date: '2024-01-29', score: 84 },
        { date: '2024-02-05', score: 91 },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Risk Overview</h1>
                <p className="text-gray-500">
                    Monitor your overall credit health and risk trends.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Average Risk Score</h3>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Activity className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">85</span>
                        <span className="text-sm text-green-600 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" /> +2.5%
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">High Risk Invoices</h3>
                        <div className="p-2 bg-red-50 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">3</span>
                        <span className="text-sm text-red-600 flex items-center">
                            <TrendingDown className="w-4 h-4 mr-1" /> +1
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Processed Volume</h3>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">₹1.2M</span>
                        <span className="text-sm text-gray-500">Last 30 days</span>
                    </div>
                </div>
            </div>

            <Card title="Risk Score Trend">
                <div className="mt-4">
                    <RiskTrendChart data={trendData} />
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Recent Risk Alerts">
                    <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        No recent critical risk alerts.
                    </div>
                </Card>
                <Card title="Recommendations">
                    <ul className="space-y-3 mt-2">
                        <li className="flex gap-3 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                            Review invoices #INV-001 for potential duplicate entries.
                        </li>
                        <li className="flex gap-3 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                            Update business profile information to improve trust score.
                        </li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsPage;
