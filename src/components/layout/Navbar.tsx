import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/flights/search", label: "Flights" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
  { to: "/verify", label: "Verify Ticket" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 w-full glass-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center"><Logo /></Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                path === l.to ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Link to={user.role === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="secondary" size="sm">{user.role === "admin" ? "Admin" : "Dashboard"}</Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/auth/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link to="/auth/register">
                <Button size="sm" className="gradient-brand text-white border-0 hover:opacity-90">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/50">
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm hover:bg-secondary">
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <ThemeToggle />
              {user ? (
                <Button variant="secondary" size="sm" onClick={() => { logout(); setOpen(false); }}>Logout</Button>
              ) : (
                <>
                  <Link to="/auth/login" onClick={() => setOpen(false)}><Button variant="ghost" size="sm">Sign in</Button></Link>
                  <Link to="/auth/register" onClick={() => setOpen(false)}>
                    <Button size="sm" className="gradient-brand text-white border-0">Get started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
