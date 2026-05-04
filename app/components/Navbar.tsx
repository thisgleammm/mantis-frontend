import { Link, useNavigate, useLocation } from "react-router"
import { useState, useEffect, useRef } from "react"
import { logout, getCurrentUser } from "../services/authService"
import { fontSans } from "../styles/fonts"

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
  const [isDark, setIsDark] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isLoggedIn = userName !== null

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"
    setIsDark(savedTheme === "dark")
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(savedTheme)
  }, [])

  useEffect(() => {
    const authStatus = localStorage.getItem("is_logged_in") === "true"

    if (authStatus && !userName) {
      getCurrentUser()
        .then(data => {
          setUserName(data.name || data.username || "User")
        })
        .catch(() => { })
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

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    setIsDark(!isDark)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(newTheme)
    window.dispatchEvent(new Event("themechange"))
  }

  const d = isDark

  return (
    <nav
      style={{ fontFamily: fontSans }}
      className={`w-full sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${scrolled
          ? d
            ? "bg-black/90 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-purple-500/5"
            : "bg-white/90 backdrop-blur-xl border-b border-purple-500/15 shadow-lg shadow-purple-500/5"
          : d
            ? "bg-black/60 backdrop-blur-md border-b border-white/8"
            : "bg-white/70 backdrop-blur-md border-b border-black/8"
        }`}
    >
      
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
          <span className="text-purple-400 text-xs font-black">M</span>
        </div>
        <span className={`font-black text-lg tracking-tight ${d ? "text-white" : "text-black"}`}
          style={{ fontFamily: fontSans }}
        >
          Mantis
        </span>
      </Link>

      
      <div className="flex items-center gap-8 text-sm font-medium tracking-wide">
        <Link to="/" className={`transition ${d ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}>
          Home
        </Link>
        <Link to="/products" className={`transition ${d ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}>
          Products
        </Link>
        {isLoggedIn && (
          <Link to="/cart" className={`relative transition ${d ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}>
            Cart
            <span className="absolute -top-1 -right-3 w-2 h-2 bg-purple-500 rounded-full" />
          </Link>
        )}
      </div>

      
      <div className="flex items-center gap-3">

        
        <button
          onClick={toggleTheme}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition text-base ${d
              ? "border-white/10 hover:border-white/25 text-gray-400 hover:text-white"
              : "border-black/10 hover:border-black/25 text-gray-500 hover:text-black"
            }`}
          title="Toggle theme"
        >
          {d ? "☀️" : "🌙"}
        </button>

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
              <div className={`absolute right-0 mt-2 w-52 border rounded-2xl shadow-2xl overflow-hidden z-50 ${d
                  ? "bg-zinc-900 border-white/10 shadow-black/50"
                  : "bg-white border-black/10 shadow-black/10"
                }`}>
                <div className={`px-4 py-3 border-b ${d ? "border-white/8" : "border-black/8"}`}>
                  <p className={`text-xs ${d ? "text-gray-500" : "text-gray-400"}`}>Masuk sebagai</p>
                  <p className={`text-sm font-bold truncate ${d ? "text-white" : "text-black"}`}>{userName}</p>
                </div>
                <div className="p-1">
                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-xl transition ${d
                        ? "text-gray-300 hover:bg-white/5 hover:text-white"
                        : "text-gray-600 hover:bg-black/5 hover:text-black"
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
          <>
            <Link to="/login">
              <button className={`px-4 py-2 text-sm border rounded-xl font-medium transition ${d
                  ? "text-gray-300 border-white/10 hover:border-white/25 hover:text-white"
                  : "text-gray-600 border-black/10 hover:border-black/25 hover:text-black"
                }`}>
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className={`px-4 py-2 text-sm font-bold rounded-xl transition shadow-sm ${d
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-black text-white hover:bg-zinc-800"
                }`}>
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}