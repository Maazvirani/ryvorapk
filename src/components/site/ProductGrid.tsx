import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { productsQueryOptions } from "@/lib/store";

export function ProductGrid({ className, limit }: { className?: string; limit?: number }) {
  const { data, isLoading, isError } = useQuery(productsQueryOptions);
  const products = limit ? (data ?? []).slice(0, limit) : (data ?? []);

  if (isLoading) {
    return (
      <div className={className}>
        {Array.from({ length: limit ?? 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-4/5 w-full bg-surface" />
            <div className="mt-4 h-4 w-2/3 bg-surface" />
            <div className="mt-2 h-3 w-1/3 bg-surface" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || products.length === 0) {
    return (
      <div className="border border-border px-6 py-20 text-center">
        <p className="text-sm text-muted-foreground">
          We couldn't load the collection just now. Please refresh.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          The RYVORA catalog is temporarily unavailable. Please try again shortly.
        </p>
        <Link to="/contact" className="eyebrow mt-5 inline-block text-gold">
          Contact us
        </Link>
      </div>
    );
  }

  return (
    <div className={className}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
