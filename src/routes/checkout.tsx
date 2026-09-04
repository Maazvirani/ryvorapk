import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Loader2, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatMoney, productImage } from "@/lib/store";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, count, subtotal, loading, checkout } = useCart();
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const address = String(form.get("address") || "").trim();
    const city = String(form.get("city") || "").trim();
    const notes = String(form.get("notes") || "").trim();
    if (!name || !email || !phone || !address || !city) {
      setError("Please complete all required fields.");
      return;
    }
    const id = await checkout({ name, email, phone, address, city, notes });
    if (!id) {
      setError("We couldn't place your order. Please check your details and try again.");
      return;
    }
    setOrderId(id);
    setSubmitted(true);
  }

  if (!lines.length && !submitted) {
    return <main className="min-h-screen bg-background px-6 py-24 text-foreground"><div className="mx-auto max-w-xl text-center"><p className="eyebrow">Checkout</p><h1 className="mt-4 font-display text-5xl">Your bag is empty.</h1><p className="mt-5 text-muted-foreground">Add an item to your bag before continuing to checkout.</p><Link to="/shop" className="mt-8 inline-flex bg-primary px-7 py-4 text-xs tracking-[0.22em] uppercase text-primary-foreground">Shop the collection</Link></div></main>;
  }

  if (submitted) {
    return <main className="min-h-screen bg-background px-6 py-20 text-foreground"><div className="mx-auto max-w-2xl text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border"><Check className="h-7 w-7" /></div><p className="eyebrow mt-8">Order received</p><h1 className="mt-4 font-display text-5xl sm:text-6xl">Thank you.</h1><p className="mx-auto mt-5 max-w-lg text-muted-foreground">Your RYVORA order has been received. We will contact you shortly to confirm delivery details.</p>{orderId && <p className="mt-6 text-xs tracking-[0.18em] uppercase text-muted-foreground">Order reference: {orderId.slice(0, 8).toUpperCase()}</p>}<Link to="/shop" className="mt-9 inline-flex border border-border px-7 py-4 text-xs tracking-[0.22em] uppercase hover:bg-muted">Continue shopping</Link></div></main>;
  }

  return <main className="min-h-screen bg-background text-foreground"><div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10"><Link to="/" className="inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> RYVORA</Link><div className="mt-12 grid gap-12 lg:grid-cols-[1fr_420px]"><section><p className="eyebrow">Secure checkout</p><h1 className="mt-3 font-display text-5xl sm:text-6xl">Complete your order.</h1><p className="mt-4 max-w-xl text-sm text-muted-foreground">Enter your delivery details below. Your order will be placed using cash on delivery.</p><form onSubmit={handleSubmit} className="mt-10 space-y-8"><fieldset className="space-y-5"><legend className="font-display text-2xl">Contact</legend><div className="grid gap-5 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-xs tracking-[0.14em] uppercase text-muted-foreground">Full name *</span><input name="name" required autoComplete="name" className="w-full border border-border bg-transparent px-4 py-3.5 outline-none focus:border-foreground" /></label><label className="block"><span className="mb-2 block text-xs tracking-[0.14em] uppercase text-muted-foreground">Email *</span><input name="email" type="email" required autoComplete="email" className="w-full border border-border bg-transparent px-4 py-3.5 outline-none focus:border-foreground" /></label></div><label className="block"><span className="mb-2 block text-xs tracking-[0.14em] uppercase text-muted-foreground">Phone *</span><input name="phone" type="tel" required autoComplete="tel" placeholder="03XX XXXXXXX" className="w-full border border-border bg-transparent px-4 py-3.5 outline-none focus:border-foreground" /></label></fieldset><fieldset className="space-y-5"><legend className="font-display text-2xl">Delivery</legend><label className="block"><span className="mb-2 block text-xs tracking-[0.14em] uppercase text-muted-foreground">Address *</span><textarea name="address" required autoComplete="street-address" rows={3} className="w-full resize-none border border-border bg-transparent px-4 py-3.5 outline-none focus:border-foreground" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-xs tracking-[0.14em] uppercase text-muted-foreground">City *</span><input name="city" required autoComplete="address-level2" className="w-full border border-border bg-transparent px-4 py-3.5 outline-none focus:border-foreground" /></label><label className="block"><span className="mb-2 block text-xs tracking-[0.14em] uppercase text-muted-foreground">Order notes</span><input name="notes" placeholder="Optional" className="w-full border border-border bg-transparent px-4 py-3.5 outline-none focus:border-foreground" /></label></div></fieldset>{error && <p role="alert" className="border border-border px-4 py-3 text-sm">{error}</p>}<button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 bg-primary px-8 py-4 text-xs tracking-[0.24em] uppercase text-primary-foreground disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Place order"}</button></form></section><aside className="h-fit border border-border p-6 lg:sticky lg:top-8"><p className="eyebrow">Order summary</p><div className="mt-6 space-y-5">{lines.map(line => <div key={line.id} className="flex gap-4"><img src={productImage(line.product.image_key)} alt={line.product.title} className="h-24 w-20 object-cover" width={160} height={200} /><div className="min-w-0 flex-1"><p className="text-sm">{line.product.title}</p><p className="mt-1 text-xs text-muted-foreground">Size {line.variant.title} · Qty {line.quantity}</p><p className="mt-2 text-sm">{formatMoney(Number(line.variant.price_pkr) * line.quantity)}</p></div></div>)}</div><div className="mt-7 border-t border-border pt-5"><div className="flex justify-between text-xs tracking-[0.14em] uppercase text-muted-foreground"><span>{count} item{count === 1 ? "" : "s"}</span><span>Subtotal</span></div><div className="mt-3 flex items-center justify-between"><span className="font-display text-2xl">Total</span><span className="text-lg">{formatMoney(subtotal)}</span></div><div className="mt-6 flex items-start gap-3 border-t border-border pt-5 text-xs text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><span>Cash on delivery. No payment is taken online.</span></div></div></aside></div></div></main>;
}
