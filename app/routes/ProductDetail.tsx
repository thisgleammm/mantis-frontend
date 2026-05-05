import { useParams, Link } from "react-router"
import { useState, useEffect } from "react"
import { getProductById } from "../services/productService"
import { ProductDetailSkeleton } from "../components/Skeleton"
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

export default function ProductDetail() {
  const { id } = useParams()
  const isDark = useTheme()
  const d = isDark
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProductById(id)
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div className={`min-h-screen px-6 py-10 font-sans transition-colors duration-300 ${d ? "bg-black text-white" : "bg-gray-50 text-black"}`}>
      <ProductDetailSkeleton isDark={d} />
    </div>
  )

  if (!product) return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${d ? "bg-black text-white" : "bg-gray-50 text-black"}`}>
      <p className={d ? "text-gray-400" : "text-gray-500"}>Produk tidak ditemukan.</p>
    </div>
  )

  return (
    <div className={`min-h-screen px-6 py-10 font-sans transition-colors duration-300 ${d ? "bg-black text-white" : "bg-gray-50 text-black"}`}>
      <div className="max-w-5xl mx-auto">

        <Link
          to="/products"
          className={`text-sm transition mb-8 inline-block ${d ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-black"}`}
        >
          ← Back to Products
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 mt-4">

          <div className={`flex-1 rounded-2xl flex items-center justify-center text-8xl min-h-72 ${d ? "bg-gradient-to-br from-zinc-900 to-zinc-800" : "bg-gradient-to-br from-gray-100 to-gray-200"}`}>
            🛍️
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${d ? "text-white" : "text-black"}`}>{product.name}</h1>
              <p className={`text-sm mb-6 ${d ? "text-gray-500" : "text-gray-500"}`}>{product.description}</p>

              <div className="mb-6">
                {product.discount_price ? (
                  <div className="flex items-center gap-3">
                    <p className={`text-3xl font-bold ${d ? "text-white" : "text-black"}`}>
                      Rp {product.discount_price.toLocaleString("id-ID")}
                    </p>
                    <p className={`text-lg line-through ${d ? "text-gray-500" : "text-gray-400"}`}>
                      Rp {product.base_price.toLocaleString("id-ID")}
                    </p>
                  </div>
                ) : (
                  <p className={`text-3xl font-bold ${d ? "text-white" : "text-black"}`}>
                    Rp {product.base_price.toLocaleString("id-ID")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="text-yellow-400">⭐</span>
                <span className={`text-sm ${d ? "text-gray-300" : "text-gray-600"}`}>
                  {product.rating_average ?? 0} / 5.0
                </span>
                <span className={`text-sm ${d ? "text-gray-600" : "text-gray-400"}`}>
                  ({product.rating_count ?? 0} reviews)
                </span>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <p className={`text-sm mb-2 ${d ? "text-gray-400" : "text-gray-500"}`}>Pilih Varian:</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        className={`px-4 py-2 rounded-xl border text-sm transition ${
                          d
                            ? "border-white/15 text-white hover:bg-white/10"
                            : "border-black/15 text-black hover:bg-black/5"
                        }`}
                      >
                        {v.variant_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button className={`flex-1 py-3 rounded-xl border text-sm transition ${
                d
                  ? "border-white/15 text-white hover:bg-white/10"
                  : "border-black/15 text-black hover:bg-black/5"
              }`}>
                + Tambah ke Cart
              </button>
              <button className={`flex-1 py-3 rounded-xl text-sm font-semibold transition ${d ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-zinc-800"}`}>
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className={`text-xl font-semibold mb-6 ${d ? "text-white" : "text-black"}`}>Reviews</h2>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="flex flex-col gap-4">
              {product.reviews.map(review => (
                <div key={review.id} className={`border rounded-2xl p-4 ${d ? "bg-white/4 border-white/8" : "bg-white border-black/8"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 text-sm">{"⭐".repeat(review.rating)}</span>
                    <span className={`text-xs ${d ? "text-gray-500" : "text-gray-400"}`}>{review.created_at?.slice(0, 10)}</span>
                  </div>
                  <p className={`text-sm ${d ? "text-gray-300" : "text-gray-600"}`}>{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-sm ${d ? "text-gray-600" : "text-gray-400"}`}>Belum ada review untuk produk ini.</p>
          )}
        </div>

      </div>
    </div>
  )
}