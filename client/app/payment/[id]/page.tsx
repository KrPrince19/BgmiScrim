"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  QrCode,
  Copy,
  MessageCircle,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  User as UserIcon,
  Upload,
  Image as ImageIcon,
  Trophy
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [scrim, setScrim] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [transactionID, setTransactionID] = useState("");
  const [clanName, setClanName] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player3, setPlayer3] = useState("");
  const [player4, setPlayer4] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const UPI_ID = "7091910259@ybl";
  const WHATSAPP_NUMBER = "916205597789";

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    if (!id) return;

    const fetchScrim = async () => {
      try {
        const { data } = await api.get(`/scrims/${id}`);
        setScrim(data);
      } catch (err) {
        console.error("Failed to fetch scrim", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScrim();
  }, [id, user, authLoading, router]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    alert("UPI ID copied to clipboard!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!transactionID || transactionID.length !== 12) {
      setError("Transaction ID (UTR) must be exactly 12 characters");
      return;
    }

    if (!clanName) {
      setError("Please enter your Team / Clan Name");
      return;
    }

    if (!player1 || !player2 || !player3 || !player4) {
      setError("Please enter all 4 team member names");
      return;
    }

    if (!screenshot) {
      setError("Please upload a payment screenshot");
      return;
    }

    if (!agreed) {
      setError("You must agree to the Terms & Conditions");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("scrimId", id as string);
      formData.append("transactionID", transactionID);
      formData.append("clanName", clanName);
      formData.append("player1", player1);
      formData.append("player2", player2);
      formData.append("player3", player3);
      formData.append("player4", player4);
      if (screenshot) {
        formData.append("screenshot", screenshot);
      }

      await api.post("/payments/join", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push(`/status/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading || !user) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-12">
      <nav className="p-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft className="h-5 w-5" /> Back to Scrims
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-3xl overflow-hidden p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black mb-2">Secure Your Slot</h1>
            <div className="flex flex-col items-center gap-1">
              <p className="text-zinc-500">Pay <span className="text-white font-bold">₹{scrim?.entryFee}</span> to join <span className="text-blue-500">{scrim?.matchName}</span></p>
              <div className="flex items-center gap-2 mt-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-black uppercase tracking-widest text-amber-500">Winning Prize: ₹{scrim?.winningPrize || 0}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl">
              <img
                src="/qr.png"
                alt="PhonePe QR Code - PRINCE KUMAR YADAV"
                className="w-44 h-44 object-contain"
              />
              <p className="text-[10px] text-zinc-400 mt-3 uppercase tracking-widest font-black">Scan to Pay via PhonePe</p>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-black mb-2">UPI ID</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{UPI_ID}</span>
                  <button onClick={handleCopyUPI} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                    <Copy className="h-4 w-4 text-zinc-400" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                <p className="text-xs text-amber-500 uppercase tracking-widest font-black mb-1">Prize Pool</p>
                <div className="text-2xl font-black text-amber-500">₹{scrim?.winningPrize || 0}</div>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-black mb-2">Entry Fee</p>
                <div className="text-2xl font-black text-blue-500">₹{scrim?.entryFee}</div>
              </div>
            </div>
          </div>

          {/* Transaction ID Input */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
                <AlertCircle className="h-5 w-5" /> {error}
              </div>
            )}

            {/* Team Details section */}
            <div className="space-y-4">
              <label className="text-xs text-zinc-500 uppercase tracking-widest font-black block mb-2">Team Members (4 Players Required)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'p1', label: 'Player 1 (Leader)', val: player1, set: setPlayer1 },
                  { id: 'p2', label: 'Player 2', val: player2, set: setPlayer2 },
                  { id: 'p3', label: 'Player 3', val: player3, set: setPlayer3 },
                  { id: 'p4', label: 'Player 4', val: player4, set: setPlayer4 },
                ].map((p) => (
                  <div key={p.id} className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder={p.label}
                      value={p.val}
                      onChange={(e) => p.set(e.target.value)}
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-500 uppercase tracking-widest font-black block mb-2">Team / Clan Name</label>
              <input
                type="text"
                placeholder="e.g. Soul, GodL, Team X"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-bold"
                value={clanName}
                onChange={(e) => setClanName(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs text-zinc-500 uppercase tracking-widest font-black block mb-2">Transaction ID (UTR Number)</label>
              <input
                type="text"
                placeholder="Enter 12-digit transaction ID"
                required
                maxLength={12}
                minLength={12}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono tracking-[0.2em]"
                value={transactionID}
                onChange={(e) => setTransactionID(e.target.value)}
              />
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Must be exactly 12 characters</p>
            </div>

            {/* Screenshot Upload */}
            <div className="space-y-4">
              <label className="text-xs text-zinc-500 uppercase tracking-widest font-black block mb-2">Payment Screenshot</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="screenshot-upload"
                  required
                />
                <label
                  htmlFor="screenshot-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-800 rounded-[2rem] bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-blue-500/50 transition-all cursor-pointer group px-6 text-center"
                >
                  {screenshotPreview ? (
                    <div className="relative w-full h-full p-2">
                      <img src={screenshotPreview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                        <p className="text-[10px] font-black uppercase text-white tracking-widest">Change Image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-zinc-500 group-hover:text-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-white uppercase tracking-tight">Upload Payment Proof</p>
                        <p className="text-[10px] text-zinc-500 font-medium">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex flex-col gap-4 p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-red-600/10 flex items-center justify-center text-[10px] font-black text-red-500">1.1</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    The four player names submitted during the joining process must <span className="text-white font-bold">EXACTLY MATCH</span> the names used in the BGMI room. Any deviation will result in an immediate kick without a refund.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-red-600/10 flex items-center justify-center text-[10px] font-black text-red-500">1.2</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Substitutions are not allowed after the joining request has been submitted. Ensure your final roster is ready before paying.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-white/5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500/50 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-blue-400 cursor-pointer font-black uppercase tracking-widest">
                  I have read and agree to these rules
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="submit"
                disabled={submitting || !transactionID || !agreed}
                className="py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <>Submit Request <CheckCircle2 className="h-5 w-5" /></>}
              </button>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I have paid for the scrim ${scrim?.matchName}. Transaction ID: ${transactionID}`}
                target="_blank"
                className="py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-center"
              >
                Verify on WhatsApp <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </form>

          <p className="text-center text-[10px] text-zinc-600 mt-8 uppercase tracking-[0.2em] font-black italic">
            Verification is a manual process. Please allow our team some time to verify your UTR.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
