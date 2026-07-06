"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gamepad2, Trophy, Shield, Zap, ChevronRight, User as UserIcon, Play, Target, Home, ListChecks, Award, Flame, Clock3 } from "lucide-react";
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
        api.get('/settings/last_match_youtube_url')
            .then(res => { if (res.data?.value) setYoutubeUrl(res.data.value); })
            .catch(err => console.log(err));

        api.get('/settings/last_match_thumbnail_url')
            .then(res => { if (res.data?.value) setYoutubeThumbnail(res.data.value); })
            .catch(err => console.log(err));

        api.get("/scrims/all")
            .then(res => {
                const completed = res.data.filter((s: any) => s.status === 'completed');
                completed.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());
                setRecentMatches(completed.slice(0, 4));
            })
            .catch(err => console.log(err));

        if (socket) {
            const handleUpdate = (data: { key: string, value: string }) => {
                if (data.key === 'last_match_youtube_url') setYoutubeUrl(data.value);
                if (data.key === 'last_match_thumbnail_url') setYoutubeThumbnail(data.value);
            };
            socket.on('settingUpdate', handleUpdate);
            return () => { socket.off('settingUpdate', handleUpdate); };
        }
    }, [socket]);

    return (
        <div className="min-h-screen bg-gray-50 md:bg-white text-gray-900 selection:bg-blue-500/30 overflow-hidden font-sans">

            {/* Dynamic Background Glows - desktop only, feels too "web" on an app screen */}
            <div className="hidden md:block fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100 blur-[150px] rounded-full pointer-events-none" />
            <div className="hidden md:block fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-50 blur-[150px] rounded-full pointer-events-none" />

            {/* ============ DESKTOP NAV (unchanged) ============ */}
            <nav className="hidden md:block fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <img src="/logo.png" alt="FragZone" className="w-10 h-10 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-105 transition-transform object-cover" />
                        <span className="text-2xl font-black tracking-tighter uppercase italic text-gray-900">Frag Zone</span>
                    </Link>
                    <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-tight">
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

            {/* ============ DESKTOP MARQUEE (unchanged) ============ */}
            <div className="hidden md:block w-full bg-blue-50 border-y border-blue-100 mt-20 overflow-hidden py-2 relative z-40 backdrop-blur-sm">
                <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="flex whitespace-nowrap gap-12 items-center">
                    <span className="text-sm font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> LIVE SCRIMS DAILY</span>
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">🔥 NEXT MATCH IN 30 MINS</span>
                    <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">🏆 {recentMatches.length > 0 ? `LATEST WINNER: ${recentMatches[0].winner}` : "DOMINATE THE LOBBY"}</span>
                    <span className="text-sm font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> PRO PRIZE POOLS</span>
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">🔥 NEXT MATCH IN 30 MINS</span>
                    <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">🏆 {recentMatches.length > 0 ? `LATEST WINNER: ${recentMatches[0].winner}` : "DOMINATE THE LOBBY"}</span>
                </motion.div>
            </div>

            {/* ============ DESKTOP HERO (unchanged) ============ */}
            <section className="hidden md:grid relative pt-12 pb-24 px-6 max-w-7xl mx-auto lg:grid-cols-2 gap-12 items-center z-10">
                <div className="text-center lg:text-left relative z-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-xs font-bold text-blue-600 mb-6 uppercase tracking-widest">
                        <Shield className="h-3.5 w-3.5" /> India's Premium Esports Platform
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9] italic uppercase text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500">
                        DOMINATE<br /><span className="text-blue-600">THE ARENA.</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
                        Join professional BGMI Scrims with real-time slots, verified payments, and instant access. Compete with the best.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <Link href={user ? "/dashboard" : "/register"} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 active:scale-95">
                            Explore Matches <ChevronRight className="h-4 w-4" />
                        </Link>
                        <Link href="https://chat.whatsapp.com/GMlsUSOnnLQFQfuujlD0G0?mode=gi_t" target="_blank" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl font-black text-sm uppercase tracking-widest text-gray-800 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Join Community
                        </Link>
                    </div>
                </div>
                <div className="relative z-20 flex justify-center lg:justify-end items-center h-[500px]">

                    <a href={youtubeUrl} target="_blank" className="relative z-30 w-full max-w-sm bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-4 shadow-2xl hover:border-blue-300 transition-all group block">
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <div className="bg-red-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.5)]"><div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Featured Match</div>
                        </div>
                        <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group-hover:scale-[1.02] transition-transform duration-300">
                            {youtubeThumbnail ? (<img src={youtubeThumbnail} alt="Match Thumbnail" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />) : (<div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center"><Gamepad2 className="w-16 h-16 text-blue-500/30" /></div>)}
                            <div className="absolute inset-0 flex items-center justify-center"><div className="w-14 h-14 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-transform"><Play className="h-6 w-6 text-white ml-1 fill-current" /></div></div>
                        </div>
                        <div className="mt-4 px-2">
                            <h3 className="text-gray-900 font-black text-lg uppercase italic tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">Watch Latest Tournament</h3>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Click to view stream</p>
                        </div>
                    </a>
                </div>
            </section>

            {/* ============ DESKTOP: Steps + Results (unchanged) ============ */}
            <section className="hidden md:block py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-gray-200">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">3 Simple Steps</h2>
                    <p className="text-4xl md:text-5xl font-black text-gray-900 italic uppercase tracking-tighter">Enter The Battlefield.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StepCardDesktop number="01" icon={<Target />} title="Join Match" description="Browse active scrims on the dashboard and secure your slot instantly." />
                    <StepCardDesktop number="02" icon={<Zap />} title="Pay Entry" description="Scan the UPI QR code and submit your Transaction ID/UTR for quick approval." />
                    <StepCardDesktop number="03" icon={<Trophy />} title="Dominate" description="Get Room ID & Password 15 minutes prior. Drop in and conquer." />
                </div>
            </section>

            <section className="hidden md:block py-24 px-6 bg-gray-50 border-t border-gray-200 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-sm font-black text-orange-600 uppercase tracking-widest mb-2">Hall of Fame</h2>
                            <p className="text-4xl md:text-5xl font-black text-gray-900 italic uppercase tracking-tighter">Recent Results.</p>
                        </div>
                        <Link href="/results" className="px-6 py-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-full font-black text-xs uppercase tracking-widest text-gray-800 transition-all flex items-center justify-center gap-2 w-fit active:scale-95 shadow-sm">View All Matches <ChevronRight className="h-3 w-3" /></Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentMatches.length > 0 ? recentMatches.map((match, i) => (<MatchCardDesktop match={match} i={i} key={match._id} />)) : (<div className="col-span-full text-center py-12"><p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No recent matches found...</p></div>)}
                    </div>
                </div>
            </section>

            {/* ================================================================== */}
            {/* ============ MOBILE APP UI (completely separate design) ========== */}
            {/* ================================================================== */}
            <div className="md:hidden">

                {/* App top bar */}
                <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
                    <div className="px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="FragZone" className="w-8 h-8 rounded-lg object-cover" />
                            <span className="text-base font-black tracking-tight text-gray-900">Frag Zone</span>
                        </div>
                        <Link href={user ? "/profile" : "/login"} className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-sm active:scale-90 transition-transform">
                            <UserIcon className="h-4 w-4 text-white" />
                        </Link>
                    </div>
                </header>

                <main className="pt-14 pb-24">

                    {/* Home banner card */}
                    <div className="px-4 pt-4">
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
                            <Gamepad2 className="absolute -right-4 -bottom-4 w-28 h-28 text-white/10" />
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-wide mb-3">
                                <Shield className="h-3 w-3" /> Premium Esports
                            </div>
                            <h1 className="text-2xl font-black tracking-tight leading-tight mb-1">Dominate the Arena</h1>
                            <p className="text-blue-100 text-sm font-medium mb-4 max-w-[85%]">Live BGMI scrims, instant slots, verified payouts.</p>
                            <Link href={user ? "/dashboard" : "/register"} className="inline-flex items-center gap-1.5 bg-white text-blue-700 text-sm font-black px-4 py-2.5 rounded-full active:scale-95 transition-transform">
                                Explore Matches <ChevronRight className="h-4 w-4" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Quick stat chips */}
                    <div className="flex gap-3 px-4 pt-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        <StatChip icon={<Flame className="h-4 w-4 text-orange-500" />} label="Next Match" value="30 min" />
                        <StatChip icon={<Trophy className="h-4 w-4 text-yellow-500" />} label="Latest Winner" value={recentMatches.length > 0 ? recentMatches[0].winner : "TBD"} />
                        <StatChip icon={<Zap className="h-4 w-4 text-blue-500" />} label="Status" value="Live Daily" />
                    </div>

                    {/* Featured match card */}
                    <div className="px-4 pt-6">
                        <SectionHeader eyebrow="Watch" title="Featured Match" />
                        <Link href={youtubeUrl} target="_blank" className="block bg-white rounded-3xl p-3 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
                            <div className="relative h-40 rounded-2xl overflow-hidden bg-gray-100">
                                {youtubeThumbnail ? (
                                    <img src={youtubeThumbnail} alt="Match Thumbnail" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center"><Gamepad2 className="w-14 h-14 text-blue-500/30" /></div>
                                )}
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-full flex items-center gap-1"><div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Live</div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg"><Play className="h-5 w-5 text-white ml-0.5 fill-current" /></div>
                                </div>
                            </div>
                            <div className="pt-3 px-1 flex items-center justify-between">
                                <div>
                                    <h3 className="text-gray-900 font-black text-sm">Watch Latest Tournament</h3>
                                    <p className="text-gray-400 text-xs font-medium">Tap to view stream</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-300" />
                            </div>
                        </Link>
                    </div>

                    {/* Steps - app list style with colored icon chips */}
                    <div className="px-4 pt-6">
                        <SectionHeader eyebrow="Get Started" title="3 Simple Steps" />
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
                            <StepRow color="bg-blue-50 text-blue-600" icon={<Target className="h-5 w-5" />} step="1" title="Join Match" description="Browse scrims & secure your slot instantly." />
                            <StepRow color="bg-orange-50 text-orange-600" icon={<Zap className="h-5 w-5" />} step="2" title="Pay Entry" description="Scan UPI QR, submit UTR for quick approval." />
                            <StepRow color="bg-emerald-50 text-emerald-600" icon={<Trophy className="h-5 w-5" />} step="3" title="Dominate" description="Get Room ID & Password 15 min prior." />
                        </div>
                    </div>

                    {/* Recent results - ranked list cards */}
                    <div className="px-4 pt-6">
                        <SectionHeader eyebrow="Hall of Fame" title="Recent Results" action={{ label: "See all", href: "/results" }} />
                        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden -mx-4 px-4">
                            {recentMatches.length > 0 ? recentMatches.map((match, i) => (
                                <MobileMatchCard match={match} i={i} key={match._id} />
                            )) : (
                                <div className="w-full text-center py-10">
                                    <p className="text-gray-400 font-bold text-sm">No recent matches found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </main>

                {/* Bottom tab bar */}
                <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
                    <div className="grid grid-cols-4 h-16 px-2">
                        <TabItem href="/" icon={<Home className="h-5 w-5" />} label="Home" active />
                        <TabItem href="/results" icon={<ListChecks className="h-5 w-5" />} label="Results" />
                        <TabItem href="/leaderboard" icon={<Award className="h-5 w-5" />} label="Ranks" />
                        <TabItem href={user ? "/profile" : "/login"} icon={<UserIcon className="h-5 w-5" />} label={user ? "Profile" : "Log In"} />
                    </div>
                </nav>
            </div>
        </div>
    );
}

