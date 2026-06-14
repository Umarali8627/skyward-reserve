import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/about")({ component: About });

function About() {
  const team = [
    {
      name: "Umar Ali",
      role: "Full Stack AI Developer",
      desc: "Built backend architecture and merged frontend",
      edu: "BSCS 6th semester, Northern University Nowshera",
    },
    {
      name: "Rafi Ullah",
      role: "Frontend Developer",
      desc: "Designed frontend pages",
      edu: "BSCS 6th semester, Northern University Nowshera",
    },
    {
      name: "M. Ismail",
      role: "Frontend Developer",
      desc: "Tested frontend pages",
      edu: "BSCS 6th semester, Northern University Nowshera",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-xs uppercase tracking-[0.2em] text-primary">About us</div>
      <h1 className="mt-2 text-4xl md:text-5xl font-bold">We're rebuilding the way the world flies.</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
        SkyLine Air is a next-generation reservation platform connecting travelers with the world's premium carriers through a beautifully designed, lightning-fast experience.
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
        <p>To make air travel feel effortless, transparent and human — from the first search to the final boarding pass.</p>
        <h2>What sets us apart</h2>
        <p>Obsessive attention to design, real-time fare intelligence, and a customer support team that actually answers.</p>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Meet the team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, idx) => {
            const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500'];
            return (
              <div key={member.name} className="glass rounded-2xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className={`h-16 w-16 rounded-full ${colors[idx]} flex items-center justify-center text-white font-bold text-lg`}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="font-bold text-lg">{member.name}</div>
                <div className="text-sm text-primary font-semibold mt-1">{member.role}</div>
                <p className="text-sm text-muted-foreground mt-2">{member.desc}</p>
                <div className="text-xs text-muted-foreground mt-3 border-t border-border/60 pt-3">{member.edu}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
