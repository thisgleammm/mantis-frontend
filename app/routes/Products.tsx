import { Link } from "react-router"
import { useState, useEffect } from "react"
import { getAllProducts } from "../services/productService"
import { ProductCardSkeleton } from "../components/Skeleton"
import type { Product } from "../types"

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

export default function Products() {
  const isDark = useTheme()
  const d = isDark
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchProducts = () => {
      getAllProducts()
        .then(data => {
          setProducts(data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }

    fetchProducts()
    const interval = setInterval(fetchProducts, 5000)
    return () => clearInterval(interval)
  }, [])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className={`min-h-screen px-6 py-10 font-sans transition-colors duration-300 ${d ? "bg-black text-white" : "bg-gray-50 text-black"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className={`h-8 rounded-lg w-48 mb-2 animate-pulse ${d ? "bg-white/8" : "bg-black/8"}`} />
          <div className={`h-4 rounded-lg w-24 animate-pulse ${d ? "bg-white/5" : "bg-black/5"}`} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} isDark={d} />)}
        </div>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen px-6 py-10 font-sans transition-colors duration-300 ${d ? "bg-black text-white" : "bg-gray-50 text-black"}`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
            <p className={`text-sm mt-1 ${d ? "text-gray-500" : "text-gray-400"}`}>
              <span className="text-purple-400">{filtered.length}</span> products found
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${d ? "text-gray-500" : "text-gray-400"}`}>🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full sm:w-72 pl-9 pr-4 py-3 rounded-xl border text-sm outline-none transition ${
                d
                  ? "bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-purple-500/40 focus:bg-purple-500/5"
                  : "bg-white border-black/10 text-black placeholder-gray-400 focus:border-purple-500/40 focus:bg-purple-500/5"
              }`}
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <h2 className={`text-lg font-semibold mb-1 ${d ? "text-white" : "text-black"}`}>Produk tidak ditemukan</h2>
            <p className={`text-sm ${d ? "text-gray-500" : "text-gray-400"}`}>Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(product => (
              <div
                key={product.id}
                className={`group border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ${
                  d
                    ? "bg-white/4 border-white/8 hover:border-purple-500/30 hover:shadow-purple-500/10"
                    : "bg-white border-black/8 hover:border-purple-500/30 hover:shadow-purple-500/10"
                }`}
              >
                {/* Image */}
                <div className={`h-48 flex items-center justify-center text-5xl relative overflow-hidden ${d ? "bg-gradient-to-br from-zinc-900 to-zinc-800" : "bg-gradient-to-br from-gray-100 to-gray-200"}`}>
                  🛍️
                  <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-all duration-200" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className={`text-base font-semibold mb-1 transition ${d ? "text-white group-hover:text-purple-100" : "text-black group-hover:text-purple-700"}`}>
                    {product.name}
                  </h3>
                  <p className={`text-xs mb-3 line-clamp-2 ${d ? "text-gray-500" : "text-gray-400"}`}>{product.description}</p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <p className={`text-lg font-bold ${d ? "text-white" : "text-black"}`}>
                      Rp {product.base_price.toLocaleString("id-ID")}
                    </p>
                    {product.discount_price && (
                      <p className={`text-xs line-through ${d ? "text-gray-500" : "text-gray-400"}`}>
                        Rp {product.discount_price.toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Link to={`/products/${product.id}`} className="flex-1">
                      <button className={`w-full py-2 rounded-xl border text-sm transition ${
                        d
                          ? "border-white/10 text-white hover:border-purple-500/40 hover:text-purple-300"
                          : "border-black/10 text-black hover:border-purple-500/40 hover:text-purple-600"
                      }`}>
                        Detail
                      </button>
                    </Link>
                    <Link to={`/cart`} className="flex-1">
                      <button className={`w-full py-2 rounded-xl text-sm font-semibold transition ${d ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-zinc-800"}`}>
                        + Cart
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}