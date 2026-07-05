"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gamepad2, Trophy, Shield, Zap, ChevronRight, User as UserIcon, Play, Target, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import api from "@/lib/api";

export default function LandingPage() {
  const { user } = useAuth();
  const socket = useSocket();
  const [youtubeUrl, setYoutubeUrl] = useState("https://www.youtube.com/@MAjorZMBGMI");
  const [youtubeThumbnail, setYoutubeThumbnail] = useState("");
  const [recentMatches, setRecentMatches] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Settings
    api.get('/settings/last_match_youtube_url')
      .then(res => { if (res.data?.value) setYoutubeUrl(res.data.value); })
      .catch(err => console.log(err));

    api.get('/settings/last_match_thumbnail_url')
      .then(res => { if (res.data?.value) setYoutubeThumbnail(res.data.value); })
      .catch(err => console.log(err));

    // Fetch Recent Matches
    api.get("/scrims/all")
      .then(res => {
         const completed = res.data.filter((s: any) => s.status === 'completed');
         // Sort by time descending (assuming time is ISO string)
         completed.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());
         setRecentMatches(completed.slice(0, 4));
      })
      .catch(err => console.log(err));

    // Listen for real-time updates
    if (socket) {
      const handleUpdate = (data: { key: string, value: string }) => {
        if (data.key === 'last_match_youtube_url') setYoutubeUrl(data.value);
        if (data.key === 'last_match_thumbnail_url') setYoutubeThumbnail(data.value);
      };
      socket.on('settingUpdate', handleUpdate);
      return () => socket.off('settingUpdate', handleUpdate);
    }
  }, [socket]);

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-500/30 overflow-hidden font-sans">
      
      {/* Dynamic Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-50 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="FragZone" className="w-10 h-10 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-105 transition-transform object-cover" />
            <span className="text-2xl font-black tracking-tighter uppercase italic text-gray-900">Frag Zone</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-tight">
            <Link href="/results" className="text-gray-600 hover:text-blue-600 transition-colors">Results</Link>
            <Link href="/leaderboard" className="text-gray-600 hover:text-blue-600 transition-colors">Leaderboard</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link>
                <Link href="/profile" className="px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center gap-2">
                  <UserIcon className="h-4 w-4" /> Profile
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Log In</Link>
                <Link href="/register" className="px-6 py-3 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all transform hover:scale-105 uppercase tracking-widest font-black shadow-lg">
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Scrolling Marquee */}
      <div className="w-full bg-blue-50 border-y border-blue-100 mt-20 overflow-hidden py-2 relative z-40 backdrop-blur-sm">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex whitespace-nowrap gap-12 items-center"
        >
           <span className="text-sm font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> LIVE SCRIMS DAILY
           </span>
           <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">
             🔥 NEXT MATCH IN 30 MINS
           </span>
           <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">
             🏆 {recentMatches.length > 0 ? `LATEST WINNER: ${recentMatches[0].winner}` : "DOMINATE THE LOBBY"}
           </span>
           <span className="text-sm font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> PRO PRIZE POOLS
           </span>
           <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">
             🔥 NEXT MATCH IN 30 MINS
           </span>
           <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">
             🏆 {recentMatches.length > 0 ? `LATEST WINNER: ${recentMatches[0].winner}` : "DOMINATE THE LOBBY"}
           </span>
        </motion.div>
      </div>

      {/* Hero Section Split Layout */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left: Text Content */}
        <div className="text-center lg:text-left relative z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-xs font-bold text-blue-600 mb-6 uppercase tracking-widest">
            <Shield className="h-3.5 w-3.5" /> India's Premium Esports Platform
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9] italic uppercase text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500">
            DOMINATE<br/><span className="text-blue-600">THE ARENA.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
            Join professional BGMI Scrims with real-time slots, verified payments, and instant access. Compete with the best.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link href={user ? "/dashboard" : "/register"} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 active:scale-95">
              Explore Matches <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="https://chat.whatsapp.com/GMlsUSOnnLQFQfuujlD0G0?mode=gi_t" target="_blank" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl font-black text-sm uppercase tracking-widest text-gray-800 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Join Community
            </Link>
          </motion.div>
        </div>

        {/* Right: Graphic & YouTube Box */}
        <div className="relative z-20 flex justify-center lg:justify-end items-center h-[500px] mt-10 lg:mt-0">
           {/* Epic 3D Graphic Background */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }} 
             animate={{ opacity: 1, scale: 1 }} 
             transition={{ duration: 0.8, type: "spring" }}
             className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none"
           >
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/hero_graphic.png" alt="Esports Helmet" className="w-full max-w-[500px] object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-pulse" style={{ animationDuration: '4s' }} />
           </motion.div>

           {/* Floating YouTube Box (Match of the Day) */}
           <motion.a 
             href={youtubeUrl} 
             target="_blank"
             initial={{ opacity: 0, x: 40 }} 
             animate={{ opacity: 1, x: 0 }} 
             transition={{ delay: 0.4, type: "spring" }}
             className="relative z-30 w-full max-w-sm bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-4 shadow-2xl hover:border-blue-300 transition-all group block"
           >
              <div className="flex items-center gap-2 mb-4 px-2">
                 <div className="bg-red-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Featured Match
                 </div>
              </div>
              
              <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group-hover:scale-[1.02] transition-transform duration-300">
                 {youtubeThumbnail ? (
                   // eslint-disable-next-line @next/next/no-img-element
                   <img src={youtubeThumbnail} alt="Match Thumbnail" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                 ) : (
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center">
                      <Gamepad2 className="w-16 h-16 text-blue-500/30" />
                   </div>
                 )}
                 
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-white ml-1 fill-current" />
                    </div>
                 </div>
              </div>

              <div className="mt-4 px-2">
                 <h3 className="text-gray-900 font-black text-lg uppercase italic tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">Watch Latest Tournament</h3>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Click to view stream</p>
              </div>
           </motion.a>
        </div>
      </section>

      {/* How it Works / Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-gray-200">
        <div className="text-center mb-16">
          <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">3 Simple Steps</h2>
          <p className="text-4xl md:text-5xl font-black text-gray-900 italic uppercase tracking-tighter">Enter The Battlefield.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard number="01" icon={<Target />} title="Join Match" description="Browse active scrims on the dashboard and secure your slot instantly." />
          <StepCard number="02" icon={<Zap />} title="Pay Entry" description="Scan the UPI QR code and submit your Transaction ID/UTR for quick approval." />
          <StepCard number="03" icon={<Trophy />} title="Dominate" description="Get Room ID & Password 15 minutes prior. Drop in and conquer." />
        </div>
      </section>

      {/* Recent Winners & Matches Section */}
      <section className="py-24 px-6 bg-gray-50 border-t border-gray-200 relative z-10">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
               <div>
                 <h2 className="text-sm font-black text-orange-600 uppercase tracking-widest mb-2">Hall of Fame</h2>
                 <p className="text-4xl md:text-5xl font-black text-gray-900 italic uppercase tracking-tighter">Recent Results.</p>
               </div>
               <Link href="/results" className="px-6 py-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-full font-black text-xs uppercase tracking-widest text-gray-800 transition-all flex items-center justify-center gap-2 w-fit active:scale-95 shadow-sm">
                 View All Matches <ChevronRight className="h-3 w-3" />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {recentMatches.length > 0 ? (
                 recentMatches.map((match, i) => (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     key={match._id} 
                     className="bg-white border border-gray-200 rounded-3xl p-6 hover:border-orange-400 transition-colors group relative overflow-hidden flex flex-col justify-between h-[220px] shadow-sm hover:shadow-md"
                   >
                     <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-500"><Trophy className="w-24 h-24 text-orange-500" /></div>
                     
                     <div className="relative z-10">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(match.time).toLocaleDateString()}</span>
                       <h3 className="text-xl font-black text-gray-900 italic uppercase tracking-tighter mt-1 truncate" title={match.matchName}>{match.matchName}</h3>
                     </div>

                     <div className="relative z-10 space-y-4">
                       <div>
                         <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest block mb-1">Champion</span>
                         <div className="text-lg font-black text-gray-900 uppercase tracking-tight truncate" title={match.winner || "TBD"}>{match.winner || "TBD"}</div>
                       </div>
                       <div className="h-px w-full bg-gray-100" />
                       <div>
                         <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Zap className="w-3 h-3" /> MVP Player</span>
                         <div className="text-sm font-bold text-gray-600 uppercase truncate" title={match.mvpPlayer || "N/A"}>{match.mvpPlayer || "N/A"}</div>
                       </div>
                     </div>
                   </motion.div>
                 ))
               ) : (
                 <div className="col-span-full text-center py-12">
                   <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No recent matches found...</p>
                 </div>
               )}
            </div>
         </div>
      </section>
    </div>
  );
}

function StepCard({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white border border-gray-200 hover:border-blue-300 p-8 rounded-[2rem] transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
      <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black text-gray-900 pointer-events-none group-hover:-translate-y-4 group-hover:opacity-10 transition-all">{number}</div>
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-gray-900 italic uppercase tracking-tight mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm font-medium">{description}</p>
    </div>
  );
}
