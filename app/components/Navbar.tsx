import { Link, useNavigate, useLocation } from "react-router"
import { useState, useEffect } from "react"
import { logout, getCurrentUser } from "../services/authService"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Initial UI state from localStorage
    const authStatus = localStorage.getItem("is_logged_in") === "true"
    setIsLoggedIn(authStatus)

    // Verify session with backend on mount
    if (authStatus) {
      getCurrentUser()
        .catch(() => {
          // If backend says unauthorized, clear local flag
          localStorage.removeItem("is_logged_in")
          setIsLoggedIn(false)
        })
    }

    const handleScroll = () => setScrolled(window.scrollY > 20)

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [location])

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem("is_logged_in")
      setIsLoggedIn(false)
      navigate("/login")
    } catch (err) {
      console.error("Logout failed:", err)
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
          <>

            <Link to="/orders">
              <button className="px-4 py-2 text-sm text-gray-300 border border-white/10 rounded-xl hover:border-purple-500/30 hover:text-white transition">
                Orders
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-white text-black font-semibold rounded-xl hover:bg-purple-50 transition"
            >
              Logout
            </button>
          </>
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