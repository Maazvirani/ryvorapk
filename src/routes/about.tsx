import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal, RevealWord } from "@/components/site/Reveal";
import fabric from "@/assets/detail-fabric.jpg";

const chapters = [
  {
    step: "01",
    title: "Yarn",
    body: "Long-staple cotton, ring-spun in Guimarães. Heavier and smoother than standard fleece, chosen so the fabric drapes instead of standing away from the body.",
  },
  {
    step: "02",
    title: "Knit",
    body: "500 GSM loopback fleece knitted slowly on vintage circular machines. Slower knitting means denser loops, which means the shape survives the wash.",
  },
  {
    step: "03",
    title: "Dye",
    body: "Garment dyed after construction for depth and a lived-in hand. Low-impact dyes, closed-loop water, no optical brighteners.",
  },
  {
    step: "04",
    title: "Finish",
    body: "Emblem embroidered in real gold thread, single operator, 40 pieces a day. Every run stops at 200 pieces per colourway.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The Atelier — How Ryvora Is Made" },
      {
        name: "description",
        content:
          "Inside the Ryvora atelier: long-staple cotton, 500 GSM loopback fleece, garment dyeing and gold-thread embroidery, all made in Porto, Portugal.",
      },
      { property: "og:title", content: "The Atelier — How Ryvora Is Made" },
      {
        property: "og:description",
        content: "Yarn, knit, dye, finish — the four stages behind every Ryvora heavyweight hoodie.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <header className="mx-auto max-w-7xl px-5 pt-36 pb-16 sm:px-8">
        <p className="eyebrow">The atelier</p>
        <h1 className="mt-5 max-w-3xl text-5xl sm:text-7xl">
          <RevealWord text="One atelier." onLoad />
          <br />
          <span className="text-gold-gradient">
            <RevealWord text="Four stages." onLoad />
          </span>
        </h1>
      </header>

      <section className="relative overflow-hidden border-y border-border">
        <img
          src={fabric}
          alt="Macro detail of Ryvora heavyweight fleece and gold embroidery"
          loading="lazy"
          width={1280}
          height={960}
          className="h-[46svh] w-full object-cover"
        />
        <div className="bg-veil absolute inset-0" />
      </section>

      <section className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <div className="flex flex-col">
          {chapters.map((c, i) => (
            <Reveal key={c.step} delay={i * 0.05}>
              <div className="grid grid-cols-1 gap-4 border-b border-border py-10 sm:grid-cols-[auto_1fr] sm:gap-12">
                <p className="font-display text-5xl text-gold">{c.step}</p>
                <div>
                  <h2 className="text-3xl">{c.title}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-16 text-center">
            <p className="mx-auto max-w-xl font-display text-2xl leading-snug sm:text-3xl">
              “We would rather make 200 pieces properly than 20,000 quickly.”
            </p>
            <p className="eyebrow mt-5">Ryvora, Porto</p>
            <Link
              to="/shop"
              className="mt-10 inline-flex items-center bg-primary px-8 py-4 text-xs tracking-[0.24em] uppercase text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5"
            >
              Shop the collection
            </Link>
          </div>
        </Reveal>
      </section>
      <SiteFooter />
    </div>
  );
}
