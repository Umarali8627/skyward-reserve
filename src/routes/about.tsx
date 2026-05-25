import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";

export const Route = createFileRoute("/about")({ component: About });

const team = [
  {
    initials: "UA",
    name: "Umar Ali",
    role: "Full Stack AI Developer",
    bio: "Built backend architecture and merged frontend.",
    school: "BSCS 6th semester, Northern University Nowshera",
    gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  },
  {
    initials: "RU",
    name: "Rafi Ullah",
    role: "Frontend Developer",
    bio: "Designed frontend pages.",
    school: "BSCS 6th semester, Northern University Nowshera",
    gradient: "linear-gradient(135deg,#0ea5e9,#6366f1)",
  },
  {
    initials: "MI",
    name: "M. Ismail",
    role: "Frontend Developer",
    bio: "Tested frontend pages.",
    school: "BSCS 6th semester, Northern University Nowshera",
    gradient: "linear-gradient(135deg,#ec4899,#8b5cf6)",
  },
];

function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-xs uppercase tracking-[0.2em] text-primary">About us</div>
      <h1 className="mt-2 text-4xl md:text-5xl font-bold">
        We're rebuilding the way the world flies.
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
        SkyLine Air is a next-generation reservation platform connecting travelers with the world's
        premium carriers through a beautifully designed, lightning-fast experience.
      </p>

      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {[
          { k: "2.4M+", v: "Happy travelers" },
          { k: "600+", v: "Destinations" },
          { k: "120+", v: "Airline partners" },
        ].map((s) => (
          <div key={s.k} className="glass rounded-2xl p-8">
            <div className="text-4xl font-bold text-gradient-brand">{s.k}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-16 prose dark:prose-invert max-w-none">
        <h2>Our mission</h2>
        <p>
          To make air travel feel effortless, transparent and human — from the first search to the
          final boarding pass.
        </p>
        <h2>What sets us apart</h2>
        <p>
          Obsessive attention to design, real-time fare intelligence, and a customer support team
          that actually answers.
        </p>
      </div>

      {/* Meet the team */}
      <section className="mt-20">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Our people</div>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold">Meet the team</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          The builders behind SkyLine Air.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 transition-shadow hover:shadow-xl hover:shadow-primary/10 border-border/60"
            >
              <div
                className="grid place-items-center h-16 w-16 rounded-2xl text-white text-lg font-semibold"
                style={{ background: m.gradient }}
              >
                {m.initials}
              </div>
              <div className="mt-4 text-lg font-semibold">{m.name}</div>
              <div className="text-sm text-primary">{m.role}</div>
              <p className="mt-3 text-sm text-muted-foreground">{m.bio}</p>
              <div className="mt-4 pt-4 border-t border-border/60 text-xs text-muted-foreground">
                {m.school}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
