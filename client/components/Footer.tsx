"use client";

import Link from "next/link";
import { Gamepad, Play, MessageCircle, MapPin, Download } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === "accepted") {
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    return (
        <footer className="relative bg-black border-t border-white/5 pt-20 pb-10 px-6 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Gamepad className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white">BGMI SCRIM</span>
                        </div>
                        <p className="text-zinc-500 max-w-sm text-sm leading-relaxed font-medium">
                            The ultimate destination for competitive BGMI players. Real-time slots, verified payments, and professional tournament-grade scrims every day.
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4">
                            <SocialLink
                                href="https://chat.whatsapp.com/E0Xvkc1PdSFCUZFyjJX4Ep?mode=gi_t"
                                icon={<MessageCircle className="h-5 w-5" />}
                                colorClass="text-emerald-500"
                            />
                            <SocialLink
                                href="https://youtube.com/@krzesty?si=4IuHcrnFKbbo7MPf"
                                icon={<Play className="h-5 w-5" />}
                                colorClass="text-red-500"
                            />
                            
                            {isInstallable && (
                                <button
                                    onClick={handleInstallClick}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                                >
                                    <Download className="h-4 w-4" />
                                    Install App
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">Explore</h3>
                        <ul className="space-y-4">
                            <FooterLink href="/dashboard">Browse Scrims</FooterLink>
                            <FooterLink href="/leaderboard">Leaderboard</FooterLink>
                            <FooterLink href="/profile">My Activity</FooterLink>
                            <FooterLink href="/terms">Tournament Rules</FooterLink>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">Support</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href="https://chat.whatsapp.com/GMlsUSOnnLQFQfuujlD0G0?mode=gi_t"
                                    target="_blank"
                                    className="flex items-center gap-3 text-zinc-500 text-sm font-medium hover:text-white transition-colors cursor-pointer"
                                >
                                    <MessageCircle className="h-4 w-4 text-emerald-500" /> WhatsApp Support
                                </Link>
                            </li>
                             <li className="flex items-center gap-3 text-zinc-500 text-sm font-medium hover:text-white transition-colors cursor-pointer">
                                <Link href="https://wa.me/916205597789" target="_blank" className="flex items-center gap-3">
                                    <MessageCircle className="h-4 w-4 text-emerald-500" /> 6205597789
                                </Link>
                             </li>
                             <li className="flex items-center gap-3 text-zinc-500 text-sm font-medium hover:text-white transition-colors cursor-pointer">
                                <MapPin className="h-4 w-4 text-red-500" /> Patna, India
                             </li>
                        </ul>
                    </div>
                </div>

                {/* Support Alert Message */}
                <div className="mb-12 p-6 rounded-3xl bg-blue-600/5 border border-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <MessageCircle className="h-24 w-24 text-blue-500" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 text-center md:text-left transition-all group-hover:scale-[1.01]">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                            <MessageCircle className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <h4 className="text-white font-black uppercase tracking-tight text-sm mb-1">Need Immediate Support?</h4>
                            <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-md">
                                For any issues regarding <span className="text-white font-bold">Payments</span>, <span className="text-white font-bold">Team Names</span>, or <span className="text-white font-bold">Player Rosters</span>, please contact our administrative team directly at <span className="text-white font-bold">6205597789</span>.
                            </p>
                        </div>
                    </div>
                    <Link 
                        href="https://chat.whatsapp.com/GMlsUSOnnLQFQfuujlD0G0?mode=gi_t"
                        target="_blank"
                        className="relative z-10 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                    >
                        Message Admin on WhatsApp
                    </Link>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-6">
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest text-center">
                        &copy; 2026 BGMI SCRIM PLATFORM. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-zinc-500 hover:text-white text-sm font-medium transition-all hover:translate-x-1 inline-block">
                {children}
            </Link>
        </li>
    );
}

function SocialLink({ href, icon, colorClass }: { href: string; icon: React.ReactNode; colorClass?: string }) {
    return (
        <Link
            href={href}
            target="_blank"
            className={`p-2.5 rounded-xl bg-zinc-900 border border-white/5 hover:bg-blue-600/10 hover:border-blue-500/20 transition-all shadow-lg ${colorClass || "text-zinc-500 hover:text-white"}`}
        >
            {icon}
        </Link>
    );
}
