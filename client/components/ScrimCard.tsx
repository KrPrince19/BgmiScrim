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
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Trophy className="h-20 w-20 text-blue-600" />
      </div>

      <div className="flex flex-col h-full gap-4 relative z-10">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
            {scrim.matchName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-200">
              Entry: ₹{scrim.entryFee}
            </span>
          </div>
        </div>

        {/* Dedicated Prize Pool Section */}
        <div className="relative group/prize mt-2">
          <div className="relative flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 leading-none mb-1">Total Prize Pool</span>
              <span className="text-2xl font-black text-blue-600 tracking-tighter">
                ₹{scrim.winningPrize || 0}
              </span>
            </div>
            <div className="bg-blue-100 p-2 rounded-xl">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-2">
          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{scrim.slotsFilled} / {scrim.totalSlots} Slots</span>
          </div>
        </div>

        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
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
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 rounded-xl font-bold text-sm transition-all"
              >
                <Clock3 className="h-4 w-4" /> Under Verification
              </Link>
            )}
            {userPayment.status === 'approved' && (
              <Link
                href={`/room/${scrim._id}`}
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-sm transition-all"
              >
                <CheckCircle2 className="h-4 w-4" /> View Room ID
              </Link>
            )}
            {userPayment.status === 'rejected' && (
              <Link
                href={`/payment/${scrim._id}`}
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl font-bold text-sm transition-all"
              >
                <XCircle className="h-4 w-4" /> Payment Failed
              </Link>
            )}
          </>
        ) : (scrim.slotsFilled >= scrim.totalSlots) ? (
          <button
            disabled
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed border border-gray-200"
          >
            <XCircle className="h-4 w-4" /> Slot Full
          </button>
        ) : (
          <Link
            href={`/payment/${scrim._id}`}
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
          >
            Join Match <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
