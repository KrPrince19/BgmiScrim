"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ScrimCard from "@/components/ScrimCard";
import { Gamepad2, Plus, Users, Trophy, Loader2, Home, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [scrims, setScrims] = useState<any[]>([]);
  const [userPayments, setUserPayments] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState(false);
  const router = useRouter();
  const socket = useSocket();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setSessionError(false);
      
      // 1. Fetch Scrims (Publicly available matched match data)
      try {
        const scrimsRes = await api.get("/scrims");
        setScrims(Array.isArray(scrimsRes.data) ? scrimsRes.data : []);
      } catch (err) {
        console.error("Failed to fetch scrims ❌", err);
      }

      // 2. Fetch User Payments (Private data, sensitive to auth)
      try {
        const paymentsRes = await api.get("/payments/my-payments");
        if (Array.isArray(paymentsRes.data)) {
          const paymentsMap: Record<string, any> = {};
          paymentsRes.data.forEach((p: any) => {
            if (!p.scrim) return; 
            const scrimId = typeof p.scrim === 'object' ? p.scrim._id : p.scrim;
            paymentsMap[scrimId] = p;
          });
          setUserPayments(paymentsMap);
        }
      } catch (err: any) {
        console.error("Failed to fetch user payments 🔐", err);
        if (err.response?.status === 401) {
          setSessionError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!socket) return;

    socket.on('scrimUpdate', (updatedScrim) => {
      console.log('Scrim updated via socket ⚡');
      setScrims(prev => prev.map(s => s._id === updatedScrim._id ? updatedScrim : s));
    });

    socket.on('scrimCreated', (newScrim) => {
      console.log('New scrim created via socket ⚡');
      // Only add if it's mark as upcoming (to stay consistent with initial fetch)
      if (newScrim.status === 'upcoming') {
        setScrims(prev => {
          // Prevent duplicates just in case
          if (prev.find(s => s._id === newScrim._id)) return prev;
          return [...prev, newScrim].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        });
      }
    });

    socket.on('scrimDeleted', (scrimId) => {
      console.log('Scrim deleted via socket ⚡');
      setScrims(prev => prev.filter(s => s._id !== scrimId));
    });

    return () => {
      socket.off('scrimUpdate');
      socket.off('scrimCreated');
      socket.off('scrimDeleted');
    };
  }, [socket]);

  // Removed handleLogout

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      {/* Header (Name on top for all screens) */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 left-0 w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold tracking-tighter">DASHBOARD</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold">{user?.username}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">{user?.role}</span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
              title="Go Back"
            >
              <Home className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-12">
        {sessionError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 text-red-600">
              <Zap className="h-5 w-5" />
              <p className="text-sm font-medium">Your session has expired. Please log in again to see your joined matches.</p>
            </div>
            <button 
              onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
              className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm active:scale-95"
            >
              LOGOUT & RESET
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-gray-900">Available <span className="text-blue-600 underline decoration-blue-200">Scrims</span></h1>
            <p className="text-gray-500">Pick a match and secure your slot instantly.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center gap-4 shadow-sm">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <div>
                <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">Total Scrims</div>
                <div className="text-xl font-black text-gray-900">{scrims.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrim Grid */}
        {scrims.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {scrims.map((scrim: any) => (
              <ScrimCard key={scrim._id} scrim={scrim} userPayment={userPayments[scrim._id]} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white rounded-3xl border-dashed border-2 border-gray-300 shadow-sm"
          >
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600">No active scrims available</h3>
            <p className="text-gray-500 mt-2">Check back later for upcoming matches.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
