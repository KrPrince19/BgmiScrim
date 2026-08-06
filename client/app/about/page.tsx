"use client";

import Navbar from "@/components/Navbar";
import { ShieldCheck, Users, Trophy, Headset } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030008] text-white font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-950/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-950/20 blur-[150px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header Banner */}
        <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden mb-10 border border-purple-500/20 shadow-[0_0_30px_rgba(126,34,206,0.15)] group shrink-0">
          <img 
            src="/about.jpeg" 
            alt="About Us" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          {/* Dark gradient overlay for text readability on the left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030008] via-[#030008]/80 to-transparent w-full md:w-2/3" />
          
          {/* Text Content (Left Aligned) */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tight mb-2 text-white drop-shadow-xl">
              About Us
            </h1>
            <p className="text-sm md:text-base text-purple-200 font-semibold drop-shadow-md">
              We are FragZone.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-16">
          {/* Left Content */}
          <div className="flex-1">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-white">Our Mission</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 font-medium">
              FragZone is built for gamers, by gamers. Our mission is to provide a fair, competitive
              and fun environment for BGMI players to improve their skills, compete in
              high quality scrims and tournaments, and grow together as a community.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full border border-purple-500/30 bg-purple-900/20 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xs font-bold text-white mb-2 uppercase">Fair Play</h3>
                <p className="text-[10px] text-gray-500 leading-tight">100% fair and secure scrims & tournaments.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full border border-purple-500/30 bg-purple-900/20 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xs font-bold text-white mb-2 uppercase">Community First</h3>
                <p className="text-[10px] text-gray-500 leading-tight">Building the biggest BGMI community.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full border border-purple-500/30 bg-purple-900/20 flex items-center justify-center mb-3">
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xs font-bold text-white mb-2 uppercase">Competitive</h3>
                <p className="text-[10px] text-gray-500 leading-tight">Made for serious players and competitive gaming.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full border border-purple-500/30 bg-purple-900/20 flex items-center justify-center mb-3">
                  <Headset className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xs font-bold text-white mb-2 uppercase">24/7 Support</h3>
                <p className="text-[10px] text-gray-500 leading-tight">We're here to help you anytime.</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative flex justify-center lg:justify-end items-center">
            {/* Glowing Hexagon Background */}
            <div className="absolute w-[300px] h-[300px] bg-purple-600/10 blur-2xl rounded-full z-0" />
            <svg className="absolute w-[80%] h-[80%] opacity-40 text-purple-700 z-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50 5, 90 28, 90 72, 50 95, 10 72, 10 28" stroke="currentColor" strokeWidth="1.5" />
              <polygon points="50 15, 80 32, 80 68, 50 85, 20 68, 20 32" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            </svg>

          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6 text-white">Our Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0b0514] border border-white/5 rounded-2xl p-6 text-center hover:border-purple-500/30 transition-colors group">
              <div className="text-3xl font-black text-white mb-1 group-hover:text-purple-400 transition-colors">5000+</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Players</div>
            </div>
            <div className="bg-[#0b0514] border border-white/5 rounded-2xl p-6 text-center hover:border-purple-500/30 transition-colors group">
              <div className="text-3xl font-black text-white mb-1 group-hover:text-purple-400 transition-colors">1200+</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Scrims Played</div>
            </div>
            <div className="bg-[#0b0514] border border-white/5 rounded-2xl p-6 text-center hover:border-purple-500/30 transition-colors group">
              <div className="text-3xl font-black text-white mb-1 group-hover:text-purple-400 transition-colors">200+</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tournaments</div>
            </div>
            <div className="bg-[#0b0514] border border-white/5 rounded-2xl p-6 text-center hover:border-purple-500/30 transition-colors group">
              <div className="text-3xl font-black text-white mb-1 group-hover:text-purple-400 transition-colors">₹1L+</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Rewards Distributed</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <div className="relative z-10 text-center sm:text-left">
            <h4 className="text-xl font-bold text-white mb-1">Stay Connected</h4>
            <p className="text-sm text-gray-400">Join our WhatsApp group and never miss any updates!</p>
          </div>
          <a 
            href="https://chat.whatsapp.com/GMlsUSOnnLQFQfuujlD0G0"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 w-full sm:w-auto px-8 py-3 bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap shadow-[0_0_20px_rgba(37,211,102,0.4)] text-center"
          >
            Join WhatsApp
          </a>
        </div>
      </main>
    </div>
  );
}
