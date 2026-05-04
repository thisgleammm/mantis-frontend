import { Link, Form, redirect, useNavigation, useActionData } from "react-router";
import { register } from "../services/authService";

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

export default function Register() {
    const actionData = useActionData<typeof clientAction>();
    const navigation = useNavigation();
    const loading = navigation.state === "submitting";

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">Register</h1>
                    <p className="text-gray-500 text-sm">Daftar dan mulai belanja di Mantis</p>
                </div>

                {/* Card */}
                <div className="bg-white/4 border border-white/8 rounded-2xl p-8 backdrop-blur">

                    {actionData?.error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2 animate-shake">
                            <span className="text-base">⚠️</span>
                            {actionData.error}
                        </div>
                    )}


                    <Form method="post" className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="username"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-white/30 transition"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Nama Lengkap</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-white/30 transition"
                            />
                        </div>

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
                            <label className="text-xs text-gray-400 mb-1 block">No. HP</label>
                            <input
                                type="text"
                                name="phone_number"
                                placeholder="08xxxxxxxxxx"
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
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-white/30 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition text-sm mt-2 disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Register"}
                        </button>
                    </Form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Udah punya akun?{" "}
                        <Link to="/login" className="text-white hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}