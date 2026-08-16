"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence as FramerAnimatePresence } from "framer-motion";
import { User as UserIcon, Mail, LogOut, ChevronLeft, Gamepad2, Loader2, Trophy, Clock, CheckCircle2, XCircle, AlertCircle, Search, Copy, QrCode, Edit2, Calendar, Users, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useSocket } from "@/context/SocketContext";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const loading = !isLoaded;
  const logout = () => { signOut({ redirectUrl: '/' }) };
  const socket = useSocket();
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoomScrim, setSelectedRoomScrim] = useState<any>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, loading]);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get("/payments/my-payments");
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch match history", err);
      setHistory([]);
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

  const filteredHistory = Array.isArray(history) ? history.filter((item) => {
    const title = item.scrim?.matchName;
    return title?.toLowerCase().includes(searchQuery.toLowerCase());
  }) : [];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0D14] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="text-sm font-bold text-emerald-400">Victory</span>; // Show Victory style for approved
      case "rejected":
        return <span className="text-sm font-bold text-red-400">Defeat</span>; // Show Defeat style for rejected
      default:
        return <span className="text-sm font-bold text-yellow-400">Pending</span>; // Pending state
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D14] text-white p-6 md:p-12 overflow-x-hidden relative">
      {/* Background gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Banner Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[2rem] overflow-hidden mb-6 h-64 md:h-72 border border-white/5 shadow-2xl"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-80" 
            style={{ backgroundImage: 'url("/footer1.jpeg")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-[#0B0D14]/50 to-transparent" />
          <div className="absolute inset-0 bg-purple-900/30 mix-blend-overlay" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#11131A] p-1 shadow-[0_0_30px_rgba(168,85,247,0.4)] border border-purple-500/50">
                 <div className="w-full h-full rounded-full bg-gradient-to-b from-purple-500/20 to-[#11131A] flex items-center justify-center overflow-hidden">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <UserIcon className="w-10 h-10 md:w-14 md:h-14 text-purple-400" />
                    )}
                 </div>
              </div>
              <div className="mb-2">
                <h1 className="text-2xl md:text-4xl font-black text-white tracking-wide flex items-center gap-3">
                  {user?.username || user?.fullName || user?.firstName || "Player"} 
                </h1>
                <p className="text-gray-400 flex items-center gap-2 text-sm mt-2 font-medium">
                   <Calendar className="w-4 h-4 text-purple-400/70" /> Member since {new Date(user?.createdAt || Date.now()).toLocaleString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                logout();
              }}
              className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 hover:border-red-500 hover:bg-red-500 text-red-400 hover:text-white px-6 py-2.5 rounded-xl font-bold transition-all mb-2 shadow-[0_0_15px_rgba(239,68,68,0)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] backdrop-blur-md"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
           <div className="bg-[#11131A]/80 border border-white/5 rounded-2xl p-6 flex items-center gap-5 hover:border-purple-500/30 transition-all group backdrop-blur-sm">
             <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform shadow-inner">
                <Calendar className="w-6 h-6 text-purple-400" />
             </div>
             <div>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Matches Played</p>
               <p className="text-white font-black text-2xl tracking-tight">{history.length}</p>
             </div>
           </div>
           <div className="bg-[#11131A]/80 border border-white/5 rounded-2xl p-6 flex items-center gap-5 hover:border-purple-500/30 transition-all group backdrop-blur-sm">
             <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform shadow-inner">
                <Gamepad2 className="w-6 h-6 text-purple-400" />
             </div>
             <div>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Matches Joined</p>
               <p className="text-white font-black text-2xl tracking-tight">{history.length}</p>
             </div>
           </div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Match History Table */}
          <div className="bg-[#11131A]/80 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
            {/* Table Header */}
            <div className="grid grid-cols-12 p-5 border-b border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/[0.02]">
              <div className="col-span-1 pl-2">#</div>
              <div className="col-span-4">Match Info</div>
              <div className="col-span-2 text-center">Type</div>
              <div className="col-span-2">Result</div>
              <div className="col-span-1 text-center">Amount</div>
              <div className="col-span-2 text-right pr-8">Match Date</div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto no-scrollbar custom-scroll">
              {loadingHistory ? (
                <div className="p-12 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                  <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Loading matches...</p>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center space-y-4">
                  <Gamepad2 className="w-12 h-12 text-gray-700" />
                  <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">No Match History</p>
                </div>
              ) : (
                filteredHistory.map((record, idx) => (
                  <div 
                    key={record._id} 
                    onClick={() => {
                        if(record.paymentType === 'scrim' && record.status === 'approved') {
                            setSelectedRoomScrim(record.scrim);
                        }
                    }}
                    className={`grid grid-cols-12 p-5 items-center transition-all group ${record.paymentType === 'scrim' && record.status === 'approved' ? 'cursor-pointer hover:bg-white/[0.04]' : ''}`}
                  >
                    <div className="col-span-1 text-gray-500 font-black text-xs pl-2">
                      {idx + 1}
                    </div>
                    
                    <div className="col-span-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Gamepad2 className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm tracking-wide">{record.scrim?.matchName || 'Unknown Match'}</p>
                        <p className="text-gray-500 text-xs font-medium mt-0.5">{record.scrim?.matchType || 'Squad'}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center">
                      <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
                        Scrim
                      </span>
                    </div>
                    
                    <div className="col-span-2 flex items-center">
                      {getStatusBadge(record.status)}
                    </div>
                    
                    <div className="col-span-1 text-gray-400 font-black text-sm text-center">
                      {record.amount ? `₹${record.amount}` : '-'}
                    </div>
                    
                    <div className="col-span-2 flex items-center justify-end gap-6 text-gray-400 text-xs">
                      <div className="text-right">
                        <p className="font-medium text-gray-300">{new Date(record.scrim?.time || record.createdAt).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                        <p className="text-gray-500 mt-0.5">{new Date(record.scrim?.time || record.createdAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>



      {/* Room Access Modal */}
      <FramerAnimatePresence>
        {selectedRoomScrim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-sm w-full bg-[#0B0D14] rounded-[2.5rem] border border-purple-500/20 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)] p-8"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <QrCode className="w-10 h-10 text-purple-400" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">Room Details</h3>
                  <p className="text-xs text-purple-400 font-bold uppercase tracking-widest">{selectedRoomScrim.matchName}</p>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-1.5 relative group hover:border-purple-500/30 transition-colors">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Room ID</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-black tracking-[0.2em] text-white">{selectedRoomScrim.roomID || "---"}</p>
                            <button onClick={() => handleCopy(selectedRoomScrim.roomID, "Room ID")} className="p-2 bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-400 rounded-xl transition-all text-gray-400">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-1.5 relative group hover:border-purple-500/30 transition-colors">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Password</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-black tracking-[0.2em] text-white">{selectedRoomScrim.roomPassword || "---"}</p>
                            <button onClick={() => handleCopy(selectedRoomScrim.roomPassword, "Password")} className="p-2 bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-400 rounded-xl transition-all text-gray-400">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <button
                  onClick={() => setSelectedRoomScrim(null)}
                  className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all mt-6 active:scale-95"
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
