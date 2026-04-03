"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { Loader2, Trophy, Clock, KeySquare, Save, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RoomPage() {
    const { user, loading: authLoading } = useAuth();
    const [scrims, setScrims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [saved, setSaved] = useState<string | null>(null);
    const [roomData, setRoomData] = useState<Record<string, { roomID: string; roomPassword: string }>>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (authLoading || !user) return;
        api.get("/scrims/all")
            .then(({ data }) => {
                const arr = Array.isArray(data) ? data : [];
                setScrims(arr);
                // Pre-fill existing room data
                const initial: Record<string, { roomID: string; roomPassword: string }> = {};
                arr.forEach((s: any) => {
                    initial[s._id] = { roomID: s.roomID || "", roomPassword: s.roomPassword || "" };
                });
                setRoomData(initial);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user, authLoading]);

    const handleSave = async (scrimId: string) => {
        setSaving(scrimId);
        try {
            await api.put(`/scrims/${scrimId}`, roomData[scrimId]);
            setSaved(scrimId);
            setTimeout(() => setSaved(null), 2500);
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(null);
        }
    };

    if (authLoading || !user || loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-10 w-10 text-red-500 animate-spin" /></div>;
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-h-screen">
                <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-black tracking-tight mb-1">Room Management</h1>
                        <p className="text-zinc-500">Set Room IDs and Passwords for each active scrim so approved players can access them.</p>
                    </div>

                    {scrims.length === 0 ? (
                        <div className="text-center py-20 glass-morphism rounded-3xl text-zinc-500">No scrims found.</div>
                    ) : (
                        <div className="space-y-4">
                            {scrims.map((scrim) => (
                                <motion.div
                                    key={scrim._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="premium-card p-6 space-y-5"
                                >
                                    {/* Scrim Header */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                                            <Trophy className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="font-bold">{scrim.matchName}</div>
                                            <div className="text-xs text-zinc-500 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {new Date(scrim.time).toLocaleString("en-IN")} · ₹{scrim.entryFee} · {scrim.slotsFilled}/{scrim.totalSlots} slots
                                            </div>
                                        </div>
                                    </div>

                                    {/* Room Inputs */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1 block">Room ID</label>
                                            <div className="relative">
                                                <KeySquare className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Enter Room ID"
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                                                    value={roomData[scrim._id]?.roomID || ""}
                                                    onChange={(e) => setRoomData(prev => ({ ...prev, [scrim._id]: { ...prev[scrim._id], roomID: e.target.value } }))}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1 block">Room Password</label>
                                            <div className="relative">
                                                <KeySquare className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Enter Password"
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                                                    value={roomData[scrim._id]?.roomPassword || ""}
                                                    onChange={(e) => setRoomData(prev => ({ ...prev, [scrim._id]: { ...prev[scrim._id], roomPassword: e.target.value } }))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleSave(scrim._id)}
                                        disabled={saving === scrim._id}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${saved === scrim._id
                                                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20"
                                                : "bg-blue-600 hover:bg-blue-500 text-white"
                                            } disabled:opacity-50`}
                                    >
                                        {saving === scrim._id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : saved === scrim._id ? (
                                            <><CheckCircle2 className="h-4 w-4" /> Saved!</>
                                        ) : (
                                            <><Save className="h-4 w-4" /> Save Room Details</>
                                        )}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    </div>
);
}
