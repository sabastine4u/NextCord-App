import React, {
  createContext, useContext, useState,
  useCallback, useEffect,
} from 'react';

// ── Storage keys ──────────────────────────────────────────────────────────────
const ACCOUNTS_KEY = 'Nextcord_accounts';
const SESSION_KEY  = 'Nextcord_session';

// ── Helpers ───────────────────────────────────────────────────────────────────
const getAccounts = () => {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]'); }
  catch { return []; }
};
const saveAccounts = (accounts) =>
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));


const getSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
};
const saveSession  = (user) => localStorage.setItem(SESSION_KEY, JSON.stringify(user));
const clearSession = ()     => localStorage.removeItem(SESSION_KEY);

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Rehydrate from localStorage on first load
  const [currentUser,      setCurrentUser]      = useState(() => getSession());
  const [isAuthenticated,  setIsAuthenticated]  = useState(() => !!getSession());
  const [authView,         setAuthView]         = useState('login'); // 'login' | 'register'

  // ── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(({ email, password, firstName, lastName }) => {
    const accounts = getAccounts();

    // Validate uniqueness
    if (accounts.find(a => a.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with that email already exists.' };
    }

    const newUser = {
      id:         `u_${Date.now()}`,
      email:      email.trim().toLowerCase(),
      password,                                   // NOTE: plaintext only for demo
      firstName:  firstName.trim() || 'User',
      lastName:   lastName.trim()  || '',
      username:   email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase(),
      image:      `https://dummyjson.com/image/avatar/${Math.floor(Math.random() * 40) + 1}`,
      address:    { city: 'Your City' },
      occupation: 'Professional',
      interests:  [],
      bio:        '',
      followers:  0,
      following:  0,
      posts:      0,
      isVerified: false,
      createdAt:  new Date().toISOString(),
    };

    saveAccounts([...accounts, newUser]);

    // Strip password before storing in session
    const { password: _pw, ...sessionUser } = newUser;
    saveSession(sessionUser);
    setCurrentUser(sessionUser);
    setIsAuthenticated(true);
    return { success: true };
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────────
  const login = useCallback(({ email, password }) => {
    const accounts = getAccounts();
    const found    = accounts.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (!found) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const { password: _pw, ...sessionUser } = found;
    saveSession(sessionUser);
    setCurrentUser(sessionUser);
    setIsAuthenticated(true);
    return { success: true };
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  // ── Update Profile ────────────────────────────────────────────────────────────
  const updateProfile = useCallback((updates) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      saveSession(updated);

      // Also update in accounts list
      const accounts = getAccounts();
      const idx      = accounts.findIndex(a => a.id === updated.id);
      if (idx !== -1) {
        accounts[idx] = { ...accounts[idx], ...updates };
        saveAccounts(accounts);
      }
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      authView, setAuthView,
      register,
      login,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
