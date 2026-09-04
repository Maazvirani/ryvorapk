import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Marquee } from "@/components/site/Marquee";
import { Reveal, RevealWord } from "@/components/site/Reveal";

import hero from "@/assets/hero.jpg";
import fabric from "@/assets/detail-fabric.jpg";
import lookbook from "@/assets/lookbook.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RYVORA — Pakistani Menswear" },
      { name: "description", content: "RYVORA is a Pakistani menswear brand creating refined formalwear and smart-casual pieces with a confident, modern point of view." },
      { property: "og:title", content: "RYVORA — Pakistani Menswear" },
      { property: "og:description", content: "Refined Pakistani menswear for modern everyday dressing." },
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

      <section ref={heroRef} className="relative h-[100svh] min-h-[620px] overflow-hidden">
        <motion.img
          src={hero}
          alt="RYVORA menswear campaign"
          width={1920}
          height={1080}
          fetchPriority="high"
          style={{ y: imgY }}
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-[118%] w-full object-cover object-center"
        />
        <div className="bg-veil absolute inset-0" />

        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pt-28 pb-16 sm:px-8 sm:pb-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="eyebrow">
            RYVORA — Pakistani Menswear
          </motion.p>
          <h1 className="mt-6 max-w-4xl text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
            <RevealWord text="Modern form." onLoad />
            <br />
            <span className="text-gold"><RevealWord text="Quiet confidence." onLoad /></span>
          </h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
            <Link to="/shop" className="group inline-flex w-fit items-center gap-3 bg-primary px-8 py-4 text-xs tracking-[0.24em] uppercase text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5">
              Shop the collection
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">Refined formalwear and smart-casual menswear, designed in Pakistan.</p>
          </motion.div>
        </motion.div>
      </section>

      <Marquee items={["RYVORA", "Pakistani Menswear", "Formalwear", "Smart Casual", "Made for Modern Men"]} />

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">The collection</p><h2 className="mt-4 text-4xl sm:text-5xl">Four pieces. Nothing extra.</h2></div>
          <Link to="/shop" className="eyebrow inline-flex items-center gap-2 text-gold">All pieces <ArrowRight className="h-3.5 w-3.5" /></Link>
        </Reveal>
        <ProductGrid className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4" limit={4} />
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch lg:grid-cols-2">
          <div className="relative overflow-hidden"><motion.img src={fabric} alt="Close-up fabric detail from RYVORA menswear" loading="lazy" width={1280} height={960} initial={{ scale: 1.15 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} className="h-full min-h-[380px] w-full object-cover" /></div>
          <div className="flex flex-col justify-center gap-8 px-5 py-20 sm:px-14">
            <Reveal><p className="eyebrow">The craft</p><h2 className="mt-4 text-4xl sm:text-5xl">Tailored for a modern Pakistani wardrobe.</h2></Reveal>
            <Reveal delay={0.1}><p className="max-w-lg text-sm leading-relaxed text-muted-foreground">RYVORA focuses on considered silhouettes, refined materials and versatile pieces that move between formal occasions and everyday city life.</p></Reveal>
            <Reveal delay={0.2} className="grid grid-cols-2 gap-8 sm:max-w-lg">
              {[["01", "Refined silhouettes"], ["02", "Modern essentials"], ["03", "Premium feel"], ["04", "Made for Pakistan"]].map(([n, label]) => <div key={label} className="border-t border-border pt-4"><p className="font-display text-4xl text-gold">{n}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>)}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <motion.img src={lookbook} alt="RYVORA menswear lookbook" loading="lazy" width={1600} height={1008} initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} className="h-[70svh] w-full object-cover" />
        <div className="bg-veil absolute inset-0" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-end px-5 pb-16 sm:px-8"><Reveal><p className="eyebrow">Lookbook</p><h2 className="mt-4 max-w-2xl text-4xl sm:text-6xl">RYVORA, in motion.</h2><Link to="/lookbook" className="mt-8 inline-flex items-center gap-3 border border-gold px-7 py-3.5 text-xs tracking-[0.24em] uppercase text-gold transition-colors hover:bg-gold hover:text-primary-foreground">View the series <ArrowRight className="h-4 w-4" /></Link></Reveal></div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:py-32"><Reveal><p className="eyebrow">Stay in the loop</p><h2 className="mt-4 text-4xl sm:text-5xl">The next chapter of RYVORA.</h2><p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground">New collections, editorial stories and early access.</p><form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"><input type="email" required placeholder="your@email.com" aria-label="Email address" className="w-full border border-input bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold" /><button type="submit" className="bg-primary px-7 py-3.5 text-xs tracking-[0.24em] uppercase text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5">Join</button></form></Reveal></section>

      <SiteFooter />
    </div>
  );
}
