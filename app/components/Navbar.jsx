import { Link } from "react-router"

export default function Navbar() {
    return (
        <nav className="w-full bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <Link to="/" className="text-white font-bold text-xl tracking-tight">
                Mantis
            </Link>
            <div className="flex items-center gap-6 text-sm text-gray-400">
                <Link to="/" className="hover:text-white transition">Home</Link>
                <Link to="/products" className="hover:text-white transition">Products</Link>
                <Link to="/cart" className="hover:text-white transition">Cart</Link>
            </div>
            <div className="flex items-center gap-3">
                <Link to="/login">
                    <button className="px-4 py-2 text-sm text-white border border-white/20 rounded-xl hover:bg-white/10 transition">
                        Login
                    </button>
                </Link>
                <Link to="/register">
                    <button className="px-4 py-2 text-sm bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition">
                        Register
                    </button>
                </Link>
            </div>
        </nav>
    )
}   