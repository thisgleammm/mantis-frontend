import { Link, Form, useNavigation, useActionData, useSearchParams, redirect } from "react-router";
import {
    Card, CardContent,
    TextField, Label, Input, FieldError,
    Separator,
} from "@heroui/react";
import { resetPassword } from "../services/authService";
import { useTheme } from "../hooks/ThemeContext";
import { Button } from "@heroui/react";
import Alert from "../components/Alert";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token tidak valid"),
    password: z.string().min(1, "Password harus diisi").min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
});

export async function clientAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const result = resetPasswordSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        return { 
            fieldErrors: {
                password: fieldErrors.password?.[0],
                confirmPassword: fieldErrors.confirmPassword?.[0],
            }
        };
    }

    const { token, password } = result.data;

    try {
        await resetPassword(token, password);
        return { success: true };
    } catch (err: any) {
        return { error: err.message || "Gagal mereset password. Token mungkin sudah kadaluarsa." };
    }
}

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const actionData = useActionData<typeof clientAction>();
    const navigation = useNavigation();
    const loading = navigation.state === "submitting";
    const [showPass, setShowPass] = useState(false);
    useTheme();

    if (actionData?.success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-background">
                <div className="w-full max-w-sm text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-2">
                            <CheckCircle2 size={32} className="text-success" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Password Berhasil Diubah</h1>
                        <p className="text-sm text-muted-foreground">Silakan login kembali dengan password baru kamu.</p>
                        <Button as={Link} to="/login" className="w-full mt-4">
                            Kembali ke Login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-sm">

                {/* Brand */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4">
                        <span className="text-white font-black text-base">M</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
                    <p className="text-sm text-muted-foreground mt-1">Masukkan password baru untuk akun kamu</p>
                </div>

                <Card className="border border-border shadow-sm bg-surface">
                    <CardContent className="p-6 flex flex-col gap-5">

                        {actionData?.error && (
                            <Alert status="danger" description={actionData.error} />
                        )}

                        {!token && (
                            <Alert status="warning" description="Token tidak ditemukan. Silakan cek link di email kamu kembali." />
                        )}

                        {token && (
                            <Form method="post" className="flex flex-col gap-4">
                                <input type="hidden" name="token" value={token} />

                                <TextField name="password" type={showPass ? "text" : "password"} isRequired isInvalid={!!actionData?.fieldErrors?.password} className="flex flex-col gap-1.5">
                                    <Label className="text-sm font-medium text-foreground">Password Baru</Label>
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

                                <TextField name="confirmPassword" type={showPass ? "text" : "password"} isRequired isInvalid={!!actionData?.fieldErrors?.confirmPassword} className="flex flex-col gap-1.5">
                                    <Label className="text-sm font-medium text-foreground">Konfirmasi Password Baru</Label>
                                    <div className="relative">
                                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                        <Input
                                            placeholder="••••••••"
                                            className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border border-border bg-field-background text-field-foreground placeholder:text-field-placeholder outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                                        />
                                    </div>
                                    <FieldError className="text-xs text-danger">{actionData?.fieldErrors?.confirmPassword}</FieldError>
                                </TextField>

                                <Button type="submit" isPending={loading} className="w-full mt-1">
                                    Reset Password
                                </Button>
                            </Form>
                        )}

                        <Separator />

                        <p className="text-center text-sm text-muted-foreground">
                            Ingat password kamu?{" "}
                            <Link to="/login" className="font-semibold text-accent hover:underline">
                                Login sekarang
                            </Link>
                        </p>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
