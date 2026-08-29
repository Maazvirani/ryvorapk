import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube } from "lucide-react";
import { Reveal } from "./Reveal";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-md">
              <p className="font-display text-4xl tracking-[0.28em]">RYVORA</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Heavyweight essentials, made in limited runs. Cut in Portugal, worn everywhere.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              <div className="flex flex-col gap-3">
                <span className="eyebrow">Shop</span>
                <Link to="/shop" className="text-sm text-muted-foreground hover:text-gold">
                  All hoodies
                </Link>
                <Link to="/lookbook" className="text-sm text-muted-foreground hover:text-gold">
                  Lookbook
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                <span className="eyebrow">Brand</span>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-gold">
                  Atelier
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-gold">
                  Contact
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                <span className="eyebrow">Follow</span>
                <div className="flex gap-4 text-muted-foreground">
                  <Instagram className="h-4 w-4 transition-colors hover:text-gold" />
                  <Twitter className="h-4 w-4 transition-colors hover:text-gold" />
                  <Youtube className="h-4 w-4 transition-colors hover:text-gold" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Ryvora. All rights reserved.</span>
          <span>Prices in USD. Duties included worldwide.</span>
        </div>
      </div>
    </footer>
  );
}