/* ============ Desktop-only sub-components (unchanged look) ============ */

function StepCardDesktop({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-white border border-gray-200 hover:border-blue-300 p-8 rounded-[2rem] transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black text-gray-900 pointer-events-none group-hover:-translate-y-4 group-hover:opacity-10 transition-all">{number}</div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">{icon}</div>
            <h3 className="text-2xl font-black text-gray-900 italic uppercase tracking-tight mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed text-sm font-medium">{description}</p>
        </div>
    );
}

function MatchCardDesktop({ match, i }: { match: any, i: number }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white border border-gray-200 rounded-3xl p-6 hover:border-orange-400 transition-colors group relative overflow-hidden flex flex-col justify-between h-[220px] shadow-sm hover:shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-500"><Trophy className="w-24 h-24 text-orange-500" /></div>
            <div className="relative z-10">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(match.time).toLocaleDateString()}</span>
                <h3 className="text-xl font-black text-gray-900 italic uppercase tracking-tighter mt-1 truncate" title={match.matchName}>{match.matchName}</h3>
            </div>
            <div className="relative z-10 space-y-4">
                <div><span className="text-[9px] font-black text-orange-600 uppercase tracking-widest block mb-1">Champion</span><div className="text-lg font-black text-gray-900 uppercase tracking-tight truncate" title={match.winner || "TBD"}>{match.winner || "TBD"}</div></div>
                <div className="h-px w-full bg-gray-100" />
                <div><span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Zap className="w-3 h-3" /> MVP Player</span><div className="text-sm font-bold text-gray-600 uppercase truncate" title={match.mvpPlayer || "N/A"}>{match.mvpPlayer || "N/A"}</div></div>
            </div>
        </motion.div>
    );
}

