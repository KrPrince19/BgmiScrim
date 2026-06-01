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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-200 font-black uppercase tracking-tighter shadow-sm">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200 font-black uppercase tracking-tighter shadow-sm">
            <XCircle className="w-3 h-3" /> Invalid
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full border border-yellow-200 font-black uppercase tracking-tighter shadow-sm">
            <AlertCircle className="w-3 h-3" /> Verifying
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold text-sm">
            <ChevronLeft className="h-5 w-5" /> Back to Home
          </Link>
          <button
            onClick={() => logout()}
            className="px-4 py-2 flex items-center gap-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold border border-red-100 shadow-sm"
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
            <div className="bg-white border border-gray-200 shadow-md rounded-[2rem] p-8 text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center relative shadow-inner">
                <Gamepad2 className="w-12 h-12 text-blue-600" />
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">{user.username}</h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <Shield className="w-3 h-3 text-emerald-500" /> {user.role}
                </p>
              </div>

              <div className="space-y-4 text-sm border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Email</span>
                  <span className="font-bold text-gray-900 truncate max-w-[150px]">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Phone</span>
                  <span className="font-bold text-gray-900">{user.phone}</span>
                </div>
                 <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Total Activity</span>
                  <span className="text-blue-600 font-black">{history.length}</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-sm w-full group uppercase tracking-widest active:scale-95"
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
            <div className="bg-white border border-gray-200 shadow-md rounded-[2rem] overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 text-gray-900">
                  <Clock className="w-5 h-5 text-blue-600" /> Activity Log
                </h2>
                <div className="flex items-center gap-4">
                  <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search activity..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-48 shadow-sm font-medium"
                    />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1 rounded-md shadow-sm">
                    {filteredHistory.length} Total
                  </div>
                </div>
              </div>

              {/* Mobile Search */}
              <div className="p-4 sm:hidden border-b border-gray-100 bg-gray-50/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search activity..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[500px] p-6 space-y-4">
                {loadingHistory ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-xs font-bold uppercase tracking-widest">Fetching your activity...</p>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-center space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-gray-50 border border-gray-200 flex items-center justify-center shadow-inner">
                      <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-tight text-gray-900">No Results Found</p>
                      <p className="text-xs text-gray-500 mt-1 max-w-[200px] font-medium">Try adjusting your search terms.</p>
                      {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="text-blue-600 text-[10px] font-black uppercase mt-2 hover:underline tracking-widest">Clear Search</button>
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
                          className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                              {isStore ? (
                                <ShoppingCart className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                              ) : (
                                <Trophy className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-black text-sm tracking-tight text-gray-900 uppercase">{title}</p>
                                {isStore && <span className="text-[8px] bg-blue-50 border border-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-black uppercase shadow-sm">Store</span>}
                              </div>
                              <p className="text-[10px] text-gray-500 font-bold mt-0.5 uppercase tracking-widest">
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
                                        className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg font-black uppercase tracking-tighter transition-colors flex items-center gap-1 shadow-sm active:scale-95"
                                    >
                                        <QrCode className="w-3 h-3" /> Room Info
                                    </button>
                                )}
                                {getStatusBadge(record.status)}
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 group/utr cursor-pointer bg-gray-50 border border-gray-200 px-2 py-1 rounded-md" onClick={() => handleCopy(record.transactionID, "UTR ID")}>
                                    <span className="text-[10px] font-mono font-bold text-gray-500 group-hover/utr:text-gray-900 transition-colors">UTR: {record.transactionID}</span>
                                    <Copy className="w-3 h-3 text-gray-400 group-hover/utr:text-blue-600 transition-colors" />
                                </div>
                                {isStore && (
                                    <span className="text-[11px] font-black text-gray-900 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">₹{record.priceAtPurchase}</span>
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-sm w-full bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-2xl p-8"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <QrCode className="w-10 h-10 text-blue-600" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900">Room Details</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{selectedRoomScrim.matchName}</p>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="p-5 bg-gray-50 border border-gray-200 rounded-3xl space-y-1.5 relative group shadow-sm">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Room ID</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-black tracking-[0.2em] text-gray-900">{selectedRoomScrim.roomID || "---"}</p>
                            <button onClick={() => handleCopy(selectedRoomScrim.roomID, "Room ID")} className="p-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors shadow-sm">
                                <Copy className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="p-5 bg-gray-50 border border-gray-200 rounded-3xl space-y-1.5 relative group shadow-sm">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Password</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-black tracking-[0.2em] text-gray-900">{selectedRoomScrim.roomPassword || "---"}</p>
                            <button onClick={() => handleCopy(selectedRoomScrim.roomPassword, "Password")} className="p-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors shadow-sm">
                                <Copy className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                <button
                  onClick={() => setSelectedRoomScrim(null)}
                  className="w-full py-4 bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs transition-all mt-6 shadow-sm active:scale-95"
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

