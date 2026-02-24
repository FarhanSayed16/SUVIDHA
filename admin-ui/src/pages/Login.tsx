import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import { useAuthStore } from '../store/useAuthStore';

const Login: React.FC = () => {
    const [phone, setPhone] = useState('9876543210'); // Default admin phone
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Re-using the same Auth Service logic but assuming this user has Role.ADMIN in DB
            await api.post('/auth/send-otp', { phone });
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to initialize administrative auth sequence');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const resp = await api.post('/auth/verify-otp', { phone, otp });
            const { token, user } = resp.data;

            // Critical: Enforce Admin specific routing
            if (user.role !== 'ADMIN') {
                setError('Access Denied. Identity verified but lacks Administrative privileges.');
                return;
            }

            login(token, user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Verification explicitly denied.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center animate-fade-in relative overflow-hidden bg-background">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none filter blur-xl" style={{ background: 'radial-gradient(circle at top right, #3b82f6, transparent 40%)' }}></div>

            <div className="card w-full max-w-md p-10 z-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-primary/50 shadow-neon">
                        <Shield size={40} className="text-primary-light" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">SUVIDHA Admin</h1>
                    <p className="text-gray-400 text-center text-sm">Centralized Civic Operations Control</p>
                </div>

                {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/50 text-red-300 rounded-lg text-sm flex items-center"><Lock size={16} className="mr-2" />{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="flex flex-col space-y-6">
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Authorized Phone Number</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="Enter 10-digit number"
                                    className="input w-full pl-12 text-lg tracking-widest font-mono py-3"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading || phone.length < 10} className="btn btn-primary w-full py-4 flex justify-center items-center group">
                            {loading ? 'Authenticating...' : <>Request Security OTP <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" /></>}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="flex flex-col space-y-6 animate-slide-up">
                        <div className="flex flex-col space-y-2 text-center mb-2">
                            <p className="text-sm text-gray-400 mb-2">Transmission Dispatched To</p>
                            <p className="font-mono text-xl text-primary-light tracking-widest">{phone}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="text"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                placeholder="Enter 6-Digit Verification PIN"
                                maxLength={6}
                                className="input w-full text-center text-2xl tracking-[0.5em] font-mono py-4"
                                autoFocus
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading || otp.length < 6} className="btn btn-primary w-full py-4 flex justify-center items-center group">
                            {loading ? 'Decrypting payload...' : <>Secure Login <Shield size={18} className="ml-2" /></>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
