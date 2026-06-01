"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Crown, ChevronLeft, Loader2, Zap, Star, Medal, Users } from "lucide-react";
import api from "@/lib/api";
import { useSocket } from "@/context/SocketContext";

export default function LeaderboardPage() {
    const [teams, setTeams] = useState<any[]>([]);
    const [latestScrim, setLatestScrim] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    const fetchLeaderboard = async () => {
        try {
            const [lbRes, scrimRes] = await Promise.all([
                api.get("/leaderboard"),
                api.get("/scrims/all")
            ]);
            setTeams(lbRes.data || []);
            const completed = (scrimRes.data || [])
                .filter((s: any) => s.status === 'completed')
                .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            setLatestScrim(completed[0] || null);
        } catch (err) {
            console.error("Failed to fetch leaderboard", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('leaderboardUpdate', fetchLeaderboard);
        return () => { socket.off('leaderboardUpdate'); };
    }, [socket]);

    const podiumTeams = teams.slice(0, 3);
    const mvpTeam = teams.find(t => t.mvps > 0) || teams[0];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-red-500/30 pb-20 overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-600/5 blur-[140px] rounded-full -z-10" />

            {/* Header */}
            <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col items-center text-center">
                <div className="flex gap-4 mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold text-[9px] uppercase tracking-[0.2em]">
                        <ChevronLeft className="h-3 w-3" /> Home
                    </Link>
                    <Link href="/results" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold text-[9px] uppercase tracking-[0.2em] border-l border-gray-300 pl-4">
                        Match History
                    </Link>
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Trophy className="h-10 w-10 text-amber-500 mb-4 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent italic">
                    CHAMPIONS <br />WALL.
                </h1>
                <p className="text-gray-500 mt-4 font-bold text-[9px] uppercase tracking-[0.5em] italic">
                    Legends of the Arena
                </p>
            </div>

            {/* Podium Section */}
            <div className="max-w-6xl mx-auto px-6 mt-16 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6 md:gap-4 lg:gap-8 relative">

                    {/* 2nd Place */}
                    <PodiumCard
                        team={podiumTeams[1]}
                        rank={2}
                        delay={0.1}
                        color="from-gray-300/50 to-gray-100"
                        icon={<Medal className="h-7 w-7 text-gray-400" />}
                    />

                    {/* 1st Place */}
                    <div className="relative z-10 md:-translate-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="relative group p-px rounded-[2.5rem] bg-gradient-to-b from-amber-400/50 via-amber-200/20 to-transparent shadow-[0_0_50px_-15px_rgba(245,158,11,0.2)]"
                        >
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                                    <Crown className="h-10 w-10 text-amber-500" />
                                </motion.div>
                            </div>
                            <div className="bg-white/90 backdrop-blur-3xl rounded-[2.4rem] p-8 flex flex-col items-center text-center h-[420px] justify-center relative border border-amber-200">
                                <div className="p-5 bg-amber-50 rounded-full mb-6 border border-amber-100 shadow-sm">
                                    <Trophy className="h-12 w-12 text-amber-500" />
                                </div>
                                <div className="text-[8px] font-black text-amber-600 uppercase tracking-[0.4em] mb-2 font-mono">Rank #1</div>
                                <h3 className="text-3xl font-black mb-6 uppercase tracking-tight italic text-gray-900 line-clamp-1">{podiumTeams[0]?.teamName || "N/A"}</h3>
                                <div className="flex items-center gap-3">
                                    <div className="px-4 py-1.5 bg-amber-500 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-sm">CHAMPION</div>
                                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-50 rounded-lg border border-gray-200 font-black text-[9px] text-gray-600 shadow-sm">
                                        <Zap className="h-3 w-3 text-amber-500 fill-amber-500" /> {podiumTeams[0]?.points || 0} PTS
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* 3rd Place */}
                    <PodiumCard
                        team={podiumTeams[2]}
                        rank={3}
                        delay={0.2}
                        color="from-orange-100 to-orange-50"
                        icon={<Trophy className="h-6 w-6 text-orange-500" />}
                    />
                </div>
            </div>

            {/* MVP Box */}
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative group p-px rounded-[2rem] bg-gradient-to-r from-blue-200 via-transparent to-transparent overflow-hidden shadow-sm"
                >
                    <div className="absolute inset-0 bg-white backdrop-blur-3xl rounded-[1.9rem]" />
                    <div className="relative flex flex-col md:flex-row items-center justify-between p-8 md:p-10 gap-8 border border-gray-200 rounded-[1.9rem]">
                        <div className="flex items-center gap-6 text-left">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                                    <Star className="h-7 w-7 text-blue-500 fill-blue-500" />
                                </div>
                            </div>
                            <div>
                                <div className="text-[8px] font-black text-blue-600 uppercase tracking-[0.4em] mb-1">Match MVP</div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-1 text-gray-900">{mvpTeam?.mvpPlayerName || "MVP"}</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest">{mvpTeam?.mvpPlayerTeam || mvpTeam?.teamName || "N/A"}</span>
                                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span className="text-blue-600/70 text-[8px] font-black uppercase tracking-widest">Career Awards: {mvpTeam?.mvps || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner">
                            <div className="text-center">
                                <div className="text-2xl font-black text-gray-900 italic">{mvpTeam?.mvpPlayerKills || mvpTeam?.totalKills || 0}</div>
                                <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Kills</div>
                            </div>
                            <div className="w-px h-8 bg-gray-300" />
                            <div className="text-center">
                                <div className="text-2xl font-black text-blue-600 italic">{mvpTeam?.points || 0}</div>
                                <div className="text-[8px] font-black text-blue-600/60 uppercase tracking-widest">Rating</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <footer className="mt-20 py-10 text-center select-none">
                <p className="text-[8px] text-gray-400 uppercase tracking-[0.4em] font-black italic">
                    ARENA X PROTOCOL // V2.0
                </p>
            </footer>
        </div>
    );
}

function PodiumCard({ team, rank, delay, color, icon }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`relative group p-px rounded-[2rem] bg-gradient-to-b ${color} overflow-hidden border border-gray-200 shadow-sm`}
        >
            <div className="bg-white/80 backdrop-blur-xl rounded-[1.9rem] p-6 flex flex-col items-center text-center h-[320px] justify-center relative">
                <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                    {icon}
                </div>
                <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] font-mono mb-1">Rank #{rank}</div>
                <h3 className="text-xl font-black uppercase tracking-tight italic text-gray-700 line-clamp-1 mb-4">{team?.teamName || "N/A"}</h3>
                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-50 rounded-lg border border-gray-200 font-black text-[8px] text-gray-600 tracking-widest uppercase shadow-sm">
                    {team?.points || 0} PTS
                </div>
            </div>
        </motion.div>
    );
}
