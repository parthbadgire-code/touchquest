import React from "react";
import Link from "next/link";
import { TreePine, Heart, Cpu, Sparkles, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function Footer() {
  return (
    <footer className="border-t border-cream-300 bg-cream-200/60 pb-20 md:pb-8 pt-12 text-forest-900 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-900 text-cream-100 shadow-sm">
                <TreePine className="h-5 w-5 text-forest-300" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-forest-950">
                TouchQuest
              </span>
              <Badge variant="earth" size="sm">Touch Grass</Badge>
            </div>
            <p className="text-sm text-forest-800/80 max-w-md leading-relaxed">
              TouchQuest is built to flip the script on algorithmic addiction. Using server-hosted
              open-weight models, we give you reason to put down the infinite feed, step outside,
              and connect with real earth, flora, and avian life.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-forest-700">
              <span>Open Source AI</span>
              <span>•</span>
              <span>Privacy-First</span>
              <span>•</span>
              <span>Zero Screen Loops</span>
            </div>
          </div>

          {/* Col 2: Genuine Open Models */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-forest-950 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-forest-600" /> Open-Weight Models
            </h4>
            <ul className="space-y-2 text-xs text-forest-800/90">
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-500"></span>
                <span>Missions: Qwen-2.5-7B / Mistral-7B</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-500"></span>
                <span>Visuals: BioCLIP (Zero-Shot Biology)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-500"></span>
                <span>Acoustics: BirdNET Bioacoustics</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-500"></span>
                <span>Maps: Leaflet + OpenStreetMap</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation & Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-forest-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-forest-600" /> Platform
            </h4>
            <ul className="space-y-2 text-xs font-medium text-forest-800/90">
              <li>
                <Link href="/dashboard" className="hover:text-forest-950 transition-colors">
                  Explorer Hub
                </Link>
              </li>
              <li>
                <Link href="/missions" className="hover:text-forest-950 transition-colors">
                  15 / 30 / 60 Min Missions
                </Link>
              </li>
              <li>
                <Link href="/scanner" className="hover:text-forest-950 transition-colors">
                  Nature Scanner
                </Link>
              </li>
              <li>
                <Link href="/birdcall" className="hover:text-forest-950 transition-colors">
                  BirdCall AI Acoustic
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-forest-950 transition-colors">
                  Field Journal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream-300 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-forest-700/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-forest-600" />
            <span>Privacy-first • No location tracking sold • MIT License</span>
          </div>
          <div className="flex items-center gap-1 text-forest-700">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-earth-600 fill-earth-500 inline" />
            <span>for the outdoors</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
