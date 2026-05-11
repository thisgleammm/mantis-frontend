import { Link, Form, redirect, useNavigation, useActionData, useSearchParams } from "react-router";
import { TextField, Label, Input, FieldError } from "@heroui/react";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { register } from "../services/authService";
import { useTheme } from "../hooks/useTheme";
import { Surface } from "../components/Surface";

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
                            isInvalid={!!actionData?.error && actionData.error.toLowerCase().includes("username")}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-xs block text-gray-500 dark:text-gray-400">Username</Label>
                            <Input
                                placeholder="username"
                                className={inputClass}
                            />
                            <FieldError className="text-[10px] text-red-500">{actionData?.error}</FieldError>
                        </TextField>

                        <TextField 
                            name="name" 
                            isRequired
                            isInvalid={!!actionData?.error && actionData.error.toLowerCase().includes("nama")}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-xs block text-gray-500 dark:text-gray-400">Nama Lengkap</Label>
                            <Input
                                placeholder="John Doe"
                                className={inputClass}
                            />
                            <FieldError className="text-[10px] text-red-500 mt-1">{actionData?.error}</FieldError>
                        </TextField>

                        <TextField 
                            name="email" 
                            type="email" 
                            defaultValue={emailParam}
                            isRequired
                            isInvalid={!!actionData?.error && actionData.error.toLowerCase().includes("email")}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-xs block text-gray-500 dark:text-gray-400">Email</Label>
                            <Input
                                placeholder="email@example.com"
                                className={inputClass}
                            />
                            <FieldError className="text-[10px] text-red-500 mt-1">{actionData?.error}</FieldError>
                        </TextField>

                        <TextField 
                            name="phone_number" 
                            isRequired
                            isInvalid={!!actionData?.error && (actionData.error.toLowerCase().includes("hp") || actionData.error.toLowerCase().includes("phone"))}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-xs block text-gray-500 dark:text-gray-400">No. HP</Label>
                            <Input
                                placeholder="08xxxxxxxxxx"
                                className={inputClass}
                            />
                            <FieldError className="text-[10px] text-red-500 mt-1">{actionData?.error}</FieldError>
                        </TextField>

                        <TextField 
                            name="password" 
                            type="password" 
                            isRequired
                            isInvalid={!!actionData?.error && actionData.error.toLowerCase().includes("password")}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-xs block text-gray-500 dark:text-gray-400">Password</Label>
                            <Input
                                placeholder="••••••••"
                                className={inputClass}
                            />
                            <FieldError className="text-[10px] text-red-500 mt-1">{actionData?.error}</FieldError>
                        </TextField>

                        <Button
                            type="submit"
                            loading={loading}
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