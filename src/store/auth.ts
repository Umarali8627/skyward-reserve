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

// Mock auth — wires to /auth/* but falls back to local mock so preview works without backend.
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      async login(email, password) {
        // Pretend call. If email contains "admin" => admin role.
        await new Promise((r) => setTimeout(r, 600));
        const role: Role = email.toLowerCase().includes("admin") ? "admin" : "customer";
        const user: User = {
          id: crypto.randomUUID(),
          username: email.split("@")[0],
          email,
          role,
        };
        const token = btoa(`${email}:${Date.now()}`);
        localStorage.setItem("skyline_token", token);
        set({ user, token });
        void password;
      },
      async register(username, email, password) {
        await new Promise((r) => setTimeout(r, 600));
        const role: Role = email.toLowerCase().includes("admin") ? "admin" : "customer";
        const user: User = { id: crypto.randomUUID(), username, email, role };
        const token = btoa(`${email}:${Date.now()}`);
        localStorage.setItem("skyline_token", token);
        set({ user, token });
        void password;
      },
      logout() {
        localStorage.removeItem("skyline_token");
        set({ user: null, token: null });
      },
      setUser(user) { set({ user }); },
    }),
    { name: "skyline-auth" },
  ),
);
