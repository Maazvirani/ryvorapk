import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";

export function CartDrawer() {
  const { lines, open, setOpen, count, subtotal, setQuantity, removeLine } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl tracking-[0.18em] uppercase">Your bag</SheetTitle>
          <SheetDescription className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
            {count === 0 ? "Empty for now" : `${count} item${count === 1 ? "" : "s"}`}
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="text-sm text-muted-foreground">Nothing in your bag yet.</p>
            <Link
              to="/shop"
              onClick={() => setOpen(false)}
              className="border border-gold px-6 py-3 text-xs tracking-[0.24em] uppercase text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <div className="flex flex-col gap-5 py-2">
                {lines.map((l) => (
                  <div key={`${l.slug}-${l.size}`} className="flex gap-4">
                    <img
                      src={l.image}
                      alt={l.name}
                      className="h-24 w-20 shrink-0 object-cover"
                      width={160}
                      height={200}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">{l.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {l.colorway} · Size {l.size}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => setQuantity(l.slug, l.size, l.quantity - 1)}
                          className="border border-border p-1.5 text-foreground transition-colors hover:border-gold hover:text-gold"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{l.quantity}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => setQuantity(l.slug, l.size, l.quantity + 1)}
                          className="border border-border p-1.5 text-foreground transition-colors hover:border-gold hover:text-gold"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          aria-label="Remove item"
                          onClick={() => removeLine(l.slug, l.size)}
                          className="ml-2 p-1.5 text-muted-foreground transition-colors hover:text-gold"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{formatPrice(l.price * l.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border px-4 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="eyebrow">Subtotal</span>
                <span className="text-lg">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Shipping and duties calculated at checkout.</p>
              <button
                onClick={() =>
                  toast.info("Checkout connects once the Shopify store is live", {
                    description: "Your bag is saved — payments go live with the Shopify connection.",
                  })
                }
                className="mt-4 w-full bg-primary px-8 py-4 text-xs tracking-[0.24em] uppercase text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
