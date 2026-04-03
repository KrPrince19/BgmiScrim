"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { Loader2, Users, Trophy, CreditCard, CheckCircle2, Clock, Globe, AlertCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sessionError, setSessionError] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const socket = useSocket();

    useEffect(() => {
        if (authLoading || !user) return;
        setSessionError(false);
        api.get("/payments/admin/stats")
            .then(({ data }) => setStats(data))
            .catch((err) => {
                console.error("Dashboard Stats Error:", err);
                if (err.response?.status === 401) {
                    setSessionError(true);
                }
            })
            .finally(() => setLoading(false));
    }, [user, authLoading]);


    if (authLoading || !user || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: "Total Players", value: stats?.totalUsers ?? 0, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", pulse: true },
        { label: "Total Scrims", value: stats?.totalScrims ?? 0, icon: Trophy, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
        { label: "Pending Verification", value: stats?.pendingPayments ?? 0, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    ];

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-h-screen">
                <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black tracking-tight mb-1">
                            Welcome, <span className="text-red-500">{user.username}</span>
                        </h1>
                        <p className="text-zinc-500">Here's what's happening on your platform today.</p>
                    </div>

                    {sessionError && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-3 text-red-500">
                                <AlertCircle className="h-5 w-5" />
                                <p className="text-sm font-bold tracking-tight">Your Admin session has expired. Statistics may not be accurate.</p>
                            </div>
                            <button
                                onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
                                className="px-5 py-2 bg-red-600 text-white text-xs font-black rounded-lg hover:bg-red-700 transition-all uppercase tracking-widest shadow-lg shadow-red-600/20"
                            >
                                Re-login Now
                            </button>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {statCards.map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <motion.div
                                    key={card.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`premium-card p-6 border ${card.bg}`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">{card.label}</span>
                                        <div className="relative">
                                            {card.pulse && <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20"></span>}
                                            <Icon className={`h-5 w-5 ${card.color} relative z-10`} />
                                        </div>
                                    </div>
                                    <div className="text-4xl font-black">{card.value}</div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Quick Actions */}
                        <div className="premium-card p-6 border border-zinc-800">
                            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                                <Zap className="h-5 w-5 text-blue-500" /> Quick Actions
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                <a href="/scrims" className="px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                                    + Create New Scrim
                                </a>
                                <a href="/payments" className="px-5 py-3 bg-amber-600/20 text-amber-400 border border-amber-500/20 hover:bg-amber-600/30 rounded-xl font-bold text-sm transition-all">
                                    View Pending Payments ({stats?.pendingPayments ?? 0})
                                </a>
                            </div>
                        </div>

                        {/* Platform Configuration */}
                        <PlatformConfig />
                    </div>
                </main>
            </div>
        </div>
    );
}

function PlatformConfig() {
    const [lastMatchUrl, setLastMatchUrl] = useState("");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        api.get("/settings/last_match_youtube_url")
            .then(({ data }) => setLastMatchUrl(data.value))
            .catch(() => console.log("No setting found yet"));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false);
        try {
            await api.put("/settings/last_match_youtube_url", { value: lastMatchUrl });
            setSuccess(true);
            setLastMatchUrl(""); // Clear input on success
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to update setting", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="premium-card p-6 border border-zinc-800">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-red-500" /> Platform Config
            </h2>
            <div className="space-y-4">
                <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-2 block">
                        Watch Last Match URL (YouTube)
                    </label>
                    <input 
                        type="text" 
                        value={lastMatchUrl}
                        onChange={(e) => setLastMatchUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm focus:border-red-500/50 outline-none transition-all"
                    />
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (success ? <CheckCircle2 className="h-4 w-4" /> : "Update Link")}
                    {success ? "Saved successfully!" : (saving ? "Updating..." : "")}
                </button>
            </div>
        </div>
    );
}
