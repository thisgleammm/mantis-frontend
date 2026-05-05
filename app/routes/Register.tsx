import { Link, Form, redirect, useNavigation, useActionData } from "react-router";
import { register } from "../services/authService";
import { useState, useEffect } from "react";

export async function clientAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone_number = formData.get("phone_number") as string;
    const password = formData.get("password") as string;

    if (!username || !name || !email || !phone_number || !password) {
        return { error: "Semua field harus diisi" };
    }

    try {
        const data = await register(username, name, email, password, phone_number);

        if (data.id || data.token || data.message === "success") {
            return redirect("/login");
        } else {
            return { error: data.message || data.error || "Pendaftaran gagal. Pastikan data yang Anda masukkan benar." };
        }
    } catch (err) {
        return { error: "Gagal terhubung ke server. Pastikan koneksi internet Anda stabil." };
    }
}

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

export default function Register() {
    const actionData = useActionData<typeof clientAction>();
    const navigation = useNavigation();
    const loading = navigation.state === "submitting";
    const isDark = useTheme()
    const d = isDark

    const inputClass = d
        ? "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-purple-500/40 focus:bg-purple-500/5 transition"
        : "w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-black placeholder-gray-400 text-sm outline-none focus:border-purple-500/40 transition"

    return (
        <div className={`min-h-screen flex items-center justify-center px-6 py-10 transition-colors duration-300 ${d ? "bg-black text-white" : "bg-gray-50 text-black"}`}>
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                        <span className="text-purple-400 text-xl font-black">M</span>
                    </div>
                    <h1 className={`text-3xl font-bold mb-2 ${d ? "text-white" : "text-black"}`}>Sign Up</h1>
                </div>

                {/* Card */}
                <div className={`border rounded-2xl p-8 backdrop-blur ${d ? "bg-white/4 border-white/8" : "bg-white border-black/8 shadow-sm"}`}>

                    {actionData?.error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                            <span className="text-base">⚠️</span>
                            {actionData.error}
                        </div>
                    )}

                    <Form method="post" className="flex flex-col gap-4">
                        <div>
                            <label className={`text-xs mb-1 block ${d ? "text-gray-400" : "text-gray-500"}`}>Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="username"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={`text-xs mb-1 block ${d ? "text-gray-400" : "text-gray-500"}`}>Nama Lengkap</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={`text-xs mb-1 block ${d ? "text-gray-400" : "text-gray-500"}`}>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="email@example.com"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={`text-xs mb-1 block ${d ? "text-gray-400" : "text-gray-500"}`}>No. HP</label>
                            <input
                                type="text"
                                name="phone_number"
                                placeholder="08xxxxxxxxxx"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={`text-xs mb-1 block ${d ? "text-gray-400" : "text-gray-500"}`}>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                className={inputClass}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 font-semibold rounded-xl transition text-sm mt-2 disabled:opacity-50 ${d ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-zinc-800"}`}
                        >
                            {loading ? "Loading..." : "Register"}
                        </button>
                    </Form>

                    <p className={`text-center text-sm mt-6 ${d ? "text-gray-500" : "text-gray-400"}`}>
                        Udah punya akun?{" "}
                        <Link to="/login" className={`font-semibold hover:underline ${d ? "text-white" : "text-black"}`}>
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}