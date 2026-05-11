import { Link, useNavigate, useLocation } from "react-router"
import { useState, useEffect } from "react"
import { useTheme } from "../hooks/useTheme"
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react"
import { Sun, Moon, ShoppingCart, Package, LogOut, User as UserIcon } from "lucide-react"
import { logout, getCurrentUser } from "../services/authService"

function getInitials(name: string): string {
  return name.split(" ").map(word => word[0]).slice(0, 2).join("").toUpperCase()
}

export default function AppNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userName, setUserName] = useState<string | null>(null)
  const { toggleTheme } = useTheme()

  const isLoggedIn = userName !== null

  // Auth
  useEffect(() => {
    const authStatus = localStorage.getItem("is_logged_in") === "true"
    if (authStatus && !userName) {
      getCurrentUser()
        .then(data => setUserName(data.name || data.username || "User"))
        .catch(() => { })
    }
    if (!authStatus) setUserName(null)
  }, [location.pathname, userName])

  const handleLogout = async () => {
    try { await logout() } catch { }
    finally {
      localStorage.removeItem("is_logged_in")
      setUserName(null)
      navigate("/login")
    }
  }

  const handleCartClick = (e: any) => {
    if (!isLoggedIn) {
      e.preventDefault()
      navigate("/login")
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        
        {/* Brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <span className="text-accent text-sm font-black">M</span>
            </div>
            <span className="font-black text-xl tracking-tight text-foreground">
              Mantis
            </span>
          </Link>
        </div>

        {/* Center Links */}
        <ul className="hidden sm:flex items-center gap-8">
          <li className="relative h-16 flex items-center">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${isActive("/") ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}
            >
              Home
            </Link>
            {isActive("/") && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-[2px] bg-foreground" />
            )}
          </li>
          <li className="relative h-16 flex items-center">
            <Link 
              to="/products" 
              className={`text-sm font-medium transition-colors ${isActive("/products") ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}
            >
              Products
            </Link>
            {isActive("/products") && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-[2px] bg-foreground" />
            )}
          </li>
        </ul>

        {/* Right Content */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button isIconOnly variant="ghost" onPress={toggleTheme} className="text-foreground/70 h-10 w-10 border-transparent bg-transparent hover:bg-foreground/5">
            <Moon size={20} className="block dark:hidden" />
            <Sun size={20} className="hidden dark:block" />
          </Button>
          
          <Link to="/cart" onClick={handleCartClick} className="block">
            <Button isIconOnly variant="ghost" className="text-foreground/70 h-10 w-10 border-transparent bg-transparent hover:bg-foreground/5">
              <ShoppingCart size={20} />
            </Button>
          </Link>

          {isLoggedIn ? (
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  isIconOnly
                  variant="secondary" 
                  className="w-10 h-10 rounded-full font-bold text-sm bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all ml-2"
                >
                  {getInitials(userName ?? "U")}
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="User menu"
                className="bg-background border border-border/50 shadow-xl shadow-black/5 dark:shadow-black/40 rounded-2xl min-w-48 p-1"
              >
                <DropdownItem key="profile" textValue="Profile" className="h-14 gap-2 opacity-100 cursor-default pointer-events-none mb-1 px-3">
                  <span className="text-xs text-foreground/50 font-medium block">Masuk sebagai</span>
                  <span className="text-sm font-bold truncate text-foreground block">{userName}</span>
                </DropdownItem>
                <DropdownItem 
                  key="orders" 
                  href="/orders" 
                  textValue="Orders"
                  className="text-foreground/80 font-medium rounded-xl mb-1 px-3 flex items-center gap-2"
                >
                  <Package size={16} className="text-foreground/60"/>
                  <span>Orders</span>
                </DropdownItem>
                <DropdownItem 
                  key="logout" 
                  textValue="Logout"
                  className="text-danger font-medium rounded-xl px-3 flex items-center gap-2 data-[hovered]:bg-danger/10" 
                  onAction={handleLogout}
                >
                  <LogOut size={16}/>
                  <span className="text-danger">Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Link to="/login" className="flex items-center ml-2">
              <Button variant="outline" className="font-semibold text-foreground border-border/60 hover:border-foreground/40 hover:bg-foreground/5 hidden sm:flex h-10 px-5 rounded-xl transition-colors">
                Get Started
              </Button>
              <Button isIconOnly variant="outline" className="text-foreground border-border/60 hover:bg-foreground/5 sm:hidden h-10 w-10 rounded-xl">
                <UserIcon size={18} />
              </Button>
            </Link>
          )}
        </div>

      </header>
    </nav>
  )
}