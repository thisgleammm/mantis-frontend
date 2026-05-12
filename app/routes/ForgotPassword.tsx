import { Link, Form, useNavigation, useActionData } from "react-router";
import {
    Card, CardContent,
    TextField, Label, Input, FieldError,
    Separator,
} from "@heroui/react";
import { forgotPassword } from "../services/authService";
import { useTheme } from "../hooks/ThemeContext";
import { Button } from "@heroui/react";
import Alert from "../components/Alert";
import { Mail, ArrowLeft } from "lucide-react";
import { z } from "zod";

const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
});

export async function clientAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const result = forgotPasswordSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        return { 
            fieldErrors: {
                email: fieldErrors.email?.[0],
            }
        };
    }

    const { email } = result.data;

    try {
        const data = await forgotPassword(email);
        return { success: data.message || "Link reset password telah dikirim ke email kamu." };
    } catch (err: any) {
        return { error: err.message || "Gagal terhubung ke server." };
    }
}

export default function ForgotPassword() {
    const actionData = useActionData<typeof clientAction>();
    const navigation = useNavigation();
    const loading = navigation.state === "submitting";
    useTheme();

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-sm">

                {/* Brand */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4">
                        <span className="text-white font-black text-base">M</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Lupa Password</h1>
                    <p className="text-sm text-muted-foreground mt-1 text-center px-6">Masukkan email kamu untuk mendapatkan link reset password</p>
                </div>

                <Card className="border border-border shadow-sm bg-surface">
                    <CardContent className="p-6 flex flex-col gap-5">

                        {actionData?.error && (
                            <Alert status="danger" description={actionData.error} />
                        )}

                        {actionData?.success && (
                            <Alert status="success" description={actionData.success} />
                        )}

                        {!actionData?.success && (
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

                                <Button type="submit" variant="primary" isPending={loading} fullWidth className="mt-1">
                                    Kirim Link Reset
                                </Button>
                            </Form>
                        )}

                        <Separator />

                        <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
                            <ArrowLeft size={14} />
                            Kembali ke Login
                        </Link>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
