import { Link, useNavigate, useLocation } from "react-router"
import { useState, useEffect, useRef } from "react"
import { logout, getCurrentUser } from "../services/authService"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map(word => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userName, setUserName] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isLoggedIn = userName !== null

  useEffect(() => {
    // Only fetch user if localStorage says we're logged in.
    // Never clear login state based on a failed fetch — the proxy/cookie issue
    // during dev would cause a false logout on every navigation.
    const authStatus = localStorage.getItem("is_logged_in") === "true"

    if (authStatus && !userName) {
      getCurrentUser()
        .then(data => {
          setUserName(data.name || data.username || "User")
        })
        .catch(() => {
          // Intentionally silent: don't punish the user if the verify call fails.
          // They stay logged in from localStorage's perspective.
          // Only a real logout clears the state.
        })
    }

    if (!authStatus) {
      setUserName(null)
    }
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      localStorage.removeItem("is_logged_in")
      setUserName(null)
      setDropdownOpen(false)
      navigate("/login")
    }
  }

  return (
    <nav className={`w-full sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${
      scrolled
        ? "bg-black/90 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-purple-500/5"
        : "bg-black/60 backdrop-blur-md border-b border-white/8"
    }`}>

      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
          <span className="text-purple-400 text-xs font-bold">M</span>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Mantis</span>
      </Link>

      <div className="flex items-center gap-8 text-sm">
        <Link to="/" className="text-gray-400 hover:text-white transition">Home</Link>
        <Link to="/products" className="text-gray-400 hover:text-white transition">Products</Link>
        {isLoggedIn && (
          <Link to="/cart" className="text-gray-400 hover:text-white transition relative">
            Cart
            <span className="absolute -top-1 -right-3 w-2 h-2 bg-purple-500 rounded-full" />
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 text-sm font-bold hover:bg-purple-500/30 hover:border-purple-400/60 transition-all duration-200"
              title={userName ?? undefined}
            >
              {getInitials(userName ?? "U")}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-3 border-b border-white/8">
                  <p className="text-xs text-gray-500">Masuk sebagai</p>
                  <p className="text-sm font-semibold text-white truncate">{userName}</p>
                </div>
                <div className="p-1">
                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition"
                  >
                    <span>📦</span> Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">
              <button className="px-4 py-2 text-sm text-gray-300 border border-white/10 rounded-xl hover:border-purple-500/30 hover:text-white transition">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="px-4 py-2 text-sm bg-white text-black font-semibold rounded-xl hover:bg-purple-50 transition">
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
