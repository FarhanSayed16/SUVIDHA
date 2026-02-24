import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { RefreshCw, Filter, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Complaint {
    id: number;
    referenceNumber: string;
    category: string;
    description: string;
    priority: string;
    status: string;
    createdAt: string;
}

const Complaints: React.FC = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            let query = '/admin/complaints/list?';
            if (statusFilter) query += `status=${statusFilter}&`;
            if (priorityFilter) query += `priority=${priorityFilter}`;

            const resp = await api.get(query);
            setComplaints(resp.data);
        } catch (err) {
            console.error('Failed to fetch admin complaints view', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [statusFilter, priorityFilter]);

    const updateStatus = async (id: number, newStatus: string) => {
        setUpdating(id);
        try {
            await api.patch(`/admin/complaints/${id}`, { status: newStatus });
            setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        } catch (err) {
            alert('Failed to update complaint status');
        } finally {
            setUpdating(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'REGISTERED': return 'bg-gray-800 text-gray-300';
            case 'IN_PROGRESS': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50';
            case 'RESOLVED': return 'bg-green-500/20 text-green-400 border border-green-500/50';
            default: return 'bg-gray-800 text-gray-300';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'EMERGENCY': return 'text-red-400 font-bold';
            case 'HIGH': return 'text-orange-400';
            case 'NORMAL': return 'text-blue-300';
            default: return 'text-gray-300';
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Grievance Management</h1>
                    <p className="text-gray-400 mt-1">Review, prioritize, and resolve civic complaints in real-time.</p>
                </div>
                <div className="flex space-x-4">
                    <button onClick={() => navigate('/dashboard')} className="btn bg-gray-800 hover:bg-gray-700">Hub</button>
                    <button onClick={fetchComplaints} disabled={loading} className="btn btn-primary flex items-center">
                        <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>
            </div>

            <div className="flex space-x-4 mb-6">
                <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input pl-10 h-12 w-48 text-sm cursor-pointer">
                        <option value="">All Statuses</option>
                        <option value="REGISTERED">Registered</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                    </select>
                </div>
                <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="input pl-10 h-12 w-48 text-sm cursor-pointer">
                        <option value="">All Priorities</option>
                        <option value="EMERGENCY">Emergency</option>
                        <option value="HIGH">High Priority</option>
                        <option value="NORMAL">Normal</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-auto card">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-background-light sticky top-0 z-10 border-b border-gray-800">
                        <tr>
                            <th className="p-4 text-xs tracking-widest text-gray-400 font-bold uppercase w-48">Reference ID</th>
                            <th className="p-4 text-xs tracking-widest text-gray-400 font-bold uppercase w-40">Category</th>
                            <th className="p-4 text-xs tracking-widest text-gray-400 font-bold uppercase">Description</th>
                            <th className="p-4 text-xs tracking-widest text-gray-400 font-bold uppercase w-32">Priority</th>
                            <th className="p-4 text-xs tracking-widest text-gray-400 font-bold uppercase w-40 text-center">Status</th>
                            <th className="p-4 text-xs tracking-widest text-gray-400 font-bold uppercase w-48 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading && complaints.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-400">Loading network telemetry...</td></tr>
                        ) : complaints.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-400">No grievance records found matching criteria.</td></tr>
                        ) : complaints.map(c => (
                            <tr key={c.id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="p-4 font-mono text-sm tracking-widest text-primary-light">{c.referenceNumber}</td>
                                <td className="p-4 text-sm font-medium">{c.category.replace('_', ' ')}</td>
                                <td className="p-4 text-sm text-gray-300 max-w-xs truncate">{c.description}</td>
                                <td className={`p-4 text-sm font-bold ${getPriorityColor(c.priority)}`}>
                                    {c.priority === 'EMERGENCY' && <AlertTriangle size={14} className="inline mr-1 -mt-1" />}
                                    {c.priority}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`inline-block px-3 py-1 rounded text-xs font-bold tracking-widest ${getStatusColor(c.status)}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => updateStatus(c.id, 'IN_PROGRESS')}
                                            disabled={c.status === 'IN_PROGRESS' || updating === c.id}
                                            className="btn bg-gray-800 hover:bg-yellow-500/20 hover:text-yellow-400 flex items-center px-3 py-1.5 text-xs border border-gray-700 hover:border-yellow-500/50"
                                            title="Mark Active"
                                        >
                                            <Clock size={14} />
                                        </button>
                                        <button
                                            onClick={() => updateStatus(c.id, 'RESOLVED')}
                                            disabled={c.status === 'RESOLVED' || updating === c.id}
                                            className="btn bg-gray-800 hover:bg-green-500/20 hover:text-green-400 flex items-center px-3 py-1.5 text-xs border border-gray-700 hover:border-green-500/50"
                                            title="Mark Resolved"
                                        >
                                            <CheckCircle2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Complaints;
