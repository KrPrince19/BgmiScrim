"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gamepad2, Trophy, Shield, Zap, ChevronRight, User as UserIcon, Play, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

export default function LandingPage() {
  const { user } = useAuth();
  const socket = useSocket();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("https://www.youtube.com/@MAjorZMBGMI");

  useEffect(() => {
    // Initial fetch
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings/last_match_youtube_url`)
      .then(res => res.json())
      .then(data => {
        if (data && data.value) {
          setYoutubeUrl(data.value);
        }
      })
      .catch((err) => console.log("Settings fetch error:", err));

    // Listen for real-time updates
    if (socket) {
      const handleUpdate = (data: { key: string, value: string }) => {
        if (data.key === 'last_match_youtube_url') {
          console.log('Real-time URL update 🎬:', data.value);
          setYoutubeUrl(data.value);
        }
      };

      socket.on('settingUpdate', handleUpdate);
      return () => {
        socket.off('settingUpdate', handleUpdate);
      };
    }
  }, [socket]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-morphism border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase italic">Frag Zone</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-tight">
            <Link href="/store" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
              Store
            </Link>
            <Link href="/results" className="text-zinc-400 hover:text-white transition-colors">
              Results
            </Link>
            <Link href="/leaderboard" className="text-zinc-400 hover:text-white transition-colors">
              Leaderboard
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-black hover:bg-blue-500 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <UserIcon className="h-4 w-4" /> Profile
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 rounded-full bg-white text-black text-xs font-black hover:bg-zinc-200 transition-all transform hover:scale-105 uppercase tracking-widest"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-zinc-950 border-b border-white/5 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4 text-sm font-bold uppercase tracking-widest">
                <Link href="/store" onClick={() => setIsMenuOpen(false)} className="text-emerald-400 hover:text-emerald-300 py-2 border-b border-white/5">
                  Store
                </Link>
                <Link href="/results" onClick={() => setIsMenuOpen(false)} className="text-zinc-400 hover:text-white py-2 border-b border-white/5">
                  Results
                </Link>
                <Link href="/leaderboard" onClick={() => setIsMenuOpen(false)} className="text-zinc-400 hover:text-white py-2 border-b border-white/5">
                  Leaderboard
                </Link>
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-zinc-400 hover:text-white py-2 border-b border-white/5">
                      Dashboard
                    </Link>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-blue-500 py-2 border-b border-white/5">
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-zinc-400 hover:text-white py-2 border-b border-white/5">
                      Log In
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)} className="text-white bg-blue-600 px-4 py-3 rounded-xl text-center mt-2">
                      Join Now
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.a
            href={youtubeUrl}
            target="_blank"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-600/30 bg-red-600/5 text-sm font-medium text-red-500 mb-8 hover:bg-red-600/10 transition-colors shadow-lg shadow-red-600/5 cursor-pointer"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Watch last match on YouTube</span>
          </motion.a>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent"
          >
            DOMINATE THE <br />ARENA.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Premium BGMI Scrims with real-time slots, verified payments, and instant access. Join the elite.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={user ? "/dashboard" : "/register"}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              Explore Matches <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              href="https://chat.whatsapp.com/GMlsUSOnnLQFQfuujlD0G0?mode=gi_t"
              target="_blank"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-bold text-lg hover:border-emerald-500/30 hover:text-emerald-400 transition-all text-center flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Join Community
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Zap className="h-6 w-6 text-yellow-400" />}
          title="Instant Access"
          description="Get Room ID and Password instantly once your payment is approved."
        />
        <FeatureCard
          icon={<Shield className="h-6 w-6 text-emerald-400" />}
          title="Verified Scrims"
          description="Every match is manually verified by our admin team for a fair experience."
        />
        <FeatureCard
          icon={<Trophy className="h-6 w-6 text-blue-400" />}
          title="Pro Standards"
          description="Tournament-grade settings and competitive player base."
        />
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">HOW IT WORKS</h2>
          <p className="text-zinc-500 font-medium">3 simple steps to enter the battlefield.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <StepCard
            number="01"
            title="Join Match"
            description="Browse active scrims on the dashboard and pick your slot."
          />
          <StepCard
            number="02"
            title="Pay Entry"
            description="Scan the UPI QR code and submit your Transaction ID/UTR."
          />
          <StepCard
            number="03"
            title="Get Room ID"
            description="Once approved, view the Room ID & Password and dominate!"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/20 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-blue-600/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="relative group">
      <div className="text-8xl font-black text-white/[0.03] absolute -top-10 -left-4 group-hover:text-blue-600/[0.05] transition-colors">{number}</div>
      <div className="relative z-10">
        <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
        <p className="text-zinc-500 leading-relaxed text-sm font-medium">{description}</p>
      </div>
    </div>
  );
}
