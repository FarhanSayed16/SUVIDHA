import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownloadCloud, ArrowLeft, BarChart2, PieChart as PieChartIcon, Activity, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import api from '../utils/api';

const COLORS = ['#3b82f6', '#fca5a5', '#60a5fa', '#f87171', '#93c5fd'];

const Analytics: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [usageData, setUsageData] = useState([]);
    const [serviceBreakdown, setServiceBreakdown] = useState<any>({});
    const [peakHours, setPeakHours] = useState([]);

    const [range, setRange] = useState('month');

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                // Determine temporal bounds
                const toDate = new Date();
                const fromDate = new Date();

                if (range === 'week') fromDate.setDate(fromDate.getDate() - 7);
                else if (range === 'month') fromDate.setMonth(fromDate.getMonth() - 1);
                else fromDate.setFullYear(fromDate.getFullYear() - 1);

                const dFrom = fromDate.toISOString().split('T')[0];
                const dTo = toDate.toISOString().split('T')[0];

                const [resUsage, resService, resPeak] = await Promise.all([
                    api.get(`/admin/analytics/usage?fromDate=${dFrom}&toDate=${dTo}`),
                    api.get(`/admin/analytics/service-breakdown`),
                    api.get(`/admin/analytics/peak-hours`)
                ]);

                setUsageData(resUsage.data);
                setServiceBreakdown(resService.data);
                setPeakHours(resPeak.data);

            } catch (err) {
                console.error("Failed to load rich analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [range]);

    // Format Pie Data dynamically from service object map
    const pieData = Object.keys(serviceBreakdown).map(key => ({
        name: key,
        value: serviceBreakdown[key].billsPaid + serviceBreakdown[key].complaints // Total Civic Engagement Volume
    })).filter(d => d.value > 0);

    const handleExportCSV = () => {
        if (!usageData.length) return alert('No temporal data available to export.');

        const headers = "Date,Transactions,BillsPaid,Grievances\n";
        const rows = usageData.map((row: any) => `${row.date},${row.transactions},${row.billsPaid},${row.complaints}`).join('\n');

        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `SUVIDHA_Analytics_Export_${range}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden p-8 animate-fade-in bg-background">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-400 hover:text-white mb-2 transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Back to Hub
                    </button>
                    <h1 className="text-3xl font-bold flex items-center"><BarChart2 className="mr-3 text-primary" size={32} /> Visual Analytics</h1>
                    <p className="text-gray-400 mt-1">Deep operational telemetry and temporal breakdown reports.</p>
                </div>
                <div className="flex space-x-4">
                    <select value={range} onChange={e => setRange(e.target.value)} className="input border-gray-700 bg-gray-800 text-sm">
                        <option value="week">Past 7 Days</option>
                        <option value="month">Past 30 Days</option>
                        <option value="year">Past 12 Months</option>
                    </select>
                    <button onClick={handleExportCSV} className="btn bg-gray-800 hover:bg-gray-700 flex items-center border border-gray-700">
                        <DownloadCloud size={18} className="mr-2" /> Export CSV Tracker
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex justify-center items-center text-primary animate-pulse">
                    <Activity size={48} className="animate-spin" />
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto pr-4 pb-8 space-y-8">

                    {/* Time Series Traffic Chart */}
                    <div className="card p-6">
                        <h3 className="text-xl font-bold mb-6 flex items-center"><Activity size={20} className="mr-2 text-primary-light" /> Temporal Operations Volume</h3>
                        <div className="w-full h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="date" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="billsPaid" name="Successful Payments" stroke="#3b82f6" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="complaints" name="Grievances Logged" stroke="#f87171" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Peak Operational Hours */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center"><Clock size={20} className="mr-2 text-primary-light" /> Transit Peak Hours</h3>
                            <div className="w-full h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={peakHours}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="hour" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                                        <Bar dataKey="volume" name="Transaction Volume" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Service Category Split */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center"><PieChartIcon size={20} className="mr-2 text-primary-light" /> Civic Engagement Matrix</h3>
                            <div className="w-full h-64 flex justify-center">
                                {pieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label>
                                                {pieData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center text-gray-500">Awaiting Service Traffic...</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Analytics;
