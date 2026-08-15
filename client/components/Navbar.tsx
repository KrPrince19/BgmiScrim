"use client";

import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { useState } from "react";

export default function Navbar() {
  const { isSignedIn } = useAuth();
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
          <div className="relative">
            <img src="/icon.png" alt="FRAGZONE" className="h-14 lg:h-16 w-auto object-contain" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap">
              <span className="w-4 h-px bg-purple-600"></span>
              <p className="text-[7px] lg:text-[8px] font-black tracking-[0.2em] uppercase">
                <span className="text-white">PLAY. </span>
                <span className="text-purple-500">COMPETE. </span>
                <span className="text-white">CONQUER.</span>
              </p>
              <span className="w-4 h-px bg-purple-600"></span>
            </div>
          </div>
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
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="px-6 py-2 rounded-lg border border-gray-700 text-white hover:bg-white/5 transition-colors text-sm font-bold">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-600 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(126,34,206,0.4)]">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link href="/profile" className="px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-all flex items-center gap-2 text-sm font-bold">
                <UserIcon className="h-4 w-4" /> Profile
              </Link>
            </>
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
          <div className="relative">
            <img src="/icon.png" alt="FRAGZONE" className="h-9 w-auto object-contain" />
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 whitespace-nowrap">
              <span className="w-2 h-px bg-purple-600"></span>
              <p className="text-[5px] font-black tracking-[0.18em] uppercase">
                <span className="text-white">PLAY. </span>
                <span className="text-purple-500">COMPETE. </span>
                <span className="text-white">CONQUER.</span>
              </p>
              <span className="w-2 h-px bg-purple-600"></span>
            </div>
          </div>
        </Link>
        
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 relative">
              <UserIcon className="w-4 h-4" />
            </button>
          </SignInButton>
        ) : (
          <Link href="/profile" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 relative bg-purple-900/30 hover:bg-purple-800/40 transition">
             <UserIcon className="w-4 h-4 text-purple-400" />
          </Link>
        )}
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
