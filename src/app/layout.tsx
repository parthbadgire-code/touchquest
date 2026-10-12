import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const serifFont = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#123324",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "TouchQuest • Explore More. Scroll Less.",
  description:
    "A mobile-first, open-source AI-powered nature exploration companion. Break digital loops, undertake 15-to-60 minute micro-adventures, scan biodiversity, and record avian acoustics.",
  keywords: [
    "nature exploration",
    "touch grass",
    "open source AI",
    "outdoor wellness",
    "micro adventures",
    "biodiversity scanner",
    "birdcall classifier",
    "nature journal",
  ],
  openGraph: {
    title: "TouchQuest • Explore More. Scroll Less.",
    description: "AI-powered nature exploration platform for the real world.",
    type: "website",
  },
};

import { AuthProvider } from "@/lib/auth/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} h-full antialiased selection:bg-forest-200 selection:text-forest-950`}
    >
      <body className="min-h-full flex flex-col font-sans bg-cream-100 text-forest-950">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
