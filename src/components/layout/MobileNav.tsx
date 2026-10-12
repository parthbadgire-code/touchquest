"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Sparkles, Camera, Mic, BookOpen } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: "Hub", icon: Compass },
    { href: "/missions", label: "Missions", icon: Sparkles },
    { href: "/scanner", label: "Scan", icon: Camera, primary: true },
    { href: "/birdcall", label: "BirdCall", icon: Mic },
    { href: "/journal", label: "Journal", icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-cream-300/80 bg-cream-50/95 backdrop-blur-lg px-2 pb-safe pt-1.5 shadow-[0_-4px_12px_rgba(18,51,36,0.06)]">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative -top-3 flex flex-col items-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-900 text-cream-50 shadow-md shadow-forest-950/20 border-2 border-cream-100 transition-transform active:scale-95 group-hover:bg-forest-800">
                  <Icon className="h-5 w-5 text-forest-200" />
                </div>
                <span className="text-[10px] font-bold text-forest-900 mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? "text-forest-950 font-bold"
                  : "text-forest-700/70 hover:text-forest-950 font-medium"
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? "bg-sage-200/90 text-forest-950" : "text-forest-700/80"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
