"use client";

import { Button as HeroButton, Spinner, tv, type ButtonProps as HeroButtonProps, type VariantProps } from "@heroui/react";
import { forwardRef } from "react";

/**
 * Mantis Button Component
 * 
 * A premium, highly-interactive button built on top of HeroUI v3.
 * Follows Mantis design system with OKLCH colors and smooth transitions.
 */

const buttonStyles = tv({
    base: "relative font-semibold transition-all duration-200 active:scale-[0.98] data-[hovered=true]:opacity-90 disabled:opacity-50 disabled:active:scale-100",
    variants: {
        variant: {
            primary: "bg-accent text-accent-foreground shadow-lg shadow-accent/20",
            secondary: "bg-surface-secondary text-surface-secondary-foreground border border-border/50",
            tertiary: "bg-default text-default-foreground hover:bg-default/80",
            outline: "border border-border bg-transparent hover:bg-surface-secondary",
            ghost: "bg-transparent hover:bg-foreground/5 text-foreground",
            danger: "bg-danger text-danger-foreground shadow-lg shadow-danger/20",
        },
        size: {
            sm: "h-9 px-4 text-xs rounded-lg gap-1.5",
            md: "h-11 px-6 text-sm rounded-xl gap-2",
            lg: "h-13 px-8 text-base rounded-2xl gap-2.5",
        },
        isIconOnly: {
            true: "px-0",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "md",
    },
});

export interface ButtonProps extends HeroButtonProps {
    /** Whether the button is in a loading state */
    loading?: boolean;
    /** Icon to display before the button content */
    leftIcon?: React.ReactNode;
    /** Icon to display after the button content */
    rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            loading,
            isPending,
            leftIcon,
            rightIcon,
            className,
            variant = "primary",
            size = "md",
            isIconOnly,
            ...props
        },
        ref
    ) => {
        const isLoading = loading || isPending;

        // Handle functional className from HeroUI/React Aria
        const resolveClassName = (renderProps: any) => {
            const baseClassName = typeof className === "function" 
                ? className(renderProps) 
                : className;
            
            return buttonStyles({
                variant: variant as any,
                size: size as any,
                isIconOnly,
                className: baseClassName as any,
            });
        };

        return (
            <HeroButton
                ref={ref}
                variant={variant as any}
                size={size as any}
                isPending={isLoading}
                isIconOnly={isIconOnly}
                className={resolveClassName as any}
                {...props}
            >
                {(renderProps) => (
                    <>
                        {isLoading && (
                            <Spinner
                                color="current"
                                size="sm"
                                className={isIconOnly ? "" : "mr-1"}
                            />
                        )}

                        {!isLoading && leftIcon && (
                            <span className="flex items-center shrink-0">{leftIcon}</span>
                        )}

                        {typeof children === "function" ? (
                            children(renderProps)
                        ) : (
                            children
                        )}

                        {!isLoading && rightIcon && (
                            <span className="flex items-center shrink-0">{rightIcon}</span>
                        )}
                    </>
                )}
            </HeroButton>
        );
    }
);

Button.displayName = "Button";

export default Button;