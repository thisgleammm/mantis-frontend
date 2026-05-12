import { Link, useNavigate, useLocation } from "react-router"
import { useTheme } from "../hooks/ThemeContext"
import { Button, Dropdown, Label, Header } from "@heroui/react"
import { Sun, Moon, ShoppingCart, Package, LogOut, User as UserIcon } from "lucide-react"
import { useCurrentUser } from "../hooks/queries"
import { useLogoutMutation } from "../hooks/mutations"

function getInitials(name: string): string {
  return name.split(" ").map(word => word[0]).slice(0, 2).join("").toUpperCase()
}

export default function AppNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useCurrentUser()
  const logoutMutation = useLogoutMutation()
  const { toggleTheme } = useTheme()

  const userName = user ? (user.name || user.username) : null
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("is_logged_in") === "true" && userName !== null

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
              <Dropdown.Trigger>
                <Button 
                  isIconOnly
                  variant="secondary" 
                  className="w-10 h-10 rounded-full font-bold text-sm bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all ml-2"
                >
                  {getInitials(userName ?? "U")}
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Popover className="min-w-[200px]">
                <Dropdown.Menu 
                  onAction={(key) => {
                    if (key === "orders") navigate("/orders")
                    if (key === "logout") handleLogout()
                  }}
                >
                  <Dropdown.Section>
                    <Header className="text-xs text-foreground/50 font-medium">Masuk sebagai</Header>
                    <Dropdown.Item id="profile" textValue={userName ?? "User"}>
                      <Label className="text-sm font-bold text-foreground">{userName}</Label>
                    </Dropdown.Item>
                  </Dropdown.Section>
                  <Dropdown.Item id="orders" textValue="Orders">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-foreground/60" />
                      <Label>Orders</Label>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item id="logout" textValue="Logout" variant="danger">
                    <div className="flex items-center gap-2">
                      <LogOut size={16} />
                      <Label>Logout</Label>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
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