"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Sparkles,
  Camera,
  Mic,
  BookOpen,
  MapPin,
  Menu,
  X,
  Flame,
  TreePine,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserCircle } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Compass },
    { href: "/missions", label: "Missions", icon: Sparkles },
    { href: "/scanner", label: "Nature Scanner", icon: Camera },
    { href: "/birdcall", label: "BirdCall AI", icon: Mic },
    { href: "/explore", label: "Nearby Parks", icon: MapPin },
    { href: "/journal", label: "Journal", icon: BookOpen },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-cream-300/80 bg-cream-100/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2.5 transition-transform active:scale-95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-900 text-cream-100 shadow-sm transition-colors group-hover:bg-forest-800">
                <TreePine className="h-5 w-5 text-forest-300 transition-transform group-hover:scale-110" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-forest-950">
                  TouchQuest
                </span>
                <span className="block text-[10px] font-semibold tracking-wider uppercase text-forest-700/80 -mt-1">
                  Touch Grass • Open AI
                </span>
              </div>
            </Link>

            <Badge variant="sage" size="sm" className="hidden lg:inline-flex ml-2">
              Nature Companion
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-forest-900 text-cream-50 shadow-sm"
                      : "text-forest-800 hover:bg-cream-200/80 hover:text-forest-950"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-forest-300" : "text-forest-600"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Streak & Auth */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-full border border-earth-300/80 bg-earth-50 px-2.5 py-1 text-xs font-semibold text-earth-800 shadow-sm hover:bg-earth-100 transition-colors"
            >
              <Flame className="h-3.5 w-3.5 text-earth-600 fill-earth-500 animate-pulse" />
              <span>3d Streak</span>
            </Link>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-cream-300 bg-cream-50 px-3 py-1.5 text-xs font-bold text-forest-900 hover:bg-cream-200 transition-colors"
            >
              <UserCircle className="h-4 w-4 text-forest-700" />
              <span className="max-w-[110px] truncate">
                {user ? (user.isGuest ? "Guest" : user.displayName) : "Sign In"}
              </span>
            </button>

            <Link
              href="/missions"
              className="rounded-xl bg-forest-900 px-3 py-1.5 text-xs font-semibold text-cream-50 hover:bg-forest-800 transition-colors shadow-sm"
            >
              Start Quest
            </Link>
          </div>

          {/* Mobile Hamburger Toggle & User trigger */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="p-1.5 rounded-xl text-forest-800 hover:bg-cream-200"
              aria-label="User account"
            >
              <UserCircle className="h-5 w-5" />
            </button>

            <Link
              href="/dashboard"
              className="flex items-center gap-1 rounded-full bg-earth-50 border border-earth-200 px-2 py-0.5 text-[11px] font-semibold text-earth-800"
            >
              <Flame className="h-3 w-3 text-earth-600 fill-earth-500" />
              <span>3d</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-1.5 text-forest-800 hover:bg-cream-200 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-cream-300 bg-cream-50 px-4 pt-3 pb-5 shadow-lg">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-forest-900 text-cream-50"
                        : "text-forest-900 hover:bg-cream-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Global Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
