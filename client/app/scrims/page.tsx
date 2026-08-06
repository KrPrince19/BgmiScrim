"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Search, Clock, Users, ShieldCheck, Gift, Headset, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useSocket } from "@/context/SocketContext";

export default function ScrimsPage() {
  const [activeTab, setActiveTab] = useState("All Scrims");
  const [searchQuery, setSearchQuery] = useState("");

  const [scrims, setScrims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchScrims = async () => {
    try {
      const { data } = await api.get("/scrims");
      setScrims(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScrims();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
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

  const tabs = ["All Scrims", "Classic", "TDM"];

  const filteredScrims = scrims.filter(scrim => {
    const modeString = scrim.matchType || "Competitive";
    const titleString = scrim.matchName || "Unknown Scrim";
    const matchesTab = activeTab === "All Scrims" || modeString.toLowerCase().includes(activeTab.toLowerCase()) || titleString.toLowerCase().includes(activeTab.toLowerCase());
    const matchesSearch = titleString.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#030008] text-white font-sans overflow-hidden">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-24">
        {/* Header Banner */}
        <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-8 border border-purple-500/20 shadow-[0_0_30px_rgba(126,34,206,0.15)] group">
          <img 
            src="/scrim.jpeg" 
            alt="Scrims" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          {/* Dark gradient overlay for text readability on the left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030008] via-[#030008]/80 to-transparent w-full md:w-2/3" />
          
          {/* Text Content (Left Aligned) */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tight mb-2 text-white drop-shadow-xl">
              SCRIMS
            </h1>
            <p className="text-xs md:text-sm text-purple-200 font-bold tracking-[0.2em] uppercase drop-shadow-md">
              Compete. Improve. Dominate.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
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
                placeholder="Search scrims..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b0514] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600"
              />
            </div>
          </div>
        </section>

        {/* Scrims List */}
        <section className="space-y-4 mb-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          </div>
        ) : filteredScrims.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-bold uppercase tracking-widest">
            No Scrims Found
          </div>
        ) : (
          filteredScrims.map((scrim) => (
            <div key={scrim._id} className="bg-[#0b0514] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:bg-[#0f071a] transition group">
              {/* Image */}
              <div className="w-full md:w-48 h-32 md:h-24 rounded-xl overflow-hidden shrink-0 relative">
                <img src={scrim.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400"} alt={scrim.matchName} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[9px] font-bold uppercase tracking-wider">
                  {(scrim.matchName || "Scrim").split(" ")[0]}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 w-full">
                <h3 className="text-lg font-black text-white mb-1">{scrim.matchName}</h3>
                <p className="text-xs text-gray-400 font-semibold mb-3">{scrim.matchType || "Squad • Competitive"}</p>
                <div className="flex flex-wrap items-center gap-4 md:gap-8 text-[11px] font-semibold text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-500" /> {new Date(scrim.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-500" /> {scrim.teamsEnrolled || 0}/{scrim.totalSlots || 32} Teams
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-[8px]">₹</span> 
                    Entry Fee <span className={scrim.entryFee === 0 ? "text-emerald-400" : "text-white"}>{scrim.entryFee === 0 ? "FREE" : `₹${scrim.entryFee}`}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="w-full md:w-auto flex flex-row md:flex-col items-center justify-between md:justify-center md:items-end gap-3 shrink-0 md:pl-6 md:border-l border-white/5">
                <div className="text-left md:text-right">
                  <div className="text-xl font-black text-white">₹{scrim.winningPrize || 0}</div>
                </div>
                <Link 
                  href={`/payment?id=${scrim._id}&type=scrim&title=${encodeURIComponent(scrim.matchName)}&fee=${scrim.entryFee || 0}&prize=${scrim.winningPrize || 0}`}
                  className="px-8 py-2.5 bg-purple-700 hover:bg-purple-600 rounded-lg text-xs font-bold transition shadow-[0_0_10px_rgba(126,34,206,0.2)] w-full md:w-auto flex items-center justify-center text-center"
                >
                  Join Now
                </Link>
              </div>
            </div>
          ))
        )}
        </section>



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
