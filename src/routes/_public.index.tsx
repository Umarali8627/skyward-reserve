import { createFileRoute, Link } from "@tanstack/react-router";
import { FlightSearchForm } from "@/components/flights/FlightSearchForm";
import { popularDestinations, testimonials } from "@/lib/mockData";
import { motion } from "motion/react";
import { ShieldCheck, Sparkles, Globe2, Star, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";


export const Route = createFileRoute("/_public/")({
  component: Home,
});

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-aurora opacity-80" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-muted-foreground">Now live · 600+ destinations worldwide</span>
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Travel the sky,<br />
              <span className="text-gradient-brand">redefined.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Search, compare and book premium flights across the world's leading airlines — all in one beautifully crafted experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-12 max-w-5xl mx-auto"
          >
            <FlightSearchForm />
          </motion.div>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-12 relative">
        <SectionHeader eyebrow="Inspiration" title="Popular destinations" subtitle="Hand-picked cities our travelers love." />
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularDestinations.map((d, i) => (
            <motion.div
              key={d.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative h-44 rounded-2xl overflow-hidden cursor-pointer border border-border/60"
              style={{ backgroundImage: d.image }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-sm font-semibold">{d.city}</div>
                <div className="text-xs opacity-80">from ${d.price}</div>
              </div>
              <div className="absolute top-3 right-3 text-[10px] font-mono text-white/80">{d.code}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <SectionHeader eyebrow="Why SkyLine" title="Built for the modern traveler" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: Globe2, title: "600+ destinations", text: "Direct integrations with the world's best carriers." },
            { icon: ShieldCheck, title: "Secure & verified", text: "Every booking protected with bank-grade security." },
            { icon: Sparkles, title: "Premium UX", text: "Designed and tuned for delight on every device." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
              <div className="grid place-items-center h-11 w-11 rounded-xl gradient-brand text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-semibold">{f.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <SectionHeader eyebrow="Loved by travelers" title="What our flyers say" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-6">
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-3 text-sm">{t.text}</p>
              <div className="mt-4">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center gradient-brand">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <h2 className="relative text-3xl md:text-4xl font-bold text-white">Ready to take off?</h2>
          <p className="relative mt-3 text-white/80 max-w-xl mx-auto">Create your free SkyLine account and unlock member-only fares.</p>
          <div className="relative mt-6 flex justify-center gap-3">
            <Link to="/auth/register"><Button size="lg" className="bg-white text-primary hover:bg-white/90">Create account</Button></Link>
            <Link to="/flights/search"><Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent">Browse flights</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-start md:items-center text-left md:text-center">
      <div className="text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</div>
      <h2 className="mt-2 text-2xl md:text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
