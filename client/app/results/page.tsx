"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Search, Map, Calendar, Trophy, User } from "lucide-react";

export default function ResultsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const resultsData = [
    {
      id: 1,
      title: "Erangel Night Scrim",
      time: "Today, 07:00 PM",
      rank: 1,
      totalTeams: 32,
      kills: 24,
      points: 98,
      prize: "2,000",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "Miramar Challengers",
      time: "24 May, 08:00 PM",
      rank: 3,
      totalTeams: 32,
      kills: 18,
      points: 72,
      prize: "600",
      image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      title: "Sanhok Showdown",
      time: "23 May, 07:00 PM",
      rank: 5,
      totalTeams: 32,
      kills: 12,
      points: 55,
      prize: null,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      title: "Vikendi Ice Battle",
      time: "22 May, 07:00 PM",
      rank: 2,
      totalTeams: 32,
      kills: 20,
      points: 85,
      prize: "800",
      image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const filteredResults = resultsData.filter(result => 
    result.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#030008] text-white font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-950/20 blur-[150px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight mb-2">Results</h1>
            <p className="text-sm text-gray-400 font-semibold">Relive the Battles.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by scrim or team..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b0514] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Results List */}
        <div className="flex flex-col gap-4">
          {filteredResults.map((result) => (
            <div key={result.id} className="bg-[#0b0514] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:border-purple-500/30 transition-colors">
              {/* Thumbnail & Title */}
              <div className="flex items-center gap-4 w-full md:w-1/3 shrink-0">
                <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
                  <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight mb-1">{result.title}</h3>
                  <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> {result.time}
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between w-full md:flex-1 md:justify-around border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                {/* Rank */}
                <div className="text-center">
                  <div className={`text-2xl font-black ${
                    result.rank === 1 ? 'text-yellow-400' :
                    result.rank === 2 ? 'text-gray-300' :
                    result.rank === 3 ? 'text-orange-400' : 'text-purple-400'
                  }`}>
                    #{result.rank}<span className="text-sm text-gray-500">/{result.totalTeams}</span>
                  </div>
                </div>

                {/* Kills */}
                <div className="text-center">
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Kills</div>
                  <div className="text-lg font-bold text-white">{result.kills}</div>
                </div>

                {/* Points */}
                <div className="text-center">
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Points</div>
                  <div className="text-lg font-bold text-white">{result.points}</div>
                </div>

                {/* Prize */}
                <div className="text-center min-w-[60px]">
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Prize</div>
                  <div className="text-lg font-bold text-white">
                    {result.prize ? `₹${result.prize}` : <span className="text-gray-600">--</span>}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="w-full md:w-auto shrink-0 md:pl-4">
                <button className="w-full md:w-auto px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(126,34,206,0.3)]">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Banner */}
        <div className="mt-12 bg-purple-950/20 border border-purple-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-700/20 rounded-full flex items-center justify-center shrink-0 border border-purple-500/30">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Want to see your full match history?</h4>
              <p className="text-sm text-gray-400">Go to your profile and check all your match analytics.</p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(126,34,206,0.4)]">
            View Profile
          </button>
        </div>
      </main>
    </div>
  );
}
