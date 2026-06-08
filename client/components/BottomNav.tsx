"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Home, Trophy, BarChart2, Gamepad2, User as UserIcon, LogIn } from "lucide-react";

export default function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-[100] bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        <NavItem href="/" icon={<Home className="h-5 w-5 mb-1" />} label="Home" isActive={pathname === "/"} />
        <NavItem href="/results" icon={<Trophy className="h-5 w-5 mb-1" />} label="Results" isActive={pathname === "/results"} />
        <NavItem href="/leaderboard" icon={<BarChart2 className="h-5 w-5 mb-1" />} label="Ranks" isActive={pathname === "/leaderboard"} />
        
        {user ? (
          <>
            <NavItem href="/dashboard" icon={<Gamepad2 className="h-5 w-5 mb-1" />} label="Play" isActive={pathname === "/dashboard"} />
            <NavItem href="/profile" icon={<UserIcon className="h-5 w-5 mb-1" />} label="Profile" isActive={pathname === "/profile"} />
          </>
        ) : (
          <NavItem href="/login" icon={<LogIn className="h-5 w-5 mb-1" />} label="Login" isActive={pathname === "/login"} />
        )}
      </div>
    </nav>
  );
}

function NavItem({ href, icon, label, isActive }: { href: string, icon: React.ReactNode, label: string, isActive: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
    >
      <div className={isActive ? 'scale-110 transition-transform' : 'transition-transform'}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </Link>
  );
}
