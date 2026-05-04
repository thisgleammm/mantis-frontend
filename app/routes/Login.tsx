import { Link, Form, redirect, useNavigation, useActionData } from "react-router";
import { login } from "../services/authService";

export async function clientAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Semua field harus diisi" };
    }
    if (password.length < 8) {
        return { error: "Password minimal 8 karakter" };
    }

    try {
        const data = await login(email, password);

        if (data.token || data.message === "logged in successfully") {
            // Note: with HttpOnly cookies, localStorage might not be necessary depending on backend
            // But we keep it if frontend relies on it, or wait, clientAction runs in browser so it's fine.
            localStorage.setItem("is_logged_in", "true");
            return redirect("/");
        } else {
            return { error: data.message || "Email atau password yang Anda masukkan tidak terdaftar." };
        }
    } catch (err) {
        return { error: "Gagal terhubung ke server. Pastikan koneksi internet Anda stabil." };
    }
}

export default function Login() {
    const actionData = useActionData<typeof clientAction>();
    const navigation = useNavigation();
    const loading = navigation.state === "submitting";

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md">

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">Login Page</h1>
                </div>

                <div className="bg-white/4 border border-white/8 rounded-2xl p-8 backdrop-blur">

                    {actionData?.error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2 animate-shake">
                            <span className="text-base">⚠️</span>
                            {actionData.error}
                        </div>
                    )}


                    <Form method="post" className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="email@example.com"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-white/30 transition"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                minLength={8}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-white/30 transition"
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition text-sm mt-2 disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Login"}
                        </button>
                    </Form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Belum punya akun?{" "}
                        <Link to="/register" className="text-white hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}