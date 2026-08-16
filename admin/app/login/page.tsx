"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, KeyRound, Loader2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const ADMIN_CODE = process.env.NEXT_PUBLIC_ADMIN_CODE || "BGMI@Admin2024";

export default function AdminLogin() {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showCode, setShowCode] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulate a short delay for UX
        await new Promise((r) => setTimeout(r, 500));

        if (code === ADMIN_CODE) {
            sessionStorage.setItem("admin_auth", "true");
            router.push("/dashboard");
        } else {
            setError("Invalid admin code. Access denied.");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-6 bg-zinc-900/80 backdrop-blur border border-red-500/10 p-8 rounded-2xl shadow-2xl"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/10 mb-4 border border-red-500/20"
                    >
                        <ShieldAlert className="h-8 w-8 text-red-500" />
                    </motion.div>
                    <h2 className="text-3xl font-bold tracking-tight text-white uppercase">Admin Portal</h2>
                    <p className="mt-2 text-xs text-zinc-500 font-mono tracking-widest">RESTRICTED ACCESS ZONE</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 text-center">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <KeyRound className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500" />
                        <input
                            type={showCode ? "text" : "password"}
                            placeholder="Enter Admin Access Code"
                            required
                            autoComplete="off"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 placeholder:text-zinc-600"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCode(!showCode)}
                            className="absolute right-4 top-3.5 text-zinc-400 hover:text-white transition-colors"
                        >
                            {showCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Authenticate"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
