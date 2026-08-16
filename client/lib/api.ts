import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * setApiToken — Call this from a component that has access to Clerk's useAuth hook.
 * Attaches (or clears) the Clerk session token on every outgoing request.
 *
 * Usage in a client component:
 *   const { getToken } = useAuth();
 *   useEffect(() => { getToken().then(setApiToken); }, [getToken]);
 */
export function setApiToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
