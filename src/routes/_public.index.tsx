import { createFileRoute, Link } from "@tanstack/react-router";
import { FlightSearchForm } from "@/components/flights/FlightSearchForm";
import { AvailableFlightsList } from "@/components/flights/AvailableFlightsList";
import { fetchAirports, type Airport } from "@/lib/lookups";
import { motion } from "motion/react";
import { ShieldCheck, Sparkles, Globe2, Plane, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_public/")({
  component: Home,
});

function Home() {
  const [showAvailableFlights, setShowAvailableFlights] = useState(false);
  const [airports, setAirports] = useState<Airport[]>([]);

  useEffect(() => {
    let alive = true;
    fetchAirports()
      .then((items) => {
        if (alive) setAirports(items.slice(0, 6));
      })
      .catch(() => {
        if (alive) setAirports([]);
      });

    return () => {
      alive = false;
    };
  }, []);

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

          {/* Available Flights Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 max-w-5xl mx-auto flex justify-center"
          >
            <Button
              variant={showAvailableFlights ? "default" : "outline"}
              onClick={() => setShowAvailableFlights((visible) => !visible)}
              className={showAvailableFlights ? "gradient-brand text-white border-0" : ""}
              aria-expanded={showAvailableFlights}
            >
              <Plane className="h-4 w-4 mr-2" />
              {showAvailableFlights ? "Hide Available Flights" : "View Available Flights"}
            </Button>
          </motion.div>

          {/* Available Flights Section */}
          {showAvailableFlights && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 max-w-5xl mx-auto"
            >
              <SectionHeader
                eyebrow="All Flights"
                title="Available Flights"
                subtitle="Browse all available flights with detailed route information."
              />
              <div className="mt-8">
                <AvailableFlightsList />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Popular destinations */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24 relative">
        <SectionHeader eyebrow="Network" title="Available destinations" subtitle="Destinations loaded from your backend airport routes." />
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {airports.length === 0 ? (
            <div className="col-span-full glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
              No airport data available from the backend yet.
            </div>
          ) : airports.map((airport, i) => (
            <motion.div
              key={airport.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative min-h-44 rounded-2xl overflow-hidden border border-border/60 glass p-5"
            >
              <div className="grid place-items-center h-11 w-11 rounded-xl gradient-brand text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="mt-5">
                <div className="text-sm font-semibold">{airport.city || airport.name}</div>
                <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{airport.name}</div>
              </div>
              <div className="absolute top-3 right-3 text-[10px] font-mono text-muted-foreground">{airport.country}</div>
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
