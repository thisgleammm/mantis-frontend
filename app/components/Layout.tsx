import { Link } from "react-router"
import { useState, useEffect } from "react"
import { fontSans } from "../styles/fonts"

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

export default function Footer() {
  const isDark = useTheme()
  const d = isDark

  return (
    <footer style={{ fontFamily: fontSans }}
      className={`border-t px-6 py-12 transition-colors duration-300 ${d ? "border-white/8 bg-black text-white" : "border-black/8 bg-gray-50 text-black"}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">

        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <span className="text-purple-400 text-xs font-black">M</span>
            </div>
            <h2 className={`text-lg font-black ${d ? "text-white" : "text-black"}`} style={{ fontFamily: fontSans }}>Mantis</h2>
          </div>
          <p className={`text-sm ${d ? "text-gray-500" : "text-gray-400"}`}>
            Premium products dengan tampilan bersih dan modern.
          </p>
          <div className="flex gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-purple-500/60" />
            <div className="w-2 h-2 rounded-full bg-purple-500/30" />
            <div className="w-2 h-2 rounded-full bg-purple-500/10" />
          </div>
        </div>

        <div>
          <h3 className={`text-sm font-semibold mb-3 ${d ? "text-gray-300" : "text-gray-700"}`}>Navigasi</h3>
          <div className={`flex flex-col gap-2 text-sm ${d ? "text-gray-500" : "text-gray-400"}`}>
            <Link to="/" className="hover:text-purple-400 transition">Home</Link>
            <Link to="/products" className="hover:text-purple-400 transition">Products</Link>
            <Link to="/cart" className="hover:text-purple-400 transition">Cart</Link>
          </div>
        </div>

        <div>
          <h3 className={`text-sm font-semibold mb-3 ${d ? "text-gray-300" : "text-gray-700"}`}>Akun</h3>
          <div className={`flex flex-col gap-2 text-sm ${d ? "text-gray-500" : "text-gray-400"}`}>
            <Link to="/login" className="hover:text-purple-400 transition">Login</Link>
            <Link to="/register" className="hover:text-purple-400 transition">Register</Link>
            <Link to="/orders" className="hover:text-purple-400 transition">Orders</Link>
          </div>
        </div>

      </div>

      <div className={`border-t pt-6 text-center text-xs ${d ? "border-white/8 text-gray-600" : "border-black/8 text-gray-400"}`}>
        © 2026 <span className="text-purple-400/60">Mantis</span> Store. All rights reserved.
      </div>
    </footer>
  )
}