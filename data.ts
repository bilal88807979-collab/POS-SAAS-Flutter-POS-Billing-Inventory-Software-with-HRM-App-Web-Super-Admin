export type Category = "Grocery" | "Beverages" | "Dairy" | "Bakery" | "Snacks" | "Household"

export type Product = {
  id: string
  name: string
  sku: string
  category: Category
  price: number
  cost: number
  stock: number
  reorderLevel: number
  taxRate: number
}

export type CartLine = {
  productId: string
  name: string
  price: number
  cost: number
  qty: number
  taxRate: number
}

// Updated Payment types: Cash, Card, JazzCash, EasyPaisa, Udhar
export type Payment = "cash" | "card" | "jazzcash" | "easypaisa" | "udhar"

export type Sale = {
  id: string
  createdAt: string
  lines: CartLine[]
  subtotal: number
  tax: number
  discount: number
  total: number
  payment: Payment
  cashier: string
  customer?: string
  customerId?: string
}

export type Customer = {
  id: string
  name: string
  phone: string
  note?: string
  createdAt: string
}

export type LedgerEntry = {
  id: string
  customerId: string
  type: "credit" | "payment"
  amount: number
  note?: string
  createdAt: string
  saleId?: string
}

export type PlanId = "trial" | "monthly" | "yearly"

export type License = {
  plan: PlanId
  startedAt: string
  expiresAt: string
  method?: "trial" | "jazzcash" | "easypaisa" | "bank"
  reference?: string
}

export const CATEGORIES: Category[] = ["Grocery", "Beverages", "Dairy", "Bakery", "Snacks", "Household"]

export const STORE_INFO = {
  name: "Khan Kiryana Store",
  tagline: "POS & Billing System",
  address: "Shop 14, Main Bazaar Road",
  city: "Gulberg, Lahore",
  phone: "+92 300 1234567",
  taxId: "NTN-4471822-3",
  cashier: "Bilal Khan",
  currencySymbol: "Rs.",
}

// Payment Account Details for SaaS subscriptions
export const SAAS_PAYMENT_INFO = {
  jazzcash: { accountTitle: "Khan Store POS", accountNumber: "03001234567" },
  easypaisa: { accountTitle: "Khan Store POS", accountNumber: "03001234567" },
  bank: { bankName: "Meezan Bank", accountTitle: "Khan Store POS", iban: "PK36MEZN0001234567890123" }
}

export const seedProducts: Product[] = [
  { id: "p1", name: "Fresh Milk 1L", sku: "DRY-001", category: "Dairy", price: 200, cost: 170, stock: 34, reorderLevel: 12, taxRate: 0 },
  { id: "p2", name: "Yogurt (Dahi) 500g", sku: "DRY-002", category: "Dairy", price: 180, cost: 150, stock: 9, reorderLevel: 10, taxRate: 0 },
  { id: "p3", name: "Eggs (Dozen)", sku: "DRY-003", category: "Dairy", price: 320, cost: 280, stock: 22, reorderLevel: 10, taxRate: 0 },
  { id: "p4", name: "Butter 200g", sku: "DRY-004", category: "Dairy", price: 480, cost: 420, stock: 7, reorderLevel: 8, taxRate: 0 },
  { id: "p5", name: "Bread Large", sku: "BAK-001", category: "Bakery", price: 140, cost: 110, stock: 18, reorderLevel: 12, taxRate: 0 },
  { id: "p6", name: "Rusk (Toast) Pack", sku: "BAK-002", category: "Bakery", price: 160, cost: 125, stock: 14, reorderLevel: 8, taxRate: 0 },
  { id: "p7", name: "Basmati Rice 1kg", sku: "GRO-001", category: "Grocery", price: 340, cost: 290, stock: 40, reorderLevel: 15, taxRate: 0 },
  { id: "p8", name: "Wheat Flour (Atta) 5kg", sku: "GRO-002", category: "Grocery", price: 850, cost: 780, stock: 25, reorderLevel: 10, taxRate: 0 },
  { id: "p9", name: "Cooking Oil 1L", sku: "GRO-003", category: "Grocery", price: 560, cost: 500, stock: 6, reorderLevel: 10, taxRate: 0 },
  { id: "p10", name: "Sugar 1kg", sku: "GRO-004", category: "Grocery", price: 150, cost: 130, stock: 52, reorderLevel: 20, taxRate: 0 },
  { id: "p11", name: "Lentils (Daal) 1kg", sku: "GRO-005", category: "Grocery", price: 340, cost: 300, stock: 30, reorderLevel: 12, taxRate: 0 },
  { id: "p12", name: "Salt 800g", sku: "GRO-006", category: "Grocery", price: 60, cost: 45, stock: 60, reorderLevel: 20, taxRate: 0 },
  { id: "p13", name: "Tea (Chai) 250g", sku: "BEV-001", category: "Beverages", price: 420, cost: 360, stock: 16, reorderLevel: 10, taxRate: 0 },
  { id: "p14", name: "Soft Drink 500ml", sku: "BEV-002", category: "Beverages", price: 90, cost: 70, stock: 48, reorderLevel: 24, taxRate: 0 },
  { id: "p15", name: "Mineral Water 1.5L", sku: "BEV-003", category: "Beverages", price: 90, cost: 65, stock: 5, reorderLevel: 18, taxRate: 0 },
  { id: "p16", name: "Biscuits Pack", sku: "SNK-001", category: "Snacks", price: 80, cost: 55, stock: 70, reorderLevel: 25, taxRate: 0 },
  { id: "p17", name: "Potato Chips", sku: "SNK-002", category: "Snacks", price: 50, cost: 35, stock: 90, reorderLevel: 30, taxRate: 0 },
  { id: "p18", name: "Chocolate Bar", sku: "SNK-003", category: "Snacks", price: 100, cost: 70, stock: 8, reorderLevel: 15, taxRate: 0 },
  { id: "p19", name: "Washing Soap", sku: "HH-001", category: "Household", price: 120, cost: 90, stock: 33, reorderLevel: 12, taxRate: 0 },
  { id: "p20", name: "Dish Soap 500ml", sku: "HH-002", category: "Household", price: 220, cost: 170, stock: 4, reorderLevel: 10, taxRate: 0 },
]

export function daysAgo(n: number, h: number, m: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}