/* ============ Mobile-only sub-components (app style) ============ */

function SectionHeader({ eyebrow, title, action }: { eyebrow: string, title: string, action?: { label: string, href: string } }) {
    return (
        <div className="flex items-end justify-between mb-3">
            <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{eyebrow}</span>
                <h2 className="text-lg font-black text-gray-900 tracking-tight -mt-0.5">{title}</h2>
            </div>
            {action && (
                <Link href={action.href} className="text-xs font-bold text-gray-400 flex items-center gap-0.5 active:text-gray-600">
                    {action.label} <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            )}
        </div>
    );
}

function StatChip({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="shrink-0 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 min-w-[130px]">
            <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</span></div>
            <div className="text-sm font-black text-gray-900 truncate">{value}</div>
        </div>
    );
}

function StepRow({ color, icon, step, title, description }: { color: string, icon: React.ReactNode, step: string, title: string, description: string }) {
    return (
        <div className="flex items-center gap-3 p-4 active:bg-gray-50 transition-colors">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-gray-300">STEP {step}</span>
                </div>
                <h3 className="text-sm font-black text-gray-900 truncate">{title}</h3>
                <p className="text-xs text-gray-500 font-medium truncate">{description}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
        </div>
    );
}

function MobileMatchCard({ match, i }: { match: any, i: number }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="snap-center shrink-0 w-[68%] bg-white rounded-2xl border border-gray-100 shadow-sm p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black flex items-center justify-center">#{i + 1}</span>
                <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1"><Clock3 className="h-3 w-3" />{new Date(match.time).toLocaleDateString()}</span>
            </div>
            <h3 className="text-sm font-black text-gray-900 truncate mb-3">{match.matchName}</h3>
            <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                <span className="text-sm font-black text-gray-900 truncate">{match.winner || "TBD"}</span>
            </div>
            <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span className="text-xs font-bold text-gray-500 truncate">{match.mvpPlayer || "N/A"}</span>
            </div>
        </motion.div>
    );
}

function TabItem({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link href={href} className="flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform">
            <div className={`w-10 h-7 rounded-full flex items-center justify-center ${active ? "bg-blue-50 text-blue-600" : "text-gray-400"}`}>{icon}</div>
            <span className={`text-[10px] font-bold uppercase tracking-wide ${active ? "text-blue-600" : "text-gray-400"}`}>{label}</span>
        </Link>
    );
}
