import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "earth" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-forest-900 text-cream-50 hover:bg-forest-800 shadow-sm shadow-forest-950/10 border border-forest-800",
    secondary:
      "bg-sage-200 text-forest-900 hover:bg-sage-300 border border-sage-300",
    outline:
      "bg-transparent text-forest-900 hover:bg-forest-50 border border-forest-300/80",
    earth:
      "bg-earth-600 text-white hover:bg-earth-700 shadow-sm border border-earth-700",
    ghost:
      "bg-transparent text-forest-800 hover:bg-sage-100/60 border border-transparent",
  }[variant];

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base font-semibold gap-2.5",
  }[size];

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
