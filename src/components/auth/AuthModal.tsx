"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { X, Lock, Mail, User, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, isSupabaseReady, signIn, signUp, signOut, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (mode === "signin") {
        const res = await signIn(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg("Welcome back, Naturalist!");
          setTimeout(() => onClose(), 800);
        }
      } else {
        const res = await signUp(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg("Account created! Check your email to confirm if required.");
          setTimeout(() => onClose(), 1200);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-cream-50 rounded-2xl border border-cream-300 shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-forest-700 hover:bg-cream-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <h2 className="font-serif text-2xl font-bold text-forest-950">
              {user && !user.isGuest ? "Naturalist Account" : mode === "signin" ? "Sign In" : "Join TouchQuest"}
            </h2>
          </div>
          <p className="text-xs text-forest-800/80">
            {isSupabaseReady
              ? "Sync your outdoor streaks, species sightings, and field journal across devices."
              : "Supabase authentication standby. You can explore as a Guest Naturalist."}
          </p>
        </div>

        {/* If user is already logged in with Supabase */}
        {user && !user.isGuest ? (
          <div className="space-y-4 pt-2">
            <div className="rounded-xl bg-forest-50 border border-forest-200 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-forest-700" />
                <span className="font-serif text-sm font-bold text-forest-950">
                  Logged in as {user.displayName}
                </span>
              </div>
              <p className="text-xs text-forest-800/80">{user.email}</p>
              <div className="pt-2">
                <Badge variant="sage" size="sm">Supabase Session Active</Badge>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await signOut();
                onClose();
              }}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <>
            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-cream-200 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  mode === "signin"
                    ? "bg-cream-50 text-forest-950 shadow-sm"
                    : "text-forest-700 hover:text-forest-950"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  mode === "signup"
                    ? "bg-cream-50 text-forest-950 shadow-sm"
                    : "text-forest-700 hover:text-forest-950"
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="rounded-xl bg-forest-50 border border-forest-200 p-3 text-xs text-forest-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-forest-900">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-forest-600/70" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naturalist@touchquest.org"
                    className="w-full rounded-xl border border-cream-300 bg-cream-100/70 pl-9 pr-3.5 py-2 text-xs text-forest-950 focus:border-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-forest-900">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-forest-600/70" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-cream-300 bg-cream-100/70 pl-9 pr-3.5 py-2 text-xs text-forest-950 focus:border-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="w-full justify-center text-xs py-2.5 font-bold shadow-md"
              >
                {submitting ? "Processing..." : mode === "signin" ? "Sign In to Journal" : "Create Account"}
              </Button>
            </form>

            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-300"></div>
              </div>
              <span className="relative bg-cream-50 px-2 text-[11px] text-forest-700/80 font-medium">
                or explore offline
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                continueAsGuest("Field Naturalist");
                onClose();
              }}
              className="w-full justify-center text-xs py-2 border-cream-300 hover:bg-cream-200"
            >
              <User className="w-3.5 h-3.5 mr-1.5 text-forest-700" />
              <span>Continue as Guest Naturalist</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
