"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User as UserIcon, Trophy, Users, Crosshair, Map, Medal, ChevronRight, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  const { user } = useAuth();
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [heroFrame, setHeroFrame] = useState(1);
  const [stats, setStats] = useState({ activePlayers: 0, scrimsPlayed: 0, dailyScrims: 0, tournaments: 0, mvp: null as any });
  const [upcomingScrims, setUpcomingScrims] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const totalFrames = 124;
    let isCancelled = false;
    let currentFrame = 1;
    let targetFrame = 124; // Will be updated by scroll immediately
    let animationFrameId: number;
    let currentPreload = 1;
    const startTime = Date.now();
    const introDurationMs = 2500; // Force intro to take at least 2.5 seconds

    // Preload sequentially
    const preloadNext = () => {
      if (isCancelled || currentPreload > totalFrames) return;
      const img = new Image();
      img.onload = () => {
        currentPreload++;
        preloadNext();
      };
      img.onerror = () => {
        currentPreload++;
        preloadNext();
      };
      img.src = `/animation/ezgif-frame-${String(currentPreload).padStart(3, '0')}.jpg`;
    };
    preloadNext();

    const handleScroll = () => {
      const scrollY = window.scrollY || 0;
      const scrollRange = 600; 
      const progress = Math.min(1, Math.max(0, scrollY / scrollRange));
      let newTarget = 124 - Math.floor(progress * 123);
      targetFrame = Math.max(1, Math.min(totalFrames, newTarget));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Set initial targetFrame

    const loop = () => {
      if (isCancelled) return;
      
      const elapsed = Date.now() - startTime;
      
      // Calculate how many frames are allowed by time (e.g., 2.5 seconds to reach 124)
      const timeAllowedFrame = Math.max(1, Math.min(totalFrames, Math.floor((elapsed / introDurationMs) * totalFrames)));
      
      // Calculate highest loaded frame
      const highestLoaded = Math.max(1, currentPreload - 1);
      
      // Cap the desired frame by BOTH load speed and the 2.5s timer
      const maxAllowedFrame = Math.min(highestLoaded, timeAllowedFrame);
      
      let desiredFrame = targetFrame;
      if (desiredFrame > maxAllowedFrame) {
        desiredFrame = maxAllowedFrame;
      }

      if (currentFrame !== desiredFrame) {
        const diff = desiredFrame - currentFrame;
        if (Math.abs(diff) <= 1) {
          currentFrame = desiredFrame;
        } else {
          // Responsive step for scrolling, intro is bounded by maxAllowedFrame natively
          let step = diff * 0.25; 
          const maxSpeed = 5; // Fast responsive cap for scrolling
          if (Math.abs(step) > maxSpeed) step = Math.sign(diff) * maxSpeed;
          if (Math.abs(step) < 1) step = Math.sign(diff);
          currentFrame += step;
        }
        setHeroFrame(Math.round(currentFrame));
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };
    
    loop();

    return () => {
      isCancelled = true;
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    // Keep backend logic exactly same for recent matches
    api.get("/scrims/all")
      .then(res => {
        const completed = res.data.filter((s: any) => s.status === 'completed');
        completed.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setRecentMatches(completed.slice(0, 4));
      })
      .catch(err => console.log(err));

    api.get("/stats")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));

    api.get("/scrims")
      .then(res => setUpcomingScrims(res.data))
      .catch(err => console.log(err));

    api.get("/leaderboard")
      .then(res => setLeaderboard(res.data.slice(0, 3)))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#030008] text-white font-sans overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-950/30 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-950/30 blur-[150px] rounded-full pointer-events-none" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-16 flex flex-col lg:flex-row items-center justify-between">
        <div className="flex-1 text-center lg:text-left z-20">
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter italic uppercase leading-[0.95] mb-6 drop-shadow-xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-100">PLAY SCRIMS.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-purple-700">GET BETTER.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-400">BE THE BEST.</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto lg:mx-0 mb-8 font-medium">
            Join competitive BGMI scrims, challenge top teams, climb the leaderboard and prove your skills.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
            <Link href="/scrims" className="w-full sm:w-auto px-8 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-bold text-sm transition-all shadow-[0_0_20px_rgba(126,34,206,0.4)] flex items-center justify-center gap-2">
              Join Scrim <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/tournaments" className="w-full sm:w-auto px-8 py-3 border border-gray-600 hover:bg-white/5 text-white rounded-lg font-bold text-sm transition-all flex items-center justify-center">
              Explore Tournaments
            </Link>
          </div>
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" className="w-7 h-7 rounded-full border-2 border-[#030008]" />
              ))}
              <div className="w-7 h-7 rounded-full border-2 border-[#030008] bg-purple-950 flex items-center justify-center text-[8px] font-bold text-purple-200">+99</div>
            </div>
            <span className="text-xs text-gray-400 font-semibold">Trusted by 5000+ Players</span>
          </div>
        </div>
        
        <div className="flex-1 relative mt-16 lg:mt-0 flex justify-center lg:justify-end">
           {/* Glowing Background / Hexagon */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-110 lg:scale-150 transform translate-y-[-10%] lg:translate-x-[10%]">
             <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-purple-800/20 blur-3xl rounded-full" />
             <svg className="absolute w-[70%] h-[70%] opacity-40 text-purple-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
               <polygon points="50 5, 90 28, 90 72, 50 95, 10 72, 10 28" stroke="currentColor" strokeWidth="2.5" />
               <polygon points="50 15, 80 32, 80 68, 50 85, 20 68, 20 32" stroke="currentColor" strokeWidth="1" opacity="0.5" />
             </svg>
           </div>
           <img src={`/animation/ezgif-frame-${String(heroFrame).padStart(3, '0')}.jpg`} alt="Hero Character" className="relative z-10 w-full max-w-[450px] lg:max-w-[550px] object-contain drop-shadow-[0_0_30px_rgba(126,34,206,0.3)] transform scale-125 lg:scale-110 mix-blend-lighten" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="bg-[#0b0514] border border-white/5 rounded-2xl grid grid-cols-2 md:grid-cols-4 overflow-hidden divide-x divide-white/5">
          <div className="flex items-center justify-center gap-3 p-4 md:p-6 border-b md:border-b-0 border-white/5">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black text-white">{stats.activePlayers}+</span>
              <span className="text-[9px] md:text-[10px] text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap">Active Players</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 md:p-6 border-b md:border-b-0 border-white/5">
            <Crosshair className="w-6 h-6 md:w-8 md:h-8 text-purple-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black text-white">{stats.scrimsPlayed}+</span>
              <span className="text-[9px] md:text-[10px] text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap">Scrims Played</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 md:p-6">
            <Map className="w-6 h-6 md:w-8 md:h-8 text-purple-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black text-white">{stats.dailyScrims}+</span>
              <span className="text-[9px] md:text-[10px] text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap">Daily Scrims</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 md:p-6">
            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-purple-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black text-white">{stats.tournaments}+</span>
              <span className="text-[9px] md:text-[10px] text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap">Tournaments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Scrims */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl md:text-3xl font-black italic tracking-tight uppercase text-white">Upcoming Scrims</h2>
          <Link href="/scrims" className="px-4 py-1.5 border border-white/10 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 transition">
            View All
          </Link>
        </div>
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {upcomingScrims.map((scrim: any) => (
            <div key={scrim._id} className="min-w-[85vw] md:min-w-0 snap-center shrink-0 bg-[#0b0514] border border-white/5 rounded-2xl overflow-hidden group">
              <div className="relative h-36 w-full">
                <img src={scrim.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800'} alt={scrim.matchName} className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0514] via-[#0b0514]/80 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded text-white ${scrim.entryFee > 0 ? 'bg-orange-600' : 'bg-purple-700'}`}>
                    {scrim.entryFee > 0 ? 'PAID' : 'FREE'}
                  </span>
                </div>
              </div>
              <div className="p-5 relative -mt-8 z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg md:text-xl font-black text-white">{scrim.matchName}</h3>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">{new Date(scrim.time).toLocaleDateString()}</span>
                    <span className="text-xs font-bold text-white">{new Date(scrim.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 font-semibold mb-6">{scrim.matchType}</div>
                <div className="mt-auto flex justify-between items-center pt-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-0.5 flex items-center gap-1"><Trophy className="w-3 h-3 text-purple-500" /> Prize Pool</span>
                    <span className="text-lg font-black text-white">₹{scrim.winningPrize || 0}</span>
                  </div>
                  <Link href={`/scrims/${scrim._id}`} className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-sm font-bold text-white transition shadow-[0_0_10px_rgba(126,34,206,0.2)]">
                    Join Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Dots for Mobile */}
        <div className="flex justify-center gap-2 mt-2 md:hidden">
           <div className="w-2 h-2 rounded-full bg-purple-600"></div>
           <div className="w-2 h-2 rounded-full bg-white/20"></div>
           <div className="w-2 h-2 rounded-full bg-white/20"></div>
        </div>
      </section>

      {/* Leaderboard & MVP */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl md:text-2xl font-black italic tracking-tight uppercase text-white">Leaderboard</h2>
            <Link href="/leaderboard" className="text-xs text-purple-600 hover:text-purple-500 font-bold transition">View All</Link>
          </div>
          <div className="bg-[#0b0514] border border-white/5 rounded-2xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-white/5">
                    <th className="pb-4 px-2 font-medium">Rank</th>
                    <th className="pb-4 px-2 font-medium">Team</th>
                    <th className="pb-4 px-2 font-medium hidden md:table-cell text-center">Matches</th>
                    <th className="pb-4 px-2 font-medium hidden md:table-cell text-center">Wins</th>
                    <th className="pb-4 px-2 font-medium text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((team: any, idx: number) => (
                    <tr key={team._id || idx} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className={`py-5 px-2 font-black text-base ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-400' : 'text-orange-400'}`}>#{idx + 1}</td>
                      <td className="py-5 px-2 flex items-center gap-3 font-bold text-white">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${idx === 0 ? 'bg-yellow-500/10 border-yellow-500/20' : idx === 1 ? 'bg-gray-500/10 border-gray-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                           <Shield className={`w-4 h-4 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : 'text-orange-500'}`} />
                        </div>
                        {team.teamName}
                      </td>
                      <td className="py-5 px-2 hidden md:table-cell text-center text-gray-300">--</td>
                      <td className="py-5 px-2 hidden md:table-cell text-center text-gray-300">{team.wins || 0}</td>
                      <td className="py-5 px-2 text-right font-black text-white">{team.points || team.killPoint || (team.wins * 10 + (team.totalKills || 0)) || 0}</td>
                    </tr>
                  ))}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">No leaderboard data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MVP */}
        <div className="lg:col-span-1">
          <div className="flex justify-between items-end mb-6 h-8">
             {/* Empty to align with Leaderboard heading */}
          </div>
          <div className="bg-[#0b0514] border border-white/5 rounded-2xl p-6 h-[calc(100%-2.5rem)] flex flex-col">
            <h2 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2 mb-6">
              <Medal className="w-4 h-4 text-purple-600" /> MVP OF THE WEEK
            </h2>
            {stats.mvp ? (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <img src={stats.mvp.avatar} alt="MVP Avatar" className="w-16 h-16 rounded-full border-2 border-purple-600 object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-700 rounded-full flex items-center justify-center border-2 border-[#0b0514]">
                       <Trophy className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{stats.mvp.playerName}</h3>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{stats.mvp.teamName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-auto">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-[10px] text-gray-400 font-semibold mb-1 uppercase">Kills</div>
                    <div className="text-xl font-black text-white">{stats.mvp.kills}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-[10px] text-gray-400 font-semibold mb-1 uppercase">Matches</div>
                    <div className="text-xl font-black text-white">{stats.mvp.matches}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-[10px] text-gray-400 font-semibold mb-1 uppercase">K/D</div>
                    <div className="text-xl font-black text-white">{stats.mvp.kd}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                No MVP data available yet
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Spacer for bottom nav */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
}
