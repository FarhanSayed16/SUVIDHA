import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, FileText, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import api from '../utils/api';
import { useAuthStore } from '../store/useAuthStore';

interface DashboardMetrics {
    complaints: {
        total: number;
        resolved: number;
        active: number;
    };
    bills: {
        totalAttempts: number;
        successfulPayments: number;
        revenueCollected: number;
    };
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const logout = useAuthStore(state => state.logout);
    const user = useAuthStore(state => state.user);

    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const resp = await api.get('/admin/analytics/dashboard');
                setMetrics(resp.data);
            } catch (err) {
                setError('Failed to securely fetch telemetry statistics.');
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
        // Polling loop for active data observation
        const interval = setInterval(fetchMetrics, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">

            {/* Sidebar Navigation */}
            <div className="w-64 bg-background-light border-r border-gray-800 flex flex-col pt-8">
                <div className="px-6 mb-10">
                    <h2 className="text-xl font-bold tracking-widest text-white">SUVIDHA</h2>
                    <p className="text-xs text-primary-light uppercase tracking-wider font-bold mt-1">Admin Portal</p>
                </div>

                <div className="flex-1 flex flex-col space-y-2 px-4">
                    <button className="flex items-center px-4 py-3 rounded-lg bg-primary/20 text-primary-light">
                        <AlertTriangle size={18} className="mr-3" /> Dashboard
                    </button>
                    <button onClick={() => navigate('/complaints')} className="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                        <CheckCircle2 size={18} className="mr-3" /> Grievance Queue
                    </button>
                    <button disabled className="flex items-center px-4 py-3 rounded-lg text-gray-600 cursor-not-allowed">
                        <Users size={18} className="mr-3" /> Citizen Records
                    </button>
                    <button disabled className="flex items-center px-4 py-3 rounded-lg text-gray-600 cursor-not-allowed">
                        <FileText size={18} className="mr-3" /> Advisories
                    </button>
                </div>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center justify-between px-2 mb-4">
                        <span className="text-sm text-gray-400">ID: Admin-{user?.userId}</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_theme(colors.green.500)]"></div>
                    </div>
                    <button onClick={handleLogout} className="btn w-full bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30">
                        Disconnect Session
                    </button>
                </div>
            </div>

            {/* Main Content Pane */}
            <div className="flex-1 flex flex-col p-10 overflow-y-auto animate-fade-in">

                <div className="mb-10">
                    <h1 className="text-3xl font-bold">Metrics Overview</h1>
                    <p className="text-gray-400 mt-2">Real-time aggregation mapping across Central Civic DB.</p>
                </div>

                {error ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">{error}</div>
                ) : loading && !metrics ? (
                    <div className="text-gray-400 animate-pulse">Aggregating telemetry nodes...</div>
                ) : metrics ? (
                    <div className="grid grid-cols-3 gap-6">

                        {/* Revenue Card */}
                        <div className="card p-6 border-t-4 border-t-green-500 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-green-500/5 rounded-bl-[100px] pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Digital Revenue</p>
                                    <h3 className="text-4xl font-bold mt-2 text-white flex items-center">
                                        <IndianRupee size={32} className="mr-1 text-green-400" />
                                        {metrics.bills.revenueCollected.toLocaleString()}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-400 mt-6">
                                <span className="text-white font-bold mr-1">{metrics.bills.successfulPayments}</span> Successful Transfers
                            </div>
                        </div>

                        {/* Active Complaints */}
                        <div className="card p-6 border-t-4 border-t-orange-500 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/5 rounded-bl-[100px] pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Active Issues</p>
                                    <h3 className="text-4xl font-bold mt-2 text-white">
                                        {metrics.complaints.active}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-400 mt-6">
                                <span className="text-white font-bold mr-1">{metrics.complaints.total}</span> Total Logged This Cycle
                            </div>
                        </div>

                        {/* Resolved Issues */}
                        <div className="card p-6 border-t-4 border-t-primary-light relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Issues Resolved</p>
                                    <h3 className="text-4xl font-bold mt-2 text-white">
                                        {metrics.complaints.resolved}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-400 mt-6">
                                <span className="text-primary-light font-bold mr-1">{metrics.complaints.total > 0 ? Math.round((metrics.complaints.resolved / metrics.complaints.total) * 100) : 0}%</span> Efficiency Rating
                            </div>
                        </div>

                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Dashboard;
