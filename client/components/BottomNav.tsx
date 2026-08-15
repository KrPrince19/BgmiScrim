"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Home, Trophy, BarChart2, Gamepad2, User as UserIcon, LogIn } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-[100] bg-[#030008] border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        <NavItem href="/" icon={<Home className="h-5 w-5 mb-1" />} label="Home" isActive={pathname === "/"} />
        <NavItem href="/scrims" icon={<Gamepad2 className="h-5 w-5 mb-1" />} label="Scrims" isActive={pathname === "/scrims"} />
        <NavItem href="/tournaments" icon={<Trophy className="h-5 w-5 mb-1" />} label="Tournaments" isActive={pathname === "/tournaments"} />
        <NavItem href="/leaderboard" icon={<BarChart2 className="h-5 w-5 mb-1" />} label="Leaderboard" isActive={pathname === "/leaderboard"} />
        <NavItem href="/profile" icon={<UserIcon className="h-5 w-5 mb-1" />} label="Profile" isActive={pathname === "/profile"} />
      </div>
    </nav>
  );
}

function NavItem({ href, icon, label, isActive }: { href: string, icon: React.ReactNode, label: string, isActive: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-purple-600' : 'text-gray-500 hover:text-purple-600'}`}
    >
      <div className={isActive ? 'scale-110 transition-transform' : 'transition-transform'}>
        {icon}
      </div>
      <span className="text-[9px] font-bold tracking-wider mt-0.5">{label}</span>
    </Link>
  );
}
