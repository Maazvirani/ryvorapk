import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Loader2, ShieldCheck, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatMoney, productImage } from "@/lib/store";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

function CheckoutPage() {
  const { lines, count, subtotal, loading, checkout } = useCart();
  const [error, setError] = useState("");

  async function handleCheckout() {
    setError("");
    const ok = await checkout();
    if (!ok) setError("We couldn't connect to Shopify checkout. Please try again.");
  }

  if (!lines.length) {
    return <main className="min-h-screen bg-background px-6 py-24 text-foreground"><div className="mx-auto max-w-xl text-center"><p className="eyebrow">Checkout</p><h1 className="mt-4 font-display text-5xl">Your bag is empty.</h1><p className="mt-5 text-muted-foreground">Add an item to your bag before continuing.</p><Link to="/shop" className="mt-8 inline-flex bg-primary px-7 py-4 text-xs tracking-[0.22em] uppercase text-primary-foreground">Shop the collection</Link></div></main>;
  }

  return <main className="min-h-screen bg-background text-foreground"><div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
    <Link to="/" className="inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> RYVORA</Link>
    <div className="mx-auto mt-16 grid max-w-5xl gap-12 lg:grid-cols-[1fr_420px]">
      <section>
        <p className="eyebrow">Shopify checkout</p>
        <h1 className="mt-3 font-display text-5xl sm:text-6xl">Complete your order.</h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">Your bag is ready. Continue to Shopify's secure hosted checkout to enter your delivery details and complete payment using the methods available for RYVORA.</p>
        <div className="mt-10 border border-border p-6 sm:p-8">
          <div className="flex items-start gap-4"><ShieldCheck className="mt-1 h-5 w-5 shrink-0"/><div><h2 className="font-display text-2xl">Secure checkout</h2><p className="mt-2 text-sm text-muted-foreground">Shopify will handle customer details, payment, taxes, order creation and inventory. RYVORA's website will not collect payment information directly.</p></div></div>
          {error && <p role="alert" className="mt-6 border border-border px-4 py-3 text-sm">{error}</p>}
          <button onClick={handleCheckout} disabled={loading} className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-primary px-8 py-4 text-xs tracking-[0.24em] uppercase text-primary-foreground disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <><ShoppingBag className="h-4 w-4"/> Continue to secure checkout</>}</button>
          <p className="mt-4 text-center text-[11px] tracking-[0.12em] uppercase text-muted-foreground">You will be redirected to Shopify</p>
        </div>
      </section>
      <aside className="h-fit border border-border p-6 lg:sticky lg:top-8"><p className="eyebrow">Order summary</p><div className="mt-6 space-y-5">{lines.map(line => <div key={line.id} className="flex gap-4"><img src={productImage(line.product.image_key)} alt={line.product.title} className="h-24 w-20 object-cover" width={160} height={200}/><div className="min-w-0 flex-1"><p className="text-sm">{line.product.title}</p><p className="mt-1 text-xs text-muted-foreground">Size {line.variant.title} · Qty {line.quantity}</p><p className="mt-2 text-sm">{formatMoney(Number(line.variant.price_pkr) * line.quantity)}</p></div></div>)}</div><div className="mt-7 border-t border-border pt-5"><div className="flex justify-between text-xs tracking-[0.14em] uppercase text-muted-foreground"><span>{count} item{count === 1 ? "" : "s"}</span><span>Subtotal</span></div><div className="mt-3 flex items-center justify-between"><span className="font-display text-2xl">Total</span><span className="text-lg">{formatMoney(subtotal)}</span></div></div></aside>
    </div>
  </div></main>;
}
