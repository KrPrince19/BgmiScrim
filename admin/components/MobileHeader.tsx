"use client";

import { Menu, Gamepad2 } from "lucide-react";
import Link from "next/link";

interface MobileHeaderProps {
    onOpenSidebar: () => void;
}

export default function MobileHeader({ onOpenSidebar }: MobileHeaderProps) {
    return (
        <header className="lg:hidden h-16 glass-morphism border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-30">
            <Link href="/dashboard" className="flex items-center gap-2">
                <div className="bg-red-600 p-1.5 rounded-lg">
                    <Gamepad2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-black tracking-tighter uppercase italic text-white">Frag Zone</span>
            </Link>

            <button
                onClick={onOpenSidebar}
                className="p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-colors"
                aria-label="Open sidebar"
            >
                <Menu className="h-5 w-5" />
            </button>
        </header>
    );
}
