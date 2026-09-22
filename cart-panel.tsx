"use client"

import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Banknote, Smartphone, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/store"
import type { CartLine, Payment } from "@/lib/data"

// Updated Pakistani Payment Types: Cash, Card, JazzCash, EasyPaisa, Udhar Khata
const payments: { id: Payment; label: string; icon: typeof CreditCard }[] = [
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "jazzcash", label: "JazzCash", icon: Smartphone },
  { id: "easypaisa", label: "EasyPaisa", icon: Smartphone },
  { id: "udhar", label: "Udhar Khata", icon: BookOpen },
  { id: "card", label: "Card", icon: CreditCard },
]

export function CartPanel({
  cart,
  discount,
  payment,
  customer,
  onQty,
  onRemove,
  onClear,
  onDiscount,
  onPayment,
  onCustomer,
  onCheckout,
}: {
  cart: CartLine[]
  discount: number
  payment: Payment
  customer: string
  onQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
  onClear: () => void
  onDiscount: (v: number) => void
  onPayment: (p: Payment) => void
  onCustomer: (v: string) => void
  onCheckout: () => void
}) {
  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0)
  const tax = cart.reduce((s, l) => s + l.price * l.qty * l.taxRate, 0)
  const total = Math.max(0, subtotal - discount) + tax
  const itemCount = cart.reduce((s, l) => s + l.qty, 0)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="size-4 text-primary" />
          <span className="font-semibold">Current Order</span>
          {itemCount > 0 ? (
            <span className="rounded-full bg-primary/12 px-2 py-0.5 text-xs font-medium text-primary">{itemCount}</span>
          ) : null}
        </div>
        {cart.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {cart.length === 0 ? (
          <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <ShoppingCart className="size-8 opacity-30" />
            <p>No items yet.</p>
            <p className="text-xs">Tap products to add them to the order.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {cart.map((l) => (
              <div key={l.productId} className="flex items-center gap-3 py-3">
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">{l.name}</span>
                  <span className="text-xs text-muted-foreground">{formatCurrency(l.price)} each</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon-xs" onClick={() => onQty(l.productId, l.qty - 1)} aria-label="Decrease quantity">
                    <Minus />
                  </Button>
                  <span className="w-7 text-center text-sm font-medium tabular-nums">{l.qty}</span>
                  <Button variant="outline" size="icon-xs" onClick={() => onQty(l.productId, l.qty + 1)} aria-label="Increase quantity">
                    <Plus />
                  </Button>
                </div>
                <span className="w-16 text-right text-sm font-semibold tabular-nums">{formatCurrency(l.price * l.qty)}</span>
                <Button variant="ghost" size="icon-xs" onClick={() => onRemove(l.productId)} aria-label="Remove item">
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border px-4 py-4">
        <div className="flex flex-col gap-2">
          <Input
            value={customer}
            onChange={(e) => onCustomer(e.target.value)}
            placeholder={payment === "udhar" ? "Customer name / phone (Required for Udhar)" : "Customer name (optional)"}
            className={payment === "udhar" && !customer ? "border-amber-500 focus-visible:ring-amber-500" : ""}
            aria-label="Customer name"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Discount</span>
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">Rs.</span>
              <Input
                type="number"
                min="0"
                step="1"
                value={discount || ""}
                onChange={(e) => onDiscount(Number(e.target.value) || 0)}
                placeholder="0"
                className="pl-10 text-right"
                aria-label="Discount amount"
              />
            </div>
          </div>
        </div>

        {/* Payment Buttons Grid */}
        <div className="grid grid-cols-3 gap-2">
          {payments.map((p) => {
            const Icon = p.icon
            const active = payment === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPayment(p.id)}
                className={`flex flex-col items-center gap-1 rounded-lg border py-2 text-xs font-medium transition-colors ${
                  active
                    ? p.id === "udhar"
                      ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {p.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-1 rounded-lg bg-muted/50 p-3 text-sm">
          <Row label="Subtotal" value={formatCurrency(subtotal)} />
          {discount > 0 ? <Row label="Discount" value={`-${formatCurrency(discount)}`} /> : null}
          <Row label="Tax" value={formatCurrency(tax)} />
          <div className="mt-1 flex justify-between border-t border-border pt-2 text-base font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(total)}</span>
          </div>
        </div>

        <Button 
          size="lg" 
          className={`h-11 text-sm ${payment === "udhar" ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}`}
          disabled={cart.length === 0 || (payment === "udhar" && !customer.trim())} 
          onClick={onCheckout}
        >
          {payment === "udhar" ? `Udhar Khata: ${formatCurrency(total)}` : `Charge ${formatCurrency(total)}`}
        </Button>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="tabular-nums text-foreground">{value}</span>
    </div>
  )
}
