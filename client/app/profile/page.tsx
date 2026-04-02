"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { User as UserIcon, Mail, Phone, Shield, LogOut, ChevronLeft, Gamepad2, Loader2, Trophy, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchHistory();
    }
  }, [user, loading, router]);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get("/payments/my-payments");
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch match history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20 font-black uppercase tracking-tighter">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-[10px] bg-red-600/10 text-red-500 px-2 py-0.5 rounded-full border border-red-500/20 font-black uppercase tracking-tighter">
            <XCircle className="w-3 h-3" /> Invalid
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/20 font-black uppercase tracking-tighter">
            <AlertCircle className="w-3 h-3" /> Verifying
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="h-5 w-5" /> Back to Home
          </Link>
          <button
            onClick={() => logout()}
            className="px-4 py-2 flex items-center gap-2 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600/20 transition-all font-semibold"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="premium-card p-8 text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-blue-600/20 border-4 border-blue-500/50 flex items-center justify-center relative">
                <Gamepad2 className="w-12 h-12 text-blue-400" />
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight">{user.username}</h1>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <Shield className="w-3 h-3 text-emerald-400" /> {user.role}
                </p>
              </div>

              <div className="space-y-4 text-sm border-t border-zinc-800/50 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Email</span>
                  <span className="font-medium truncate max-w-[150px]">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Phone</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Matches Joined</span>
                  <span className="text-blue-400 font-black">{history.length}</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 bg-blue-600 px-6 py-4 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 w-full group"
            >
              <Trophy className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Enter Scrim Area
            </Link>
          </motion.div>

          {/* Match History / Activity Log */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="premium-card p-0 overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500" /> Match History
                </h2>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-md">
                  Last Update: Just Now
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[500px] p-6 space-y-4">
                {loadingHistory ? (
                  <div className="flex flex-col items-center justify-center h-64 text-zinc-500 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-xs font-bold uppercase tracking-widest">Fetching your activity...</p>
                  </div>
                ) : history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-zinc-600 text-center space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <Trophy className="w-8 h-8 opacity-20" />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-tight">No Matches Joined Yet</p>
                      <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">Start your journey by joining your first scrim from the dashboard.</p>
                    </div>
                  </div>
                ) : (
                  history.map((record, index) => (
                    <motion.div
                      key={record._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/30 flex items-center justify-between group hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                          <Trophy className="w-5 h-5 text-zinc-500 group-hover:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tight">{record.scrim?.matchName}</p>
                          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                            {new Date(record.scrim?.time).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(record.status)}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

