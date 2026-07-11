import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
}

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-signal text-white hover:bg-signal/90",
    ghost: "bg-transparent text-ink border border-base-600 hover:bg-base-700",
    danger: "bg-risk-critical text-white hover:bg-risk-critical/90",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
