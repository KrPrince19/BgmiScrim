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
    apple: "/mainlogo.jpeg",
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

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen font-sans bg-gray-50 text-gray-900 antialiased pb-16 md:pb-0">
        <Toaster position="top-right" toastOptions={{
          style: { background: '#ffffff', color: '#111827', border: '1px solid #e5e7eb' },
        }} />
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <AuthProvider>
            <SocketProvider>
              {children}
              <Footer />
              <BottomNav />
              <InstallPrompt />
            </SocketProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
