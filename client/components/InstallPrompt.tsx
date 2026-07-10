"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallPrompt() {
  const [isStandalone, setIsStandalone] = useState(true); // Default to true to prevent SSR flicker
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Register Service Worker for PWA installation
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW registered:", reg.scope))
        .catch((err) => console.error("SW registration failed:", err));
    }

    // Check if app is already installed
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isStandaloneNav = (window.navigator as any).standalone === true;
      const isCapacitor = (window as any).Capacitor?.isNativePlatform?.();
      return isStandaloneMedia || isStandaloneNav || isCapacitor;
    };

    const isInstalled = checkStandalone();
    setIsStandalone(isInstalled);
    
    // Only show prompt if not installed
    if (!isInstalled) {
       setShowPrompt(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setShowPrompt(true);
      setIsStandalone(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for iOS Safari or browsers where prompt isn't supported automatically
      alert("To install the app, tap 'Share' (or Menu) and then 'Add to Home Screen' in your browser.");
    }
  };
  
  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("dismissedInstallPrompt", "true"); // Prevent annoying the user
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white border border-blue-200 shadow-2xl rounded-2xl p-4 z-[200] flex items-center justify-between gap-4"
        >
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-sm">Install App</span>
            <span className="text-xs text-gray-500">For a faster, full-screen experience</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleInstallClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 whitespace-nowrap"
            >
              <Download className="w-4 h-4" /> Install
            </button>
            <button 
              onClick={handleDismiss}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
