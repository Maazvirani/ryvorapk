import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to="/product/$slug" params={{ slug: product.slug }} className="group block">
        <div className="relative overflow-hidden bg-surface">
          <motion.img
            src={product.image}
            alt={`${product.name} in ${product.colorway}`}
            loading="lazy"
            width={1024}
            height={1280}
            className="aspect-4/5 w-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          {product.badge && (
            <span className="absolute left-4 top-4 border border-gold/50 bg-background/70 px-3 py-1 text-[10px] tracking-[0.24em] uppercase text-gold backdrop-blur">
              {product.badge}
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-background/85 py-3 text-center text-[11px] tracking-[0.24em] uppercase text-gold backdrop-blur transition-transform duration-500 group-hover:translate-y-0">
            View piece
          </div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg leading-tight">{product.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{product.colorway}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-foreground">{formatPrice(product.price)}</p>
            {product.compareAt && (
              <p className="text-xs text-muted-foreground line-through">{formatPrice(product.compareAt)}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
