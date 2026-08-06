"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { Gamepad2, LayoutDashboard, CreditCard, Trophy, LogOut, DoorOpen, Users, Award, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/scrims", label: "Manage Scrims", icon: Trophy },
    { href: "/tournaments", label: "Manage Tournaments", icon: Award },
    { href: "/leaderboard", label: "Leaderboard", icon: Award },
    { href: "/payments", label: "Payments", icon: CreditCard },
    { href: "/room", label: "Room Management", icon: DoorOpen },
    { href: "/players", label: "Players", icon: Users },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <>
            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 glass-morphism border-r border-white/5 flex flex-col transition-transform duration-300 transform
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                lg:static lg:h-screen lg:flex-shrink-0
            `}>
                {/* Logo */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-600 p-2 rounded-lg">
                            <Gamepad2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <div className="font-black text-sm tracking-tight uppercase italic">Frag Zone</div>
                            <div className="text-[10px] text-red-500 uppercase tracking-widest font-black">Admin Panel</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20 border border-white/10"
                                    : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl border border-white/5">
                        <div className="min-w-0">
                            <div className="text-xs font-black truncate text-white">{user?.username}</div>
                            <div className="text-[9px] text-red-500 uppercase tracking-widest font-bold">Administrator</div>
                        </div>
                        <button onClick={logout} className="p-2 rounded-lg hover:bg-red-600/10 hover:text-red-500 transition-colors" title="Logout">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
