import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-9 w-9 shrink-0">
        <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="skylineGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--brand-blue)" />
              <stop offset="100%" stopColor="var(--brand-purple)" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#skylineGrad)" />
          <path
            d="M9 24 L20 10 L31 24 L24.5 24 L20 18 L15.5 24 Z M11 28 H29"
            fill="white"
            stroke="white"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showText && (
        <div className="leading-none">
          <div className="text-base font-semibold tracking-tight">
            Sky<span className="text-gradient-brand">Line</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Air Reservations
          </div>
        </div>
      )}
    </div>
  );
}
