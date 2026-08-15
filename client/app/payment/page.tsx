"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import api from "@/lib/api";
import { useUser } from "@clerk/nextjs";

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

function PaymentContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const title = searchParams.get("title");
  const fee = searchParams.get("fee");
  const prize = searchParams.get("prize");
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const authLoading = !isLoaded;
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
    if (authLoading || !user) return;

    if (title) {
      setScrim({
        id: id,
        matchName: title,
        entryFee: fee ? parseInt(fee.replace(/,/g, '')) : 0,
        winningPrize: prize || "0"
      });
      setLoading(false);
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
  }, [id, title, fee, prize, user, authLoading, router]);

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

  const isFree = scrim?.entryFee === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isFree) {
      if (!transactionID || transactionID.length !== 12) {
        setError("Transaction ID (UTR) must be exactly 12 characters");
        return;
      }
      if (!screenshot) {
        setError("Please upload a payment screenshot");
        return;
      }
    }

    if (!clanName) {
      setError("Please enter your Team / Clan Name");
      return;
    }

    if (!player1 || !player2 || !player3 || !player4) {
      setError("Please enter all 4 team member names");
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
      if (!isFree) {
        formData.append("transactionID", transactionID);
        if (screenshot) formData.append("screenshot", screenshot);
      }
      formData.append("clanName", clanName);
      formData.append("player1", player1);
      formData.append("player2", player2);
      formData.append("player3", player3);
      formData.append("player4", player4);

      await api.post("/payments/join", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push(`/status?id=${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading || !user) return (
    <div className="min-h-screen bg-[#030008] flex items-center justify-center">
      <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030008] text-white pb-12 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-950/20 blur-[150px] rounded-full pointer-events-none" />

      <nav className="p-6 relative z-10">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold text-sm">
          <ChevronLeft className="h-5 w-5" /> Go Back
        </button>
      </nav>

      <main className="max-w-2xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0b0514] rounded-3xl overflow-hidden p-8 border border-white/5 shadow-[0_0_50px_rgba(126,34,206,0.1)] relative"
        >
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-3xl font-black mb-2 text-white">Secure Your Slot</h1>
            <div className="flex flex-col items-center gap-1">
              <p className="text-gray-400">
                {isFree ? (
                  <>Join <span className="text-purple-400 font-bold">{scrim?.matchName}</span> for <span className="text-emerald-400 font-black uppercase">Free</span></>
                ) : (
                  <>Pay <span className="text-white font-black">₹{scrim?.entryFee}</span> to join <span className="text-purple-400 font-bold">{scrim?.matchName}</span></>
                )}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-black uppercase tracking-widest text-amber-500">Winning Prize: ₹{scrim?.winningPrize || 0}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          {!isFree && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
              <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="p-2 bg-white rounded-xl">
                  <img
                    src="/qr.png"
                    alt="PhonePe QR Code"
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-3 uppercase tracking-widest font-black">Scan to Pay via PhonePe</p>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-[#0b0514] border border-white/10 rounded-2xl">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-black mb-2">UPI ID</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-white">{UPI_ID}</span>
                    <button onClick={handleCopyUPI} type="button" className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-colors">
                      <Copy className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-2xl">
                  <p className="text-xs text-amber-500 uppercase tracking-widest font-black mb-1">Prize Pool</p>
                  <div className="text-2xl font-black text-amber-400">₹{scrim?.winningPrize || 0}</div>
                </div>

                <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl">
                  <p className="text-xs text-purple-400 uppercase tracking-widest font-black mb-2">Entry Fee</p>
                  <div className="text-2xl font-black text-purple-400">₹{scrim?.entryFee}</div>
                </div>
              </div>
            </div>
          )}

          {isFree && (
            <div className="flex items-center justify-center p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl mb-8">
              <p className="text-emerald-400 font-black text-xl uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6" /> Free Entry
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-400 text-sm font-bold flex items-center gap-3">
                <AlertCircle className="h-5 w-5" /> {error}
              </div>
            )}

            {/* Team Details section */}
            <div className="space-y-4">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-black block mb-2">Team Members (4 Players Required)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'p1', label: 'Team Leader Name', val: player1, set: setPlayer1 },
                  { id: 'p2', label: 'Second Player Name', val: player2, set: setPlayer2 },
                  { id: 'p3', label: 'Third Player Name', val: player3, set: setPlayer3 },
                  { id: 'p4', label: 'Fourth Player Name', val: player4, set: setPlayer4 },
                ].map((p) => (
                  <div key={p.id} className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder={p.label}
                      value={p.val}
                      onChange={(e) => p.set(e.target.value)}
                      required
                      className="w-full bg-[#030008] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-600 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-black block mb-2">Team / Clan Name</label>
              <input
                type="text"
                placeholder="e.g. Soul, GodL, Team X"
                required
                className="w-full bg-[#030008] border border-white/10 rounded-xl py-4 px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-black placeholder-gray-600 transition-all"
                value={clanName}
                onChange={(e) => setClanName(e.target.value)}
              />
            </div>

            {!isFree && (
              <>
                <div className="space-y-4">
                  <label className="text-xs text-gray-400 uppercase tracking-widest font-black block mb-2">Transaction ID (UTR Number)</label>
                  <input
                    type="text"
                    placeholder="Enter 12-digit transaction ID"
                    required={!isFree}
                    maxLength={12}
                    minLength={12}
                    className="w-full bg-[#030008] border border-white/10 rounded-xl py-4 px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono tracking-[0.2em] font-bold placeholder-gray-600 transition-all"
                    value={transactionID}
                    onChange={(e) => setTransactionID(e.target.value)}
                  />
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Must be exactly 12 characters</p>
                </div>

                <div className="space-y-4">
                  <label className="text-xs text-gray-400 uppercase tracking-widest font-black block mb-2">Payment Screenshot</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="screenshot-upload"
                      required={!isFree}
                    />
                    <label
                      htmlFor="screenshot-upload"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-[2rem] bg-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all cursor-pointer group px-6 text-center"
                    >
                      {screenshotPreview ? (
                        <div className="relative w-full h-full p-2">
                          <img src={screenshotPreview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                            <p className="text-[10px] font-black uppercase text-white tracking-widest">Change Image</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="h-6 w-6 text-gray-400 group-hover:text-purple-400" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-black text-white uppercase tracking-tight">Upload Payment Proof</p>
                            <p className="text-[10px] text-gray-500 font-medium">PNG, JPG up to 5MB</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Terms Agreement */}
            <div className="flex flex-col gap-4 p-5 bg-purple-950/10 rounded-2xl border border-purple-500/20">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-red-950/50 border border-red-500/50 flex items-center justify-center text-[10px] font-black text-red-400">1.1</div>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                    Strictly <span className="text-white font-black">NO REFUNDS</span> will be provided after successful registration. Make sure all your details are correct before paying.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-red-950/50 border border-red-500/50 flex items-center justify-center text-[10px] font-black text-red-400">1.2</div>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                    For any concerns, issues, or further assistance, you must join our WhatsApp group and contact the administrative team directly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-600 bg-white/5 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
                />
                <label htmlFor="terms" className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer font-black uppercase tracking-widest transition-colors">
                  I have read and agree to these rules
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="submit"
                disabled={submitting || (!isFree && !transactionID) || !agreed}
                className="py-4 bg-purple-700 hover:bg-purple-600 text-white rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-[0_0_20px_rgba(126,34,206,0.3)] hover:shadow-[0_0_30px_rgba(126,34,206,0.5)]"
              >
                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <>Submit Request <CheckCircle2 className="h-5 w-5" /></>}
              </button>

              {!isFree && (
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I have paid for the scrim ${scrim?.matchName}. Transaction ID: ${transactionID}`}
                  target="_blank"
                  className="py-4 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all text-center active:scale-95 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]"
                >
                  Verify on WhatsApp <MessageCircle className="h-5 w-5" />
                </a>
              )}
            </div>
          </form>

          {!isFree && (
            <p className="text-center text-[10px] text-gray-500 mt-8 uppercase tracking-[0.2em] font-black italic relative z-10">
              Verification is a manual process. Please allow our team some time to verify your UTR.
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030008] flex items-center justify-center"><Loader2 className="h-10 w-10 text-purple-600 animate-spin" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
