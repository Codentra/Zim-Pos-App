/**
 * Auth context. Current user + login/logout.
 */
import React, { createContext, useCallback, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "@/lib/domain/types";
import { AUTH_STORAGE_KEY } from "@/constants/auth";
import { loginByPin as loginByPinRepo } from "@/lib/data/repositories/authRepo";

type AuthContextValue = {
  user: User | null;
  isReady: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
  }, []);

  const login = useCallback(async (pin: string): Promise<boolean> => {
    const u = await loginByPinRepo(pin);
    if (!u) return false;
    setUserState(u);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, u.id);
    return true;
  }, []);

  const logout = useCallback(async () => {
    setUserState(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const loadStoredUser = useCallback(async () => {
    try {
      const storedId = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedId) {
        const { getUserById } = await import("@/lib/data/repositories/authRepo");
        const u = await getUserById(storedId);
        if (u) setUserState(u);
        else await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } finally {
      setIsReady(true);
    }
  }, []);

  React.useEffect(() => {
    loadStoredUser();
  }, [loadStoredUser]);

  const value: AuthContextValue = {
    user,
    isReady,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
