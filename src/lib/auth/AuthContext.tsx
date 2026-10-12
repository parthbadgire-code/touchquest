"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export interface AuthUser {
  id: string;
  email?: string;
  displayName: string;
  isGuest: boolean;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isSupabaseReady: boolean;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signUp: (email: string, pass: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  continueAsGuest: (name?: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isSupabaseReady: false,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  continueAsGuest: () => {},
});

const GUEST_STORAGE_KEY = "touchquest_guest_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage for persistent guest user first
    const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);

    if (isSupabaseConfigured && supabase) {
      // 1. Check active Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Naturalist",
            isGuest: false,
          });
        } else if (savedGuest) {
          try {
            setUser(JSON.parse(savedGuest));
          } catch {
            // fallback guest
            setUser({
              id: "guest-default",
              displayName: "Field Naturalist",
              isGuest: true,
            });
          }
        } else {
          // Default guest naturalist
          const defaultGuest: AuthUser = {
            id: `guest-${Date.now().toString(36)}`,
            displayName: "Field Naturalist",
            isGuest: true,
          };
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(defaultGuest));
          setUser(defaultGuest);
        }
        setIsLoading(false);
      });

      // 2. Listen to Supabase auth events
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Naturalist",
            isGuest: false,
          });
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Offline / standalone mode
      if (savedGuest) {
        try {
          setUser(JSON.parse(savedGuest));
        } catch {
          setUser({ id: "guest-local", displayName: "Field Explorer", isGuest: true });
        }
      } else {
        const guest: AuthUser = {
          id: `guest-${Math.random().toString(36).substring(2, 9)}`,
          displayName: "Field Explorer",
          isGuest: true,
        };
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guest));
        setUser(guest);
      }
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, pass: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: "Supabase authentication is pending project keys in .env.local" };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) return { error: error.message };
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Naturalist",
        isGuest: false,
      });
    }
    return {};
  };

  const signUp = async (email: string, pass: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: "Supabase authentication is pending project keys in .env.local" };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
    });
    if (error) return { error: error.message };
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Naturalist",
        isGuest: false,
      });
    }
    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    // Revert to guest naturalist
    const guest: AuthUser = {
      id: `guest-${Date.now().toString(36)}`,
      displayName: "Field Explorer",
      isGuest: true,
    };
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guest));
    setUser(guest);
  };

  const continueAsGuest = (name: string = "Field Naturalist") => {
    const guest: AuthUser = {
      id: `guest-${Date.now().toString(36)}`,
      displayName: name,
      isGuest: true,
    };
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guest));
    setUser(guest);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSupabaseReady: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
