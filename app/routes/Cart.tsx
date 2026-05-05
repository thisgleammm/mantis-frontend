import { Link, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import type { Product } from "../types"

interface CartItem extends Product {
  quantity: number;
}

const dummyCart: CartItem[] = [
  { id: 1, name: "Airpods Pro", base_price: 2500000, category: "Audio", quantity: 1, category_id: 1, slug: "airpods-pro", rating_average: 0, rating_count: 0, created_at: "" },
  { id: 2, name: "Macbook Pro M5", base_price: 35000000, category: "Laptop", quantity: 1, category_id: 2, slug: "macbook-pro-m5", rating_average: 0, rating_count: 0, created_at: "" },
]

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true
    return (localStorage.getItem("theme") || "dark") === "dark"
  })
  useEffect(() => {
    const handler = () => setIsDark((localStorage.getItem("theme") || "dark") === "dark")
    window.addEventListener("themechange", handler)
    return () => window.removeEventListener("themechange", handler)
  }, [])
  return isDark
}

export default function Cart() {
  const navigate = useNavigate()
  const isDark = useTheme()
  const d = isDark
  const [cartItems, setCartItems] = useState<CartItem[]>(dummyCart)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("is_logged_in") === "true"
    if (!isLoggedIn) {
      navigate("/login")
    }
  }, [])

  const updateQty = (id: number | string, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const removeItem = (id: number | string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.base_price * item.quantity, 0)
  const shipping = 50000
  const total = subtotal + shipping

  return (
    <div className={`min-h-screen px-6 py-10 font-sans transition-colors duration-300 ${d ? "bg-black text-white" : "bg-gray-50 text-black"}`}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold tracking-tight ${d ? "text-white" : "text-black"}`}>Your Cart</h1>
          <p className={`text-sm mt-1 ${d ? "text-gray-500" : "text-gray-400"}`}>
            <span className="text-purple-400">{cartItems.length}</span> items in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-4xl mb-6">
              🛒
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${d ? "text-white" : "text-black"}`}>Cart kosong nih!</h2>
            <p className={`text-sm mb-6 ${d ? "text-gray-500" : "text-gray-400"}`}>Yuk belanja dulu</p>
            <Link to="/products">
              <button className={`px-6 py-3 font-semibold rounded-xl transition text-sm ${d ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-zinc-800"}`}>
                Shop Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Cart Items */}
            <div className="flex-1 flex flex-col gap-4">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className={`group border rounded-2xl p-4 flex gap-4 items-center hover:border-purple-500/20 hover:shadow-md hover:shadow-purple-500/5 transition-all duration-200 ${
                    d ? "bg-white/4 border-white/8" : "bg-white border-black/8"
                  }`}
                >
                  {/* Image */}
                  <div className={`w-20 h-20 rounded-xl border flex items-center justify-center text-3xl flex-shrink-0 ${d ? "bg-gradient-to-br from-zinc-900 to-zinc-800 border-white/5" : "bg-gradient-to-br from-gray-100 to-gray-200 border-black/5"}`}>
                    🛍️
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <span className="text-xs text-purple-400/70 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <h3 className={`text-sm font-semibold mt-2 transition ${d ? "text-white group-hover:text-purple-100" : "text-black group-hover:text-purple-700"}`}>
                      {item.name}
                    </h3>
                    <p className={`text-base font-bold mt-1 ${d ? "text-white" : "text-black"}`}>
                      Rp {(item.base_price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center text-lg transition ${
                        d
                          ? "border-white/10 text-white hover:border-purple-500/40 hover:text-purple-300"
                          : "border-black/10 text-black hover:border-purple-500/40 hover:text-purple-600"
                      }`}
                    >
                      −
                    </button>
                    <span className={`text-sm font-semibold w-6 text-center ${d ? "text-white" : "text-black"}`}>{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center text-lg transition ${
                        d
                          ? "border-white/10 text-white hover:border-purple-500/40 hover:text-purple-300"
                          : "border-black/10 text-black hover:border-purple-500/40 hover:text-purple-600"
                      }`}
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-500 hover:text-red-400 transition text-lg ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className={`border border-purple-500/15 rounded-2xl p-6 sticky top-24 ${d ? "bg-white/4" : "bg-white shadow-sm"}`}>
                <h2 className={`text-lg font-semibold mb-6 ${d ? "text-white" : "text-black"}`}>Order Summary</h2>

                <div className="flex flex-col gap-3 text-sm mb-6">
                  <div className={`flex justify-between ${d ? "text-gray-400" : "text-gray-500"}`}>
                    <span>Subtotal</span>
                    <span className={d ? "text-white" : "text-black"}>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className={`flex justify-between ${d ? "text-gray-400" : "text-gray-500"}`}>
                    <span>Shipping</span>
                    <span className={d ? "text-white" : "text-black"}>Rp {shipping.toLocaleString("id-ID")}</span>
                  </div>
                  <div className={`border-t pt-3 flex justify-between font-bold text-base ${d ? "border-white/8" : "border-black/8"}`}>
                    <span className={d ? "text-white" : "text-black"}>Total</span>
                    <span className="text-purple-400">Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <Link to="/checkout">
                  <button className={`w-full py-3 font-semibold rounded-xl transition text-sm ${d ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-zinc-800"}`}>
                    Checkout →
                  </button>
                </Link>
                <Link to="/products">
                  <button className={`w-full py-3 border rounded-xl transition text-sm mt-3 ${d ? "border-white/10 text-white hover:border-purple-500/30 hover:text-purple-300" : "border-black/10 text-black hover:border-purple-500/30 hover:text-purple-600"}`}>
                    Lanjut Belanja
                  </button>
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}