import { Link, Form, redirect, useNavigation, useActionData } from "react-router";
import { login } from "../services/authService";
import { useTheme } from "../hooks/useTheme";

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
            localStorage.setItem("is_logged_in", "true");
            localStorage.setItem("token", data.token);
            return redirect("/");
        } else if (data.message === "email tidak terdaftar") {
            return redirect(`/register?email=${encodeURIComponent(email)}`);
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
    useTheme()

    const inputClass = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition bg-white border-black/10 text-black placeholder-gray-400 focus:border-purple-500/40 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-600 dark:focus:border-purple-500/40 dark:focus:bg-purple-500/5"

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50 text-black dark:bg-black dark:text-white">
            <div className="w-full max-w-md">

                <div className="text-center mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                        <span className="text-purple-400 text-xl font-black">M</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">Sign In</h1>
                </div>

                <div className="border rounded-2xl p-8 backdrop-blur bg-white border-black/8 shadow-sm dark:bg-white/4 dark:border-white/8 dark:shadow-none">

                    {actionData?.error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                            <span className="text-base">⚠️</span>
                            {actionData.error}
                        </div>
                    )}

                    <Form method="post" className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs mb-1 block text-gray-500 dark:text-gray-400">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="email@example.com"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="text-xs mb-1 block text-gray-500 dark:text-gray-400">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                minLength={8}
                                required
                                className={inputClass}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 font-semibold rounded-xl transition text-sm mt-2 disabled:opacity-50 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
                        >
                            {loading ? "Loading..." : "Login"}
                        </button>
                    </Form>

                    <p className="text-center text-sm mt-6 text-gray-400 dark:text-gray-500">
                        Belum punya akun?{" "}
                        <Link to="/register" className="font-semibold hover:underline text-black dark:text-white">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}