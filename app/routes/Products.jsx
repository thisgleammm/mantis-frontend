import { Link } from "react-router"
import { useState, useEffect } from "react"
import { getAllProducts } from "../services/productService"
import { ProductCardSkeleton } from "../components/Skeleton"

export default function Products() {
  const [products, setProducts] = useState([])
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
  <div className="min-h-screen bg-black text-white px-6 py-10 font-sans">
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="h-8 bg-white/8 rounded-lg w-48 mb-2 animate-pulse" />
        <div className="h-4 bg-white/5 rounded-lg w-24 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    </div>
  </div>
)

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
            <p className="text-gray-500 text-sm mt-1">
              <span className="text-purple-400">{filtered.length}</span> products found
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-72 pl-9 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-purple-500/40 focus:bg-purple-500/5 transition"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <h2 className="text-lg font-semibold mb-1">Produk tidak ditemukan</h2>
            <p className="text-gray-500 text-sm">Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(product => (
              <div
                key={product.id}
                className="group bg-white/4 border border-white/8 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center text-5xl relative overflow-hidden">
                  🛍️
                  <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-all duration-200" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-semibold mb-1 group-hover:text-purple-100 transition">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <p className="text-lg font-bold">
                      Rp {product.base_price.toLocaleString("id-ID")}
                    </p>
                    {product.discount_price && (
                      <p className="text-xs text-gray-500 line-through">
                        Rp {product.discount_price.toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Link to={`/products/${product.id}`} className="flex-1">
                      <button className="w-full py-2 rounded-xl border border-white/10 text-white text-sm hover:border-purple-500/40 hover:text-purple-300 transition">
                        Detail
                      </button>
                    </Link>
                    <Link to={`/cart`} className="flex-1">
                      <button className="w-full py-2 rounded-xl border border-white text-black text-sm hover:border-purple-500/40 hover:text-purple-300 transition bg-white">
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