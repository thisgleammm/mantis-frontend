import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, TextField, Label, Input, FieldError
} from "@heroui/react";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { confirmPassword } from "../services/authService";
import Alert from "./Alert";

interface ConfirmPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

export default function ConfirmPasswordModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Konfirmasi Password",
    description = "Sila masukkan password kamu untuk melanjutkan tindakan ini."
}: ConfirmPasswordModalProps) {
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!password) return;
        
        setLoading(true);
        setError(null);
        
        try {
            await confirmPassword(password);
            onConfirm();
            onClose();
            setPassword("");
        } catch (err: any) {
            setError(err.message || "Password salah.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold">{title}</h3>
                </ModalHeader>
                <ModalBody className="pb-6">
                    <p className="text-sm text-muted-foreground mb-4">
                        {description}
                    </p>

                    {error && (
                        <Alert status="danger" description={error} className="mb-4" />
                    )}

                    <TextField isRequired className="flex flex-col gap-1.5">
                        <Label className="text-sm font-medium text-foreground">Password</Label>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                type={showPass ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border border-border bg-field-background text-field-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </TextField>
                </ModalBody>
                <ModalFooter className="border-t border-border pt-4">
                    <Button variant="ghost" onClick={onClose} isDisabled={loading}>
                        Batal
                    </Button>
                    <Button color="primary" onClick={handleConfirm} isPending={loading} isDisabled={!password}>
                        Konfirmasi
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
