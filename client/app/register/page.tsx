"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { User as UserIcon, Mail, Phone, Lock, Loader2, Gamepad2, Check, X, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const { login: setAuth } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Password Validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters, with 1 uppercase letter and 1 special character.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/signup", formData);
      setAuth(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white border border-gray-200 p-8 rounded-2xl shadow-sm"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 mb-4"
          >
            <Gamepad2 className="h-10 w-10 text-blue-600" />
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join the ultimate BGMI scrim arena</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Username"
                required
                className="w-full bg-white border border-gray-300 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400 shadow-sm"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full bg-white border border-gray-300 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400 shadow-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                placeholder="Phone Number"
                required
                className="w-full bg-white border border-gray-300 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400 shadow-sm"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full bg-white border border-gray-300 rounded-xl py-2.5 pl-10 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400 shadow-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Real-time Checklist */}
            {formData.password.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2"
              >
                <div className={`flex items-center gap-2 transition-colors ${formData.password.length >= 8 ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {formData.password.length >= 8 ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  <span>At least 8 characters length</span>
                </div>
                <div className={`flex items-center gap-2 transition-colors ${/[A-Z]/.test(formData.password) ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {/[A-Z]/.test(formData.password) ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  <span>At least 1 capital letter</span>
                </div>
                <div className={`flex items-center gap-2 transition-colors ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  <span>At least 1 special character</span>
                </div>
              </motion.div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center items-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50 shadow-sm active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold">
              Log in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
