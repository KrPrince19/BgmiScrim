import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor — attaches the Clerk session token as a Bearer token.
 *
 * Clerk exposes the session token via window.__clerk_db_jwt (set by ClerkProvider)
 * or via the Clerk object on window. We read it here so every API call is
 * automatically authenticated without needing to wrap every component.
 *
 * NOTE: This works because ClerkProvider is mounted in layout.tsx above the app.
 */
api.interceptors.request.use(async (config) => {
  try {
    // window.Clerk is the global Clerk instance injected by <ClerkProvider>
    const clerkInstance = (window as any).Clerk;
    if (clerkInstance?.session) {
      const token = await clerkInstance.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // Not in a browser environment (e.g. SSR) — skip silently
  }
  return config;
});

export default api;
