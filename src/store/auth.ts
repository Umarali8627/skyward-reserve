import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/lib/api";

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

function deriveRole(email: string, raw?: any): Role {
  const r = raw?.role ?? raw?.user?.role;
  if (typeof r === "string") return r.toLowerCase() === "admin" ? "admin" : "customer";
  return email.toLowerCase().includes("admin") ? "admin" : "customer";
}

/** Dig a JWT out of whatever shape the backend returns */
function extractToken(data: any): string | null {
  if (data?.access_token) return data.access_token;
  if (data?.token) return data.token;
  if (data?.jwt) return data.jwt;
  if (data?.data?.access_token) return data.data.access_token;
  if (data?.data?.token) return data.data.token;
  if (data?.result?.access_token) return data.result.access_token;
  if (typeof data?.Authorization === "string")
    return data.Authorization.replace(/^Bearer\s+/i, "");
  return null;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      async login(email, password) {
        const res = await authApi.login({ email, password });
        const data: any = res.data ?? {};

        // 🔍 Remove once login is confirmed working
        console.log("[auth] login response:", data);

        const token = extractToken(data);
        if (!token) {
          throw new Error(
            `Login succeeded but no token found. Keys: ${Object.keys(data).join(", ")}`
          );
        }

        const u = data.user ?? data;
        const user: User = {
          id: String(u.user_id ?? u.id ?? u._id ?? crypto.randomUUID()),
          username: u.user_name ?? u.username ?? email.split("@")[0],
          email: u.email ?? email,
          role: deriveRole(email, data),
        };

        localStorage.setItem("skyline_token", token);
        set({ user, token });
      },

      async register(username, email, password) {
        // Backend expects `user_name` (underscore), not `username`
        await authApi.register({ user_name: username, email, password });

        const res = await authApi.login({ email, password });
        const data: any = res.data ?? {};
        const token = extractToken(data);
        if (!token) throw new Error("No token in response after register");

        const u = data.user ?? data;
        const user: User = {
          id: String(u.user_id ?? u.id ?? crypto.randomUUID()),
          username: u.user_name ?? u.username ?? username,
          email: u.email ?? email,
          role: deriveRole(email, data),
        };
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