"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import {
  seedProducts,
  STORE_INFO,
  type CartLine,
  type Payment,
  type Product,
  type Sale,
} from "@/lib/data"

type NewProduct = Omit<Product, "id">

type StoreContextValue = {
  products: Product[]
  sales: Sale[]
  cart: CartLine[]
  addProduct: (p: NewProduct) => void
  updateProduct: (id: string, p: NewProduct) => void
  deleteProduct: (id: string) => void
  addToCart: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  checkout: (opts: { payment: Payment; discount: number; customer?: string }) => Sale
}

const StoreContext = createContext<StoreContextValue | null>(null)

let saleCounter = 100249

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts)
  const [sales, setSales] = useState<Sale[]>([])
  const [cart, setCart] = useState<CartLine[]>([])

  const value = useMemo<StoreContextValue>(() => {
    function addProduct(p: NewProduct) {
      setProducts((prev) => [{ ...p, id: `p${Date.now()}` }, ...prev])
    }
    function updateProduct(id: string, p: NewProduct) {
      setProducts((prev) => prev.map((x) => (x.id === id ? { ...p, id } : x)))
    }
    function deleteProduct(id: string) {
      setProducts((prev) => prev.filter((x) => x.id !== id))
      setCart((prev) => prev.filter((l) => l.productId !== id))
    }
    function addToCart(productId: string) {
      const product = products.find((p) => p.id === productId)
      if (!product) return
      setCart((prev) => {
        const existing = prev.find((l) => l.productId === productId)
        if (existing) {
          return prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 1 } : l))
        }
        return [
          ...prev,
          { productId, name: product.name, price: product.price, cost: product.cost || 0, qty: 1, taxRate: product.taxRate },
        ]
      })
    }
    function setQty(productId: string, qty: number) {
      if (qty <= 0) {
        setCart((prev) => prev.filter((l) => l.productId !== productId))
        return
      }
      setCart((prev) => prev.map((l) => (l.productId === productId ? { ...l, qty } : l)))
    }
    function removeFromCart(productId: string) {
      setCart((prev) => prev.filter((l) => l.productId !== productId))
    }
    function clearCart() {
      setCart([])
    }
    function checkout({ payment, discount, customer }: { payment: Payment; discount: number; customer?: string }): Sale {
      const lines = cart
      const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
      const tax = lines.reduce((s, l) => s + l.price * l.qty * l.taxRate, 0)
      const total = Math.max(0, subtotal - discount) + tax
      const sale: Sale = {
        id: `S-${saleCounter++}`,
        createdAt: new Date().toISOString(),
        lines,
        subtotal,
        tax,
        discount,
        total,
        payment,
        cashier: STORE_INFO.cashier,
        customer: customer || undefined,
      }
      setSales((prev) => [sale, ...prev])
      setProducts((prev) =>
        prev.map((p) => {
          const soldLine = lines.find((l) => l.productId === p.id)
          return soldLine ? { ...p, stock: Math.max(0, p.stock - soldLine.qty) } : p
        }),
      )
      setCart([])
      return sale
    }

    return {
      products,
      sales,
      cart,
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      checkout,
    }
  }, [products, sales, cart])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}

// Updated Currency Formatting: Pakistani Rupees (Rs.)
export function formatCurrency(n: number) {
  const rounded = Math.round(n)
  return `Rs. ${rounded.toLocaleString("en-PK")}`
}
