'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authApi.me().then(data => setUser(data.user)).catch(() => setUser(null)).finally(() => setLoading(false));
    }, []);

    const login = async (body) => {
        const data = await authApi.login(body);
        setUser(data.user);
        return data;
    };
    const signup = async (body) => {
        const data = await authApi.signup(body);
        setUser(data.user);
        return data;
    };
    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };
    const refresh = async () => {
        const data = await authApi.me();
        setUser(data.user);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    return ctx || { user: null, loading: true, login: async () => { }, signup: async () => { }, logout: async () => { }, refresh: async () => { } };
};