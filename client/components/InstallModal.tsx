"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Gamepad } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function InstallModal() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the modal
      setShowModal(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowModal(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative max-w-sm w-full bg-[#18181b] border border-[#27272a] rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            {/* Glossy Background Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full" />
            
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 relative">
                 <div className="w-20 h-20 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                    <Gamepad className="h-10 w-10 text-blue-500" />
                 </div>
                 {/* Small badge */}
                 <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-full border-2 border-[#18181b]">
                    <div className="bg-white w-1.5 h-1.5 rounded-full animate-pulse" />
                 </div>
              </div>

              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                Install FragZone App
              </h2>
              <p className="text-zinc-500 text-sm font-medium mb-8 leading-relaxed">
                Experience crystal-clear real-time slots and professional scrims with our premium mobile app.
              </p>

              <div className="w-full space-y-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Install Now
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-4 bg-transparent border border-[#27272a] hover:bg-white/5 text-zinc-400 hover:text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            <p className="mt-8 text-[9px] text-zinc-600 font-black uppercase tracking-widest text-center">
                Requires very little storage space
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
