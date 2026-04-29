import { Link } from "react-router"
import { useState, useEffect } from "react"
import { getAllProducts } from "../services/productService"

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
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <p className="text-gray-400">Loading...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-black text-white px-6 py-10 font-sans">

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
                <p className="text-gray-500 text-sm mt-1">{filtered.length} products found</p>
            </div>

            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm outline-none focus:border-white/30 backdrop-blur transition"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map(product => (
                    <div
                        key={product.id}
                        className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden backdrop-blur-md hover:-translate-y-1 hover:border-white/20 transition-all duration-200"
                    >
                        <div className="h-48 bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center text-5xl">
                            🛍️
                        </div>
                        <div className="p-4">
                            <h3 className="text-base font-semibold mt-1 mb-1">{product.name}</h3>
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                            <p className="text-lg font-bold mb-4">
                                Rp {product.base_price.toLocaleString("id-ID")}
                            </p>
                            <div className="flex gap-2">
                                <Link to={`/products/${product.id}`} className="flex-1">
                                    <button className="w-full py-2 rounded-xl border border-white/15 text-white text-sm hover:bg-white/10 transition">
                                        Detail
                                    </button>
                                </Link>
                                <button className="flex-1 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-200 transition">
                                    + Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}