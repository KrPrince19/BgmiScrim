"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Loader2, Gamepad2, Eye, EyeOff, UserPlus, User, BarChart2, Gift, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const { login: setAuth } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the Terms of Service");
      setLoading(false);
      return;
    }

    // Password Validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters, with 1 uppercase letter and 1 special character.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: "0000000000", // Defaulting for backward compatibility since it was required before
      });
      setAuth(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
    return strength;
  };

  const strength = getPasswordStrength();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030008] p-4 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 z-10 relative mt-10 lg:mt-0">
        
        {/* Left Side Content - Only visible on desktop */}
        <div className="hidden lg:flex flex-col flex-1 text-white relative h-full min-h-[600px] justify-center">
          {/* Background Image behind text */}
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
            Create Your<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Account</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-md">
            Join FragZone and start your journey to greatness.
          </p>

          <div className="space-y-6">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/20 flex items-center justify-center border border-purple-500/20">
                   <Trophy className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                   <h3 className="font-bold text-white text-sm">Join Tournaments</h3>
                   <p className="text-gray-500 text-xs mt-1 max-w-xs">Compete in exciting tournaments.</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/20 flex items-center justify-center border border-purple-500/20">
                   <BarChart2 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                   <h3 className="font-bold text-white text-sm">Climb Leaderboards</h3>
                   <p className="text-gray-500 text-xs mt-1 max-w-xs">Show your skills and rank on top.</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/20 flex items-center justify-center border border-purple-500/20">
                   <Gift className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                   <h3 className="font-bold text-white text-sm">Earn Rewards</h3>
                   <p className="text-gray-500 text-xs mt-1 max-w-xs">Play, win and earn exciting rewards.</p>
                </div>
             </div>
          </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0c0814]/80 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl relative"
        >
          {/* Header Icon */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
             <div className="w-16 h-16 rounded-2xl bg-[#0c0814] border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <UserPlus className="w-8 h-8 text-purple-500" />
             </div>
          </div>

          <div className="text-center mt-10 mb-8">
            <h2 className="text-2xl font-black text-white">Sign Up</h2>
            <p className="mt-2 text-sm text-gray-400">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-950/50 p-3 text-sm text-red-400 border border-red-500/20 text-center">
                {error}
              </div>
            )}

            <div className="space-y-1">
               <label className="text-xs font-bold text-gray-300 ml-1">Username</label>
               <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                  <input
                     type="text"
                     placeholder="Choose a unique username"
                     required
                     className="w-full bg-[#150f22] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600 text-sm"
                     value={formData.username}
                     onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
               </div>
            </div>

            <div className="space-y-1">
               <label className="text-xs font-bold text-gray-300 ml-1">Email</label>
               <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                  <input
                     type="email"
                     placeholder="Enter your email address"
                     required
                     className="w-full bg-[#150f22] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600 text-sm"
                     value={formData.email}
                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
               </div>
            </div>

            <div className="space-y-1">
               <label className="text-xs font-bold text-gray-300 ml-1">Password</label>
               <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                  <input
                     type={showPassword ? "text" : "password"}
                     placeholder="Create a strong password"
                     required
                     className="w-full bg-[#150f22] border border-white/5 rounded-xl py-3 pl-11 pr-11 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600 text-sm"
                     value={formData.password}
                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300 focus:outline-none transition-colors"
                  >
                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
               </div>
               {/* Password Strength Indicator */}
               {formData.password && (
                  <div className="pt-2 px-1 flex items-center gap-1">
                     <div className={`h-1 flex-1 rounded-full ${strength >= 25 ? 'bg-red-500' : 'bg-gray-700'}`} />
                     <div className={`h-1 flex-1 rounded-full ${strength >= 50 ? 'bg-orange-500' : 'bg-gray-700'}`} />
                     <div className={`h-1 flex-1 rounded-full ${strength >= 75 ? 'bg-yellow-500' : 'bg-gray-700'}`} />
                     <div className={`h-1 flex-1 rounded-full ${strength >= 100 ? 'bg-green-500' : 'bg-gray-700'}`} />
                     <span className="text-[10px] text-gray-400 ml-2 font-bold w-12 text-right">
                        {strength === 100 ? 'Strong' : strength >= 50 ? 'Medium' : 'Weak'}
                     </span>
                  </div>
               )}
            </div>

            <div className="space-y-1">
               <label className="text-xs font-bold text-gray-300 ml-1">Confirm Password</label>
               <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                  <input
                     type={showConfirmPassword ? "text" : "password"}
                     placeholder="Confirm your password"
                     required
                     className="w-full bg-[#150f22] border border-white/5 rounded-xl py-3 pl-11 pr-11 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600 text-sm"
                     value={formData.confirmPassword}
                     onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button
                     type="button"
                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                     className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300 focus:outline-none transition-colors"
                  >
                     {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
               </div>
            </div>

            <div className="flex items-center pt-2">
               <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-[#150f22] text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
               />
               <label htmlFor="terms" className="ml-2 block text-xs text-gray-400">
                  I agree to the <Link href="/terms" className="text-purple-500 hover:text-purple-400">Terms of Service</Link> and <Link href="/terms" className="text-purple-500 hover:text-purple-400">Privacy Policy</Link>
               </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 py-3.5 text-sm font-bold text-white hover:from-purple-500 hover:to-purple-600 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(147,51,234,0.3)] active:scale-95 mt-2"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>
                  Create Account
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            <div className="flex items-center my-4">
               <div className="flex-1 border-t border-white/10"></div>
               <span className="px-3 text-[10px] text-gray-500 uppercase tracking-wider">or sign up with</span>
               <div className="flex-1 border-t border-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button type="button" className="flex justify-center items-center gap-2 py-2.5 bg-[#150f22] border border-white/5 rounded-xl hover:bg-white/5 transition-colors text-sm text-gray-300 font-medium">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
               </button>
               <button type="button" className="flex justify-center items-center gap-2 py-2.5 bg-[#150f22] border border-white/5 rounded-xl hover:bg-white/5 transition-colors text-sm text-gray-300 font-medium">
                  <svg className="w-5 h-5 text-[#5865F2]" fill="currentColor" viewBox="0 0 127.14 96.36">
                     <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.08 0A72.37 72.37 0 0 0 45.67 0a105.14 105.14 0 0 0-26.23 8.07C2.04 33.84-2.4 58.98.92 83.74a105.73 105.73 0 0 0 32.27 16.17 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.28-16.17c3.78-29.28-2.61-54.08-19.53-75.67zM42.68 65.36c-5.36 0-9.82-4.93-9.82-11s4.38-11 9.82-11c5.49 0 9.89 4.97 9.82 11 0 6.07-4.33 11-9.82 11zm41.78 0c-5.36 0-9.82-4.93-9.82-11s4.38-11 9.82-11c5.49 0 9.89 4.97 9.82 11 0 6.07-4.33 11-9.82 11z"/>
                  </svg>
                  Discord
               </button>
            </div>

            <p className="text-center text-xs text-gray-500 pt-1">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-500 hover:text-purple-400 font-bold transition-colors">
                Login
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
