"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Loader2, Clock, CheckCircle2, XCircle, ChevronLeft, RefreshCw, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function StatusPage() {
  const { id } = useParams();
  const router = useRouter();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const { data } = await api.get(`/payments/status/${id}`);
      setPayment(data);
      if (data.status === 'approved') {
        // Redirection logic or show button
      }
    } catch (err) {
      console.error("Failed to fetch status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
    </div>
  );

  const statusColors = {
    pending: "text-amber-600 bg-amber-50 border-amber-100 shadow-sm px-3 py-1 rounded-full text-sm",
    approved: "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-sm px-3 py-1 rounded-full text-sm",
    rejected: "text-red-600 bg-red-50 border-red-100 shadow-sm px-3 py-1 rounded-full text-sm"
  };

  const statusIcons = {
    pending: <Clock className="h-12 w-12 text-amber-500" />,
    approved: <CheckCircle2 className="h-12 w-12 text-emerald-500" />,
    rejected: <XCircle className="h-12 w-12 text-red-500" />
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
       <nav className="p-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold text-sm">
          <ChevronLeft className="h-5 w-5" /> Back to Dashboard
        </Link>
      </nav>

      <main className="max-w-xl mx-auto px-6 pt-12 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm"
        >
          <div className="flex justify-center mb-6">
             {statusIcons[payment?.status as keyof typeof statusIcons]}
          </div>

          <h1 className="text-3xl font-black mb-4 uppercase tracking-tight flex items-center justify-center gap-3">
            Status: <span className={statusColors[payment?.status as keyof typeof statusColors]}>
              {payment?.status}
            </span>
          </h1>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-8 shadow-inner">
             <p className="text-gray-500 text-sm mb-1 uppercase tracking-widest font-black">Transaction ID</p>
             <p className="font-mono font-bold text-blue-600">{payment?.transactionID}</p>
          </div>

          <div className="space-y-6">
            {payment?.status === 'pending' && (
              <div className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    Your payment is being manually verified by our administrative team. 
                    This process ensures the integrity of the tournament. Please stay on this page.
                  </p>
                 <div className="flex items-center justify-center gap-2 text-gray-400 animate-pulse">
                    <RefreshCw className="h-4 w-4 animate-spin-slow" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Auto-refreshing status</span>
                 </div>
              </div>
            )}

            {payment?.status === 'approved' && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-6"
               >
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    Great news! Your payment has been verified. You can now access the room details.
                  </p>
                  <Link 
                    href={`/room/${id}`}
                    className="flex items-center justify-center gap-2 py-4 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all transform active:scale-95 shadow-sm"
                  >
                    Get Room Access <Gamepad2 className="h-5 w-5" />
                  </Link>
               </motion.div>
            )}

            {payment?.status === 'rejected' && (
              <div className="space-y-4">
                 <p className="text-red-500 text-sm leading-relaxed font-bold">
                   Your payment request was rejected. Please contact support via WhatsApp if you believe this is an error.
                 </p>
                 <Link 
                    href={`/payment/${id}`}
                    className="inline-block text-blue-600 hover:underline text-sm font-black uppercase tracking-widest mt-2"
                  >
                    Try Again with Correct Transaction ID
                  </Link>
              </div>
            )}
          </div>
        </motion.div>

        <p className="mt-12 text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">
          BGMI SCRIM OFFICIAL VERIFICATION SYSTEM
        </p>
      </main>
    </div>
  );
}
