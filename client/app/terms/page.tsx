"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ChevronLeft, Gavel, Scale, AlertOctagon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function TermsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get("returnTo");

    const handleAccept = () => {
        if (returnTo) {
            router.push(`/payment/${returnTo}`);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 selection:bg-blue-500/30">
            <div className="max-w-3xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => returnTo ? router.push(`/payment/${returnTo}`) : router.push("/")}
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold"
                    >
                        <ChevronLeft className="h-5 w-5" /> {returnTo ? "Back to Match" : "Back to Home"}
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-600/10 text-red-500 rounded-full border border-red-500/20 text-[10px] font-black uppercase tracking-widest">
                        <ShieldAlert className="w-3 h-3" /> Strict Enforcement
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 text-center md:text-left"
                >
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                        TERMS & <br />CONDITIONS.
                    </h1>
                    <p className="text-zinc-500 font-medium max-w-xl">
                        By participating in our scrims, you agree to follow these professional standards. Failure to comply results in an immediate ban.
                    </p>
                </motion.div>

                {/* Rules Grid */}
                <div className="space-y-6">
                    <Section title="1. Team Integrity" icon={<Gavel className="w-5 h-5 text-blue-500" />}>
                        <ul className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                            <li className="flex gap-4">
                                <span className="text-blue-500 font-black">1.1</span>
                                <span>The four player names submitted during the joining process must **EXACTLY MATCH** the names used in the BGMI room. Any deviation will result in an immediate kick without a refund.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-blue-500 font-black">1.2</span>
                                <span>Substitutions are not allowed after the joining request has been submitted. Ensure your final roster is ready before paying.</span>
                            </li>
                        </ul>
                    </Section>

                    <Section title="2. Fair Play & Anti-Cheat" icon={<AlertOctagon className="w-5 h-5 text-red-500" />}>
                        <ul className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                            <li className="flex gap-4">
                                <span className="text-red-500 font-black">2.1</span>
                                <span>Use of any third-party tools, scripts, or hacks will result in a **PERMANENT BAN** from our platform and a report to the BGMI official team.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-red-500 font-black">2.2</span>
                                <span>No teaming or pre-lobby cooperation with other squads. Any suspicious behavior will be reviewed by admins.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-red-500 font-black">2.3</span>
                                <span>Emulator players are strictly forbidden. Only mobile participants are allowed.</span>
                            </li>
                        </ul>
                    </Section>

                    <Section title="3. Payment Terms" icon={<Scale className="w-5 h-5 text-emerald-500" />}>
                        <ul className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                            <li className="flex gap-4">
                                <span className="text-emerald-500 font-black">3.1</span>
                                <span>Payment is mandatory for all paid scrims. Any fake Transaction IDs (UTR numbers) will lead to an immediate account suspension.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-emerald-500 font-black">3.2</span>
                                <span>Once a payment is approved, it is non-refundable unless the match is canceled by the admin.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-emerald-500 font-black">3.3</span>
                                <span>Please allow our team some time to manually verify your UTR. This manual process ensures the integrity of the tournament and prevents fraudulent entries.</span>
                            </li>
                        </ul>
                    </Section>

                    <Section title="4. Administrative Authority" icon={<ShieldAlert className="w-5 h-5 text-zinc-500" />}>
                        <ul className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                            <li className="flex gap-4">
                                <span className="text-zinc-500 font-black">4.1</span>
                                <span>The tournament administrator's decision is **FINAL AND BINDING**. No arguments or appeals will be entertained regarding match outcomes or disqualifications.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-zinc-500 font-black">4.2</span>
                                <span>Abuse, threats, or disrespectful behavior towards admins or other participants in-game or on community groups will result in an immediate and permanent ban.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-zinc-500 font-black">4.3</span>
                                <span>The platform reserves the right to cancel any scrim or modify the prize pool if technical issues or server problems occur.</span>
                            </li>
                        </ul>
                    </Section>
                </div>

                {/* Final Agreement */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-6"
                >
                    <CheckCircle2 className="w-12 h-12 text-blue-500 mx-auto" />
                    <h3 className="text-xl font-bold">READY TO COMPETE?</h3>
                    <p className="text-sm text-zinc-500">By proceeding to join a match, you acknowledge that you have read and understood all the terms above.</p>
                    <button
                        onClick={handleAccept}
                        className="inline-block bg-white text-black px-8 py-4 rounded-2xl font-black text-sm hover:bg-zinc-200 transition-all uppercase tracking-widest"
                    >
                        I Agree & Accept
                    </button>
                </motion.div>

                <footer className="py-12 text-center text-[10px] text-zinc-700 uppercase tracking-widest font-black">
                    BGMI SCRIM &copy; 2026 OFFICIAL PLATFORM
                </footer>
            </div>
        </div>
    );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 space-y-6"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5">{icon}</div>
                <h2 className="text-lg font-black uppercase tracking-tight">{title}</h2>
            </div>
            {children}
        </motion.div>
    );
}
