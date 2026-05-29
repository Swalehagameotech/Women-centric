import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AuthModal from '../components/AuthModal';
import { authFetch } from '../utils/api';
import { clearAuth, getStoredUser, isLoggedIn, updateStoredUser } from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loggedIn, setLoggedIn] = useState(() => isLoggedIn());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const pendingActionRef = useRef(null);

  const refreshUser = useCallback(async () => {
    if (!isLoggedIn()) {
      setUser(null);
      setLoggedIn(false);
      return null;
    }

    try {
      const result = await authFetch('/api/auth/me');
      setUser(result.data);
      updateStoredUser(result.data);
      setLoggedIn(true);
      return result.data;
    } catch {
      clearAuth();
      setUser(null);
      setLoggedIn(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn()) {
      refreshUser();
    }
  }, [refreshUser]);

  const openAuth = useCallback((mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthModalOpen(false);
    pendingActionRef.current = null;
  }, []);

  const handleAuthSuccess = useCallback((userData) => {
    setUser(userData);
    setLoggedIn(true);
    setAuthModalOpen(false);

    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      action();
    }
  }, []);

  const signOut = useCallback(() => {
    clearAuth();
    setUser(null);
    setLoggedIn(false);
    pendingActionRef.current = null;
  }, []);

  const requireAuth = useCallback(
    (action, mode = 'login') => {
      if (loggedIn) {
        action();
        return true;
      }

      pendingActionRef.current = action;
      openAuth(mode);
      return false;
    },
    [loggedIn, openAuth],
  );

  const value = useMemo(
    () => ({
      user,
      loggedIn,
      openAuth,
      closeAuth,
      signOut,
      requireAuth,
      refreshUser,
      setUser,
    }),
    [user, loggedIn, openAuth, closeAuth, signOut, requireAuth, refreshUser],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={closeAuth}
        onSuccess={handleAuthSuccess}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
