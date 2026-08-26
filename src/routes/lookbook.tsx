import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal, RevealWord } from "@/components/site/Reveal";
import hero from "@/assets/hero.jpg";
import lookbook from "@/assets/lookbook.jpg";
import fabric from "@/assets/detail-fabric.jpg";
import onyx from "@/assets/product-onyx.jpg";
import bone from "@/assets/product-bone.jpg";

const frames = [
  { src: lookbook, alt: "Two models in Ryvora hoodies in a concrete interior", caption: "Frame 01 — Porto, 06:40", wide: true },
  { src: hero, alt: "Model in the Onyx heavyweight hoodie under gold light", caption: "Frame 02 — Studio light" },
  { src: fabric, alt: "Macro detail of gold embroidered emblem on black fleece", caption: "Frame 03 — Gold thread" },
  { src: onyx, alt: "Onyx heavyweight hoodie", caption: "Frame 04 — Onyx" },
  { src: bone, alt: "Bone atelier hoodie", caption: "Frame 05 — Bone" },
];

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "Lookbook — Ryvora Volume 01" },
      {
        name: "description",
        content:
          "The Ryvora Volume 01 lookbook: heavyweight hoodies photographed in Porto concrete and gold studio light.",
      },
      { property: "og:title", content: "Lookbook — Ryvora Volume 01" },
      { property: "og:description", content: "Heavyweight hoodies shot in Porto concrete and gold studio light." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Lookbook,
});

function Lookbook() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <header className="mx-auto max-w-7xl px-5 pt-36 pb-14 sm:px-8">
        <p className="eyebrow">Volume 01 series</p>
        <h1 className="mt-5 text-5xl sm:text-7xl">
          <RevealWord text="Porto, 06:40" onLoad />
        </h1>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 pb-24 sm:grid-cols-2 sm:px-8">
        {frames.map((f, i) => (
          <motion.figure
            key={f.caption}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={f.wide ? "sm:col-span-2" : undefined}
          >
            <div className="group overflow-hidden bg-surface">
              <img
                src={f.src}
                alt={f.alt}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105 ${
                  f.wide ? "aspect-16/9" : "aspect-4/5"
                }`}
              />
            </div>
            <figcaption className="eyebrow mt-3">{f.caption}</figcaption>
          </motion.figure>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-28 text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl">Wear the series.</h2>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center border border-gold px-8 py-3.5 text-xs tracking-[0.24em] uppercase text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
          >
            Shop Volume 01
          </Link>
        </Reveal>
      </section>
      <SiteFooter />
    </div>
  );
}
