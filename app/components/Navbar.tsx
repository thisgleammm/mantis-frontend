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

// Cart icon SVG
function CartIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-5 h-5"}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userName, setUserName] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isLoggedIn = userName !== null

  // Init theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"
    setIsDark(savedTheme === "dark")
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(savedTheme)
  }, [])

  // Listen for theme changes from other components
  useEffect(() => {
    const handler = () => setIsDark((localStorage.getItem("theme") || "dark") === "dark")
    window.addEventListener("themechange", handler)
    return () => window.removeEventListener("themechange", handler)
  }, [])

  // Auth
  useEffect(() => {
    const authStatus = localStorage.getItem("is_logged_in") === "true"
    if (authStatus && !userName) {
      getCurrentUser()
        .then(data => setUserName(data.name || data.username || "User"))
        .catch(() => { })
    }
    if (!authStatus) setUserName(null)
  }, [location.pathname])

  // Scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Click outside dropdown
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
    try { await logout() } catch { }
    finally {
      localStorage.removeItem("is_logged_in")
      setUserName(null)
      setDropdownOpen(false)
      navigate("/login")
    }
  }

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    setIsDark(!isDark)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(newTheme)
    window.dispatchEvent(new Event("themechange"))
  }

  // Cart click — redirect to login if not logged in
  const handleCartClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault()
      navigate("/login")
    }
  }

  const d = isDark

  const navLink = `text-sm font-medium transition-colors ${d ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`
  const activeNavLink = `text-sm font-medium ${d ? "text-white" : "text-black"}`

  const isActive = (path: string) => location.pathname === path

  return (
    <nav
      style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif" }}
      className={`w-full sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? d
            ? "bg-black/90 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-purple-500/5"
            : "bg-white/90 backdrop-blur-xl border-b border-purple-500/15 shadow-lg shadow-purple-500/5"
          : d
            ? "bg-black/60 backdrop-blur-md border-b border-white/8"
            : "bg-white/70 backdrop-blur-md border-b border-black/8"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
          <span className="text-purple-400 text-xs font-black">M</span>
        </div>
        <span className={`font-black text-lg tracking-tight ${d ? "text-white" : "text-black"}`}>
          Mantis
        </span>
      </Link>

      {/* Center nav links */}
      <div className="hidden sm:flex items-center gap-7">
        <Link to="/" className={isActive("/") ? activeNavLink : navLink}>Home</Link>
        <Link to="/products" className={isActive("/products") ? activeNavLink : navLink}>Products</Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition text-base ${
            d
              ? "border-white/10 hover:border-white/25 text-gray-400 hover:text-white"
              : "border-black/10 hover:border-black/25 text-gray-500 hover:text-black"
          }`}
          title="Toggle theme"
        >
          {d ? "☀️" : "🌙"}
        </button>

        {/* Cart — always visible, redirect to login if not logged in */}
        <Link
          to="/cart"
          onClick={handleCartClick}
          title="Cart"
          className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition ${
            d
              ? "border-white/10 hover:border-white/25 text-gray-400 hover:text-white"
              : "border-black/10 hover:border-black/25 text-gray-500 hover:text-black"
          }`}
        >
          <CartIcon className="w-4 h-4" />
          {/* Dot indicator only when logged in */}
          {isLoggedIn && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full" />
          )}
        </Link>

        {/* User section */}
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 text-sm font-black hover:bg-purple-500/30 hover:border-purple-400/60 transition-all duration-200"
              title={userName ?? undefined}
            >
              {getInitials(userName ?? "U")}
            </button>

            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-52 border rounded-2xl shadow-2xl overflow-hidden z-50 ${
                d ? "bg-zinc-900 border-white/10 shadow-black/50" : "bg-white border-black/10 shadow-black/10"
              }`}>
                <div className={`px-4 py-3 border-b ${d ? "border-white/8" : "border-black/8"}`}>
                  <p className={`text-xs ${d ? "text-gray-500" : "text-gray-400"}`}>Masuk sebagai</p>
                  <p className={`text-sm font-bold truncate ${d ? "text-white" : "text-black"}`}>{userName}</p>
                </div>
                <div className="p-1">
                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-xl transition ${
                      d ? "text-gray-300 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-black/5 hover:text-black"
                    }`}
                  >
                    <span>📦</span> Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Login + Register — side by side, compact */
          <div className="flex items-center gap-2 ml-1">
            <Link to="/login">
              <button className={`px-4 py-2 text-sm font-medium rounded-xl border transition ${
                d
                  ? "text-gray-300 border-white/10 hover:border-white/25 hover:text-white"
                  : "text-gray-600 border-black/10 hover:border-black/25 hover:text-black"
              }`}>
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className={`px-4 py-2 text-sm font-bold rounded-xl transition ${
                d ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-zinc-800"
              }`}>
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}