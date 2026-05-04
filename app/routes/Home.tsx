import { Link } from "react-router"
import { useState, useEffect } from "react"
import { getAllProducts } from "../services/productService"
import type { Product } from "../types"

const categories = [
  { name: "T-Shirt", icon: "👕" },
  { name: "Laptop", icon: "💻" },
  { name: "Audio", icon: "🎧" },
  { name: "Shoes", icon: "👟" },
  { name: "Watch", icon: "⌚" },
  { name: "Tablet", icon: "📟" },
  { name: "Smartphone", icon: "📱" },
  { name: "All", icon: "🛍️" },
]

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now()
    if (diff <= 0) return { h: 0, m: 0, s: 0 }
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(t)
  }, [])
  return time
}

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true
    return (localStorage.getItem("theme") || "dark") === "dark"
  })

  useEffect(() => {
    const handler = () => {
      setIsDark((localStorage.getItem("theme") || "dark") === "dark")
    }
    window.addEventListener("themechange", handler)
    return () => window.removeEventListener("themechange", handler)
  }, [])

  return isDark
}

export default function Home() {
  const isDark = useTheme()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [flashProducts, setFlashProducts] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState("Best Seller")

  const flashEnd = new Date(Date.now() + 6 * 3600000)
  const { h, m, s } = useCountdown(flashEnd)

  useEffect(() => {
    getAllProducts()
      .then(data => {
        setFeaturedProducts(data.slice(0, 8))
        setFlashProducts(data.slice(0, 5))
      })
      .catch(err => console.error(err))
  }, [])

  const pad = (n: number) => String(n).padStart(2, "0")
  const tabs = ["Best Seller", "Keep Stylish", "Special Discount", "Official Store"]
  const d = isDark

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${d ? "bg-black text-white" : "bg-gray-50 text-black"}`}
      style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}
    >

      <section className={`relative overflow-hidden border-b ${d ? "border-white/8" : "border-black/8"}`}>
        <div className={`absolute inset-0 pointer-events-none ${d ? "bg-gradient-to-br from-white/3 via-transparent to-purple-500/5" : "bg-gradient-to-br from-purple-500/5 via-transparent to-gray-100"}`} />
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 z-10">
            <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full tracking-widest uppercase">
              🔥 Limited Time Offer
            </span>
            <h1 className="mt-5 mb-3 leading-none" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              <span className={`block text-6xl font-black tracking-tight ${d ? "text-white" : "text-black"}`}>Up to</span>
              <span className="block text-7xl font-black tracking-tight" style={{ WebkitTextStroke: "2px #a855f7", color: "transparent" }}>50% OFF</span>
            </h1>
            <p className={`text-base mb-1 font-light tracking-wide ${d ? "text-gray-400" : "text-gray-600"}`}>Premium Products, Minimal Aesthetic.</p>
            <p className={`text-sm mb-8 max-w-sm leading-relaxed ${d ? "text-gray-600" : "text-gray-500"}`}>
              Temukan produk teknologi terbaik dengan tampilan yang bersih dan modern.
            </p>
            <div className="flex gap-3">
              <Link to="/products">
                <button className={`px-7 py-3 font-bold rounded-2xl transition text-sm tracking-wide shadow-lg ${d ? "bg-white text-black hover:bg-gray-100 shadow-white/10" : "bg-black text-white hover:bg-zinc-800 shadow-black/10"}`}>
                  Shop Now →
                </button>
              </Link>
              <Link to="/products">
                <button className={`px-7 py-3 border rounded-2xl transition text-sm tracking-wide ${d ? "border-white/15 text-white hover:border-white/30" : "border-black/15 text-black hover:border-black/30"}`}>
                  Browse All
                </button>
              </Link>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center z-10">
            <div className="relative w-80 h-72">
              <div className={`absolute inset-0 border rounded-3xl flex items-center justify-center text-8xl shadow-2xl ${d ? "bg-white/4 border-white/10" : "bg-black/4 border-black/10"}`}>
                🛍️
              </div>
              <div className={`absolute -top-4 -right-4 text-xs font-black px-4 py-2 rounded-2xl shadow-lg ${d ? "bg-white text-black" : "bg-black text-white"}`}>
                50% OFF
              </div>
              <div className={`absolute -bottom-4 -left-4 border backdrop-blur rounded-2xl px-4 py-3 text-xs shadow-lg ${d ? "bg-white/8 border-white/15" : "bg-black/5 border-black/10"}`}>
                <p className={`text-[10px] uppercase tracking-widest mb-1 ${d ? "text-gray-400" : "text-gray-500"}`}>Best Seller</p>
                <p className={`font-bold ${d ? "text-white" : "text-black"}`}>Macbook Pro M5</p>
                <p className={`text-[11px] ${d ? "text-gray-300" : "text-gray-500"}`}>Rp 35.000.000</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 pb-6">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? d ? "w-6 bg-white" : "w-6 bg-black" : d ? "w-2 bg-white/20" : "w-2 bg-black/20"}`} />
          ))}
        </div>
      </section>

      <section className={`border-b px-6 py-6 ${d ? "border-white/8" : "border-black/8"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {categories.map(cat => (
              <Link to="/products" key={cat.name}>
                <div className={`group flex flex-col items-center gap-2 p-3 rounded-2xl transition cursor-pointer ${d ? "hover:bg-white/5" : "hover:bg-black/5"}`}>
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-200 ${d ? "bg-white/5 border-white/8 group-hover:border-white/20" : "bg-black/5 border-black/8 group-hover:border-black/20"}`}>
                    {cat.icon}
                  </div>
                  <span className={`text-[10px] transition text-center font-medium tracking-wide ${d ? "text-gray-500 group-hover:text-white" : "text-gray-400 group-hover:text-black"}`}>{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`px-6 py-10 border-b ${d ? "border-white/8" : "border-black/8"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-black tracking-tight">⚡ Flash Sale</h2>
              <div className="flex items-center gap-1">
                {[pad(h), pad(m), pad(s)].map((val, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-lg min-w-[28px] text-center ${d ? "bg-white text-black" : "bg-black text-white"}`}>{val}</span>
                    {i < 2 && <span className={`font-bold text-sm ${d ? "text-white/50" : "text-black/50"}`}>:</span>}
                  </span>
                ))}
              </div>
            </div>
            <Link to="/products" className={`text-sm transition font-medium ${d ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}>
              View All →
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {flashProducts.map(product => (
              <div
                key={product.id}
                className={`group flex-shrink-0 w-44 border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200 ${d ? "bg-white/4 border-white/8 hover:border-white/20 hover:shadow-black/50" : "bg-white border-black/8 hover:border-black/20 hover:shadow-black/10"}`}
              >
                <div className={`relative h-36 flex items-center justify-center text-4xl ${d ? "bg-gradient-to-br from-zinc-900 to-zinc-800" : "bg-gradient-to-br from-gray-100 to-gray-200"}`}>
                  🛍️
                  <div className={`absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full ${d ? "bg-white text-black" : "bg-black text-white"}`}>
                    SALE
                  </div>
                </div>
                <div className="p-3">
                  <h3 className={`text-xs font-semibold mb-1 line-clamp-2 transition leading-relaxed ${d ? "text-white group-hover:text-white" : "text-black"}`}>{product.name}</h3>
                  <p className={`text-sm font-black ${d ? "text-white" : "text-black"}`}>
                    Rp {product.base_price.toLocaleString("id-ID")}
                  </p>
                  <div className={`w-full rounded-full h-1 mt-2 ${d ? "bg-white/10" : "bg-black/10"}`}>
                    <div className="bg-purple-500 h-1 rounded-full w-3/4" />
                  </div>
                  <p className={`text-[10px] mt-1 ${d ? "text-gray-500" : "text-gray-400"}`}>75% sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`px-6 py-10 border-b ${d ? "border-white/8" : "border-black/8"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-black tracking-tight">Todays For You!</h2>
            <div className="flex gap-2 flex-wrap">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition tracking-wide ${activeTab === tab
                      ? d ? "bg-white text-black shadow-lg shadow-white/10" : "bg-black text-white shadow-lg shadow-black/10"
                      : d ? "border border-white/10 text-gray-500 hover:border-white/25 hover:text-white" : "border border-black/10 text-gray-400 hover:border-black/25 hover:text-black"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map(product => (
              <div
                key={product.id}
                className={`group border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200 ${d ? "bg-white/4 border-white/8 hover:border-white/20 hover:shadow-black/50" : "bg-white border-black/8 hover:border-black/15 hover:shadow-black/10"}`}
              >
                <div className={`relative h-40 flex items-center justify-center text-4xl ${d ? "bg-gradient-to-br from-zinc-900 to-zinc-800" : "bg-gradient-to-br from-gray-100 to-gray-200"}`}>
                  🛍️
                  <button className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm transition ${d ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"}`}>
                    🤍
                  </button>
                </div>
                <div className="p-3">
                  <h3 className={`text-sm font-semibold mb-1 line-clamp-2 transition leading-relaxed ${d ? "text-white" : "text-black"}`}>{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className={`text-xs font-medium ${d ? "text-gray-400" : "text-gray-500"}`}>{product.rating_average ?? 0}</span>
                    <span className={`text-xs ${d ? "text-gray-600" : "text-gray-400"}`}>• {product.rating_count ?? 0} sold</span>
                  </div>
                  <p className={`text-sm font-black mb-3 ${d ? "text-white" : "text-black"}`}>
                    Rp {product.base_price.toLocaleString("id-ID")}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/products/${product.id}`} className="flex-1">
                      <button className={`w-full py-1.5 rounded-xl border text-xs transition font-medium ${d ? "border-white/10 text-gray-400 hover:border-white/25 hover:text-white" : "border-black/10 text-gray-500 hover:border-black/25 hover:text-black"}`}>
                        Detail
                      </button>
                    </Link>
                    <button className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${d ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-zinc-800"}`}>
                      + Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className={`relative border rounded-3xl p-12 flex flex-col items-center text-center overflow-hidden ${d ? "bg-white/4 border-white/10" : "bg-white border-black/10 shadow-lg"}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />
            <span className="text-xs text-purple-400 border border-purple-500/20 bg-purple-500/5 px-4 py-1 rounded-full mb-5 z-10 tracking-widest uppercase">
              ✨ Special Offer
            </span>
            <h2 className={`text-3xl font-black mb-2 z-10 tracking-tight ${d ? "text-white" : "text-black"}`} style={{ fontFamily: "'Georgia', serif" }}>
              "Shop Beyond Boundaries"
            </h2>
            <p className={`text-sm mb-8 z-10 max-w-sm leading-relaxed ${d ? "text-gray-500" : "text-gray-500"}`}>
              Daftar sekarang dan dapatkan pengalaman belanja terbaik.
            </p>
            <Link to="/register" className="z-10">
              <button className={`px-8 py-3 font-bold rounded-2xl transition text-sm tracking-wide shadow-lg ${d ? "bg-white text-black hover:bg-gray-100 shadow-white/10" : "bg-black text-white hover:bg-zinc-800 shadow-black/10"}`}>
                Daftar Sekarang →
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  )
}