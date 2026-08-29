import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = {
  slug: string;
  name: string;
  size: string;
  price: number;
  image: string;
  colorway: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  addLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (slug: string, size: string, quantity: number) => void;
  removeLine: (slug: string, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "ryvora-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore corrupt cart */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const key = (slug: string, size: string) => `${slug}::${size}`;
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.quantity * l.price, 0),
      open,
      setOpen,
      addLine: (line, quantity = 1) =>
        setLines((prev) => {
          const existing = prev.find((l) => key(l.slug, l.size) === key(line.slug, line.size));
          if (existing) {
            return prev.map((l) =>
              key(l.slug, l.size) === key(line.slug, line.size) ? { ...l, quantity: l.quantity + quantity } : l,
            );
          }
          return [...prev, { ...line, quantity }];
        }),
      setQuantity: (slug, size, quantity) =>
        setLines((prev) =>
          quantity <= 0
            ? prev.filter((l) => key(l.slug, l.size) !== key(slug, size))
            : prev.map((l) => (key(l.slug, l.size) === key(slug, size) ? { ...l, quantity } : l)),
        ),
      removeLine: (slug, size) => setLines((prev) => prev.filter((l) => key(l.slug, l.size) !== key(slug, size))),
      clear: () => setLines([]),
    };
  }, [lines, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
