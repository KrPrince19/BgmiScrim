"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Loader2, Trophy, Clock, Search, X, Shield, Star, Zap, ChevronRight, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResultsPage() {
    const [scrims, setScrims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedScrim, setSelectedScrim] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'podium' | 'standings'>('podium');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get("/scrims/all");
                setScrims(data.filter((s: any) => s.status === 'completed'));
            } catch (err) {
                console.error("Failed to fetch match history:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const openDetails = (scrim: any) => {
        setSelectedScrim(scrim);
        setActiveTab('podium');
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Hero Header */}
            <div className="relative pt-24 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-600/10 blur-[120px] rounded-full opacity-30" />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-4 leading-none text-white">
                            Match <span className="text-red-600">History</span>
                        </h1>
                        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">
                            Hall of Fame & Tournament Results
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6">
                {scrims.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-[3rem] border border-white/5">
                        <Trophy className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                        <p className="text-zinc-600 font-black uppercase tracking-widest italic text-sm">No historical data recorded yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {scrims.map((scrim, idx) => (
                            <motion.div
                                key={scrim._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => openDetails(scrim)}
                                className="group relative p-6 rounded-[2rem] bg-zinc-900/40 border border-white/5 hover:border-red-600/30 transition-all cursor-pointer overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex flex-col items-center justify-center text-center">
                                            <span className="text-[10px] font-black text-red-600 leading-none">RANK</span>
                                            <span className="text-2xl font-black text-white">#{idx + 1}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Trophy className="h-3 w-3 text-amber-500" />
                                                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Champion: {scrim.winner}</span>
                                            </div>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter italic text-zinc-100">{scrim.matchName}</h3>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase">
                                                    <Clock className="w-3 h-3" /> {new Date(scrim.time).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase">
                                                    <Zap className="w-3 h-3 text-blue-400" /> MVP: {scrim.mvpTeam}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-red-600 group-hover:text-white transition-all border border-white/5 group-hover:border-red-600">
                                        View Results <ChevronRight className="h-3 w-3" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Results Detailed Modal */}
            <AnimatePresence>
                {showModal && selectedScrim && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-black border border-white/10 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_0_100px_-20px_rgba(220,38,38,0.2)]"
                        >
                            <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto no-scrollbar">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none mb-2">Match Report <span className="text-red-600">.</span></h2>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-zinc-400 uppercase tracking-widest border border-white/5">{selectedScrim.matchName}</span>
                                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{new Date(selectedScrim.time).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/5"><X className="h-5 w-5" /></button>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        {/* MVP HIGHLIGHT STRIP */}
                                        {selectedScrim.mvpPlayer && (
                                            <div className="p-5 rounded-[2rem] bg-blue-600/10 border border-blue-500/20 flex items-center justify-between group overflow-hidden relative">
                                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Zap className="w-20 h-20 rotate-12" /></div>
                                                <div className="flex items-center gap-5 relative z-10">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 font-black text-xs italic">
                                                        MVP
                                                    </div>
                                                    <div>
                                                        <div className="text-blue-400 text-[8px] font-black uppercase tracking-widest leading-none mb-1">Standout individual</div>
                                                        <div className="text-white font-black text-xl uppercase tracking-tighter">{selectedScrim.mvpPlayer}</div>
                                                        <div className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest leading-none">Squad: {selectedScrim.mvpPlayerTeam}</div>
                                                    </div>
                                                </div>
                                                <div className="text-center relative z-10 px-6 border-l border-white/5">
                                                    <div className="text-2xl font-black text-blue-400 leading-none">{selectedScrim.mvpPlayerKills}</div>
                                                    <div className="text-[8px] font-black text-blue-400/50 uppercase tracking-widest">Kills</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* CONSOLIDATED STANDINGS TABLE */}
                                        <div className="bg-zinc-950/50 rounded-[2.5rem] border border-white/5 overflow-hidden">
                                            <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 bg-white/[0.02]">
                                                <div className="col-span-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pos</div>
                                                <div className="col-span-7 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Squad Identifier</div>
                                                <div className="col-span-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Kills</div>
                                            </div>
                                            <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                                                {selectedScrim.matchResults.sort((a: any, b: any) => b.kills - a.kills).map((res: any, i: number) => {
                                                    const isWinner = res.teamName === selectedScrim.winner;
                                                    const isSecond = res.teamName === selectedScrim.secondPlace;
                                                    const isThird = res.teamName === selectedScrim.thirdPlace;
                                                    const isMvpSquad = res.teamName === selectedScrim.mvpPlayerTeam;

                                                    return (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: i * 0.02 }}
                                                            key={res.teamName}
                                                            className={`grid grid-cols-12 gap-4 px-8 py-6 items-center transition-all border-b border-white/[0.03] last:border-0 ${isWinner ? 'bg-amber-500/10' : 'hover:bg-white/[0.02]'}`}
                                                        >
                                                            <div className="col-span-2 flex items-center gap-2">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic text-xs ${isWinner ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : isSecond ? 'bg-zinc-300 text-black' : isThird ? 'bg-amber-700 text-white' : 'bg-zinc-900 text-zinc-500'}`}>
                                                                    #{i + 1}
                                                                </div>
                                                            </div>
                                                            <div className="col-span-7">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex flex-col">
                                                                        <span className={`font-black uppercase tracking-tight text-sm ${isWinner ? 'text-white' : 'text-zinc-300'}`}>
                                                                            {res.teamName}
                                                                        </span>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            {isWinner && <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Chicken Dinner</span>}
                                                                            {isMvpSquad && <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1"><Zap className="w-2 h-2" /> MVP in Squad</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-3 text-right flex items-center justify-end gap-3">
                                                                <span className={`text-xl font-black ${isWinner ? 'text-amber-500' : 'text-zinc-100'}`}>{res.kills}</span>
                                                                <Target className={`w-4 h-4 ${isWinner ? 'text-amber-500/50' : 'text-zinc-800'}`} />
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] mt-10 transition-all border border-white/5"
                                >
                                    Dismiss Report
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
