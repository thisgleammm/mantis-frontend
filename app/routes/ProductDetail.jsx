import { useParams, Link } from "react-router"
import { useState, useEffect } from "react"
import { getProductById } from "../services/productService"
import { ProductDetailSkeleton } from "../components/Skeleton"

export default function ProductDetail() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
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
        <div className="min-h-screen bg-black text-white px-6 py-10 font-sans">
            <ProductDetailSkeleton />
        </div>
    )   

    if (!product) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <p className="text-gray-400">Produk tidak ditemukan.</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-black text-white px-6 py-10 font-sans">
            <div className="max-w-5xl mx-auto">

                <Link to="/products" className="text-gray-500 text-sm hover:text-white transition mb-8 inline-block">
                    ← Back to Products
                </Link>

                <div className="flex flex-col lg:flex-row gap-10 mt-4">

                    <div className="flex-1 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl flex items-center justify-center text-8xl min-h-72">
                        🛍️
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                            <p className="text-gray-500 text-sm mb-6">{product.description}</p>

                            <div className="mb-6">
                                {product.discount_price ? (
                                    <div className="flex items-center gap-3">
                                        <p className="text-3xl font-bold">
                                            Rp {product.discount_price.toLocaleString("id-ID")}
                                        </p>
                                        <p className="text-gray-500 line-through text-lg">
                                            Rp {product.base_price.toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-3xl font-bold">
                                        Rp {product.base_price.toLocaleString("id-ID")}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-yellow-400">⭐</span>
                                <span className="text-sm text-gray-300">
                                    {product.rating_average ?? 0} / 5.0
                                </span>
                                <span className="text-gray-600 text-sm">
                                    ({product.rating_count ?? 0} reviews)
                                </span>
                            </div>

                            {product.variants && product.variants.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-sm text-gray-400 mb-2">Pilih Varian:</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {product.variants.map(v => (
                                            <button
                                                key={v.id}
                                                className="px-4 py-2 rounded-xl border border-white/15 text-sm hover:bg-white/10 transition"
                                            >
                                                {v.variant_name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button className="flex-1 py-3 rounded-xl border border-white/15 text-white text-sm hover:bg-white/10 transition">
                                + Tambah ke Cart
                            </button>
                            <button className="flex-1 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-200 transition">
                                Beli Sekarang
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-xl font-semibold mb-6">Reviews</h2>
                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {product.reviews.map(review => (
                                <div key={review.id} className="bg-white/4 border border-white/8 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-yellow-400 text-sm">{"⭐".repeat(review.rating)}</span>
                                        <span className="text-gray-500 text-xs">{review.created_at?.slice(0, 10)}</span>
                                    </div>
                                    <p className="text-sm text-gray-300">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-sm">Belum ada review untuk produk ini.</p>
                    )}
                </div>

            </div>
        </div>
    )
}