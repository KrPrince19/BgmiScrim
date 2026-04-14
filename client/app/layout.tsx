import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FragZone | Premium BGMI Scrims",
  description: "Join professional BGMI Scrims, secure your slots, and dominate the arena with FragZone.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FragZone",
  },
  icons: {
    apple: "/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen font-sans bg-[#09090b] text-[#fafafa] antialiased">
        <Toaster position="top-right" toastOptions={{
          style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' },
        }} />
        <AuthProvider>
          <SocketProvider>
            {children}
            <Footer />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
