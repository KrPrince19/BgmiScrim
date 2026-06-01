"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import {
    Loader2, Plus, Pencil, Trash2, X, Check, Trophy, Clock, Search, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/context/SocketContext";

const emptyForm = { matchName: "", time: "", entryFee: "", winningPrize: "", totalSlots: "", roomID: "", roomPassword: "" };

export default function ScrimsPage() {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
    const [scrims, setScrims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [activeResultsTab, setActiveResultsTab] = useState<'details' | 'kills'>('details');

    const [editingScrim, setEditingScrim] = useState<any>(null);
    const [selectedFinalizeScrim, setSelectedFinalizeScrim] = useState<any>(null);
    const [selectedResultsScrim, setSelectedResultsScrim] = useState<any>(null);

    const [participants, setParticipants] = useState<string[]>([]);
    const [finalResults, setFinalResults] = useState<{ teamName: string, kills: number }[]>([]);
    const [winnerName, setWinnerName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [thirdName, setThirdName] = useState("");
    const [mvpTeamName, setMvpTeamName] = useState("");
    const [mvpPlayerNameInput, setMvpPlayerNameInput] = useState("");
    const [mvpPlayerKillsInput, setMvpPlayerKillsInput] = useState(0);

    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const socket = useSocket();

    const fetchScrims = async () => {
        try {
            const { data } = await api.get("/scrims/all");
            setScrims(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredScrims = scrims.filter(s =>
        activeTab === 'upcoming' ? s.status !== 'completed' : s.status === 'completed'
    );

    useEffect(() => {
        if (authLoading || !user) return;
        fetchScrims();
    }, [user, authLoading]);

    useEffect(() => {
        if (!socket) return;

        const handleUpdate = () => {
            console.log('Admin: Scrim change detected via socket! ⚡');
            fetchScrims();
        };

        socket.on('scrimCreated', handleUpdate);
        socket.on('scrimUpdate', handleUpdate);
        socket.on('scrimDeleted', handleUpdate);

        return () => {
            socket.off('scrimCreated', handleUpdate);
            socket.off('scrimUpdate', handleUpdate);
            socket.off('scrimDeleted', handleUpdate);
        };
    }, [socket]);

    const openCreate = () => {
        setEditingScrim(null);
        setForm(emptyForm);
        setError("");
        setShowModal(true);
    };

    const openEdit = (scrim: any) => {
        setEditingScrim(scrim);
        setForm({
            matchName: scrim.matchName,
            time: new Date(scrim.time).toISOString().slice(0, 16),
            entryFee: scrim.entryFee,
            winningPrize: scrim.winningPrize || "",
            totalSlots: scrim.totalSlots,
            roomID: scrim.roomID || "",
            roomPassword: scrim.roomPassword || "",
        });
        setError("");
        setShowModal(true);
    };

    const handleFinalize = async (id: string) => {
        if (!confirm("Start finalizing results? This will move the match to 'Match History' and open it for leaderboard editing.")) return;
        setLoading(true);
        try {
            await api.post(`/scrims/${id}/finalize`);
            fetchScrims();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to finalize");
        } finally {
            setLoading(false);
        }
    };

    const openResults = (scrim: any) => {
        setSelectedResultsScrim(scrim);
        setActiveResultsTab('details');
        setShowResultsModal(true);
    };


    const handleDelete = async (id: string) => {
        if (!confirm("Delete this scrim?")) return;
        await api.delete(`/scrims/${id}`);
        fetchScrims();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const payload = {
                ...form,
                entryFee: Number(form.entryFee),
                winningPrize: Number(form.winningPrize),
                totalSlots: Number(form.totalSlots),
            };
            if (editingScrim) {
                await api.put(`/scrims/${editingScrim._id}`, payload);
            } else {
                await api.post("/scrims", payload);
            }
            setShowModal(false);
            fetchScrims();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    if (authLoading || !user || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-h-screen">
                <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight mb-1 font-heading uppercase text-red-600">Match Center</h1>
                            <p className="text-zinc-500 font-medium tracking-tight">Tournament operations and historical results library.</p>
                        </div>
                        <button
                            onClick={openCreate}
                            className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20"
                        >
                            <Plus className="h-4 w-4" /> New Scrim
                        </button>
                    </div>

                    {/* Dashboard Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-zinc-900/50 rounded-2xl border border-white/5 mb-8 max-w-fit">
                        {[
                            { id: 'upcoming', label: 'Active Scrims', icon: Loader2 },
                            { id: 'completed', label: 'Match History', icon: Trophy },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-white'}`}
                            >
                                <tab.icon className={`h-3 w-3 ${activeTab === tab.id && tab.id === 'upcoming' ? 'animate-spin' : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {filteredScrims.length === 0 ? (
                            <div className="text-center py-20 glass-morphism rounded-3xl text-zinc-500 font-bold italic tracking-widest border border-dashed border-white/5">
                                NO {activeTab.toUpperCase()} MATCHES FOUND.
                            </div>
                        ) : (
                            filteredScrims.map((scrim) => (
                                <motion.div
                                    key={scrim._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="premium-card p-5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scrim.status === 'completed' ? 'bg-amber-500/10' : 'bg-red-500/10'}`}>
                                            <Trophy className={`h-5 w-5 ${scrim.status === 'completed' ? 'text-amber-500' : 'text-red-500'}`} />
                                        </div>
                                        <div>
                                            <div className="font-bold uppercase tracking-tight flex items-center gap-2 text-white">
                                                {scrim.matchName}
                                                {scrim.winner && (
                                                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-black rounded-lg border border-amber-500/20">
                                                        🏆 {scrim.winner}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-zinc-500 text-sm flex items-center gap-2 mt-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(scrim.time).toLocaleString("en-IN")} · Room: {scrim.roomID || "TBA"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {scrim.status !== 'completed' ? (
                                            <>
                                                <button
                                                    onClick={() => handleFinalize(scrim._id)}
                                                    className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg text-xs font-black transition-all border border-amber-500/20 flex items-center gap-2"
                                                >
                                                    <Check className="h-3 w-3" /> Finalize
                                                </button>
                                                <button onClick={() => openEdit(scrim)} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
                                                    <Pencil className="h-4 w-4 text-zinc-400" />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => openResults(scrim)}
                                                className="px-4 py-2 bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-400 rounded-lg text-xs font-black transition-all border border-white/5 flex items-center gap-2"
                                            >
                                                <Search className="h-3 w-3" /> View Results
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(scrim._id)} className="p-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 transition-colors">
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-morphism border border-white/10 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">{editingScrim ? "Edit Scrim" : "New Scrim"}</h2>
                                <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-zinc-400 hover:text-white" /></button>
                            </div>
                            <form onSubmit={handleSave} className="space-y-4 text-white">
                                {[
                                    { key: "matchName", label: "Match Name", type: "text", placeholder: "e.g. Pro Scrim V1" },
                                    { key: "time", label: "Match Date & Time", type: "datetime-local" },
                                ].map(({ key, label, type, placeholder }) => (
                                    <div key={key}>
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1 block">{label}</label>
                                        <input
                                            type={type}
                                            placeholder={placeholder}
                                            required
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-bold"
                                            value={(form as any)[key]}
                                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                        />
                                    </div>
                                ))}

                                <div className="flex items-center gap-3 p-3 bg-red-600/10 border border-red-500/20 rounded-xl cursor-pointer" onClick={() => setForm({ ...form, entryFee: form.entryFee === 0 || form.entryFee === "0" ? "" : "0" })}>
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${form.entryFee === 0 || form.entryFee === "0" ? 'bg-red-600 border-red-600' : 'bg-zinc-900 border-zinc-700'}`}>
                                        {(form.entryFee === 0 || form.entryFee === "0") && <Check className="h-3 w-3 text-white" />}
                                    </div>
                                    <label className="text-xs font-bold text-red-500 uppercase tracking-widest cursor-pointer">
                                        Free Tournament
                                    </label>
                                </div>

                                {[
                                    { key: "entryFee", label: "Entry Fee (₹)", type: "number", placeholder: "0", hidden: form.entryFee === 0 || form.entryFee === "0" },
                                    { key: "winningPrize", label: "Winning Prize (₹)", type: "number", placeholder: "0" },
                                    { key: "totalSlots", label: "Total Slots", type: "number", placeholder: "25" },
                                    { key: "roomID", label: "Room ID", type: "text", placeholder: "" },
                                    { key: "roomPassword", label: "Room Password", type: "text", placeholder: "" },
                                ].map(({ key, label, type, placeholder, hidden }) => !hidden && (
                                    <div key={key}>
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1 block">{label}</label>
                                        <input
                                            type={type}
                                            placeholder={placeholder}
                                            required={!["roomID", "roomPassword"].includes(key)}
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-bold"
                                            value={(form as any)[key]}
                                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                        />
                                    </div>
                                ))}
                                <button type="submit" disabled={saving} className="w-full py-3.5 bg-red-600 hover:bg-red-500 rounded-xl font-black flex items-center justify-center gap-2 transition-all mt-4 text-white">
                                    {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <><Check className="h-4 w-4" /> {editingScrim ? "Update Scrim" : "Launch Scrim"}</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            {/* Results Modal - Gold UI */}
            <AnimatePresence>
                {showResultsModal && selectedResultsScrim && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-1 w-full max-w-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="bg-zinc-900 rounded-[2.2rem] p-8 max-h-[90vh] overflow-y-auto no-scrollbar text-white">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white flex items-center gap-2">Match Report <span className="text-red-600">.</span></h2>
                                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{selectedResultsScrim.matchName}</p>
                                    </div>
                                    <button onClick={() => setShowResultsModal(false)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-6">
                                        {/* MVP STRIP */}
                                        {selectedResultsScrim.mvpPlayer && (
                                            <div className="p-4 rounded-[1.5rem] bg-blue-600/10 border border-blue-500/20 flex items-center justify-between group overflow-hidden relative">
                                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Zap className="w-16 h-16 rotate-12" /></div>
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 font-black text-[10px] italic">
                                                        MVP
                                                    </div>
                                                    <div>
                                                        <div className="text-blue-400 text-[8px] font-black uppercase tracking-widest leading-none mb-1">Match MVP</div>
                                                        <div className="text-white font-black text-lg uppercase tracking-tighter">{selectedResultsScrim.mvpPlayer}</div>
                                                        <div className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest leading-none">Team: {selectedResultsScrim.mvpPlayerTeam}</div>
                                                    </div>
                                                </div>
                                                <div className="text-center relative z-10 px-4 border-l border-white/5">
                                                    <div className="text-xl font-black text-blue-400 leading-none">{selectedResultsScrim.mvpPlayerKills}</div>
                                                    <div className="text-[8px] font-black text-blue-400/50 uppercase tracking-widest">Kills</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* CONSOLIDATED TABLE */}
                                        <div className="bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden">
                                            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                                                <div className="col-span-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest text-center">Pos</div>
                                                <div className="col-span-7 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Participating Squad</div>
                                                <div className="col-span-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest text-right">Eliminations</div>
                                            </div>
                                            <div className="max-h-[450px] overflow-y-auto no-scrollbar">
                                                {selectedResultsScrim.matchResults.sort((a: any, b: any) => b.kills - a.kills).map((res: any, i: number) => {
                                                    const isWinner = res.teamName === selectedResultsScrim.winner;
                                                    const isSecond = res.teamName === selectedResultsScrim.secondPlace;
                                                    const isThird = res.teamName === selectedResultsScrim.thirdPlace;
                                                    const isMvpSquad = res.teamName === selectedResultsScrim.mvpPlayerTeam;

                                                    return (
                                                        <div
                                                            key={res.teamName}
                                                            className={`grid grid-cols-12 gap-4 px-6 py-5 items-center transition-all border-b border-white/[0.03] last:border-0 ${isWinner ? 'bg-amber-500/10' : 'hover:bg-white/[0.01]'}`}
                                                        >
                                                            <div className="col-span-2 flex justify-center">
                                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black italic text-[10px] ${isWinner ? 'bg-amber-500 text-black' : isSecond ? 'bg-zinc-300 text-black' : isThird ? 'bg-amber-700 text-white' : 'bg-zinc-900 text-zinc-600'}`}>
                                                                    #{i + 1}
                                                                </div>
                                                            </div>
                                                            <div className="col-span-7">
                                                                <div className="flex flex-col">
                                                                    <span className={`font-black uppercase tracking-tight text-xs ${isWinner ? 'text-white' : 'text-zinc-400'}`}>
                                                                        {res.teamName}
                                                                    </span>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        {isWinner && <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest">Chicken Dinner</span>}
                                                                        {isMvpSquad && <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest">MVP in Squad</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-3 text-right flex items-center justify-end gap-2 pr-2">
                                                                <span className={`text-base font-black ${isWinner ? 'text-amber-500' : 'text-zinc-300'}`}>{res.kills}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => setShowResultsModal(false)} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] mt-8 transition-all">Close Report</button>
                            </div>
                        </motion.div>
                    </div>
                )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    </div>
    );
}
