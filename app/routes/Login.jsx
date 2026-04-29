import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { login } from "../services/authService"

export default function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleLogin = async () => {
        setLoading(true)
        setError("")
        try {
            const data = await login(form.email, form.password)

            if (data.token) {
                localStorage.setItem("token", data.token)
                navigate("/")
            } else {
                setError(data.message || "Login gagal")
            }
        } catch (err) {
            setError("Terjadi kesalahan, coba lagi")
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-black text-white flex ixtems-center justify-center px-6">
            <div className="w-full max-w-md">

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">Login Page</h1>
                </div>

                <div className="bg-white/4 border border-white/8 rounded-2xl p-8 backdrop-blur">

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="email@example.com"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-white/30 transition"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-white/30 transition"
                            />
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition text-sm mt-2 disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Login"}
                        </button>
                    </div>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Belum punya akun?{" "}
                        <Link to="/register" className="text-white hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}