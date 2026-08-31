import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft, Check, Loader2, Truck } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { formatMoney, productQueryOptions, productsQueryOptions } from "@/lib/shopify";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$slug")({
  head: () => ({
    meta: [
      { title: "Heavyweight Hoodie — Ryvora" },
      {
        name: "description",
        content: "A Ryvora heavyweight hoodie, cut in a limited run. Select your size and checkout securely.",
      },
      { property: "og:title", content: "Heavyweight Hoodie — Ryvora" },
      { property: "og:description", content: "Ryvora heavyweight hoodies, made in limited runs." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useQuery(productQueryOptions(slug));
  const { data: all } = useQuery(productsQueryOptions);
  const [variantId, setVariantId] = useState<string | null>(null);
  const { addVariant, setOpen: setCartOpen, loading } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex min-h-[70svh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center gap-6 px-5 text-center">
          <h1 className="text-4xl">Piece not found</h1>
          <p className="text-sm text-muted-foreground">This piece may have sold out or moved.</p>
          <Link
            to="/shop"
            className="border border-gold px-7 py-3.5 text-xs tracking-[0.24em] uppercase text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
          >
            Back to collection
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const image = product.images.edges[0]?.node;
  const variants = product.variants.edges.map((e) => e.node);
  const selected = variants.find((v) => v.id === variantId) ?? null;
  const price = selected?.price ?? product.priceRange.minVariantPrice;
  const related = (all ?? []).filter((p) => p.handle !== product.handle).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
        <Link to="/shop" className="eyebrow inline-flex items-center gap-2 text-muted-foreground hover:text-gold">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to collection
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden bg-surface"
        >
          {image && (
            <img
              src={image.url}
              alt={image.altText ?? product.title}
              width={1024}
              height={1280}
              className="aspect-4/5 w-full object-cover"
            />
          )}
        </motion.div>

        <div className="flex flex-col justify-center">
          <Reveal>
            <h1 className="mt-4 text-4xl sm:text-5xl">{product.title}</h1>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-2xl">{formatMoney(price.amount, price.currencyCode)}</span>
            </div>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-9">
              <p className="eyebrow">Size</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    disabled={!v.availableForSale}
                    onClick={() => setVariantId(v.id)}
                    className={`min-w-14 border px-4 py-3 text-xs tracking-[0.18em] uppercase transition-colors ${
                      variantId === v.id
                        ? "border-gold bg-gold text-primary-foreground"
                        : "border-border text-foreground hover:border-gold hover:text-gold"
                    } disabled:cursor-not-allowed disabled:opacity-35`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              onClick={async () => {
                if (!selected) {
                  toast.error("Select a size first");
                  return;
                }
                await addVariant(selected.id, 1);
                setCartOpen(true);
                toast.success(`${product.title} · ${selected.title} added to your bag`);
              }}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-primary px-8 py-4 text-xs tracking-[0.24em] uppercase text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto sm:min-w-72"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to bag"}
            </button>

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-gold" /> Tracked worldwide shipping
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-gold" /> 30-day returns
              </span>
            </div>

            <ul className="mt-10 border-t border-border pt-6">
              {["500 GSM loopback fleece", "Garment dyed, pre-shrunk", "Made in limited runs"].map((spec) => (
                <li
                  key={spec}
                  className="flex items-center gap-3 border-b border-border py-3 text-sm text-muted-foreground"
                >
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  {spec}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl">Pairs well with</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
