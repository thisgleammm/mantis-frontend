import { Link, Form, redirect, useNavigation, useActionData } from "react-router";
import {
    Card, CardContent,
    TextField, Label, Input, FieldError,
    Separator,
    Spinner,
} from "@heroui/react";
import { login } from "../services/authService";
import { useTheme } from "../hooks/ThemeContext";
import { Button } from "@heroui/react";
import Alert from "../components/Alert";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
    password: z.string().min(1, "Password harus diisi").min(8, "Password minimal 8 karakter"),
});

export async function clientAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const result = loginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        return { 
            fieldErrors: {
                email: fieldErrors.email?.[0],
                password: fieldErrors.password?.[0],
            }
        };
    }

    const { email, password } = result.data;

    try {
        const data = await login(email, password);
        if (data.token || data.message === "logged in successfully") {
            localStorage.setItem("is_logged_in", "true");
            document.cookie = "is_logged_in=true; path=/; max-age=31536000"; // 1 year
            if (data.token) {
                localStorage.setItem("token", data.token);
                document.cookie = `token=${data.token}; path=/; max-age=31536000`;
            }
            return redirect("/");
        } else if (data.message === "email tidak terdaftar") {
            return redirect(`/register?email=${encodeURIComponent(email)}`);
        } else {
            return { error: data.message || "Email atau password salah." };
        }
    } catch (err: any) {
        return { error: err.message || "Gagal terhubung ke server." };
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
                            <TextField name="email" type="email" isRequired isInvalid={!!actionData?.fieldErrors?.email}  className="flex flex-col gap-1.5">
                                <Label className="text-sm font-medium text-foreground">Email</Label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    <Input
                                        placeholder="email@gmail.com"
                                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-field-background text-field-foreground placeholder:text-field-placeholder outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                                    />
                                </div>
                                <FieldError className="text-xs text-danger">{actionData?.fieldErrors?.email}</FieldError>
                            </TextField>

                            <TextField name="password" type={showPass ? "text" : "password"} isRequired className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-foreground">Password</Label>
                                    <Link to="/forgot-password" className="text-xs text-accent hover:underline">
                                        Lupa password?
                                    </Link>
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
                                <FieldError className="text-xs text-danger">{actionData?.fieldErrors?.password}</FieldError>
                            </TextField>

                            <Button type="submit" variant="primary" isPending={loading} fullWidth className="mt-1">
                                Login
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
