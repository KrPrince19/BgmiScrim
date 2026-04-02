"use client";

import { motion } from "framer-motion";
import { Trophy, Clock, Users, ChevronRight, Zap, CheckCircle2, Clock3, XCircle } from "lucide-react";
import Link from "next/link";

interface ScrimProps {
  scrim: {
    _id: string;
    matchName: string;
    time: string;
    entryFee: number;
    winningPrize?: number;
    slotsFilled: number;
    totalSlots: number;
  };
  userPayment?: {
    _id: string;
    status: string;
    transactionID: string;
  };
}

export default function ScrimCard({ scrim, userPayment }: ScrimProps) {
  const formattedTime = new Date(scrim.time).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  let percentFilled = 0;
  if (scrim.totalSlots && scrim.totalSlots > 0) {
    percentFilled = (scrim.slotsFilled / scrim.totalSlots) * 100;
  }
  percentFilled = Math.min(Math.max(percentFilled, 0), 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="premium-card p-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Trophy className="h-20 w-20" />
      </div>

      <div className="flex flex-col h-full gap-4 relative z-10">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
            {scrim.matchName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
              Entry: ₹{scrim.entryFee}
            </span>
          </div>
        </div>

        {/* Dedicated Prize Pool Section */}
        <div className="relative group/prize mt-2">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl blur opacity-20 group-hover/prize:opacity-40 transition duration-1000"></div>
          <div className="relative flex items-center justify-between p-4 bg-zinc-900/50 border border-amber-500/20 rounded-2xl overflow-hidden">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/60 leading-none mb-1">Total Prize Pool</span>
              <span className="text-2xl font-black text-amber-500 tracking-tighter">
                ₹{scrim.winningPrize || 0}
              </span>
            </div>
            <div className="bg-amber-500/10 p-2 rounded-xl">
              <Trophy className="h-6 w-6 text-amber-500" />
            </div>
            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-16 w-16 bg-amber-500/5 rounded-full blur-2xl"></div>
          </div>
        </div>

        <div className="space-y-3 mt-2">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Clock className="h-4 w-4" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Users className="h-4 w-4" />
            <span>{scrim.slotsFilled} / {scrim.totalSlots} Slots</span>
          </div>
        </div>

        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-blue-500 transition-all duration-1000"
            style={{ width: `${percentFilled}%` }}
          />
        </div>

        {userPayment ? (
          <>
            {userPayment.status === 'pending' && (
              <Link
                href={`/status/${scrim._id}`}
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/10"
              >
                <Clock3 className="h-4 w-4" /> Under Verification
              </Link>
            )}
            {userPayment.status === 'approved' && (
              <Link
                href={`/room/${scrim._id}`}
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/10"
              >
                <CheckCircle2 className="h-4 w-4" /> View Room ID
              </Link>
            )}
            {userPayment.status === 'rejected' && (
              <Link
                href={`/payment/${scrim._id}`}
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-500/10"
              >
                <XCircle className="h-4 w-4" /> Payment Failed
              </Link>
            )}
          </>
        ) : (scrim.slotsFilled >= scrim.totalSlots) ? (
          <button
            disabled
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-zinc-900/50 text-zinc-500 rounded-xl font-bold text-sm cursor-not-allowed border border-zinc-800/50"
          >
            <XCircle className="h-4 w-4" /> Slot Full
          </button>
        ) : (
          <Link
            href={`/payment/${scrim._id}`}
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 hover:bg-blue-600 rounded-xl font-bold text-sm transition-all transform hover:scale-[1.02] active:scale-95"
          >
            Join Match <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
