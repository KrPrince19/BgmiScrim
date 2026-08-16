"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { Loader2, Trophy, Users, Trash2, Phone, Mail, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function PlayersPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const [scrims, setScrims] = useState<any[]>([]);
    const [selectedScrim, setSelectedScrim] = useState<any>(null);
    const [players, setPlayers] = useState<any[]>([]);
    const [loadingScrims, setLoadingScrims] = useState(true);
    const [loadingPlayers, setLoadingPlayers] = useState(false);
    const [removing, setRemoving] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (authLoading || !isAdmin) return;
        api.get("/scrims/all")
            .then(({ data }) => setScrims(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoadingScrims(false));
    }, [user, authLoading]);

    const fetchPlayers = async (scrim: any) => {
        setSelectedScrim(scrim);
        setLoadingPlayers(true);
        try {
            const { data } = await api.get(`/payments/admin/scrim/${scrim._id}/players`);
            setPlayers(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingPlayers(false);
        }
    };

    const handleRemove = async (paymentId: string) => {
        if (!confirm("Remove this player from the match? Their slot will be freed.")) return;
        setRemoving(paymentId);
        try {
            await api.delete(`/payments/admin/${paymentId}/remove`);
            setPlayers(prev => prev.filter(p => p._id !== paymentId));
        } catch (e) {
            console.error(e);
        } finally {
            setRemoving(null);
        }
    };

    if (authLoading || !user || loadingScrims) {
        return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-10 w-10 text-red-500 animate-spin" /></div>;
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-h-screen">
                <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-black tracking-tight mb-1">Player Management</h1>
                        <p className="text-zinc-500">Select a scrim to view and manage its approved players.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                        {/* Scrim selector */}
                        <div className="space-y-2">
                            <h2 className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-3">Select Scrim</h2>
                            {scrims.map((scrim) => (
                                <button
                                    key={scrim._id}
                                    onClick={() => fetchPlayers(scrim)}
                                    className={`w-full text-left p-4 rounded-xl transition-all border ${selectedScrim?._id === scrim._id
                                            ? "bg-red-600/20 border-red-500/30 text-white"
                                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Trophy className="h-4 w-4 text-blue-400" />
                                        <span className="font-bold text-sm truncate">{scrim.matchName}</span>
                                    </div>
                                    <div className="text-xs text-zinc-500">{scrim.slotsFilled}/{scrim.totalSlots} players</div>
                                </button>
                            ))}
                        </div>

                        {/* Players panel */}
                        <div>
                            {!selectedScrim ? (
                                <div className="flex flex-col items-center justify-center h-60 glass-morphism rounded-2xl text-zinc-600">
                                    <Users className="h-12 w-12 mb-3" />
                                    <p className="font-bold">Select a scrim to view players</p>
                                </div>
                            ) : loadingPlayers ? (
                                <div className="flex justify-center items-center h-60">
                                    <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
                                </div>
                            ) : players.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-60 glass-morphism rounded-2xl text-zinc-600">
                                    <UserCheck className="h-12 w-12 mb-3" />
                                    <p className="font-bold">No approved players yet</p>
                                    <p className="text-sm mt-1">Approve payments to add players here.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">
                                        {players.length} Approved Player{players.length !== 1 ? "s" : ""} — {selectedScrim.matchName}
                                    </h2>
                                    {players.map((p, i) => (
                                        <motion.div
                                            key={p._id}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="premium-card p-4 flex items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-black text-sm flex-shrink-0">
                                                    {p.user?.username?.[0]?.toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm">{p.user?.username}</div>
                                                    <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
                                                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{p.user?.email}</span>
                                                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{p.user?.phone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(p._id)}
                                                disabled={removing === p._id}
                                                className="p-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 transition-colors border border-red-500/10 disabled:opacity-50"
                                                title="Remove player"
                                            >
                                                {removing === p._id
                                                    ? <Loader2 className="h-4 w-4 text-red-500 animate-spin" />
                                                    : <Trash2 className="h-4 w-4 text-red-500" />
                                                }
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
);
}
