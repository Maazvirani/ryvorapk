import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ProductCard } from "@/components/site/ProductCard";
import { Marquee } from "@/components/site/Marquee";
import { Reveal, RevealWord } from "@/components/site/Reveal";
import { products } from "@/lib/products";
import hero from "@/assets/hero.jpg";
import fabric from "@/assets/detail-fabric.jpg";
import lookbook from "@/assets/lookbook.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ryvora — Heavyweight Hoodies, Made in Limited Runs" },
      {
        name: "description",
        content:
          "Ryvora crafts 500 GSM heavyweight hoodies in Portugal. Noir-and-gold essentials cut in limited runs, shipped worldwide with duties included.",
      },
      { property: "og:title", content: "Ryvora — Heavyweight Hoodies, Made in Limited Runs" },
      {
        property: "og:description",
        content: "500 GSM heavyweight hoodies, cut in Portugal in limited runs. Shop the Ryvora collection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section ref={heroRef} className="relative h-[100svh] overflow-hidden">
        <motion.img
          src={hero}
          alt="Model wearing the Ryvora Onyx heavyweight hoodie under gold studio light"
          width={1600}
          height={1920}
          style={{ y: imgY }}
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-[118%] w-full object-cover object-center"
        />
        <div className="bg-veil absolute inset-0" />

        <motion.div
          style={{ y: textY, opacity: fade }}
          className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-20 sm:px-8"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="eyebrow"
          >
            Volume 01 — Heavyweight
          </motion.p>
          <h1 className="mt-6 max-w-4xl text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
            <RevealWord text="Weight you can" onLoad />
            <br />
            <span className="text-gold">
              <RevealWord text="feel." onLoad />
            </span>
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center"
          >
            <Link
              to="/shop"
              className="group inline-flex w-fit items-center gap-3 bg-primary px-8 py-4 text-xs tracking-[0.24em] uppercase text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5"
            >
              Shop the collection
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              500 GSM fleece. Garment dyed. 4 colourways, 200 pieces each.
            </p>
          </motion.div>
        </motion.div>
      </section>

      <Marquee
        items={["500 GSM Fleece", "Made in Portugal", "Limited Runs of 200", "Duties Included", "Free Returns 30 Days"]}
      />

      {/* Collection */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">The collection</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">Four cuts. Nothing extra.</h2>
          </div>
          <Link to="/shop" className="eyebrow inline-flex items-center gap-2 text-gold">
            All pieces <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Craft split */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch lg:grid-cols-2">
          <div className="relative overflow-hidden">
            <motion.img
              src={fabric}
              alt="Macro detail of Ryvora heavyweight black fleece with gold embroidered emblem"
              loading="lazy"
              width={1280}
              height={960}
              initial={{ scale: 1.15 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full min-h-[380px] w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-8 px-5 py-20 sm:px-14">
            <Reveal>
              <p className="eyebrow">The craft</p>
              <h2 className="mt-4 text-4xl sm:text-5xl">Built like outerwear, worn like a second skin.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                Every Ryvora piece starts as long-staple cotton spun into 500 GSM loopback fleece, then garment dyed for
                a depth flat-dyed fabric can't hold. Panels are cut single-ply, shoulders are dropped by hand, and the
                emblem is embroidered in real gold thread — one machine, one operator, 40 pieces a day.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="grid grid-cols-2 gap-8 sm:max-w-lg">
              {[
                ["500", "GSM fleece weight"],
                ["200", "Pieces per colourway"],
                ["6", "Weeks per production run"],
                ["1", "Atelier in Porto"],
              ].map(([n, label]) => (
                <div key={label} className="border-t border-border pt-4">
                  <p className="font-display text-4xl text-gold">{n}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Lookbook teaser */}
      <section className="relative overflow-hidden">
        <motion.img
          src={lookbook}
          alt="Two models in Ryvora black and bone hoodies in a concrete interior"
          loading="lazy"
          width={1600}
          height={1008}
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-[70svh] w-full object-cover"
        />
        <div className="bg-veil absolute inset-0" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-end px-5 pb-16 sm:px-8">
          <Reveal>
            <p className="eyebrow">Lookbook</p>
            <h2 className="mt-4 max-w-2xl text-4xl sm:text-6xl">Porto, 06:40</h2>
            <Link
              to="/lookbook"
              className="mt-8 inline-flex items-center gap-3 border border-gold px-7 py-3.5 text-xs tracking-[0.24em] uppercase text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
            >
              View the series
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:py-32">
        <Reveal>
          <p className="eyebrow">Next drop</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Volume 02 lands in October.</h2>
          <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground">
            200 pieces per colourway. Early access opens 48 hours before public release.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              aria-label="Email address"
              className="w-full border border-input bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold"
            />
            <button
              type="submit"
              className="bg-primary px-7 py-3.5 text-xs tracking-[0.24em] uppercase text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5"
            >
              Join
            </button>
          </form>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
