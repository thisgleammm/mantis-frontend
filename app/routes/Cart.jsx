import { Link } from "react-router"
import { useState } from "react"

const dummyCart = [
  { id: 1, name: "Airpods Pro", base_price: 2500000, category: "Audio", quantity: 1 },
  { id: 2, name: "Macbook Pro M5", base_price: 35000000, category: "Laptop", quantity: 1 },
]

export default function Cart() {
  const [cartItems, setCartItems] = useState(dummyCart)

  const updateQty = (id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.base_price * item.quantity, 0)
  const shipping = 50000
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
          <p className="text-gray-500 text-sm mt-1">
            <span className="text-purple-400">{cartItems.length}</span> items in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-4xl mb-6">
              🛒
            </div>
            <h2 className="text-xl font-semibold mb-2">Cart kosong nih!</h2>
            <p className="text-gray-500 text-sm mb-6">Yuk belanja dulu</p>
            <Link to="/products">
              <button className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-purple-50 transition text-sm">
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
                  className="group bg-white/4 border border-white/8 rounded-2xl p-4 flex gap-4 items-center hover:border-purple-500/20 hover:shadow-md hover:shadow-purple-500/5 transition-all duration-200"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 border border-white/5 flex items-center justify-center text-3xl flex-shrink-0">
                    🛍️
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <span className="text-xs text-purple-400/70 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-semibold mt-2 group-hover:text-purple-100 transition">
                      {item.name}
                    </h3>
                    <p className="text-base font-bold mt-1">
                      Rp {(item.base_price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-8 h-8 rounded-lg border border-white/10 text-white hover:border-purple-500/40 hover:text-purple-300 transition flex items-center justify-center text-lg"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-8 h-8 rounded-lg border border-white/10 text-white hover:border-purple-500/40 hover:text-purple-300 transition flex items-center justify-center text-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-600 hover:text-red-400 transition text-lg ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white/4 border border-purple-500/15 rounded-2xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

                <div className="flex flex-col gap-3 text-sm mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-white">Rp {shipping.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="border-t border-white/8 pt-3 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-purple-300">Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <Link to="/checkout">
                  <button className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-purple-50 transition text-sm">
                    Checkout →
                  </button>
                </Link>
                <Link to="/products">
                  <button className="w-full py-3 border border-white/10 text-white rounded-xl hover:border-purple-500/30 hover:text-purple-300 transition text-sm mt-3">
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