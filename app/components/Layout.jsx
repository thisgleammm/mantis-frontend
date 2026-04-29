import { Link } from "react-router"

export default function Footer() {
    return (
        <footer className="border-t border-white/8 bg-black text-white px-6 py-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
                <div>
                    <h2 className="text-lg font-bold mb-2">Mantis</h2>
                    <p className="text-gray-500 text-sm">
                        Premium products dengan tampilan bersih dan modern.
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-300">Navigasi</h3>
                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-white transition">Home</Link>
                        <Link to="/products" className="hover:text-white transition">Products</Link>
                        <Link to="/cart" className="hover:text-white transition">Cart</Link>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-300">Akun</h3>
                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                        <Link to="/login" className="hover:text-white transition">Login</Link>
                        <Link to="/register" className="hover:text-white transition">Register</Link>
                        <Link to="/orders" className="hover:text-white transition">Orders</Link>
                    </div>
                </div>

            </div>

            <div className="border-t border-white/8 pt-6 text-center text-xs text-gray-600">
                © 2026 Mantis Store. All rights reserved.
            </div>
        </footer>
    )
}