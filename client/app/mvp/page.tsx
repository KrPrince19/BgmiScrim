"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Shield, Trophy, Gamepad2, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useSocket } from "@/context/SocketContext";

export default function MVPPage() {
  const [scrims, setScrims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchScrims();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleScrimUpdate = (updatedScrim: any) => {
      setScrims((prev) => {
        const exists = prev.find(s => s._id === updatedScrim._id);
        if (exists) {
          return prev.map(s => s._id === updatedScrim._id ? updatedScrim : s);
        } else {
          return [updatedScrim, ...prev].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        }
      });
    };
    socket.on('scrimUpdate', handleScrimUpdate);
    return () => {
      socket.off('scrimUpdate', handleScrimUpdate);
    };
  }, [socket]);

  // Filter for completed scrims that have an MVP assigned
  const mvpScrims = scrims
    .filter(s => s.status === 'completed' && s.mvpPlayer)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const currentMVP = mvpScrims.length > 0 ? mvpScrims[0] : null;
  const previousMVPs = mvpScrims.slice(1);

  return (
    <div className="min-h-screen bg-[#030008] text-white font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-950/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-950/20 blur-[150px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col min-h-[calc(100vh-80px)]">
        {/* Header Banner */}
        <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-8 border border-purple-500/20 shadow-[0_0_30px_rgba(126,34,206,0.15)] group shrink-0">
          <img 
            src="/mvp.jpeg" 
            alt="MVP" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          {/* Dark gradient overlay for text readability on the left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030008] via-[#030008]/80 to-transparent w-full md:w-2/3" />
          
          {/* Text Content (Left Aligned) */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tight mb-2 text-white drop-shadow-xl">
              MVP
            </h1>
            <p className="text-sm md:text-base text-purple-200 font-semibold drop-shadow-md">
              Most Valuable Players.
            </p>
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center items-center py-20">
             <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
           </div>
        ) : (
          <>
            {/* Current MVP Feature Card */}
            {currentMVP ? (
              <div className="relative bg-[#0b0514] border border-white/5 rounded-3xl overflow-hidden mb-12 shadow-[0_0_50px_rgba(126,34,206,0.15)] group">
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0b0514] via-[#0b0514]/90 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0514] via-transparent to-transparent z-10" />
                </div>

                <div className="relative z-20 p-8 md:p-12 w-full md:w-2/3">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      {currentMVP.mvpPlayerAvatar ? (
                        <div className="w-24 h-24 rounded-full border-4 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] overflow-hidden">
                          <img src={currentMVP.mvpPlayerAvatar} alt={currentMVP.mvpPlayer} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                          <Trophy className="w-12 h-12 text-yellow-500" />
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0b0514] rounded-full flex items-center justify-center p-1">
                        <div className="w-full h-full bg-yellow-500 rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-black" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{currentMVP.mvpPlayer}</h2>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-yellow-500 border border-yellow-500/30 backdrop-blur-sm">
                        <Shield className="w-3.5 h-3.5" /> {currentMVP.mvpPlayerTeam}
                      </div>
                    </div>
                    
                    {/* Large MVP Text Watermark */}
                    <div className="hidden lg:block absolute top-10 right-10 opacity-10 font-black text-8xl tracking-tighter text-transparent" style={{ WebkitTextStroke: '2px white' }}>
                      MVP
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Match</div>
                      <div className="text-sm font-black text-white line-clamp-1">{currentMVP.matchName}</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Date</div>
                      <div className="text-sm font-black text-white">{new Date(currentMVP.updatedAt).toLocaleDateString()}</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                      <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1">Kills</div>
                      <div className="text-2xl font-black text-purple-400">{currentMVP.mvpPlayerKills}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10 font-bold uppercase tracking-widest bg-white/5 rounded-2xl border border-white/5 mb-12">
                No MVP Data Available Yet
              </div>
            )}

            {/* Previous MVPs */}
            <div className="mb-12">
              <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-6">Previous MVPs</h3>
              
              {previousMVPs.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previousMVPs.map((scrim) => (
                    <div key={scrim._id} className="bg-[#0b0514] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center hover:border-purple-500/30 transition-all hover:-translate-y-1">
                      <div className="relative mb-4">
                        {scrim.mvpPlayerAvatar ? (
                          <div className="w-16 h-16 rounded-full border-2 border-white/10 overflow-hidden">
                            <img src={scrim.mvpPlayerAvatar} alt={scrim.mvpPlayer} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/10">
                             <Trophy className="w-8 h-8 text-yellow-500" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[8px] font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap">
                          MVP
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{scrim.mvpPlayer}</h4>
                      <p className="text-[10px] text-gray-500 font-semibold mb-1">{scrim.mvpPlayerTeam}</p>
                      <p className="text-[10px] text-purple-400 font-black">{scrim.mvpPlayerKills} Kills</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 text-[10px] font-black uppercase tracking-widest italic border border-dashed border-white/5 rounded-2xl">
                    No Previous MVP data
                </div>
              )}
            </div>
          </>
        )}

        {/* Call to Action Banner */}
        <div className="mt-auto bg-purple-950/20 border border-purple-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle bg pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-purple-700/20 rounded-xl flex items-center justify-center shrink-0 border border-purple-500/30 rotate-3">
              <Gamepad2 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Think you have what it takes?</h4>
              <p className="text-sm text-gray-400">Play more, perform better and become the next MVP!</p>
            </div>
          </div>
          <Link href="/tournaments" className="relative z-10 w-full sm:w-auto px-8 py-3 bg-purple-700 hover:bg-purple-600 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap shadow-[0_0_20px_rgba(126,34,206,0.4)] text-center">
            Play Now
          </Link>
        </div>
      </main>
    </div>
  );
}
