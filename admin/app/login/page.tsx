"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Lock, Mail, Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminLogin() {
    const { login: setAuth } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const pw = formData.password;
    const checks = [
        { label: "At least 8 characters", pass: pw.length >= 8 },
        { label: "At least 1 capital letter", pass: /[A-Z]/.test(pw) },
        { label: "At least 1 special character", pass: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw) },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const { data } = await api.post("/auth/login", formData);
            setAuth(data); // Context will reject if role !== admin
        } catch (err: any) {
            if (err.message?.includes("Access Denied")) {
                setError(err.message);
            } else {
                setError(err.response?.data?.message || "Invalid Admin Credentials");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-6 glass-morphism p-8 rounded-2xl shadow-2xl border border-red-500/10"
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

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500" />
                        <input
                            type="email" placeholder="Admin Email Address" required
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 placeholder:text-zinc-600"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* Password + real-time checklist */}
                    <div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500" />
                            <input
                                type={showPassword ? "text" : "password"} placeholder="Secure Password" required
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 placeholder:text-zinc-600"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-white hover:text-zinc-300 transition-colors">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        {/* Real-time checklist shown while typing */}
                        {pw.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="space-y-1.5 text-xs bg-zinc-900/30 border border-zinc-800/50 p-3 rounded-lg mt-2"
                            >
                                {checks.map((c) => (
                                    <div key={c.label} className={`flex items-center gap-2 transition-colors ${c.pass ? "text-emerald-400" : "text-zinc-500"}`}>
                                        {c.pass ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                        <span>{c.label}</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Authenticate"}
                    </button>

                    <p className="text-center text-sm text-zinc-500">
                        First time here?{" "}
                        <Link href="/register" className="text-red-500 hover:text-red-400 font-bold">Create Admin Account</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
