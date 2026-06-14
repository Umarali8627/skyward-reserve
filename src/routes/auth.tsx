import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { motion } from "motion/react";
import { Plane } from "lucide-react";

export const Route = createFileRoute("/auth")({ component: AuthLayout });

function AuthLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="relative hidden md:block overflow-hidden gradient-brand">
        <div className="absolute inset-0 grid-bg opacity-20" />
        {/* Floating animated orbs */}
        <motion.div
          aria-hidden
          className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-primary/30 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Drifting plane */}
        <motion.div
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 text-white/30"
          initial={{ x: "-15%" }}
          animate={{ x: "115%" }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          <Plane className="h-10 w-10 rotate-12" />
        </motion.div>

        <div className="relative h-full flex flex-col p-10 text-white">
          <Link to="/"><Logo /></Link>
          <div className="flex-1 grid place-items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-sm"
            >
              <h2 className="text-4xl font-bold leading-tight">Your next journey starts here.</h2>
              <p className="mt-4 text-white/80">
                Join millions exploring the world with SkyLine Air's premium reservation experience.
              </p>
            </motion.div>
          </div>
          <div className="text-xs text-white/60">© {new Date().getFullYear()} SkyLine Air</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="p-6 md:hidden"><Link to="/"><Logo /></Link></div>
        <div className="flex-1 grid place-items-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
