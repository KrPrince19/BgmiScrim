"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import api from "@/lib/api";
import { Loader2, ShieldCheck, Copy, ChevronLeft, Gamepad2, Info, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function RoomContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const { data } = await api.get(`/payments/status/${id}`);
        setPayment(data);
        if (data.status !== 'approved') {
          router.push(`/status?id=${id}`);
        }
      } catch (err) {
        console.error("Failed to fetch room details", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [id, router]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="p-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold text-sm">
          <ChevronLeft className="h-5 w-5" /> Back to Dashboard
        </Link>
      </nav>

      <main className="max-w-xl mx-auto px-6 pt-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <ShieldCheck className="h-32 w-32 text-emerald-500" />
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1 inline-flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-widest mb-6 shadow-sm">
             <ShieldCheck className="h-3 w-3" /> Player Verified
          </div>

          <h1 className="text-3xl font-black mb-2 uppercase tracking-tight text-gray-900">{payment?.scrim?.matchName}</h1>
          <p className="text-gray-500 mb-8 border-b border-gray-100 pb-6 font-medium">Access your room details below. Good luck, player!</p>

          <div className="space-y-6">
             {payment?.scrim?.roomID && payment?.scrim?.roomPassword ? (
               <>
                 {/* Room ID */}
                 <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl group flex items-center justify-between transition-all hover:border-blue-300 shadow-sm">
                    <div>
                       <p className="text-xs text-gray-500 uppercase tracking-widest font-black mb-2">Room ID</p>
                       <p className="text-3xl font-black text-gray-900 tracking-widest">{payment?.scrim?.roomID}</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(payment?.scrim?.roomID)}
                      className="p-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors group-hover:bg-blue-50 shadow-sm"
                    >
                       <Copy className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </button>
                 </div>

                 {/* Room Password */}
                 <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl group flex items-center justify-between transition-all hover:border-blue-300 shadow-sm">
                    <div>
                       <p className="text-xs text-gray-500 uppercase tracking-widest font-black mb-2">Password</p>
                       <p className="text-3xl font-black text-gray-900 tracking-widest">{payment?.scrim?.roomPassword}</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(payment?.scrim?.roomPassword)}
                      className="p-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors group-hover:bg-blue-50 shadow-sm"
                    >
                       <Copy className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </button>
                 </div>
               </>
             ) : (
               <div className="p-8 bg-gray-50 border border-dashed border-gray-300 rounded-3xl flex flex-col items-center text-center gap-4 py-12 shadow-inner">
                  <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-2 shadow-sm">
                    <Clock className="h-8 w-8 text-blue-600 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Awaiting Room Details</h3>
                  <p className="text-gray-500 text-sm max-w-[280px] leading-relaxed font-medium">
                    Room ID & Password will be updated here **15-30 minutes** before the match starts.
                  </p>
               </div>
             )}

             <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100 mt-8 shadow-sm">
                <Info className="h-5 w-5 text-blue-600 mt-1" />
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  Join the room at least 5 minutes before the match starts. 
                  Sharing the room details with unverified players will lead to a permanent ban.
                </p>
             </div>
          </div>
        </motion.div>

        <Link 
          href="https://play.google.com/store/apps/details?id=com.pubg.imobile"
          target="_blank"
          className="mt-8 flex items-center justify-center gap-3 py-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-sm active:scale-95"
        >
          Launch BGMI <Gamepad2 className="h-5 w-5" />
        </Link>
      </main>
    </div>
  );
}

export default function RoomPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="h-10 w-10 text-blue-600 animate-spin" /></div>}>
      <RoomContent />
    </Suspense>
  );
}
