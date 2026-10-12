import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "forest" | "sage" | "earth" | "cream" | "pending" | "success" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "sage",
  size = "md",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    forest: "bg-forest-900 text-cream-100 border border-forest-700/50",
    sage: "bg-sage-100 text-forest-900 border border-sage-300",
    earth: "bg-earth-100 text-earth-800 border border-earth-300",
    cream: "bg-cream-200 text-forest-900 border border-cream-400",
    pending: "bg-amber-50 text-amber-900 border border-amber-300/80",
    success: "bg-emerald-50 text-emerald-900 border border-emerald-300",
    neutral: "bg-cream-200 text-stone-700 border border-stone-300",
  }[variant];

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold tracking-wide",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
}
