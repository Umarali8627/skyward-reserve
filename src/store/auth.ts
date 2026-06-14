import { authApi } from "@/lib/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "customer" | "admin";
export type User = { id: string; username: string; email: string; role: Role };

type AuthState = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (u: User | null) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      async login(email, password) {
        const res = await authApi.login({ email, password });
        const token = res.data.token as string;
        const u = res.data.user as { id: number; username: string; email: string; role: string };
        const role: Role = u.role === "admin" ? "admin" : "customer";
        const user: User = { id: String(u.id), username: u.username, email: u.email, role };
        localStorage.setItem("skyline_token", token);
        set({ user, token });
      },
      async register(username, email, password) {
        await authApi.register({ user_name: username, email, password });
        const res = await authApi.login({ email, password });
        const token = res.data.token as string;
        const u = res.data.user as { id: number; username: string; email: string; role: string };
        const role: Role = u.role === "admin" ? "admin" : "customer";
        const user: User = { id: String(u.id), username: u.username, email: u.email, role };
        localStorage.setItem("skyline_token", token);
        set({ user, token });
      },
      logout() {
        localStorage.removeItem("skyline_token");
        set({ user: null, token: null });
      },
      setUser(user) {
        set({ user });
      },
    }),
    { name: "skyline-auth" },
  ),
);
