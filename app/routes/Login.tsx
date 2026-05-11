import { Link, Form, redirect, useNavigation, useActionData } from "react-router";
import {
    Card, CardContent,
    TextField, Label, Input, FieldError,
    Separator,
    Spinner,
} from "@heroui/react";
import { login } from "../services/authService";
import { useTheme } from "../hooks/useTheme";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";

export async function clientAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return { error: "Semua field harus diisi" };
    if (password.length < 8) return { error: "Password minimal 8 karakter" };

    try {
        const data = await login(email, password);
        if (data.token || data.message === "logged in successfully") {
            localStorage.setItem("is_logged_in", "true");
            localStorage.setItem("token", data.token);
            return redirect("/");
        } else if (data.message === "email tidak terdaftar") {
            return redirect(`/register?email=${encodeURIComponent(email)}`);
        } else {
            return { error: data.message || "Email atau password salah." };
        }
    } catch {
        return { error: "Gagal terhubung ke server." };
    }
}

export default function Login() {
    const actionData = useActionData<typeof clientAction>();
    const navigation = useNavigation();
    const loading = navigation.state === "submitting";
    const [showPass, setShowPass] = useState(false);
    useTheme();

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-sm">

                {/* Brand */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4">
                        <span className="text-white font-black text-base">M</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Selamat datang</h1>
                    <p className="text-sm text-muted-foreground mt-1">Masuk ke akun Mantis kamu</p>
                </div>

                <Card className="border border-border shadow-sm bg-surface">
                    <CardContent className="p-6 flex flex-col gap-5">

                        {actionData?.error && (
                            <Alert status="danger" description={actionData.error} />
                        )}

                        <Form method="post" className="flex flex-col gap-4">
                            <TextField name="email" type="email" isRequired className="flex flex-col gap-1.5">
                                <Label className="text-sm font-medium text-foreground">Email</Label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    <Input
                                        placeholder="email@example.com"
                                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-field-background text-field-foreground placeholder:text-field-placeholder outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                                    />
                                </div>
                                <FieldError className="text-xs text-danger" />
                            </TextField>

                            <TextField name="password" type={showPass ? "text" : "password"} isRequired className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-foreground">Password</Label>
                                </div>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    <Input
                                        placeholder="••••••••"
                                        className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border border-border bg-field-background text-field-foreground placeholder:text-field-placeholder outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                <FieldError className="text-xs text-danger" />
                            </TextField>

                            <Button type="submit" loading={loading} className="w-full mt-1">
                                {loading ? "Masuk..." : "Masuk"}
                            </Button>
                        </Form>

                        <Separator />

                        <p className="text-center text-sm text-muted-foreground">
                            Belum punya akun?{" "}
                            <Link to="/register" className="font-semibold text-accent hover:underline">
                                Daftar sekarang
                            </Link>
                        </p>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
