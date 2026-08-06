"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Mail, Lock, Loader2, Gamepad2, Eye, EyeOff, Target, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/reset-password", formData);
      toast.success(data.message || "Password reset successful!");
      router.push("/login");
    } catch (err: any) {
      if (!err.response) {
        setError("Connection error: Cannot reach the backend server.");
      } else {
        setError(err.response?.data?.message || "Failed to reset password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030008] p-4 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 z-10 relative">
        
        {/* Left Side Content - Only visible on desktop */}
        <div className="hidden lg:flex flex-col flex-1 text-white relative h-full min-h-[600px] justify-center">
          <div className="absolute inset-0 z-0 -mx-12 pointer-events-none">
             <img src="/footer1.jpeg" alt="Background" className="w-full h-full object-cover opacity-50" style={{ maskImage: 'linear-gradient(to right, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)' }} />
          </div>
          <div className="relative z-10">
          <div className="mb-8">
            <Link href="/">
                <img src="/fragzone.png" alt="FRAGZONE" className="h-12 w-auto object-contain" />
            </Link>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 text-white leading-tight">
            Reset Your<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Password</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-md">
            Enter your email and a new password to regain access to your account.
          </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0c0814]/80 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl relative mx-auto"
        >
          {/* Header Icon */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
             <div className="w-16 h-16 rounded-2xl bg-[#0c0814] border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <Target className="w-8 h-8 text-purple-500" />
             </div>
          </div>

          <div className="text-center mt-10 mb-8">
            <h2 className="text-2xl font-black text-white">Direct Reset</h2>
            <p className="mt-2 text-sm text-gray-400">Update your password immediately</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-950/50 p-3 text-sm text-red-400 border border-red-500/20 text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="w-full bg-[#150f22] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600 text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    required
                    className="w-full bg-[#150f22] border border-white/5 rounded-xl py-3 pl-11 pr-11 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600 text-sm"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 ml-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    required
                    className="w-full bg-[#150f22] border border-white/5 rounded-xl py-3 pl-11 pr-11 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600 text-sm"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 py-3.5 text-sm font-bold text-white hover:from-purple-500 hover:to-purple-600 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(147,51,234,0.3)] active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>
                  Reset Password
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500 pt-2">
              Remembered your password?{" "}
              <Link href="/login" className="text-purple-500 hover:text-purple-400 font-bold transition-colors">
                Back to Login
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
