import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AUTH_TOKEN_KEY = 'scan2invoice_token';
const AUTH_USER_KEY = 'scan2invoice_user';
const AuthContext = createContext(null);

function getStoredUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null));
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  const login = (authToken, profile) => {
    setToken(authToken);
    setUser(profile);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      window.localStorage.removeItem(AUTH_USER_KEY);
      window.location.href = '/login';
    }
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
