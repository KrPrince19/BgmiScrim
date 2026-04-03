"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import {
    Loader2, CheckCircle2, XCircle, Clock, Filter, User, Banknote, Eye, X, ExternalLink, ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/context/SocketContext";

const STATUS_COLORS: Record<string, string> = {
    pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    approved: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    rejected: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function PaymentsPage() {
    const { user, loading: authLoading } = useAuth();
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [updating, setUpdating] = useState<string | null>(null);
    const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const socket = useSocket();

    const fetchPayments = async () => {
        try {
            const query = filter !== "all" ? `?status=${filter}` : "";
            const { data } = await api.get(`/payments/admin/all${query}`);
            setPayments(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (authLoading || !user) return;
        setLoading(true);
        fetchPayments();
    }, [user, authLoading, filter]);

    useEffect(() => {
        if (!socket) return;

        socket.on('newPayment', (data) => {
            console.log('New payment received via socket! 🔔', data);
            fetchPayments();
        });

        return () => {
            socket.off('newPayment');
        };
    }, [socket, filter]); // filter included to respect current view if needed, but fetch usually gets all or status

    const handleStatus = async (paymentId: string, status: "approved" | "rejected") => {
        setUpdating(paymentId);
        try {
            await api.patch(`/payments/admin/${paymentId}/status`, { status });
            fetchPayments();
        } catch (e) { console.error(e); }
        finally { setUpdating(null); }
    };

    if (authLoading || !user) {
        return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-10 w-10 text-red-500 animate-spin" /></div>;
    }

    const filters = ["all", "pending", "approved", "rejected"];

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-h-screen">
                <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-black tracking-tight mb-1">Payments</h1>
                        <p className="text-zinc-500">Verify transaction IDs and approve or reject player join requests.</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 mb-6">
                        <Filter className="h-4 w-4 text-zinc-500" />
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === f ? "bg-red-600 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 text-red-500 animate-spin" /></div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-20 glass-morphism rounded-3xl text-zinc-500">
                            No payments found for this filter.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {payments.map((payment) => (
                                <motion.div
                                    key={payment._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="premium-card p-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className={`px-3 py-1 rounded-full text-xs font-black border ${STATUS_COLORS[payment.status]}`}>
                                                {payment.status.toUpperCase()}
                                            </div>
                                            <span className="text-sm font-bold">{payment.scrim?.matchName}</span>
                                            <span className="text-xs text-zinc-500">₹{payment.scrim?.entryFee}</span>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-zinc-400 flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3.5 w-3.5" /> {payment.user?.username} · {payment.user?.phone}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Banknote className="h-3.5 w-3.5" />
                                                <span className="font-mono text-blue-400 font-bold tracking-widest">{payment.transactionID}</span>
                                            </span>
                                            {payment.screenshot && (
                                                <button
                                                    onClick={() => setSelectedScreenshot(payment.screenshot)}
                                                    className="flex items-center gap-1 text-emerald-500 hover:text-emerald-400 font-bold transition-colors ml-2"
                                                >
                                                    <ImageIcon className="h-3.5 w-3.5" /> View Proof
                                                </button>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                {new Date(payment.createdAt).toLocaleString("en-IN")}
                                            </span>
                                        </div>

                                        {/* Team Members List */}
                                        <div className="pt-2 flex flex-wrap gap-2">
                                            {[payment.player1, payment.player2, payment.player3, payment.player4].map((p, i) => (
                                                <span key={i} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md border border-white/5 font-bold tracking-tight">
                                                    P{i + 1}: {p || "N/A"}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {payment.status === "pending" && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setSelectedScreenshot(payment.screenshot)}
                                                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all"
                                                title="Quick View Proof"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatus(payment._id, "approved")}
                                                disabled={updating === payment._id}
                                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                                            >
                                                {updating === payment._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatus(payment._id, "rejected")}
                                                disabled={updating === payment._id}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/20 hover:bg-red-600/30 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Screenshot Lightbox */}
            <AnimatePresence>
                {selectedScreenshot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative max-w-4xl w-full bg-zinc-900 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-600/20 rounded-lg">
                                        <ImageIcon className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <h3 className="font-black text-lg uppercase tracking-tight">Payment Verification</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedScreenshot(null)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="h-6 w-6 text-zinc-500" />
                                </button>
                            </div>
                            <div className="p-8 flex items-center justify-center bg-black/40 min-h-[400px]">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'}${selectedScreenshot}`}
                                    alt="Payment Screenshot"
                                    className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                                />
                            </div>
                            <div className="p-6 bg-zinc-900/50 border-t border-white/5 flex justify-end gap-4">
                                <a
                                    href={`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'}${selectedScreenshot}`}
                                    target="_blank"
                                    className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-bold text-sm transition-all"
                                >
                                    <ExternalLink className="h-4 w-4" /> Open Full Image
                                </a>
                                <button
                                    onClick={() => setSelectedScreenshot(null)}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-sm transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
                </div>
            </main>
        </div>
    </div>
);
}
