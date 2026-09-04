import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabaseConfig";
import productOnyx from "@/assets/product-onyx.jpg";
import productBone from "@/assets/product-bone.jpg";
import productEspresso from "@/assets/product-espresso.jpg";
import productSlate from "@/assets/product-slate.jpg";
import hero from "@/assets/hero.jpg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

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

export async function fetchProducts(first = 24): Promise<StoreProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id,title,handle,description,image_key,price_pkr,compare_at_price_pkr,product_variants(id,title,available_for_sale,stock_quantity,price_pkr)")
    .eq("published", true)
    .order("created_at", { ascending: true })
    .limit(first);
  if (error) throw error;
  return (data ?? []) as StoreProduct[];
}

export async function fetchProductByHandle(handle: string): Promise<StoreProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select("id,title,handle,description,image_key,price_pkr,compare_at_price_pkr,product_variants(id,title,available_for_sale,stock_quantity,price_pkr)")
    .eq("handle", handle)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as StoreProduct | null;
}

export function productImage(key: string | null) {
  const images: Record<string, string> = {
    "product-onyx": productOnyx,
    "product-bone": productBone,
    "product-espresso": productEspresso,
    "product-slate": productSlate,
  };
  return key ? images[key] ?? hero : hero;
}

export function formatMoney(amount: string | number, currency = "PKR") {
  const value = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-PK", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export type CartLine = { id: string; product: StoreProduct; variant: StoreVariant; quantity: number };

export async function createOrder(customer: { name: string; email: string; phone: string; address: string; city: string; notes?: string }, lines: CartLine[]) {
  if (!lines.length) throw new Error("Your cart is empty.");

  const subtotal = lines.reduce((sum, line) => sum + Number(line.variant.price_pkr) * line.quantity, 0);
  const orderId = crypto.randomUUID();

  // Do not request the inserted order back with .select(): public checkout intentionally
  // has no SELECT access to customer orders. Generate the UUID client-side instead.
  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    customer_name: customer.name,
    email: customer.email || null,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    notes: customer.notes || null,
    subtotal_pkr: subtotal,
    status: "pending",
  });
  if (orderError) throw orderError;

  const items = lines.map((line) => ({
    order_id: orderId,
    product_id: line.product.id,
    variant_id: line.variant.id,
    product_title: line.product.title,
    variant_title: line.variant.title,
    quantity: line.quantity,
    unit_price_pkr: line.variant.price_pkr,
  }));

  const { error: itemError } = await supabase.from("order_items").insert(items);
  if (itemError) throw itemError;

  return { id: orderId, subtotal };
}

export const productsQueryOptions = {
  queryKey: ["supabase", "products"] as const,
  queryFn: () => fetchProducts(),
  staleTime: 5 * 60 * 1000,
};

export const productQueryOptions = (handle: string) => ({
  queryKey: ["supabase", "product", handle] as const,
  queryFn: () => fetchProductByHandle(handle),
  staleTime: 5 * 60 * 1000,
});
