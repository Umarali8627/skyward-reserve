import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs">
            Premium air reservations engineered for travelers who expect more.
          </p>
        </div>
        <FooterCol title="Explore" items={[
          { label: "Flight search", to: "/flights/search" },
          { label: "Popular destinations", to: "/" },
          { label: "Verify ticket", to: "/verify" },
        ]} />
        <FooterCol title="Company" items={[
          { label: "About us", to: "/about" },
          { label: "Contact", to: "/contact" },
          { label: "FAQ", to: "/faq" },
        ]} />
        <FooterCol title="Account" items={[
          { label: "Sign in", to: "/auth/login" },
          { label: "Register", to: "/auth/register" },
          { label: "Dashboard", to: "/dashboard" },
        ]} />
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SkyLine Air. All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-3">{title}</div>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-muted-foreground hover:text-foreground">{i.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
