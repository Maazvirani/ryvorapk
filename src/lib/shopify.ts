import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2026-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "pcwun0-sm.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

// Public Storefront API requests can use Shopify's tokenless access for products and cart.
// Keep the token optional so checkout does not depend on a deployment secret.
const SHOPIFY_STOREFRONT_TOKEN = (import.meta.env["VITE_SHOPIFY_STOREFRONT_TOKEN"] as string | undefined)?.trim() ?? "";

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  selectedOptions: Array<{ name: string; value: string }>;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: ShopifyVariant }> };
  options: Array<{ name: string; values: string[] }>;
};

export async function storefrontApiRequest<T = any>(query: string, variables: Record<string, unknown> = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (SHOPIFY_STOREFRONT_TOKEN) headers["X-Shopify-Storefront-Access-Token"] = SHOPIFY_STOREFRONT_TOKEN;

  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Shopify request failed [${response.status}]: ${body}`);
  }

  const json = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(", "));
  return json;
}

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText } } }
  variants(first: 20) {
    edges {
      node {
        id
        title
        availableForSale
        price { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
  options { name values }
`;

const PRODUCTS_QUERY = `query GetProducts($first: Int!) { products(first: $first) { edges { node { ${PRODUCT_FIELDS} } } } }`;
const PRODUCT_BY_HANDLE_QUERY = `query GetProduct($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`;

export async function fetchProducts(first = 24): Promise<ShopifyProduct[]> {
  const res = await storefrontApiRequest<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(PRODUCTS_QUERY, { first });
  return res?.data?.products.edges.map((e) => e.node) ?? [];
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const res = await storefrontApiRequest<{ product: ShopifyProduct | null }>(PRODUCT_BY_HANDLE_QUERY, { handle });
  return res?.data?.product ?? null;
}

export const productsQueryOptions = {
  queryKey: ["shopify", "products"] as const,
  queryFn: () => fetchProducts(),
  staleTime: 5 * 60 * 1000,
};

export const productQueryOptions = (handle: string) => ({
  queryKey: ["shopify", "product", handle] as const,
  queryFn: () => fetchProductByHandle(handle),
  staleTime: 5 * 60 * 1000,
});

export function formatMoney(amount: string | number, currencyCode = "PKR") {
  const value = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  try {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currencyCode} ${value.toFixed(0)}`;
  }
}

export type ShopifyCheckoutLine = { variantId: string; quantity: number };

const CART_CREATE = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
      warnings { code message }
    }
  }
`;

export async function createShopifyCheckout(lines: ShopifyCheckoutLine[]): Promise<string | null> {
  const validLines = lines.filter((line) => line.variantId && line.quantity > 0);
  if (!validLines.length) throw new Error("Your cart is empty.");

  const res = await storefrontApiRequest<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: Array<{ field: string[] | null; message: string }>;
      warnings: Array<{ code: string; message: string }>;
    };
  }>(CART_CREATE, {
    input: {
      lines: validLines.map((line) => ({ merchandiseId: line.variantId, quantity: line.quantity })),
    },
  });

  const payload = res?.data?.cartCreate;
  if (!payload) throw new Error("Shopify did not return a checkout.");
  if (payload.userErrors.length) throw new Error(payload.userErrors.map((e) => e.message).join(", "));
  if (!payload.cart?.checkoutUrl) throw new Error("Shopify did not return a checkout URL.");

  return payload.cart.checkoutUrl;
}

export async function startShopifyCheckout(lines: ShopifyCheckoutLine[]) {
  try {
    const checkoutUrl = await createShopifyCheckout(lines);
    if (!checkoutUrl) return false;
    window.location.assign(checkoutUrl);
    return true;
  } catch (error) {
    console.error("Shopify checkout error:", error);
    toast.error("Checkout could not be started", {
      description: error instanceof Error ? error.message : "Please try again.",
    });
    return false;
  }
}
