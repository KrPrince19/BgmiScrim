"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { Loader2, Trophy, User, Zap, Star, Check, Plus, Trash2, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/context/SocketContext";
import toast from "react-hot-toast";

export default function LeaderboardAdmin() {
    const { user, loading: authLoading } = useAuth();
    const [scrims, setScrims] = useState<any[]>([]);
    const [selectedScrim, setSelectedScrim] = useState<any>(null);
    const [participants, setParticipants] = useState<string[]>([]);
    const [rankings, setRankings] = useState<{ teamName: string, rank: number, kills: number }[]>([]);
    const [mvpForm, setMvpForm] = useState({ playerName: "", teamName: "", kills: 0 });

    const [liveLeaderboard, setLiveLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const socket = useSocket();

    const fetchInitialData = async () => {
        try {
            const [scrimsRes, lbRes] = await Promise.all([
                api.get("/scrims/all"),
                api.get("/leaderboard")
            ]);
            setScrims(Array.isArray(scrimsRes.data) ? scrimsRes.data.filter((s: any) => s.status === 'completed') : []);
            setLiveLeaderboard(Array.isArray(lbRes.data) ? lbRes.data : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading || !user) return;
        fetchInitialData();
    }, [user, authLoading]);

    const handleSelectScrim = async (scrim: any) => {
        setSelectedScrim(scrim);
        setLoading(true);
        try {
            const { data } = await api.get(`/payments/admin/scrim/${scrim._id}/participants`);
            setParticipants(data);
            // Default: Empty rankings
            setRankings([]);
            setMvpForm({
                playerName: scrim.mvpPlayer || "",
                teamName: scrim.mvpPlayerTeam || (data[0] || ""),
                kills: scrim.mvpPlayerKills || 0
            });
        } catch (err) {
            toast.error("Failed to fetch participants");
        } finally {
            setLoading(false);
        }
    };

    const addRankingRow = () => {
        const nextRank = rankings.length + 1;
        setRankings([...rankings, { teamName: participants[0] || "", rank: nextRank, kills: 0 }]);
    };

    const removeRankingRow = (index: number) => {
        const newRankings = rankings.filter((_, i) => i !== index).map((r, i) => ({ ...r, rank: i + 1 }));
        setRankings(newRankings);
    };

    const handlePublish = async () => {
        if (rankings.length === 0) return toast.error("Please add at least one ranking entry");
        setPublishing(true);
        try {
            await api.post("/scrims/publish-results", {
                scrimId: selectedScrim._id,
                rankings,
                mvpPlayer: mvpForm.playerName,
                mvpTeam: mvpForm.teamName,
                mvpKills: mvpForm.kills
            });
            toast.success("Leaderboard updated and published live! ⚡");
            fetchInitialData();
            setSelectedScrim(null);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to publish");
        } finally {
            setPublishing(false);
        }
    };

    if (authLoading || !user || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white selection:bg-red-500/30">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-h-screen">
                <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black tracking-tight mb-2 uppercase text-red-600">Leaderboard Manager</h1>
                        <p className="text-zinc-500 font-medium">Configure official standings and MVP awards for completed matches.</p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* LEFT: Scrim Selection */}
                        <div className="xl:col-span-1 space-y-6">
                            <div className="premium-card p-6 border border-white/5">
                                <div className="flex items-center gap-2 mb-6">
                                    <List className="h-4 w-4 text-red-600" />
                                    <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Completed Matches</h2>
                                </div>
                                <div className="space-y-3">
                                    {scrims.length === 0 ? (
                                        <div className="text-center py-10 text-zinc-600 text-[10px] font-black uppercase tracking-widest italic border border-dashed border-white/5 rounded-2xl">
                                            No completed scrims found.
                                        </div>
                                    ) : (
                                        scrims.map((s) => (
                                            <button
                                                key={s._id}
                                                onClick={() => handleSelectScrim(s)}
                                                className={`w-full p-4 rounded-2xl text-left transition-all border ${selectedScrim?._id === s._id ? 'bg-red-600/10 border-red-600 text-white shadow-lg shadow-red-600/10' : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/10 hover:text-white'}`}
                                            >
                                                <div className="font-black uppercase tracking-tight text-xs mb-1">{s.matchName}</div>
                                                <div className="text-[10px] opacity-60 font-medium">{new Date(s.updatedAt).toLocaleDateString()} · {s.roomID || 'SCR-00'}</div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Live Preview / Stats Summary */}
                            <div className="premium-card p-6 border border-white/5 bg-zinc-950/50">
                                <div className="flex items-center gap-2 mb-6">
                                    <Star className="h-4 w-4 text-amber-500" />
                                    <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Live Standings Preview</h2>
                                </div>
                                <div className="space-y-2">
                                    {liveLeaderboard.slice(0, 5).map((team, i) => (
                                        <div key={team._id} className="flex items-center justify-between p-3 bg-white/[0.01] rounded-xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-zinc-600 italic">#{i + 1}</span>
                                                <span className="text-[10px] font-black uppercase tracking-tight">{team.teamName}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-amber-500">{team.points} PTS</span>
                                        </div>
                                    ))}
                                    {liveLeaderboard.length > 5 && <div className="text-[10px] text-zinc-600 font-bold text-center mt-2 italic">+ {liveLeaderboard.length - 5} more teams...</div>}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Ranking and MVP Management */}
                        <div className="xl:col-span-2 space-y-8">
                            {!selectedScrim ? (
                                <div className="h-full flex flex-col items-center justify-center py-20 bg-white/[0.01] rounded-[2.5rem] border border-dashed border-white/5">
                                    <LayoutGrid className="h-12 w-12 text-zinc-800 mb-4" />
                                    <p className="text-zinc-600 font-black text-xs uppercase tracking-widest italic">Select a match to start management</p>
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    {/* PART 1: RANKINGS */}
                                    <div className="premium-card p-8 border border-white/5">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-tighter italic text-white flex items-center gap-2">Dynamic Rankings <span className="text-red-600">.</span></h3>
                                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Rank as many squads as you want</p>
                                            </div>
                                            <button
                                                onClick={addRankingRow}
                                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 flex items-center gap-2"
                                            >
                                                <Plus className="h-3 w-3" /> Add Rank
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {rankings.map((row, idx) => (
                                                <div key={idx} className="grid grid-cols-12 gap-3 items-center p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                                                    <div className="col-span-1 text-center font-black text-zinc-600 italic text-sm">#{row.rank}</div>
                                                    <div className="col-span-7">
                                                        <select
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs font-bold text-white outline-none focus:border-red-600/50"
                                                            value={row.teamName}
                                                            onChange={(e) => {
                                                                const nr = [...rankings];
                                                                nr[idx].teamName = e.target.value;
                                                                setRankings(nr);
                                                            }}
                                                        >
                                                            {participants.map(p => <option key={p} value={p}>{p}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="col-span-3">
                                                        <input
                                                            type="number"
                                                            placeholder="Kills"
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-center font-black text-red-500 outline-none"
                                                            value={row.kills}
                                                            onChange={(e) => {
                                                                const nr = [...rankings];
                                                                nr[idx].kills = Number(e.target.value);
                                                                setRankings(nr);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-span-1 text-right">
                                                        <button onClick={() => removeRankingRow(idx)} className="p-2 hover:bg-red-600/10 text-zinc-700 hover:text-red-500 rounded-lg transition-all">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {rankings.length === 0 && (
                                                <div className="text-center py-10 text-zinc-700 text-[9px] font-black uppercase tracking-widest italic border border-dashed border-white/5 rounded-2xl">
                                                    Click "Add Rank" to start ordering squads.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* PART 2: MVP */}
                                    <div className="premium-card p-8 border border-white/5">
                                        <div className="mb-8">
                                            <h3 className="text-xl font-black uppercase tracking-tighter italic text-white flex items-center gap-2">MVP Spotlight <span className="text-blue-600">.</span></h3>
                                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Select the standout individual player</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-2 block">Player Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Mortal"
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold text-white outline-none focus:border-blue-600/50"
                                                        value={mvpForm.playerName}
                                                        onChange={(e) => setMvpForm({ ...mvpForm, playerName: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-2 block">Player Team</label>
                                                <select
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 px-6 text-sm font-bold text-white outline-none focus:border-blue-600/50"
                                                    value={mvpForm.teamName}
                                                    onChange={(e) => setMvpForm({ ...mvpForm, teamName: e.target.value })}
                                                >
                                                    {participants.map(p => <option key={p} value={p}>{p}</option>)}
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-2 block">MVP Kill Count</label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 15"
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 px-6 text-sm font-black text-blue-500 outline-none"
                                                    value={mvpForm.kills}
                                                    onChange={(e) => setMvpForm({ ...mvpForm, kills: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={handlePublish}
                                        disabled={publishing}
                                        className="w-full py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-600/20 uppercase tracking-[0.2em] text-xs text-white"
                                    >
                                        {publishing ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="h-5 w-5" /> Publish to Live Leaderboard</>}
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
