import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useMemo } from "react";
import { ArrowLeft, Check, Loader2, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { useCartStore } from "@/stores/cartStore";
import {
  fetchShopifyProductByHandle,
  fetchShopifyProducts,
  formatShopifyPrice,
  getFirstAvailableVariant,
  getPrimaryImage,
  type ShopifyProduct,
} from "@/lib/shopify";

const productQuery = (handle: string) => ({
  queryKey: ["shopify-product", handle],
  queryFn: () => fetchShopifyProductByHandle(handle),
});

const relatedQuery = () => ({
  queryKey: ["shopify-products"],
  queryFn: () => fetchShopifyProducts(50),
});

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(productQuery(params.slug)),
  head: ({ loaderData }) => {
    const p = loaderData as ShopifyProduct | undefined;
    const title = p ? `${p.node.title} — Ryvora` : "Ryvora";
    const description = p
      ? `${p.node.title}. ${p.node.description.slice(0, 120)}...`
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
  const { slug } = Route.useParams();
  const { data: product } = useQuery(productQuery(slug));
  const { data: allProducts = [] } = useQuery(relatedQuery());
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  if (!product) throw notFound();

  const image = getPrimaryImage(product);
  const price = product.node.priceRange.minVariantPrice;
  const sizeOption = product.node.options.find((o) => o.name.toLowerCase() === "size");
  const sizes = sizeOption?.values || [];
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const selectedVariant = useMemo(() => {
    if (!selectedSize) return null;
    return product.node.variants.edges.find((v) =>
      v.node.selectedOptions.some((o) => o.name.toLowerCase() === "size" && o.value === selectedSize),
    )?.node;
  }, [selectedSize, product]);

  const defaultVariant = getFirstAvailableVariant(product);
  const related = allProducts.filter((p) => p.node.handle !== slug).slice(0, 3);

  const handleAddToBag = async () => {
    const variant = selectedVariant || defaultVariant;
    if (!variant) {
      toast.error("This product is unavailable");
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Select a size first");
      return;
    }

    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
      lineId: null,
    });

    toast.success(`${product.node.title} · ${variant.title} added to your bag`);
  };

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
          {image ? (
            <img
              src={image.url}
              alt={image.altText || product.node.title}
              width={1024}
              height={1280}
              className="aspect-4/5 w-full object-cover"
            />
          ) : (
            <div className="flex aspect-4/5 w-full items-center justify-center bg-surface">
              <span className="eyebrow text-muted-foreground">Ryvora</span>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col justify-center">
          <Reveal>
            <h1 className="mt-4 text-4xl sm:text-5xl">{product.node.title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {product.node.variants.edges[0]?.node.title === "Default Title"
                ? "One size"
                : `${product.node.variants.edges.length} variants available`}
            </p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-2xl">{formatShopifyPrice(price.amount, price.currencyCode)}</span>
            </div>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-muted-foreground">{product.node.description}</p>
          </Reveal>

          <Reveal delay={0.1}>
            {sizes.length > 0 && (
              <div className="mt-9">
                <p className="eyebrow">Size — {selectedSize || "Select"}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-14 border px-4 py-3 text-xs tracking-[0.18em] uppercase transition-colors ${
                        selectedSize === s
                          ? "border-gold bg-gold text-primary-foreground"
                          : "border-border text-foreground hover:border-gold hover:text-gold"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToBag}
              disabled={isLoading}
              className="mt-8 flex w-full items-center justify-center bg-primary px-8 py-4 text-xs tracking-[0.24em] uppercase text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto sm:min-w-72"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
              {[
                "500 GSM loopback fleece",
                "Garment dyed, pre-shrunk",
                "Gold-thread emblem at chest",
                "Made in Portugal",
              ].map((spec) => (
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
              <ProductCard key={p.node.handle} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
