import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Reveal, RevealWord } from "@/components/site/Reveal";
import { Marquee } from "@/components/site/Marquee";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Heavyweight Hoodies — Ryvora" },
      {
        name: "description",
        content:
          "Shop the full Ryvora collection of 500 GSM heavyweight hoodies in onyx, bone, espresso and slate. Limited runs of 200 pieces, made in Portugal.",
      },
      { property: "og:title", content: "Shop Heavyweight Hoodies — Ryvora" },
      {
        property: "og:description",
        content: "Four heavyweight hoodie cuts, 200 pieces per colourway, made in Portugal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <header className="mx-auto max-w-7xl px-5 pt-36 pb-14 sm:px-8">
        <p className="eyebrow">Volume 01</p>
        <h1 className="mt-5 text-5xl sm:text-7xl">
          <RevealWord text="The collection" onLoad />
        </h1>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Four heavyweight cuts in the colours we wear ourselves. Each colourway is produced once, in a run of 200,
            and never repeated.
          </p>
        </Reveal>
      </header>
      <Marquee items={["Free worldwide shipping over $200", "Duties included", "30-day returns", "Made in Portugal"]} />
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <ProductGrid className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3" />
      </section>
      <SiteFooter />
    </div>
  );
}
