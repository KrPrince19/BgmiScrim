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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-red-500/30 pb-20 overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-600/5 blur-[140px] rounded-full -z-10" />

            {/* Header */}
            <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col items-center text-center">
                <div className="flex gap-4 mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-600 hover:text-white transition-colors font-bold text-[9px] uppercase tracking-[0.2em]">
                        <ChevronLeft className="h-3 w-3" /> Home
                    </Link>
                    <Link href="/results" className="inline-flex items-center gap-2 text-zinc-600 hover:text-white transition-colors font-bold text-[9px] uppercase tracking-[0.2em] border-l border-white/10 pl-4">
                        Match History
                    </Link>
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Trophy className="h-10 w-10 text-amber-500 mb-4 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none bg-gradient-to-b from-white to-zinc-700 bg-clip-text text-transparent italic">
                    CHAMPIONS <br />WALL.
                </h1>
                <p className="text-zinc-600 mt-4 font-bold text-[9px] uppercase tracking-[0.5em] italic">
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
                        color="from-zinc-400/10 to-zinc-950/10"
                        icon={<Medal className="h-7 w-7 text-zinc-400" />}
                    />

                    {/* 1st Place */}
                    <div className="relative z-10 md:-translate-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="relative group p-px rounded-[2.5rem] bg-gradient-to-b from-amber-500/50 via-amber-900/20 to-transparent shadow-[0_0_50px_-15px_rgba(245,158,11,0.2)]"
                        >
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                                    <Crown className="h-10 w-10 text-amber-500" />
                                </motion.div>
                            </div>
                            <div className="bg-zinc-950/90 backdrop-blur-3xl rounded-[2.4rem] p-8 flex flex-col items-center text-center h-[420px] justify-center relative border border-white/5">
                                <div className="p-5 bg-amber-500/5 rounded-full mb-6 border border-amber-500/10">
                                    <Trophy className="h-12 w-12 text-amber-500" />
                                </div>
                                <div className="text-[8px] font-black text-amber-500 uppercase tracking-[0.4em] mb-2 font-mono">Rank #1</div>
                                <h3 className="text-3xl font-black mb-6 uppercase tracking-tight italic text-white line-clamp-1">{podiumTeams[0]?.teamName || "N/A"}</h3>
                                <div className="flex items-center gap-3">
                                    <div className="px-4 py-1.5 bg-amber-500 text-black rounded-lg font-black text-[9px] uppercase tracking-widest">CHAMPION</div>
                                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-white/5 rounded-lg border border-white/5 font-black text-[9px] text-zinc-300">
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
                        color="from-orange-900/10 to-transparent"
                        icon={<Trophy className="h-6 w-6 text-orange-600" />}
                    />
                </div>
            </div>

            {/* MVP Box */}
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative group p-px rounded-[2rem] bg-gradient-to-r from-blue-600/30 via-transparent to-transparent overflow-hidden shadow-2xl"
                >
                    <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-3xl rounded-[1.9rem]" />
                    <div className="relative flex flex-col md:flex-row items-center justify-between p-8 md:p-10 gap-8 border border-white/5">
                        <div className="flex items-center gap-6 text-left">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/10">
                                    <Star className="h-7 w-7 text-blue-400 fill-blue-400" />
                                </div>
                            </div>
                            <div>
                                <div className="text-[8px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1">Match MVP</div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-1 text-white">{mvpTeam?.mvpPlayerName || "MVP"}</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">{mvpTeam?.mvpPlayerTeam || mvpTeam?.teamName || "N/A"}</span>
                                    <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                    <span className="text-blue-400/50 text-[8px] font-black uppercase tracking-widest">Career Awards: {mvpTeam?.mvps || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 bg-black/30 p-6 rounded-2xl border border-white/5">
                            <div className="text-center">
                                <div className="text-2xl font-black text-white italic">{mvpTeam?.mvpPlayerKills || mvpTeam?.totalKills || 0}</div>
                                <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Kills</div>
                            </div>
                            <div className="w-px h-8 bg-white/5" />
                            <div className="text-center">
                                <div className="text-2xl font-black text-blue-400 italic">{mvpTeam?.points || 0}</div>
                                <div className="text-[8px] font-black text-blue-400/40 uppercase tracking-widest">Rating</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <footer className="mt-20 py-10 text-center select-none">
                <p className="text-[8px] text-zinc-700 uppercase tracking-[0.4em] font-black italic">
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
            className={`relative group p-px rounded-[2rem] bg-gradient-to-b ${color} overflow-hidden border border-white/5`}
        >
            <div className="bg-zinc-950/80 backdrop-blur-xl rounded-[1.9rem] p-6 flex flex-col items-center text-center h-[320px] justify-center relative">
                <div className="mb-4 p-3 bg-white/5 rounded-xl">
                    {icon}
                </div>
                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] font-mono mb-1">Rank #{rank}</div>
                <h3 className="text-xl font-black uppercase tracking-tight italic text-zinc-300 line-clamp-1 mb-4">{team?.teamName || "N/A"}</h3>
                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-white/5 rounded-lg border border-white/5 font-black text-[8px] text-zinc-500 tracking-widest uppercase">
                    {team?.points || 0} PTS
                </div>
            </div>
        </motion.div>
    );
}
