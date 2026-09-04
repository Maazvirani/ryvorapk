import { Link } from "@tanstack/react-router";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";

import { useCart } from "@/lib/cart";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/lookbook", label: "Lookbook" },
  { to: "/about", label: "Atelier" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const { count, setOpen: setCartOpen } = useCart();

  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? "bg-background/85 backdrop-blur-xl hairline" : "bg-transparent"}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span className="font-display text-xl tracking-[0.32em] text-foreground sm:text-2xl">RYVORA</span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="eyebrow group relative text-foreground/70 transition-colors hover:text-foreground">
              {l.label}
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => setCartOpen(true)} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs tracking-[0.2em] uppercase text-foreground transition-colors hover:border-gold hover:text-gold sm:px-4">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Bag</span> ({count})
          </button>
          <button aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)} className="p-2 text-foreground md:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col px-5 py-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="eyebrow py-4 text-foreground">{l.label}</Link>
            ))}
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
}
