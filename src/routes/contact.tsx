import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal, RevealWord } from "@/components/site/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Ryvora — Client Care & Atelier Enquiries" },
      {
        name: "description",
        content:
          "Reach the Ryvora team for order help, sizing advice, wholesale and press enquiries. Client care replies within one business day.",
      },
      { property: "og:title", content: "Contact Ryvora — Client Care & Atelier Enquiries" },
      {
        property: "og:description",
        content: "Order help, sizing advice, wholesale and press enquiries — answered within one business day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const details = [
  { icon: Mail, label: "Client care", value: "care@ryvora.com" },
  { icon: MapPin, label: "Atelier", value: "Rua das Flores 118, Porto, Portugal" },
  { icon: Clock, label: "Hours", value: "Mon–Fri, 09:00–18:00 WET" },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <header className="mx-auto max-w-7xl px-5 pt-40 pb-14 sm:px-8">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-5 text-5xl sm:text-7xl">
          <RevealWord text="Talk to us" onLoad />
        </h1>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Sizing, orders, restocks, wholesale or press — one small team reads every message and replies within one
            business day.
          </p>
        </Reveal>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-5 pb-28 sm:px-8 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              (e.currentTarget as HTMLFormElement).reset();
              toast.success("Message sent — we'll reply within one business day");
            }}
            className="flex flex-col gap-5"
          >
            <label className="flex flex-col gap-2">
              <span className="eyebrow">Name</span>
              <input
                required
                name="name"
                className="border border-input bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="eyebrow">Email</span>
              <input
                required
                type="email"
                name="email"
                className="border border-input bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="eyebrow">Subject</span>
              <select
                name="subject"
                className="border border-input bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
              >
                <option>Order enquiry</option>
                <option>Sizing advice</option>
                <option>Returns</option>
                <option>Wholesale</option>
                <option>Press</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="eyebrow">Message</span>
              <textarea
                required
                name="message"
                rows={5}
                className="border border-input bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-primary px-8 py-4 text-xs tracking-[0.24em] uppercase text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5 sm:w-auto sm:min-w-64"
            >
              Send message
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col gap-8">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="border-t border-border pt-5">
              <p className="eyebrow inline-flex items-center gap-2 text-gold">
                <Icon className="h-3.5 w-3.5" /> {label}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{value}</p>
            </div>
          ))}
          <div className="border-t border-border pt-5">
            <p className="eyebrow text-gold">Shipping</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Worldwide delivery in 3–6 business days, duties included. Free over $200, with 30-day returns on unworn
              pieces.
            </p>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
