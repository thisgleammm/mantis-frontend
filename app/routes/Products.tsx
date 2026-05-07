import { Link } from "react-router"
import { useState, useEffect } from "react"
import { getAllProducts } from "../services/productService"
import { ProductCardSkeleton } from "../components/Skeleton"
import { useTheme } from "../hooks/useTheme"
import type { Product } from "../types"

export default function Products() {
  const { isDark } = useTheme()
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
    <div className="min-h-screen px-6 py-10 font-sans bg-gray-50 text-black dark:bg-black dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 rounded-lg w-48 mb-2 animate-pulse bg-black/8 dark:bg-white/8" />
          <div className="h-4 rounded-lg w-24 animate-pulse bg-black/5 dark:bg-white/5" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen px-6 py-10 font-sans bg-gray-50 text-black dark:bg-black dark:text-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
            <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">
              <span className="text-purple-400">{filtered.length}</span> products found
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-72 pl-9 pr-4 py-3 rounded-xl border text-sm outline-none transition bg-white border-black/10 text-black placeholder-gray-400 focus:border-purple-500/40 focus:bg-purple-500/5 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-600 dark:focus:border-purple-500/40 dark:focus:bg-purple-500/5"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <h2 className="text-lg font-semibold mb-1 text-black dark:text-white">Produk tidak ditemukan</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500">Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(product => (
              <div
                key={product.id}
                className="group border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 bg-white border-black/8 hover:border-purple-500/30 hover:shadow-purple-500/10 dark:bg-white/4 dark:border-white/8 dark:hover:border-purple-500/30 dark:hover:shadow-purple-500/10"
              >
                {/* Image */}
                <div className="h-48 flex items-center justify-center text-5xl relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-zinc-800">
                  🛍️
                  <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-all duration-200" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-semibold mb-1 transition text-black group-hover:text-purple-700 dark:text-white dark:group-hover:text-purple-100">
                    {product.name}
                  </h3>
                  <p className="text-xs mb-3 line-clamp-2 text-gray-400 dark:text-gray-500">{product.description}</p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <p className="text-lg font-bold text-black dark:text-white">
                      Rp {product.base_price.toLocaleString("id-ID")}
                    </p>
                    {product.discount_price && (
                      <p className="text-xs line-through text-gray-400 dark:text-gray-500">
                        Rp {product.discount_price.toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Link to={`/products/${product.id}`} className="flex-1">
                      <button className="w-full py-2 rounded-xl border text-sm transition border-black/10 text-black hover:border-purple-500/40 hover:text-purple-600 dark:border-white/10 dark:text-white dark:hover:border-purple-500/40 dark:hover:text-purple-300">
                        Detail
                      </button>
                    </Link>
                    <Link to={`/cart`} className="flex-1">
                      <button className="w-full py-2 rounded-xl text-sm font-semibold transition bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-100">
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