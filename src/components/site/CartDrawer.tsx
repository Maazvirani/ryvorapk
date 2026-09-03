import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { formatMoney, productImage } from "@/lib/store";

export function CartDrawer() {
  const { lines, open, setOpen, count, subtotal, loading, setLineQuantity, removeLine, checkout } = useCart();
  const placeOrder = async () => {
    const name = window.prompt("Full name"); if (!name) return;
    const phone = window.prompt("Phone number"); if (!phone) return;
    const address = window.prompt("Delivery address"); if (!address) return;
    const city = window.prompt("City"); if (!city) return;
    await checkout({ name, phone, address, city, email: "" });
  };
  return <Sheet open={open} onOpenChange={setOpen}><SheetContent className="flex w-full flex-col bg-background sm:max-w-md"><SheetHeader><SheetTitle className="font-display text-2xl tracking-[0.18em] uppercase">Your bag</SheetTitle><SheetDescription className="text-xs tracking-[0.18em] uppercase text-muted-foreground">{count === 0 ? "Empty for now" : `${count} item${count === 1 ? "" : "s"}`}</SheetDescription></SheetHeader>
    {lines.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center"><p className="text-sm text-muted-foreground">Nothing in your bag yet.</p><Link to="/shop" onClick={() => setOpen(false)} className="border border-gold px-6 py-3 text-xs tracking-[0.24em] uppercase text-gold">Shop the collection</Link></div> : <><div className="flex-1 overflow-y-auto px-4"><div className="flex flex-col gap-5 py-2">{lines.map(line => <div key={line.id} className="flex gap-4"><img src={productImage(line.product.image_key)} alt={line.product.title} className="h-24 w-20 shrink-0 object-cover" width={160} height={200}/><div className="min-w-0 flex-1"><p className="truncate text-sm">{line.product.title}</p><p className="mt-1 text-xs text-muted-foreground">Size {line.variant.title}</p><div className="mt-3 flex items-center gap-2"><button aria-label="Decrease quantity" disabled={loading} onClick={() => setLineQuantity(line.id, line.quantity - 1)} className="border border-border p-1.5"><Minus className="h-3 w-3"/></button><span className="w-6 text-center text-sm">{line.quantity}</span><button aria-label="Increase quantity" disabled={loading} onClick={() => setLineQuantity(line.id, line.quantity + 1)} className="border border-border p-1.5"><Plus className="h-3 w-3"/></button><button aria-label="Remove item" disabled={loading} onClick={() => removeLine(line.id)} className="ml-2 p-1.5 text-muted-foreground"><Trash2 className="h-3.5 w-3.5"/></button></div></div><p className="text-sm">{formatMoney(Number(line.variant.price_pkr) * line.quantity)}</p></div>)}</div></div>
    <div className="border-t border-border px-4 py-5"><div className="flex items-center justify-between text-sm"><span className="eyebrow">Subtotal</span><span className="text-lg">{formatMoney(subtotal)}</span></div><p className="mt-2 text-xs text-muted-foreground">Cash-on-delivery order. We will contact you to confirm.</p><button onClick={placeOrder} disabled={loading} className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-primary px-8 py-4 text-xs tracking-[0.24em] uppercase text-primary-foreground disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Place order"}</button></div></>}
  </SheetContent></Sheet>;
}
