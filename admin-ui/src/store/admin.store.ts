/* ═══════════════════════════════════════════════════════
   SUVIDHA Admin UI — Zustand Store
   JWT stored in sessionStorage per TRD §3.2
   ═══════════════════════════════════════════════════════ */
import { create } from 'zustand';
import type { AdminInfo } from '../types';

const TOKEN_KEY = 'suvidha_admin_token';

export interface AdminState {
    // Auth
    token: string | null;
    admin: AdminInfo | null;
    isAuthenticated: boolean;

    // Actions
    login: (token: string, admin: AdminInfo) => void;
    logout: () => void;

    // Helpers
    getToken: () => string | null;
}

function decodeJWT(token: string): AdminInfo | null {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

        const role = decoded.role as string;
        // Strictly prevent Kiosk 'CITIZEN' tokens from authenticating the Admin UI
        if (role !== 'MUNICIPAL_ADMIN' && role !== 'SYSTEM_ADMIN' && role !== 'admin') {
            return null;
        }
        // Normalize 'admin' to MUNICIPAL_ADMIN for display
        const normalizedRole = role === 'admin' ? 'MUNICIPAL_ADMIN' : role;

        return {
            adminId: decoded.adminId || decoded.sub, // Fallback to sub if new format
            name: decoded.name as string,
            ulbId: decoded.ulbId as string,
            role: normalizedRole,
        };
    } catch {
        return null;
    }
}

// Bootstrap from sessionStorage on app load
const storedToken = sessionStorage.getItem(TOKEN_KEY);
const bootstrapAdmin = storedToken ? decodeJWT(storedToken) : null;

export const useAdminStore = create<AdminState>((set) => ({
    token: storedToken,
    admin: bootstrapAdmin,
    isAuthenticated: !!storedToken && !!bootstrapAdmin,

    login: (token, admin) => {
        sessionStorage.setItem(TOKEN_KEY, token);
        set({ token, admin, isAuthenticated: true });
    },

    logout: () => {
        sessionStorage.removeItem(TOKEN_KEY);
        set({ token: null, admin: null, isAuthenticated: false });
    },

    getToken: () => sessionStorage.getItem(TOKEN_KEY),
}));
