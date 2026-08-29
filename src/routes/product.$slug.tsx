import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft, Check, Truck } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { formatPrice, getProduct, products } from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} — Ryvora` : "Ryvora";
    const description = p
      ? `${p.name} in ${p.colorway}. ${p.subtitle}. ${formatPrice(p.price)}, limited run of 200 pieces, made in Portugal.`
      : "Heavyweight hoodies made in limited runs.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [size, setSize] = useState<string | null>(null);
  const { addLine, setOpen: setCartOpen } = useCart();
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

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
          <img
            src={product.image}
            alt={`${product.name} in ${product.colorway}`}
            width={1024}
            height={1280}
            className="aspect-4/5 w-full object-cover"
          />
        </motion.div>

        <div className="flex flex-col justify-center">
          <Reveal>
            {product.badge && <p className="eyebrow text-gold">{product.badge}</p>}
            <h1 className="mt-4 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-sm text-muted-foreground">{product.subtitle}</p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-2xl">{formatPrice(product.price)}</span>
              {product.compareAt && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compareAt)}</span>
              )}
            </div>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-9">
              <p className="eyebrow">Size — {product.colorway}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-14 border px-4 py-3 text-xs tracking-[0.18em] uppercase transition-colors ${
                      size === s
                        ? "border-gold bg-gold text-primary-foreground"
                        : "border-border text-foreground hover:border-gold hover:text-gold"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (!size) {
                  toast.error("Select a size first");
                  return;
                }
                addLine({
                  slug: product.slug,
                  name: product.name,
                  size,
                  price: product.price,
                  image: product.image,
                  colorway: product.colorway,
                });
                setCartOpen(true);
                toast.success(`${product.name} · ${size} added to your bag`);
              }}
              className="mt-8 w-full bg-primary px-8 py-4 text-xs tracking-[0.24em] uppercase text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5 sm:w-auto sm:min-w-72"
            >
              Add to bag
            </button>

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-gold" /> Free shipping over $200
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-gold" /> 30-day returns
              </span>
            </div>

            <ul className="mt-10 border-t border-border pt-6">
              {product.specs.map((spec) => (
                <li key={spec} className="flex items-center gap-3 border-b border-border py-3 text-sm text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  {spec}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl">Pairs well with</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {related.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
