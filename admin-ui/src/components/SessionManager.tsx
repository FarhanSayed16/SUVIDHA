import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const SessionManager: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useAuthStore(state => state.logout);
    const token = useAuthStore(state => state.token);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 5 minutes of inactivity for Admin = session kill
    const TIMEOUT_MS = 5 * 60 * 1000;

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);

        // Only enforce if the user is authenticated and not on login page
        if (token && location.pathname !== '/login') {
            timerRef.current = setTimeout(() => {
                handleTimeout();
            }, TIMEOUT_MS);
        }
    };

    const handleTimeout = () => {
        if (token) {
            logout();
        }
        navigate('/login', { replace: true });
    };

    useEffect(() => {
        resetTimer();

        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

        const handleActivity = () => {
            resetTimer();
        };

        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [location.pathname, token]);

    return null;
};

export default SessionManager;
