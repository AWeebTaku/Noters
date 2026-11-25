/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "../lib/axios";
import type { User } from "../types";

type Auth = {
  user: User | null | undefined; // undefined = still checking the session
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    api
      .get<User>("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const value: Auth = {
    user,
    login: async (email, password) => {
      setUser((await api.post<User>("/auth/login", { email, password })).data);
    },
    register: async (email, password) => {
      setUser((await api.post<User>("/auth/register", { email, password })).data);
    },
    logout: async () => {
      await api.post("/auth/logout");
      setUser(null);
    },
  };
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
