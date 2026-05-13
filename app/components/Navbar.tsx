import { Link, useNavigate, useLocation } from "react-router"
import { useTheme } from "../hooks/ThemeContext"
import { Button, Dropdown, Label, Header, Kbd } from "@heroui/react"
import { Sun, Moon, ShoppingCart, Package, LogOut, User as UserIcon, Search, Menu } from "lucide-react"
import { useCurrentUser, useCart } from "../hooks/queries"
import { useLogoutMutation } from "../hooks/mutations"
import { useState, useEffect, useRef } from "react"

function getInitials(name: string): string {
  return name.split(" ").map(word => word[0]).slice(0, 2).join("").toUpperCase()
}

export default function AppNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useCurrentUser()
  const { data: cartData } = useCart()
  const logoutMutation = useLogoutMutation()
  const { toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [platform, setPlatform] = useState<"mac" | "windows">("mac")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const userName = user ? (user.name || user.username) : null
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("is_logged_in") === "true" && userName !== null
  const cartItemCount = cartData?.items?.length || 0

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPlatform(navigator.platform.toUpperCase().indexOf("MAC") >= 0 ? "mac" : "windows")
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("is_logged_in")
        localStorage.removeItem("token")
        document.cookie = "is_logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        navigate("/login")
      },
    })
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="fixed top-0 z-50 w-full px-6 py-4 pointer-events-none">
      <nav
        className={`mx-auto max-w-6xl w-full flex items-center justify-between px-6 h-16 rounded-2xl border transition-all duration-300 pointer-events-auto
          ${isScrolled
            ? "bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-black/5 dark:border-white/10 shadow-xl py-2"
            : "bg-white/40 dark:bg-black/20 backdrop-blur-md border-transparent shadow-none py-4"}
        `}
      >
        {/* Left: Brand & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button isIconOnly variant="ghost" className="sm:hidden text-foreground/70">
            <Menu size={20} />
          </Button>

          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
              <span className="text-white text-base font-black">M</span>
            </div>
            <span className="hidden sm:block font-black text-xl tracking-tighter text-foreground uppercase">
              Mantis
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation & Search */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center max-w-md px-10">
          <ul className="flex items-center gap-6">
            <li>
              <Link
                to="/products"
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive("/products") ? "text-purple-600" : "text-foreground/40 hover:text-foreground"}`}
              >
                Catalog
              </Link>
            </li>
            <li className="h-4 w-[1px] bg-foreground/10" />
            <li className="relative group w-64">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30 group-hover:text-foreground/50 transition-colors pointer-events-none">
                <Search size={14} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                defaultValue={new URLSearchParams(location.search).get("q") || ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/products?q=${encodeURIComponent(e.currentTarget.value)}`)
                    e.currentTarget.blur()
                  }
                }}
                className="w-full h-10 pl-9 pr-14 text-xs rounded-xl bg-foreground/5 border border-transparent focus:border-purple-500/30 outline-none transition-all placeholder:text-foreground/30 text-foreground"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Kbd className="scale-75 origin-right opacity-40">
                  <Kbd.Abbr keyValue={platform === "mac" ? "command" : "ctrl"} />
                  <Kbd.Content>K</Kbd.Content>
                </Kbd>
              </div>
            </li>
          </ul>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            variant="ghost"
            onPress={toggleTheme}
            className="text-foreground/60 h-10 w-10 border-transparent bg-transparent hover:bg-foreground/5 transition-colors"
          >
            <Moon size={18} className="block dark:hidden" />
            <Sun size={18} className="hidden dark:block" />
          </Button>

          <Link to="/cart">
            <Button
              isIconOnly
              variant="ghost"
              className="relative text-foreground/60 h-10 w-10 border-transparent bg-transparent hover:bg-foreground/5 transition-colors"
            >
              <ShoppingCart size={18} />
              {cartItemCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-purple-600 text-[9px] font-black text-white flex items-center justify-center animate-in zoom-in duration-300">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>

          <div className="w-[1px] h-4 bg-foreground/10 mx-1" />

          {isLoggedIn ? (
            <Dropdown>
              <Button
                isIconOnly
                variant="secondary"
                className="w-10 h-10 rounded-full font-bold text-sm bg-purple-600/10 text-purple-600 border border-purple-600/20 hover:bg-purple-600/20 transition-all shadow-sm flex items-center justify-center pointer-events-auto"
              >
                {getInitials(userName ?? "U")}
              </Button>
              <Dropdown.Popover className="min-w-[220px] bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-black/5 dark:border-white/10 shadow-2xl rounded-2xl">
                <Dropdown.Menu
                  onAction={(key) => {
                    if (key === "orders") navigate("/orders")
                    if (key === "logout") handleLogout()
                  }}
                >
                  <Dropdown.Section>
                    <Header className="text-[10px] text-foreground/30 font-black uppercase tracking-widest px-2 mb-1">Account</Header>
                    <Dropdown.Item id="profile" textValue={userName ?? "User"}>
                      <div className="flex flex-col py-1">
                        <span className="text-sm font-bold text-foreground">{userName}</span>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Section>
                  <Dropdown.Item id="orders" textValue="Orders">
                    <div className="flex items-center gap-3 py-1">
                      <Package size={16} className="text-foreground/40" />
                      <span className="font-medium text-sm">Order History</span>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item id="logout" textValue="Logout" variant="danger">
                    <div className="flex items-center gap-3 py-1 text-red-500">
                      <LogOut size={16} />
                      <span className="font-medium text-sm">Sign Out</span>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button
                variant="primary"
                className="font-bold text-[10px] uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black h-10 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/10 dark:shadow-white/10"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}