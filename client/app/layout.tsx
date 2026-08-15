import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import "./globals.css";
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
    apple: "/mainlogo.jpeg",
    icon: "/mainlogo.jpeg",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

import { Toaster } from "react-hot-toast";
import BottomNav from "@/components/BottomNav";
import InstallPrompt from "@/components/InstallPrompt";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen font-sans bg-gray-50 text-gray-900 antialiased pb-16 md:pb-0">
        <ClerkProvider>
          <Toaster position="top-right" toastOptions={{
          style: { background: '#ffffff', color: '#111827', border: '1px solid #e5e7eb' },
          }} />
          <SocketProvider>
          {children}
          <Footer />
          <BottomNav />
          <InstallPrompt />
          </SocketProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}