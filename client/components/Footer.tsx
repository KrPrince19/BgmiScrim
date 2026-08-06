"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Gamepad2, ChevronRight, ChevronDown, ChevronUp, Mail, MessageSquare, Phone, Heart, Shield, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#05010d] border-t border-purple-900/30 overflow-hidden font-sans pt-0">
      {/* Top Banner Image */}
      <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] relative">
        <img 
          src="/footer1.jpeg" 
          alt="FragZone Banner" 
          className="w-full h-full object-cover object-center"
        />
        {/* Stronger gradient at the bottom so text overlaying the image remains readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05010d] via-[#05010d]/80 to-transparent h-[120%]" />
      </div>

      {/* Pull the text up over the image by using negative margin-top */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8 relative z-10 -mt-24 md:-mt-40 lg:-mt-56">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand (Takes up 4 cols on lg) */}
          <div className="lg:col-span-4 pr-0 lg:pr-12">
            <Link href="/" className="inline-block mb-6">
              <div className="text-3xl font-black italic tracking-tighter text-white">
                FRAG<span className="text-purple-600">ZONE</span>
              </div>
            </Link>
            
            <h3 className="text-white font-bold mb-4">Compete. Dominate. Conquer.</h3>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              FragZone is the ultimate platform for BGMI players to compete in scrims, tournaments and climb the leaderboard.
            </p>
            
            <div className="flex gap-4">
              <SocialIcon href="https://www.youtube.com/@zamgaming06" icon={<YoutubeIcon className="w-4 h-4" />} />
              <SocialIcon href="#" icon={<DiscordIcon className="w-4 h-4" />} />
              <SocialIcon href="https://www.instagram.com/ig_zamgaming?igsh=cnhraWZkbjJwdHJ6" icon={<InstagramIcon className="w-4 h-4" />} />
            </div>
          </div>

          {/* Column 2: Quick Links (Takes up 2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-wider mb-6 text-sm">Quick Links</h4>
            <ul className="space-y-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/scrims">Scrims</FooterLink>
              <FooterLink href="/tournaments">Tournaments</FooterLink>
              <FooterLink href="/leaderboard">Leaderboard</FooterLink>
              <FooterLink href="/results">Results</FooterLink>
              <FooterLink href="/mvp">MVP Players</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
            </ul>
          </div>

          {/* Column 3: Resources (Takes up 2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-wider mb-6 text-sm">Resources</h4>
            <ul className="space-y-3">
              <ExpandableResource 
                title="Rules & Guidelines" 
                content="Players must register using their exact in-game name. Any use of third-party software, hacks, or toxic behavior will result in immediate termination of the entire team."
              />
              <ExpandableResource 
                title="How It Works" 
                content={
                  <ol className="list-decimal pl-3 space-y-1">
                    <li>Log in and join your preferred match.</li>
                    <li>Pay the entry fee and upload a screenshot for verification.</li>
                    <li>Match ID and Password will be provided 15 minutes prior to the start time via your Profile section or our WhatsApp group.</li>
                  </ol>
                }
              />
              <ExpandableResource 
                title="Help Center & FAQ" 
                content="Need help? For any issues regarding payments, missing Match IDs, or roster changes, please contact our administrative team on WhatsApp. Responses are usually within a few minutes during active scrim hours."
              />
              <ExpandableResource 
                title="Privacy Policy" 
                content="Your privacy is important to us. We securely store your registration data and game IDs. We do not sell or share your personal information with any third parties."
              />
              <ExpandableResource 
                title="Terms & Conditions" 
                content="Strictly NO REFUNDS will be provided after successful registration. Players must join the custom room at least 10 minutes prior to the match start time, otherwise entry will be denied. For any concerns or issues, please contact our support team directly on WhatsApp."
              />
            </ul>
          </div>

          {/* Column 4: Support (Takes up 4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-black uppercase tracking-wider mb-6 text-sm">Support</h4>
            <ul className="space-y-4">
              <li>
                <Link href="#" target="_blank" className="flex items-center gap-3 text-gray-400 text-sm hover:text-purple-400 transition-colors">
                  <DiscordIcon className="w-4 h-4 text-purple-500" />
                  <span>Join our Discord</span>
                </Link>
              </li>
              <li>
                <Link href="https://chat.whatsapp.com/GMlsUSOnnLQFQfuujlD0G0" target="_blank" className="flex items-center gap-3 text-gray-400 text-sm hover:text-purple-400 transition-colors">
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                  <span>Contact on WhatsApp</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-purple-900/30 rounded border border-purple-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xs text-gray-500">
              <p className="mb-0.5">© 2024 FragZone. All rights reserved.</p>
              <p className="flex items-center gap-1">Made with <Heart className="w-3 h-3 text-purple-500 fill-purple-500" /> for BGMI Players.</p>
            </div>
          </div>

          {/* Center Emblem */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-purple-500/50" />
            <div className="w-8 h-8 rounded-full border border-purple-500/30 bg-[#0a0514] flex items-center justify-center shadow-[0_0_15px_rgba(126,34,206,0.3)]">
              <Shield className="w-3 h-3 text-purple-400" />
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-xs text-gray-500">
              Trusted by <span className="text-purple-400">10,000+ Players</span> • Growing Every Day
            </div>
            <button 
              onClick={scrollToTop}
              className="w-10 h-10 border border-white/10 hover:border-purple-500 rounded-lg flex items-center justify-center bg-[#0a0514] hover:bg-purple-900/20 transition-all group shrink-0"
            >
              <ArrowUp className="w-4 h-4 text-gray-400 group-hover:text-purple-400" />
            </button>
          </div>
          
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-2 text-gray-400 hover:text-purple-400 text-sm font-medium transition-colors group">
        <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors" />
        {children}
      </Link>
    </li>
  );
}

function ExpandableResource({ title, content }: { title: string; content: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <li ref={ref} className="relative flex flex-col gap-2">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full text-left text-gray-400 hover:text-purple-400 text-sm font-medium transition-colors group"
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUp className="w-3 h-3 text-purple-500" />
          ) : (
            <ChevronDown className="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors" />
          )}
          <span>{title}</span>
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute left-4 md:left-full top-0 mt-8 md:mt-0 md:ml-4 z-50 w-72 md:w-[350px] px-4 py-4 text-xs font-bold text-gray-800 leading-relaxed border-l-4 border-purple-600 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {content}
        </div>
      )}
    </li>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="w-10 h-10 rounded-lg border border-white/10 bg-[#0a0514] hover:bg-purple-900/40 hover:border-purple-500 flex items-center justify-center text-gray-400 hover:text-purple-400 transition-all shadow-sm"
    >
      {icon}
    </Link>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}
