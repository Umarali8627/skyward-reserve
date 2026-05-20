import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/_public/faq")({ component: FAQ });

const items = [
  { q: "How do I book a flight?", a: "Use the search form on the home page, choose your flight, select your seat and pay." },
  { q: "Can I cancel my booking?", a: "Yes, most fares are cancellable from your dashboard. Refund timing depends on the fare class." },
  { q: "How do I check in?", a: "Online check-in opens 24 hours before departure from your bookings page." },
  { q: "Is my payment secure?", a: "All payments are processed over TLS with PCI-DSS compliant providers." },
  { q: "Do you support multi-city trips?", a: "Multi-city support is rolling out soon. For now, book each leg separately." },
  { q: "How do I verify a ticket?", a: "Use the Verify Ticket page with your booking reference or QR code." },
];

function FAQ() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-xs uppercase tracking-[0.2em] text-primary text-center">FAQ</div>
      <h1 className="mt-2 text-4xl font-bold text-center">Questions, answered.</h1>
      <Accordion type="single" collapsible className="mt-10 glass rounded-2xl p-2">
        {items.map((it, i) => (
          <AccordionItem key={i} value={`i${i}`} className="border-b border-border/40 last:border-b-0">
            <AccordionTrigger className="px-4 text-left">{it.q}</AccordionTrigger>
            <AccordionContent className="px-4 text-muted-foreground">{it.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
