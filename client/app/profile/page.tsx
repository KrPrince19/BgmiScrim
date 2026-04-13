"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { User as UserIcon, Mail, Phone, Shield, LogOut, ChevronLeft, Gamepad2, Loader2, Trophy, Clock, CheckCircle2, XCircle, AlertCircle, ShoppingCart, Tag, Search, Copy, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useSocket } from "@/context/SocketContext";
import { toast } from "react-hot-toast";
import { AnimatePresence as FramerAnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const socket = useSocket();
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoomScrim, setSelectedRoomScrim] = useState<any>(null);
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

  useEffect(() => {
    if (!socket) return;

    const handlePaymentUpdate = (updatedPayment: any) => {
      setHistory((prev) => 
        prev.map((item) => (item._id === updatedPayment._id ? { ...item, status: updatedPayment.status } : item))
      );
    };

    socket.on('paymentUpdate', handlePaymentUpdate);
    return () => {
      socket.off('paymentUpdate', handlePaymentUpdate);
    };
  }, [socket]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const filteredHistory = history.filter((item) => {
    const title = item.paymentType === 'store' ? item.itemName : item.scrim?.matchName;
    return title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
                  <span className="text-zinc-500">Total Activity</span>
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
                  <Clock className="w-5 h-5 text-blue-500" /> Activity Log
                </h2>
                <div className="flex items-center gap-4">
                  <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Search activity..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all w-48"
                    />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-md">
                    {filteredHistory.length} Total
                  </div>
                </div>
              </div>

              {/* Mobile Search */}
              <div className="p-4 sm:hidden border-b border-zinc-800/30">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search activity..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 w-full"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[500px] p-6 space-y-4">
                {loadingHistory ? (
                  <div className="flex flex-col items-center justify-center h-64 text-zinc-500 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-xs font-bold uppercase tracking-widest">Fetching your activity...</p>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-zinc-600 text-center space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <Search className="w-8 h-8 opacity-20" />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-tight">No Results Found</p>
                      <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">Try adjusting your search terms.</p>
                      {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="text-blue-500 text-[10px] font-black uppercase mt-2 hover:underline tracking-widest">Clear Search</button>
                      )}
                    </div>
                  </div>
                ) : (
                    filteredHistory.map((record, index) => {
                      const isStore = record.paymentType === 'store';
                      const title = isStore ? record.itemName : record.scrim?.matchName;
                      const subtitle = isStore ? record.storeItem?.category : 'Scrim Match';
                      const timestamp = isStore ? record.createdAt : record.scrim?.time;

                      return (
                        <motion.div
                          key={record._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/30 flex items-center justify-between group hover:border-blue-500/30 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                              {isStore ? (
                                <ShoppingCart className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400" />
                              ) : (
                                <Trophy className="w-5 h-5 text-zinc-500 group-hover:text-blue-400" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm tracking-tight">{title}</p>
                                {isStore && <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-black uppercase">Store</span>}
                              </div>
                              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                {subtitle} • {new Date(timestamp).toLocaleString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                                {record.paymentType === 'scrim' && record.status === 'approved' && (
                                    <button 
                                        onClick={() => setSelectedRoomScrim(record.scrim)}
                                        className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg font-black uppercase tracking-tighter transition-colors flex items-center gap-1"
                                    >
                                        <QrCode className="w-3 h-3" /> Room Info
                                    </button>
                                )}
                                {getStatusBadge(record.status)}
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 group/utr cursor-pointer" onClick={() => handleCopy(record.transactionID, "UTR ID")}>
                                    <span className="text-[10px] font-mono text-zinc-600 group-hover/utr:text-zinc-400 transition-colors">UTR: {record.transactionID}</span>
                                    <Copy className="w-3 h-3 text-zinc-700 group-hover/utr:text-blue-500 transition-colors" />
                                </div>
                                {isStore && (
                                    <span className="text-[10px] font-black text-emerald-500">₹{record.priceAtPurchase}</span>
                                )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Room Access Modal */}
      <FramerAnimatePresence>
        {selectedRoomScrim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-sm w-full bg-zinc-950 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl p-8"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <QrCode className="w-10 h-10 text-blue-500" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Room Details</h3>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{selectedRoomScrim.matchName}</p>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-1.5 relative group">
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Room ID</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-black tracking-[0.2em]">{selectedRoomScrim.roomID || "---"}</p>
                            <button onClick={() => handleCopy(selectedRoomScrim.roomID, "Room ID")} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <Copy className="w-4 h-4 text-zinc-500" />
                            </button>
                        </div>
                    </div>

                    <div className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-1.5 relative group">
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Password</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-black tracking-[0.2em]">{selectedRoomScrim.roomPassword || "---"}</p>
                            <button onClick={() => handleCopy(selectedRoomScrim.roomPassword, "Password")} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <Copy className="w-4 h-4 text-zinc-500" />
                            </button>
                        </div>
                    </div>
                </div>

                <button
                  onClick={() => setSelectedRoomScrim(null)}
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all mt-6"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </FramerAnimatePresence>
    </div>
  );
}

