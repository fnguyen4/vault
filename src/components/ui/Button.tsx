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
    "bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold disabled:bg-amber-400/40",
  secondary:
    "bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600 disabled:opacity-40",
  ghost:
    "bg-transparent hover:bg-slate-800 text-slate-300 hover:text-slate-100 disabled:opacity-40",
  danger:
    "bg-red-600 hover:bg-red-500 text-white font-semibold disabled:opacity-40",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
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
      className={`inline-flex items-center justify-center gap-2 transition-colors duration-150 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
