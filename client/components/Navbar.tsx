"use client";

import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

import { useState } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLinkClass = (path: string) => {
    return pathname === path
      ? "text-white border-b-2 border-purple-600 pb-1"
      : "text-gray-400 hover:text-white transition-colors";
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex relative z-50 items-center justify-between px-8 py-3 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center group">
          <img src="/mainlogo.jpeg" alt="FRAGZONE" className="h-16 lg:h-20 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-8 text-sm font-semibold">
          <Link href="/" className={getLinkClass("/")}>Home</Link>
          <Link href="/scrims" className={getLinkClass("/scrims")}>Scrims</Link>
          <Link href="/tournaments" className={getLinkClass("/tournaments")}>Tournaments</Link>
          <Link href="/leaderboard" className={getLinkClass("/leaderboard")}>Leaderboard</Link>
          <Link href="/mvp" className={getLinkClass("/mvp")}>MVP</Link>
          <Link href="/about" className={getLinkClass("/about")}>About Us</Link>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login" className="px-6 py-2 rounded-lg border border-gray-700 text-white hover:bg-white/5 transition-colors text-sm font-bold">
                Login
              </Link>
              <Link href="/register" className="px-6 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-600 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(126,34,206,0.4)]">
                Sign Up
              </Link>
            </>
          ) : (
            <Link href="/profile" className="px-6 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-600 transition-all shadow-[0_0_15px_rgba(126,34,206,0.4)] flex items-center gap-2 text-sm font-bold">
              <UserIcon className="h-4 w-4" /> Profile
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-[#030008] border-b border-white/5">
        <button className="text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <Link href="/" className="flex items-center absolute left-1/2 -translate-x-1/2">
          <img src="/mainlogo.jpeg" alt="FRAGZONE" className="h-10 w-auto object-contain" />
        </Link>
        <Link href={user ? "/profile" : "/login"} className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 relative">
          <UserIcon className="w-4 h-4" />
        </Link>
      </header>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 z-50 bg-[#030008] border-b border-purple-900/30 p-6 flex flex-col gap-3 text-lg font-bold shadow-2xl max-h-[80vh] overflow-y-auto">
          <Link href="/" className={getLinkClass("/")} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/scrims" className={getLinkClass("/scrims")} onClick={() => setIsMobileMenuOpen(false)}>Scrims</Link>
          <Link href="/tournaments" className={getLinkClass("/tournaments")} onClick={() => setIsMobileMenuOpen(false)}>Tournaments</Link>
          <Link href="/leaderboard" className={getLinkClass("/leaderboard")} onClick={() => setIsMobileMenuOpen(false)}>Leaderboard</Link>
          <Link href="/mvp" className={getLinkClass("/mvp")} onClick={() => setIsMobileMenuOpen(false)}>MVP</Link>
          <Link href="/about" className={getLinkClass("/about")} onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
        </div>
      )}
    </>
  );
}
