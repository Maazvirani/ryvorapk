import type { ShopifyProduct } from "@/lib/shopify";

export type Product = ShopifyProduct;

export function productTitle(product: Product) {
  return product.node.title;
}

export function productHandle(product: Product) {
  return product.node.handle;
}

export function productPrice(product: Product) {
  return parseFloat(product.node.priceRange.minVariantPrice.amount);
}

export function formatPrice(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}
