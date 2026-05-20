import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

export const Route = createFileRoute("/auth")({ component: AuthLayout });

function AuthLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="relative hidden md:block overflow-hidden gradient-brand">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative h-full flex flex-col p-10 text-white">
          <Link to="/"><Logo /></Link>
          <div className="flex-1 grid place-items-center text-center">
            <div className="max-w-sm">
              <h2 className="text-4xl font-bold leading-tight">Your next journey starts here.</h2>
              <p className="mt-4 text-white/80">Join millions exploring the world with SkyLine Air's premium reservation experience.</p>
            </div>
          </div>
          <div className="text-xs text-white/60">© {new Date().getFullYear()} SkyLine Air</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="p-6 md:hidden"><Link to="/"><Logo /></Link></div>
        <div className="flex-1 grid place-items-center p-6">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
