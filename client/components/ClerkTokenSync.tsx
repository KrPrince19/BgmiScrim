"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { setApiToken } from "@/lib/api";

/**
 * ClerkTokenSync
 * Sits inside <ClerkProvider> and keeps the axios Authorization header in sync
 * with the current Clerk session token. Runs on every auth state change.
 */
export default function ClerkTokenSync() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      setApiToken(null);
      return;
    }

    // Fetch and cache the current Clerk session token
    getToken().then((token) => {
      setApiToken(token);
    });

    // Refresh the token every 50 seconds (Clerk tokens expire in ~60s)
    const interval = setInterval(() => {
      getToken().then((token) => {
        setApiToken(token);
      });
    }, 50_000);

    return () => clearInterval(interval);
  }, [isSignedIn, getToken]);

  // Renders nothing — purely a side-effect component
  return null;
}
