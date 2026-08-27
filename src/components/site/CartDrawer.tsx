import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { formatShopifyPrice, getPrimaryImage } from "@/lib/shopify";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );
  const currencyCode = items[0]?.price.currencyCode || "USD";

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-[0.2em] uppercase text-foreground transition-colors hover:border-gold hover:text-gold md:inline-flex">
          <ShoppingCart className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Bag</span>
          <span className="sr-only">Items in bag:</span>
          <span>({totalItems})</span>
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-0 bg-gold p-0 text-[10px] text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col border-border bg-background sm:max-w-lg">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-display text-2xl">Your bag</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Your bag is empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Your bag is empty</p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-6 border-gold text-gold hover:bg-gold hover:text-primary-foreground"
                >
                  <Link to="/shop">Shop the collection</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                <div className="space-y-5">
                  {items.map((item) => {
                    const image = getPrimaryImage(item.product);
                    return (
                      <div key={item.variantId} className="flex gap-4 border-b border-border pb-5">
                        <div className="h-20 w-16 flex-shrink-0 overflow-hidden bg-surface">
                          {image && (
                            <img
                              src={image.url}
                              alt={image.altText || item.product.node.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 min-w-0 flex-col justify-between">
                          <div>
                            <h4 className="truncate font-display text-lg leading-tight">
                              {item.product.node.title}
                            </h4>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {item.selectedOptions.map((o) => o.value).join(" · ") || item.variantTitle}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gold">
                              {formatShopifyPrice(item.price.amount, item.price.currencyCode)}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => removeItem(item.variantId)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                              <div className="flex items-center gap-1 border border-border">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-none"
                                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center text-xs">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-none"
                                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex-shrink-0 space-y-4 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Total</span>
                  <span className="font-display text-2xl text-gold">
                    {formatShopifyPrice(totalPrice.toFixed(2), currencyCode)}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary py-6 text-xs tracking-[0.24em] uppercase text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="mr-2 h-4 w-4" />
                  )}
                  Checkout with Shopify
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
