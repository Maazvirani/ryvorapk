import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { startShopifyCheckout } from "@/lib/shopify";
import type { CartLine, StoreProduct, StoreVariant } from "@/lib/store";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  loading: boolean;
  setOpen: (open: boolean) => void;
  addVariant: (product: StoreProduct, variant: StoreVariant, quantity?: number) => void;
  setLineQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  checkout: () => Promise<boolean>;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "ryvora-cart";

function loadCart(): CartLine[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => typeof window === "undefined" ? [] : loadCart());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const persist = (next: CartLine[]) => { setLines(next); try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {} };

  const value = useMemo<CartContextValue>(() => ({
    lines,
    count: lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: lines.reduce((n, l) => n + Number(l.variant.price_pkr) * l.quantity, 0),
    open,
    loading,
    setOpen,
    addVariant: (product, variant, quantity = 1) => {
      const existing = lines.find(l => l.variant.id === variant.id);
      persist(existing ? lines.map(l => l.variant.id === variant.id ? { ...l, quantity: l.quantity + quantity } : l) : [...lines, { id: crypto.randomUUID(), product, variant, quantity }]);
      setOpen(true);
    },
    setLineQuantity: (lineId, quantity) => quantity <= 0 ? persist(lines.filter(l => l.id !== lineId)) : persist(lines.map(l => l.id === lineId ? { ...l, quantity } : l)),
    removeLine: (lineId) => persist(lines.filter(l => l.id !== lineId)),
    checkout: async () => {
      if (!lines.length) return false;
      setLoading(true);
      try {
        const ok = await startShopifyCheckout(lines.map(line => ({ variantId: line.variant.id, quantity: line.quantity })));
        if (ok) setOpen(false);
        return ok;
      } catch (error) {
        console.error(error);
        toast.error("We could not start checkout. Please try again.");
        return false;
      } finally {
        setLoading(false);
      }
    },
  }), [lines, open, loading]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const ctx = useContext(CartContext); if (!ctx) throw new Error("useCart must be used inside CartProvider"); return ctx; }
