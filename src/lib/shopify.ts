import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "pcwun0-sm.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "ece33a5f2cce1ee7b2c183ce73fe47d7";

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
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: payment required", {
      description: "Store API access needs an active Shopify billing plan.",
    });
    return null;
  }

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

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) { edges { node { ${PRODUCT_FIELDS} } } }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

export async function fetchProducts(first = 24): Promise<ShopifyProduct[]> {
  const res = await storefrontApiRequest<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(PRODUCTS_QUERY, {
    first,
  });
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

export function formatMoney(amount: string | number, currencyCode = "USD") {
  const value = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currencyCode} ${value.toFixed(0)}`;
  }
}

/* ---------------- Cart (Storefront API) ---------------- */

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            image { url altText }
            product { title handle }
          }
        }
      }
    }
  }
`;

const CART_QUERY = `query cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`;
const CART_CREATE = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) { cart { ${CART_FIELDS} } userErrors { field message } }
  }
`;
const CART_LINES_ADD = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { field message } }
  }
`;
const CART_LINES_UPDATE = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { field message } }
  }
`;
const CART_LINES_REMOVE = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { field message } }
  }
`;

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          image: { url: string; altText: string | null } | null;
          product: { title: string; handle: string };
        };
      };
    }>;
  };
};

export function formatCheckoutUrl(checkoutUrl: string) {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFound(userErrors: Array<{ message: string }> = []) {
  return userErrors.some(
    (e) => e.message.toLowerCase().includes("cart not found") || e.message.toLowerCase().includes("does not exist"),
  );
}

type CartResult = { cart: ShopifyCart | null; cartNotFound?: boolean };

function unwrap(payload: { cart: ShopifyCart | null; userErrors?: Array<{ message: string }> } | undefined): CartResult {
  if (!payload) return { cart: null };
  if (isCartNotFound(payload.userErrors)) return { cart: null, cartNotFound: true };
  if (payload.userErrors?.length) {
    console.error("Shopify cart error:", payload.userErrors);
    return { cart: null };
  }
  return { cart: payload.cart };
}

export async function getCart(cartId: string): Promise<CartResult> {
  const res = await storefrontApiRequest<{ cart: ShopifyCart | null }>(CART_QUERY, { id: cartId });
  return { cart: res?.data?.cart ?? null, cartNotFound: res ? !res.data?.cart : false };
}

export async function createCart(variantId: string, quantity: number): Promise<CartResult> {
  const res = await storefrontApiRequest<{ cartCreate: { cart: ShopifyCart | null; userErrors: any[] } }>(CART_CREATE, {
    input: { lines: [{ merchandiseId: variantId, quantity }] },
  });
  return unwrap(res?.data?.cartCreate);
}

export async function addCartLine(cartId: string, variantId: string, quantity: number): Promise<CartResult> {
  const res = await storefrontApiRequest<{ cartLinesAdd: { cart: ShopifyCart | null; userErrors: any[] } }>(
    CART_LINES_ADD,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] },
  );
  return unwrap(res?.data?.cartLinesAdd);
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<CartResult> {
  const res = await storefrontApiRequest<{ cartLinesUpdate: { cart: ShopifyCart | null; userErrors: any[] } }>(
    CART_LINES_UPDATE,
    { cartId, lines: [{ id: lineId, quantity }] },
  );
  return unwrap(res?.data?.cartLinesUpdate);
}

export async function removeCartLine(cartId: string, lineId: string): Promise<CartResult> {
  const res = await storefrontApiRequest<{ cartLinesRemove: { cart: ShopifyCart | null; userErrors: any[] } }>(
    CART_LINES_REMOVE,
    { cartId, lineIds: [lineId] },
  );
  return unwrap(res?.data?.cartLinesRemove);
}
