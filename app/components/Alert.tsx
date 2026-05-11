"use client";

import { Alert as HeroAlert, tv } from "@heroui/react";
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  XCircle,
  X
} from "lucide-react";
import { forwardRef } from "react";

/**
 * Mantis Alert Component
 * 
 * A premium, informative alert component built on top of HeroUI v3.
 * Features glassmorphism, status-aware icons, and responsive design.
 */

const alertStyles = tv({
    base: "w-full flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300",
    variants: {
        status: {
            default: "bg-surface-secondary/50 border-border/50 text-foreground backdrop-blur-md",
            success: "bg-success/10 border-success/20 text-success backdrop-blur-md",
            warning: "bg-warning/10 border-warning/20 text-warning backdrop-blur-md",
            danger: "bg-danger/10 border-danger/20 text-danger backdrop-blur-md",
            info: "bg-accent/10 border-accent/20 text-accent backdrop-blur-md",
        }
    },
    defaultVariants: {
        status: "default"
    }
});

export interface AlertProps {
    /** Title of the alert */
    title?: string;
    /** Description or body text */
    description?: string;
    /** Visual status of the alert */
    status?: "default" | "success" | "warning" | "danger" | "info";
    /** Custom icon to override the default status icon */
    icon?: React.ReactNode;
    /** Callback when the close button is pressed */
    onClose?: () => void;
    /** Additional CSS classes */
    className?: string;
    /** Alternative content for the body */
    children?: React.ReactNode;
}

const statusIcons = {
    default: <Info size={20} />,
    success: <CheckCircle2 size={20} />,
    warning: <AlertCircle size={20} />,
    danger: <XCircle size={20} />,
    info: <Info size={20} />,
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
    ({ title, description, status = "default", icon, onClose, className, children }, ref) => {
        const activeIcon = icon || statusIcons[status];

        return (
            <HeroAlert.Root 
                ref={ref}
                status={status === "default" ? undefined : status as any} 
                className={alertStyles({ status, className })}
            >
                <HeroAlert.Indicator className="mt-0.5 shrink-0">
                    {activeIcon}
                </HeroAlert.Indicator>
                
                <HeroAlert.Content className="flex-1 space-y-1">
                    {title && (
                        <HeroAlert.Title className="font-bold text-sm leading-tight">
                            {title}
                        </HeroAlert.Title>
                    )}
                    
                    {(description || children) && (
                        <HeroAlert.Description className="text-sm opacity-90 leading-relaxed">
                            {description || children}
                        </HeroAlert.Description>
                    )}
                </HeroAlert.Content>

                {onClose && (
                    <button 
                        onClick={onClose}
                        type="button"
                        className="shrink-0 p-1 rounded-lg hover:bg-foreground/10 transition-colors"
                        aria-label="Close alert"
                    >
                        <X size={16} />
                    </button>
                )}
            </HeroAlert.Root>
        );
    }
);

Alert.displayName = "Alert";

export default Alert;