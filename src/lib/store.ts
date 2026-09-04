import { fetchProducts as fetchShopifyProducts, fetchProductByHandle as fetchShopifyProductByHandle, formatMoney as formatShopifyMoney, productsQueryOptions as shopifyProductsQueryOptions, productQueryOptions as shopifyProductQueryOptions, type ShopifyProduct, type ShopifyVariant } from "@/lib/shopify";

export type StoreVariant = {
  id: string;
  title: string;
  available_for_sale: boolean;
  stock_quantity: number;
  price_pkr: number;
};

export type StoreProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  image_key: string | null;
  price_pkr: number;
  compare_at_price_pkr: number | null;
  product_variants: StoreVariant[];
};

export type CartLine = {
  id: string;
  product: StoreProduct;
  variant: StoreVariant;
  quantity: number;
};

function toStoreProduct(product: ShopifyProduct): StoreProduct {
  const image = product.images.edges[0]?.node.url ?? null;
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    image_key: image,
    price_pkr: Number(product.priceRange.minVariantPrice.amount),
    compare_at_price_pkr: product.compareAtPriceRange?.minVariantPrice?.amount
      ? Number(product.compareAtPriceRange.minVariantPrice.amount)
      : null,
    product_variants: product.variants.edges.map(({ node }: { node: ShopifyVariant }) => ({
      id: node.id,
      title: node.title,
      available_for_sale: node.availableForSale,
      // Inventory is owned by Shopify. Storefront API intentionally does not expose exact stock here.
      stock_quantity: node.availableForSale ? 1 : 0,
      price_pkr: Number(node.price.amount),
    })),
  };
}

export async function fetchProducts(first = 24): Promise<StoreProduct[]> {
  const products = await fetchShopifyProducts(first);
  return products.map(toStoreProduct);
}

export async function fetchProductByHandle(handle: string): Promise<StoreProduct | null> {
  const product = await fetchShopifyProductByHandle(handle);
  return product ? toStoreProduct(product) : null;
}

export function productImage(imageUrl: string | null) {
  return imageUrl ?? "";
}

export function formatMoney(amount: string | number, currency = "PKR") {
  return formatShopifyMoney(amount, currency);
}

export const productsQueryOptions = {
  ...shopifyProductsQueryOptions,
  queryFn: () => fetchProducts(),
};

export const productQueryOptions = (handle: string) => ({
  ...shopifyProductQueryOptions(handle),
  queryFn: () => fetchProductByHandle(handle),
});
