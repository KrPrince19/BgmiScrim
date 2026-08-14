"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Loader2, Gamepad2, Eye, EyeOff, UserPlus, User, BarChart2, Gift, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });
      setAuth(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Google signup failed");
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
               <img src="/mainlogo.jpeg" alt="FRAGZONE" className="h-12 w-auto object-contain" />
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

            <div className="flex justify-center">
               <div className="flex justify-center items-center overflow-hidden rounded-xl bg-[#150f22] border border-white/5 h-[42px] w-full max-w-xs">
                  <GoogleLogin 
                     onSuccess={handleGoogleSuccess} 
                     onError={() => setError("Google signup failed")}
                     useOneTap
                     shape="rectangular"
                     text="signup_with"
                     theme="filled_black"
                  />
               </div>
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
