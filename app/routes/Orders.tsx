import { Link, redirect } from "react-router"
import { useState } from "react"
import { OrderCardSkeleton } from "../components/Skeleton"
import { useTheme } from "../hooks/useTheme"

export const loader = async () => {
  const authStatus = typeof window !== "undefined"
    ? localStorage.getItem("is_logged_in") === "true"
    : false;

  if (!authStatus) {
    return redirect("/login");
  }
  return null;
};


interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
}

interface Order {
  id: number;
  invoice_number: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  grand_total: number;
  courier_name: string | null;
  tracking_number: string | null;
  created_at: string;
  items: OrderItem[];
}

const dummyOrders: Order[] = [
  {
    id: 1,
    invoice_number: "INV-20260001",
    status: "delivered",
    grand_total: 37550000,
    courier_name: "JNE",
    tracking_number: "JNE123456789",
    created_at: "2026-04-01T10:00:00Z",
    items: [
      { id: 1, product_name: "Airpods Pro", quantity: 1, price_at_purchase: 2500000 },
      { id: 2, product_name: "Macbook Pro M5", quantity: 1, price_at_purchase: 35000000 },
    ]
  },
  {
    id: 2,
    invoice_number: "INV-20260002",
    status: "processing",
    grand_total: 18050000,
    courier_name: "SiCepat",
    tracking_number: null,
    created_at: "2026-04-20T14:00:00Z",
    items: [
      { id: 3, product_name: "iPhone 16", quantity: 1, price_at_purchase: 18000000 },
    ]
  },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:    { label: "Pending",    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  processing: { label: "Processing", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  shipped:    { label: "Shipped",    color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  delivered:  { label: "Delivered",  color: "text-green-400 bg-green-400/10 border-green-400/20" },
  cancelled:  { label: "Cancelled",  color: "text-red-400 bg-red-400/10 border-red-400/20" },
}


export default function Orders() {
  const { isDark } = useTheme()
  const [loading] = useState(false)

  if (loading) return (
    <div className="min-h-screen px-6 py-10 font-sans bg-gray-50 text-black dark:bg-black dark:text-white">
      <div className="max-w-4xl mx-auto">
        <div className="h-8 rounded-lg w-48 mb-2 animate-pulse bg-black/8 dark:bg-white/8" />
        <div className="h-4 rounded-lg w-24 mb-8 animate-pulse bg-black/5 dark:bg-white/5" />
        <div className="flex flex-col gap-5">
          {[...Array(3)].map((_, i) => <OrderCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen px-6 py-10 font-sans bg-gray-50 text-black dark:bg-black dark:text-white">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">My Orders</h1>
          <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">
            <span className="text-purple-400">{dummyOrders.length}</span> orders ditemukan
          </p>
        </div>

        {dummyOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-4xl mb-6">
              📦
            </div>
            <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Belum ada order!</h2>
            <p className="text-sm mb-6 text-gray-400 dark:text-gray-500">Yuk mulai belanja</p>
            <Link to="/products">
              <button className="px-6 py-3 font-semibold rounded-xl transition text-sm bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                Shop Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {dummyOrders.map(order => {
              const status = statusConfig[order.status] || statusConfig.pending
              return (
                <div
                  key={order.id}
                  className="border rounded-2xl p-6 hover:border-purple-500/20 hover:shadow-md hover:shadow-purple-500/5 transition-all duration-200 bg-white border-black/8 dark:bg-white/4 dark:border-white/8"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs mb-1 text-gray-400 dark:text-gray-500">{order.created_at.slice(0, 10)}</p>
                      <h3 className="text-base font-semibold text-black dark:text-white">{order.invoice_number}</h3>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 mb-4 rounded-xl p-3 bg-black/2 dark:bg-white/2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{item.product_name} x{item.quantity}</span>
                        <span className="text-black dark:text-white">Rp {item.price_at_purchase.toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 flex items-center justify-between border-black/8 dark:border-white/8">
                    <div className="text-sm text-gray-400 dark:text-gray-500">
                      {order.courier_name && (
                        <span className="flex items-center gap-1">
                          🚚 {order.courier_name}
                          {order.tracking_number && (
                            <span className="text-purple-400/70 ml-1">• {order.tracking_number}</span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs mb-1 text-gray-400 dark:text-gray-500">Total</p>
                      <p className="text-base font-bold text-purple-400">
                        Rp {order.grand_total.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}