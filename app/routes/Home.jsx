import { Link } from "react-router"
import { useState, useEffect } from "react"
import { getAllProducts } from "../services/productService"

const categories = [
  { name: "Smartphone", icon: "📱" },
  { name: "Laptop", icon: "💻" },
  { name: "Audio", icon: "🎧" },
  { name: "Tablet", icon: "📟" },
]

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    getAllProducts()
      .then(data => {
        setFeaturedProducts(data.slice(0, 4))  
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* Hero */}
      <section className="relative px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden max-w-6xl mx-auto">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-10 left-0 pointer-events-none" />
        <div className="absolute w-64 h-64 bg-purple-500/5 rounded-full blur-3xl bottom-0 right-20 pointer-events-none" />

        {/* Left */}
        <div className="flex-1 flex flex-col items-start text-left z-10">
          <span className="text-xs text-purple-400/80 border border-purple-500/20 bg-purple-500/5 px-4 py-1 rounded-full mb-6">
            🛍️ Welcome to Mantis Store
          </span>
          <h1 className="text-5xl font-bold tracking-tight leading-tight max-w-lg mb-4">
            Premium Products,<br />
            <span className="text-gray-400">Minimal Aesthetic.</span>
          </h1>
          <p className="text-gray-500 text-base max-w-sm mb-8">
            Temukan produk teknologi terbaik dengan tampilan yang bersih dan modern.
          </p>
          <div className="flex gap-3">
            <Link to="/products">
              <button className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-purple-50 transition text-sm">
                Shop Now
              </button>
            </Link>
            <Link to="/products">
              <button className="px-6 py-3 border border-white/20 text-white rounded-xl hover:border-purple-500/40 hover:text-purple-300 transition text-sm">
                Browse All
              </button>
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex items-center justify-center z-10">
          <div className="relative w-72 h-72">
            <div className="absolute inset-0 bg-white/5 border border-purple-500/20 rounded-3xl backdrop-blur-md flex items-center justify-center text-8xl shadow-lg shadow-purple-500/10">
              💻
            </div>
            <div className="absolute -bottom-4 -left-8 bg-black/80 border border-purple-500/20 backdrop-blur rounded-2xl px-4 py-3 text-xs shadow-lg">
              <p className="text-purple-400 mb-1">Best Seller</p>
              <p className="text-white font-semibold">Macbook Pro M5</p>
              <p className="text-gray-300">Rp 35.000.000</p>
            </div>
            <div className="absolute -top-4 -right-6 bg-black/80 border border-purple-500/20 backdrop-blur rounded-2xl px-4 py-3 text-xs shadow-lg">
              <p className="text-purple-400 mb-1">Rating</p>
              <p className="text-white font-semibold">⭐ 4.9 / 5.0</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-12 border-t border-white/8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link to="/products" key={cat.name}>
                <div className="group bg-white/4 border border-white/8 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-purple-500/30 hover:bg-purple-500/5 hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                  <span className="text-4xl">{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-400 group-hover:text-purple-300 transition">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-12 border-t border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Featured Products</h2>
            <Link to="/products" className="text-sm text-purple-400 hover:text-purple-300 transition">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map(product => (
              <div
                key={product.id}
                className="group bg-white/4 border border-white/8 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200"
              >
                <div className="h-40 bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center text-4xl relative">
                  🛍️
                  <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-all duration-200" />
                </div>
                <div className="p-4">
                  <span className="text-xs text-purple-400/70 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h3 className="text-sm font-semibold mt-3 mb-1 group-hover:text-purple-100 transition">{product.name}</h3>
                  <p className="text-base font-bold mb-4">
                    Rp {product.base_price.toLocaleString("id-ID")}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/products/${product.id}`} className="flex-1">
                      <button className="w-full py-2 rounded-xl border border-white/10 text-white text-xs hover:border-purple-500/40 hover:text-purple-300 transition">
                        Detail
                      </button>
                    </Link>
                    <button className="flex-1 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-purple-50 transition">
                      + Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-12 border-t border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white/4 border border-purple-500/20 rounded-2xl p-10 flex flex-col items-center text-center overflow-hidden">
            <div className="absolute w-64 h-64 bg-purple-500/10 rounded-full blur-3xl top-0 left-1/2 -translate-x-1/2 pointer-events-none" />
            <span className="text-xs text-purple-400/80 border border-purple-500/20 bg-purple-500/5 px-4 py-1 rounded-full mb-4 z-10">
              ✨ Special Offer
            </span>
            <h2 className="text-2xl font-bold mb-2 z-10">Siap belanja sekarang?</h2>
            <p className="text-gray-500 text-sm mb-6 z-10">Daftar sekarang dan dapatkan pengalaman belanja terbaik.</p>
            <Link to="/register" className="z-10">
              <button className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-purple-50 transition text-sm">
                Daftar Sekarang
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-8" />
    </div>
  )
}