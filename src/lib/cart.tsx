import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import {
  addCartLine,
  createCart,
  formatCheckoutUrl,
  getCart,
  removeCartLine,
  updateCartLine,
  type ShopifyCart,
} from "@/lib/shopify";

type CartContextValue = {
  cart: ShopifyCart | null;
  count: number;
  loading: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  addVariant: (variantId: string, quantity?: number) => Promise<void>;
  setLineQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  checkout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "ryvora-cart-id";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const cartId = useRef<string | null>(null);

  const persist = (next: ShopifyCart | null) => {
    setCart(next);
    cartId.current = next?.id ?? null;
    try {
      if (next?.id) localStorage.setItem(STORAGE_KEY, next.id);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  };

  // Restore the Shopify cart on load (and clear it once an order completes).
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (!stored) return;
    cartId.current = stored;
    getCart(stored)
      .then(({ cart: fresh }) => persist(fresh && fresh.totalQuantity > 0 ? fresh : null))
      .catch(() => persist(null));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const run = async (fn: () => Promise<{ cart: ShopifyCart | null; cartNotFound?: boolean }>) => {
      setLoading(true);
      try {
        const { cart: next, cartNotFound } = await fn();
        if (cartNotFound) {
          persist(null);
          toast.error("Your bag expired — please add the item again");
          return;
        }
        if (next) persist(next);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong with your bag");
      } finally {
        setLoading(false);
      }
    };

    return {
      cart,
      count: cart?.totalQuantity ?? 0,
      loading,
      open,
      setOpen,
      addVariant: async (variantId, quantity = 1) => {
        const id = cartId.current;
        await run(() => (id ? addCartLine(id, variantId, quantity) : createCart(variantId, quantity)));
      },
      setLineQuantity: async (lineId, quantity) => {
        const id = cartId.current;
        if (!id) return;
        if (quantity <= 0) {
          await run(() => removeCartLine(id, lineId));
          return;
        }
        await run(() => updateCartLine(id, lineId, quantity));
      },
      removeLine: async (lineId) => {
        const id = cartId.current;
        if (!id) return;
        await run(() => removeCartLine(id, lineId));
      },
      checkout: () => {
        if (!cart?.checkoutUrl) return;
        window.open(formatCheckoutUrl(cart.checkoutUrl), "_blank");
        setOpen(false);
      },
    };
  }, [cart, loading, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
