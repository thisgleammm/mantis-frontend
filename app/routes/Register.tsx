import { Link, Form, redirect, useNavigation, useActionData, useSearchParams } from "react-router";
import {
    Card, CardContent,
    TextField, Label, Input, FieldError,
    Separator,
} from "@heroui/react";
import { Button } from '@heroui/react';
import Alert from "../components/Alert";
import { z } from "zod";
import { register } from "../services/authService";
import { useTheme } from "../hooks/ThemeContext";
import { User, Mail, Lock, Phone, UserCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const registerSchema = z.object({
    username: z.string().min(1, "Username harus diisi").min(3, "Username minimal 3 karakter"),
    name: z.string().min(1, "Nama harus diisi"),
    email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
    phone_number: z.string().min(1, "Nomor HP harus diisi").min(10, "Nomor HP minimal 10 digit"),
    password: z.string().min(1, "Password harus diisi").min(8, "Password minimal 8 karakter"),
});

export async function clientAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const result = registerSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        return {
            fieldErrors: {
                username: fieldErrors.username?.[0],
                name: fieldErrors.name?.[0],
                email: fieldErrors.email?.[0],
                phone_number: fieldErrors.phone_number?.[0],
                password: fieldErrors.password?.[0],
            }
        };
    }

    const { username, name, email, password, phone_number } = result.data;

    try {
        const data = await register(username, name, email, password, phone_number);
        if (data.id || data.token || data.message === "success") {
            return redirect("/login");
        } else {
            return { error: data.message || data.error || "Pendaftaran gagal." };
        }
    } catch (err: any) {
        return { error: err.message || "Gagal terhubung ke server." };
    }
}

export default function Register() {
    const actionData = useActionData<typeof clientAction>();
    const navigation = useNavigation();
    const [searchParams] = useSearchParams();
    const emailParam = searchParams.get("email") || "";
    const loading = navigation.state === "submitting";
    const [showPass, setShowPass] = useState(false);
    useTheme();

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
            <div className="w-full max-w-sm">

                {/* Brand */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4">
                        <span className="text-white font-black text-base">M</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Buat akun baru</h1>
                    <p className="text-sm text-muted-foreground mt-1">Daftar untuk mulai belanja</p>
                </div>

                <Card className="border border-border shadow-sm bg-surface">
                    <CardContent className="p-6 flex flex-col gap-5">

                        {actionData?.error && (
                            <Alert 
                                status="danger" 
                                description={actionData.error} 
                                className="mb-6"
                            />
                        )}

                        <Form method="post" className="flex flex-col gap-4">
                            <TextField name="username" isRequired isInvalid={!!actionData?.fieldErrors?.username} className="flex flex-col gap-1.5">
                                <Label className="text-sm font-medium text-foreground">Username</Label>
                                <div className="relative">
                                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    <Input
                                        placeholder="username"
                                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-field-background text-field-foreground placeholder:text-field-placeholder outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                                    />
                                </div>
                                <FieldError className="text-xs text-danger">{actionData?.fieldErrors?.username}</FieldError>
                            </TextField>

                            <TextField name="name" isRequired isInvalid={!!actionData?.fieldErrors?.name} className="flex flex-col gap-1.5">
                                <Label className="text-sm font-medium text-foreground">Nama Lengkap</Label>
                                <div className="relative">
                                    <UserCircle size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    <Input
                                        placeholder="John Doe"
                                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-field-background text-field-foreground placeholder:text-field-placeholder outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                                    />
                                </div>
                                <FieldError className="text-xs text-danger">{actionData?.fieldErrors?.name}</FieldError>
                            </TextField>

                            <TextField name="email" type="email" defaultValue={emailParam} isInvalid={!!actionData?.fieldErrors?.email} isRequired className="flex flex-col gap-1.5">
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

                            <TextField name="phone_number" isRequired isInvalid={!!actionData?.fieldErrors?.phone_number} className="flex flex-col gap-1.5">
                                <Label className="text-sm font-medium text-foreground">No. HP</Label>
                                <div className="relative">
                                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    <Input
                                        placeholder="08xxxxxxxxxx"
                                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-field-background text-field-foreground placeholder:text-field-placeholder outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                                    />
                                </div>
                                <FieldError className="text-xs text-danger">{actionData?.fieldErrors?.phone_number}</FieldError>
                            </TextField>

                            <TextField name="password" type={showPass ? "text" : "password"} isRequired isInvalid={!!actionData?.fieldErrors?.password} className="flex flex-col gap-1.5">
                                <Label className="text-sm font-medium text-foreground">Password</Label>
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
                          
                            <Button
                                type="submit"
                                isPending={loading}
                                className="w-full mt-1"
                            >
                                Daftar
                            </Button>
                        </Form>

                        <Separator />

                        <p className="text-center text-sm text-muted-foreground">
                            Sudah punya akun?{" "}
                            <Link to="/login" className="font-semibold text-accent hover:underline">
                                Masuk sekarang
                            </Link>
                        </p>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
