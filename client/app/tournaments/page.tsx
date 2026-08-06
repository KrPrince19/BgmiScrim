"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Trophy, Search, Calendar, Users, MessageSquare, Loader2, Headset, ShieldCheck, Gift } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useSocket } from "@/context/SocketContext";

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState("All Tournaments");
  const [searchQuery, setSearchQuery] = useState("");

  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchTournaments = async () => {
    try {
      const { data } = await api.get("/tournaments");
      setTournaments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
      fetchTournaments();
    };
    socket.on('tournamentCreated', handleUpdate);
    socket.on('tournamentUpdate', handleUpdate);
    socket.on('tournamentDeleted', handleUpdate);
    return () => {
      socket.off('tournamentCreated', handleUpdate);
      socket.off('tournamentUpdate', handleUpdate);
      socket.off('tournamentDeleted', handleUpdate);
    };
  }, [socket]);

  const tabs = ["All Tournaments", "Classic", "TDM"];

  const filteredTournaments = tournaments.filter(tournament => {
    const modeString = tournament.matchType || "Classic";
    const titleString = tournament.matchName || "Unknown Tournament";
    const matchesTab = activeTab === "All Tournaments" || modeString.toLowerCase().includes(activeTab.toLowerCase()) || titleString.toLowerCase().includes(activeTab.toLowerCase());
    const matchesSearch = titleString.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#030008] text-white font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-950/30 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-950/30 blur-[150px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header Banner */}
        <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-8 border border-purple-500/20 shadow-[0_0_30px_rgba(126,34,206,0.15)] group">
          <img 
            src="/tournament.jpeg" 
            alt="Tournaments" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          {/* Dark gradient overlay for text readability on the left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030008] via-[#030008]/80 to-transparent w-full md:w-2/3" />
          
          {/* Text Content (Left Aligned) */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tight mb-2 text-white drop-shadow-xl">
              Tournaments
            </h1>
            <p className="text-sm md:text-base text-purple-200 font-semibold drop-shadow-md uppercase tracking-[0.1em]">
              Big Battles. Bigger Rewards.
            </p>
          </div>
        </div>

        {/* Tabs and Search */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-semibold whitespace-nowrap pb-2 transition-colors ${
                  activeTab === tab 
                    ? "text-purple-500 border-b-2 border-purple-500" 
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search tournaments..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b0514] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600"
              />
            </div>
          </div>
        </section>

        {/* Tournament List */}
        <div className="flex flex-col gap-4 mb-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-bold uppercase tracking-widest">
            No Tournaments Found
          </div>
        ) : (
          filteredTournaments.map((tournament) => (
            <div key={tournament._id} className="bg-[#0b0514] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-6 hover:border-purple-500/30 transition-colors group">
              {/* Thumbnail */}
              <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                <img src={tournament.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"} alt={tournament.matchName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-purple-700/80 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded">
                  {tournament.matchType || "Classic"}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-black text-white mb-1 group-hover:text-purple-400 transition-colors">{tournament.matchName}</h3>
                <p className="text-xs text-gray-400 font-semibold mb-4">Squad • Competitive</p>
                
                <div className="flex flex-wrap items-center gap-4 md:gap-8 text-[11px] font-semibold text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    {new Date(tournament.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-500" />
                    {tournament.teamsEnrolled || 0}/{tournament.totalSlots || 32} Teams
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-[8px]">₹</span> 
                    Entry Fee <span className={tournament.entryFee === 0 ? "text-emerald-400" : "text-white"}>{tournament.entryFee === 0 ? "FREE" : `₹${tournament.entryFee}`}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 shrink-0 md:min-w-[150px]">
                <div className="text-left md:text-right">
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Prize Pool</div>
                  <div className="text-xl font-black text-white">₹{tournament.winningPrize || 0}</div>
                </div>
                <Link 
                  href={`/payment?id=${tournament._id}&type=tournament&title=${encodeURIComponent(tournament.matchName)}&fee=${tournament.entryFee || 0}&prize=${tournament.winningPrize || 0}`}
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(126,34,206,0.3)] w-full md:w-auto mt-0 md:mt-4 flex items-center justify-center text-center"
                >
                  Join Now
                </Link>
              </div>
            </div>
          ))
        )}
        </div>

        {/* WhatsApp Banner */}
        <div className="mt-12 bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#25D366]/20 rounded-full flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-[#25D366]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Don't miss any tournament!</h4>
              <p className="text-sm text-gray-400">Join our WhatsApp group and stay updated.</p>
            </div>
          </div>
          <a 
            href="https://chat.whatsapp.com/GMlsUSOnnLQFQfuujlD0G0"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap text-center"
          >
            Join WhatsApp
          </a>
        </div>

        {/* Stats Footer */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-8">
          <div className="flex items-center gap-3">
            <Headset className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-semibold text-gray-400">24/7 Support</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-semibold text-gray-400">Secure & Fair Play</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-semibold text-gray-400">5000+ Active Players</span>
          </div>
          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-semibold text-gray-400">Daily Rewards</span>
          </div>
        </section>

      </main>
      
      {/* Spacer for bottom nav */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
}
