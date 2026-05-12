import { Link, Form, redirect, useNavigation, useActionData } from "react-router";
import { TextField, Label, Input, FieldError } from "@heroui/react";
import { z } from "zod";
import { login } from "../services/authService";
import { useTheme } from "../hooks/useTheme";
import { Button } from "@heroui/react";
import Alert from "../components/Alert";
import { Surface } from "../components/Surface";

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
            return { error: data.message || "Email atau password yang Anda masukkan tidak terdaftar." };
        }
    } catch (err: any) {
        return { error: err.message || "Gagal terhubung ke server. Pastikan koneksi internet Anda stabil." };
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

                <Surface 
                    variant="default" 
                    className="border rounded-2xl p-8 backdrop-blur border-black/8 shadow-sm dark:border-white/8 dark:shadow-none"
                >

                    {actionData?.error && (
                        <Alert 
                            status="danger" 
                            description={actionData.error} 
                            className="mb-6"
                        />
                    )}

                    <Form method="post" className="flex flex-col gap-4">
                        <TextField 
                            name="email" 
                            type="email" 
                            isRequired
                            isInvalid={!!actionData?.fieldErrors?.email}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-xs block text-gray-500 dark:text-gray-400">Email</Label>
                            <Input
                                placeholder="email@example.com"
                                className={inputClass}
                            />
                            <FieldError className="text-[10px] text-red-500 mt-1">{actionData?.fieldErrors?.email}</FieldError>
                        </TextField>

                        <TextField 
                            name="password" 
                            type="password" 
                            isRequired
                            isInvalid={!!actionData?.fieldErrors?.password}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-xs block text-gray-500 dark:text-gray-400">Password</Label>
                            <Input
                                placeholder="••••••••"
                                className={inputClass}
                            />
                            <FieldError className="text-[10px] text-red-500 mt-1">{actionData?.fieldErrors?.password}</FieldError>
                        </TextField>  
                        
                        <Button
                            type="submit"
                            isPending={loading}
                            className="w-full mt-2"
                        >
                            Login
                        </Button>
                    </Form>

                    <p className="text-center text-sm mt-6 text-gray-400 dark:text-gray-500">
                        Belum punya akun?{" "}
                        <Link to="/register" className="font-semibold hover:underline text-black dark:text-white">
                            Register
                        </Link>
                    </p>
                </Surface>
            </div>
        </div>
    );
}