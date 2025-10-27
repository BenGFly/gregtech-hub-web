'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  userId: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (userId: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  username: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Recuperar sesión del localStorage
    const savedUserId = localStorage.getItem('gtnh_user_id');
    const savedUsername = localStorage.getItem('gtnh_username');

    if (savedUserId && savedUsername) {
      setUserId(savedUserId);
      setUsername(savedUsername);
    }
    setIsLoading(false);
  }, []);

  const login = (newUserId: string, newUsername: string) => {
    setUserId(newUserId);
    setUsername(newUsername);
    localStorage.setItem('gtnh_user_id', newUserId);
    localStorage.setItem('gtnh_username', newUsername);
  };

  const logout = () => {
    setUserId(null);
    setUsername(null);
    localStorage.removeItem('gtnh_user_id');
    localStorage.removeItem('gtnh_username');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-purple-950 to-zinc-900">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        userId,
        username,
        isAuthenticated: !!userId,
        login,
        logout,
      }}
    >
      {children}
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
