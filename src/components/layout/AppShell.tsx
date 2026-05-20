import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { LogOut } from "lucide-react";

export type NavItem = { to: string; label: string; icon: React.ElementType };

export function AppShell({
  items, title, children,
}: { items: NavItem[]; title: string; children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur">
        <div className="p-4 border-b border-border/60"><Link to="/"><Logo /></Link></div>
        <div className="px-3 py-3 text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
        <nav className="flex-1 px-2 space-y-1">
          {items.map((it) => {
            const active = path === it.to || (it.to !== "/" && path.startsWith(it.to));
            return (
              <Link key={it.to} to={it.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "gradient-brand text-white" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}>
                <it.icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border/60 space-y-2">
          {user && (
            <div className="glass rounded-xl p-3">
              <div className="text-sm font-medium truncate">{user.username}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
          )}
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout} className="flex-1 justify-start">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border/60 bg-sidebar/60 backdrop-blur">
          <Link to="/"><Logo /></Link>
          <div className="flex gap-2"><ThemeToggle /><Button size="sm" variant="ghost" onClick={logout}>Logout</Button></div>
        </div>
        <div className="lg:hidden flex gap-1 overflow-x-auto p-2 border-b border-border/60">
          {items.map((it) => {
            const active = path === it.to;
            return (
              <Link key={it.to} to={it.to}
                className={cn("shrink-0 rounded-md px-3 py-1.5 text-xs",
                  active ? "gradient-brand text-white" : "text-muted-foreground hover:text-foreground")}>
                {it.label}
              </Link>
            );
          })}
        </div>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
