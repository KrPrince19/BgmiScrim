"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Shield, Loader2, Trophy, Crosshair, Star } from "lucide-react";
import api from "@/lib/api";
import { useSocket } from "@/context/SocketContext";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("Overall");
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchLeaderboard = async () => {
    try {
      const { data } = await api.get("/leaderboard");
      setLeaderboardData(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (newLeaderboard: any) => {
      setLeaderboardData(Array.isArray(newLeaderboard) ? newLeaderboard : []);
    };
    socket.on('leaderboardUpdate', handleUpdate);
    return () => {
      socket.off('leaderboardUpdate', handleUpdate);
    };
  }, [socket]);

    // No MVP calculations needed anymore

  return (
    <div className="min-h-screen bg-[#030008] text-white font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-950/20 blur-[150px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header Banner */}
        <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-8 border border-purple-500/20 shadow-[0_0_30px_rgba(126,34,206,0.15)] group">
          <img 
            src="/leaderboard.jpeg" 
            alt="Leaderboard" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          {/* Dark gradient overlay for text readability on the left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030008] via-[#030008]/80 to-transparent w-full md:w-2/3" />
          
          {/* Text Content (Left Aligned) */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tight mb-2 text-white drop-shadow-xl">
              Leaderboard
            </h1>
            <p className="text-sm md:text-base text-purple-200 font-semibold drop-shadow-md uppercase tracking-widest">
              Top Teams. Top Skills.
            </p>
          </div>
        </div>

        {/* MVP Spotlight removed as requested */}

        <div className="bg-[#0b0514] border border-white/5 rounded-2xl p-4 md:p-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex gap-6 border-b border-white/5 pb-2 w-full sm:w-auto overflow-x-auto overflow-y-hidden scrollbar-hide [&::-webkit-scrollbar]:hidden">
              {['Overall', 'Monthly', 'Weekly'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-bold pb-2 relative whitespace-nowrap ${
                    activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-purple-600 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="text-center text-gray-500 py-10 font-bold uppercase tracking-widest">
                No Rankings Yet
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-white/5">
                    <th className="pb-4 px-4 font-medium w-16">Rank</th>
                    <th className="pb-4 px-4 font-medium">Player Name</th>
                    <th className="pb-4 px-4 font-medium">Team Name</th>
                    <th className="pb-4 px-4 font-medium text-right">Kill Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leaderboardData.map((team, index) => {
                    const rank = index + 1;
                    return (
                    <tr key={team._id} className="hover:bg-white/5 transition-colors group">
                      <td className={`py-4 px-4 font-black text-lg italic ${
                        rank === 1 ? 'text-yellow-400' : 
                        rank === 2 ? 'text-gray-300' : 
                        rank === 3 ? 'text-orange-400' : 'text-gray-500'
                      }`}>
                        #{team.rank || rank}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-black uppercase tracking-tight text-white group-hover:text-purple-400 transition-colors">{team.playerName}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-400 uppercase tracking-tight">{team.teamName}</div>
                      </td>
                      <td className="py-4 px-4 text-right font-black text-xl text-white">{team.killPoint}</td>
                    </tr>
                  )})}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
