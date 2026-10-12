import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "glass" | "forest" | "earth" | "bordered";
}

export function Card({
  children,
  variant = "default",
  className = "",
  ...props
}: CardProps) {
  const variantStyles = {
    default:
      "bg-cream-50/90 text-forest-950 border border-cream-300 shadow-sm shadow-forest-950/5",
    glass:
      "nature-glass text-forest-950 border border-cream-200/80 shadow-md shadow-forest-950/5",
    forest:
      "bg-forest-900 text-cream-50 border border-forest-800 shadow-md shadow-forest-950/20",
    earth:
      "bg-earth-50 text-earth-950 border border-earth-200 shadow-sm",
    bordered:
      "bg-transparent border border-dashed border-sage-300 text-forest-900",
  }[variant];

  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
