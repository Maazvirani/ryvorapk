import productOnyx from "@/assets/product-onyx.jpg";
import productBone from "@/assets/product-bone.jpg";
import productEspresso from "@/assets/product-espresso.jpg";
import productSlate from "@/assets/product-slate.jpg";
import hero from "@/assets/hero.jpg";
import { getSupabase } from "@/lib/supabaseClient";
import {
  fetchProducts as fetchShopifyProducts,
  fetchProductByHandle as fetchShopifyProductByHandle,
  formatMoney as formatShopifyMoney,
  productsQueryOptions as shopifyProductsQueryOptions,
  productQueryOptions as shopifyProductQueryOptions,
  type ShopifyProduct,
  type ShopifyVariant,
} from "@/lib/shopify";

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
      // Exact inventory is managed by Shopify and isn't exposed by the Storefront API here.
      stock_quantity: node.availableForSale ? 1 : 0,
      price_pkr: Number(node.price.amount),
    })),
  };
}

type SupabaseProductRow = {
  id: string;
  title: string;
  handle: string;
  description: string;
  image_key: string | null;
  price_pkr: number | string;
  compare_at_price_pkr: number | string | null;
  product_variants: Array<{
    id: string;
    title: string;
    available_for_sale: boolean;
    stock_quantity: number;
    price_pkr: number | string;
  }>;
};

function toStoreProductFromSupabase(product: SupabaseProductRow): StoreProduct {
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    image_key: product.image_key,
    price_pkr: Number(product.price_pkr),
    compare_at_price_pkr:
      product.compare_at_price_pkr == null ? null : Number(product.compare_at_price_pkr),
    product_variants: (product.product_variants ?? []).map((variant) => ({
      id: variant.id,
      title: variant.title,
      available_for_sale: Boolean(variant.available_for_sale),
      stock_quantity: Number(variant.stock_quantity),
      price_pkr: Number(variant.price_pkr),
    })),
  };
}

async function fetchSupabaseProducts(): Promise<StoreProduct[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,title,handle,description,image_key,price_pkr,compare_at_price_pkr,product_variants(id,title,available_for_sale,stock_quantity,price_pkr)",
    )
    .eq("published", true)
    .order("title");

  if (error) throw error;
  return ((data ?? []) as SupabaseProductRow[]).map(toStoreProductFromSupabase);
}

async function fetchSupabaseProductByHandle(handle: string): Promise<StoreProduct | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,title,handle,description,image_key,price_pkr,compare_at_price_pkr,product_variants(id,title,available_for_sale,stock_quantity,price_pkr)",
    )
    .eq("published", true)
    .eq("handle", handle)
    .maybeSingle();

  if (error) throw error;
  return data ? toStoreProductFromSupabase(data as SupabaseProductRow) : null;
}

export async function fetchProducts(first = 24): Promise<StoreProduct[]> {
  try {
    const products = await fetchShopifyProducts(first);
    if (products.length) return products.map(toStoreProduct);
  } catch (error) {
    console.warn("Shopify catalog unavailable; using the RYVORA catalog fallback.", error);
  }

  return fetchSupabaseProducts();
}

export async function fetchProductByHandle(handle: string): Promise<StoreProduct | null> {
  try {
    const product = await fetchShopifyProductByHandle(handle);
    if (product) return toStoreProduct(product);
  } catch (error) {
    console.warn("Shopify product unavailable; using the RYVORA catalog fallback.", error);
  }

  return fetchSupabaseProductByHandle(handle);
}

export function productImage(imageUrl: string | null) {
  if (!imageUrl) return hero;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  const images: Record<string, string> = {
    "product-onyx": productOnyx,
    "product-bone": productBone,
    "product-espresso": productEspresso,
    "product-slate": productSlate,
  };

  return images[imageUrl] ?? hero;
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
