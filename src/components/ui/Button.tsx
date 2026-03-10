import { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary:
    "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold shadow-warm hover:shadow-warm-md disabled:opacity-50",
  secondary:
    "bg-white hover:bg-orange-50 text-stone-700 border border-stone-200 shadow-warm hover:border-orange-200 disabled:opacity-50",
  ghost:
    "bg-transparent hover:bg-orange-50 text-stone-500 hover:text-stone-700 disabled:opacity-50",
  danger:
    "bg-red-500 hover:bg-red-600 text-white font-semibold shadow-warm disabled:opacity-50",
};

const sizes = {
  sm: "px-3.5 py-1.5 text-sm rounded-xl",
  md: "px-5 py-2.5 text-sm rounded-2xl",
  lg: "px-6 py-3.5 text-base rounded-2xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
