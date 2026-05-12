import { Link, Form, redirect, useNavigation, useActionData, useSearchParams } from "react-router";
import { TextField, Label, Input, FieldError } from "@heroui/react";
import { Button } from '@heroui/react';
import Alert from "../components/Alert";
import { z } from "zod";
import { register } from "../services/authService";
import { useTheme } from "../hooks/useTheme";
import { Surface } from "../components/Surface";

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
            return { error: data.message || data.error || "Pendaftaran gagal. Pastikan data yang Anda masukkan benar." };
        }
    } catch (err: any) {
        return { error: err.message || "Gagal terhubung ke server. Pastikan koneksi internet Anda stabil." };
    }
}


export default function Register() {
    const actionData = useActionData<typeof clientAction>();
    const navigation = useNavigation();
    const [searchParams] = useSearchParams();
    const emailParam = searchParams.get("email") || "";
    const loading = navigation.state === "submitting";
    useTheme()

    const inputClass = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition bg-white border-black/10 text-black placeholder-gray-400 focus:border-purple-500/40 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-600 dark:focus:border-purple-500/40 dark:focus:bg-purple-500/5"

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-gray-50 text-black dark:bg-black dark:text-white">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                        <span className="text-purple-400 text-xl font-black">M</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">Sign Up</h1>
                </div>

                {/* Card */}
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
                            name="username" 
                            isRequired
                            isInvalid={!!actionData?.fieldErrors?.username}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-xs block text-gray-500 dark:text-gray-400">Username</Label>
                            <Input
                                placeholder="username"
                                className={inputClass}
                            />
                            <FieldError className="text-[10px] text-red-500">{actionData?.fieldErrors?.username}</FieldError>
                        </TextField>

                        <TextField 
                            name="name" 
                            isRequired
                            isInvalid={!!actionData?.fieldErrors?.name}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-xs block text-gray-500 dark:text-gray-400">Nama Lengkap</Label>
                            <Input
                                placeholder="John Doe"
                                className={inputClass}
                            />
                            <FieldError className="text-[10px] text-red-500 mt-1">{actionData?.fieldErrors?.name}</FieldError>
                        </TextField>

                        <TextField 
                            name="email" 
                            type="email" 
                            defaultValue={emailParam}
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
                            name="phone_number" 
                            isRequired
                            isInvalid={!!actionData?.fieldErrors?.phone_number}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-xs block text-gray-500 dark:text-gray-400">No. HP</Label>
                            <Input
                                placeholder="08xxxxxxxxxx"
                                className={inputClass}
                            />
                            <FieldError className="text-[10px] text-red-500 mt-1">{actionData?.fieldErrors?.phone_number}</FieldError>
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
                            Register
                        </Button>
                    </Form>

                    <p className="text-center text-sm mt-6 text-gray-400 dark:text-gray-500">
                        Udah punya akun?{" "}
                        <Link to="/login" className="font-semibold hover:underline text-black dark:text-white">
                            Login
                        </Link>
                    </p>
                </Surface>
            </div>
        </div>
    );
}