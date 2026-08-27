import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { formatShopifyPrice, getPrimaryImage, type ShopifyProduct } from "@/lib/shopify";

export function ProductCard({ product, index = 0 }: { product: ShopifyProduct; index?: number }) {
  const image = getPrimaryImage(product);
  const price = product.node.priceRange.minVariantPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to="/product/$slug" params={{ slug: product.node.handle }} className="group block">
        <div className="relative overflow-hidden bg-surface">
          {image ? (
            <motion.img
              src={image.url}
              alt={image.altText || product.node.title}
              loading="lazy"
              width={1024}
              height={1280}
              className="aspect-4/5 w-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <div className="flex aspect-4/5 w-full items-center justify-center bg-surface">
              <span className="eyebrow text-muted-foreground">Ryvora</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-background/85 py-3 text-center text-[11px] tracking-[0.24em] uppercase text-gold backdrop-blur transition-transform duration-500 group-hover:translate-y-0">
            View piece
          </div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg leading-tight">{product.node.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {product.node.variants.edges[0]?.node.title === "Default Title"
                ? "One size"
                : product.node.variants.edges.map((v) => v.node.title).join(" · ")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-foreground">{formatShopifyPrice(price.amount, price.currencyCode)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
