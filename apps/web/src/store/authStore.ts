import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "ALUMNI" | "ADMIN" | "RECRUITER";
  profileImage?: string;
  bio?: string;
  department?: string;
  batch?: string;
  verified: boolean;
  reputationPoints: number;
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, token: null })
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token })
    }
  )
);
