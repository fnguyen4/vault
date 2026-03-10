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
    "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold disabled:opacity-50",
  secondary:
    "bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 hover:border-stone-300 disabled:opacity-50",
  ghost:
    "bg-transparent hover:bg-stone-100 text-stone-500 hover:text-stone-700 disabled:opacity-50",
  danger:
    "bg-red-500 hover:bg-red-600 text-white font-semibold disabled:opacity-50",
};

const sizes = {
  sm: "px-4 py-1.5 text-sm rounded-full",
  md: "px-5 py-2.5 text-sm rounded-full",
  lg: "px-7 py-3.5 text-base rounded-full",
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
