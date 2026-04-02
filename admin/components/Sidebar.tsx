"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { Gamepad2, LayoutDashboard, CreditCard, Trophy, LogOut, DoorOpen, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/scrims", label: "Manage Scrims", icon: Trophy },
    { href: "/leaderboard", label: "Leaderboard", icon: Award },
    { href: "/payments", label: "Payments", icon: CreditCard },
    { href: "/room", label: "Room Management", icon: DoorOpen },
    { href: "/players", label: "Players", icon: Users },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const socket = useSocket();

    return (
        <div className="h-screen w-64 flex-shrink-0 glass-morphism border-r border-white/5 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="bg-red-600 p-2 rounded-lg">
                        <Gamepad2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <div className="font-black text-sm tracking-tight">Frag Zone</div>
                        <div className="text-[10px] text-red-500 uppercase tracking-widest font-bold">Admin Panel</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                ? "bg-red-600/20 text-red-500 border border-red-500/20"
                                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
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
                <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl">
                    <div className="min-w-0">
                        <div className="text-sm font-bold truncate">{user?.username}</div>
                        <div className="text-[10px] text-red-500 uppercase tracking-widest">Admin</div>
                    </div>
                    <button onClick={logout} className="p-2 rounded-lg hover:bg-zinc-800 transition-colors" title="Logout">
                        <LogOut className="h-4 w-4 text-zinc-400" />
                    </button>
                </div>
            </div>
        </div>
    );
}
