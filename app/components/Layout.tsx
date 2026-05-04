import { Link } from "react-router"

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">

        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <span className="text-purple-400 text-xs font-bold">M</span>
            </div>
            <h2 className="text-lg font-bold">Mantis</h2>
          </div>
          <p className="text-gray-500 text-sm">
            Premium products dengan tampilan bersih dan modern.
          </p>
          <div className="flex gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-purple-500/60" />
            <div className="w-2 h-2 rounded-full bg-purple-500/30" />
            <div className="w-2 h-2 rounded-full bg-purple-500/10" />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-300">Navigasi</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-purple-400 transition">Home</Link>
            <Link to="/products" className="hover:text-purple-400 transition">Products</Link>
            <Link to="/cart" className="hover:text-purple-400 transition">Cart</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-300">Akun</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <Link to="/login" className="hover:text-purple-400 transition">Login</Link>
            <Link to="/register" className="hover:text-purple-400 transition">Register</Link>
            <Link to="/orders" className="hover:text-purple-400 transition">Orders</Link>
          </div>
        </div>

      </div>

      <div className="border-t border-white/8 pt-6 text-center text-xs text-gray-600">
        © 2026 <span className="text-purple-400/60">Mantis</span> Store. All rights reserved.
      </div>
    </footer>
  )
}