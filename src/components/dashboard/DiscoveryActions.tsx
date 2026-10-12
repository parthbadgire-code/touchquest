import React from "react";
import Link from "next/link";
import { Camera, Mic, Sparkles, ArrowRight, Upload, Leaf, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function DiscoveryActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Nature Scanner Card */}
      <Card variant="default" className="p-5 sm:p-6 flex flex-col justify-between group hover:border-forest-400/80 transition-all">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-900 text-cream-100 shadow-sm">
              <Camera className="w-5 h-5 text-forest-300" />
            </div>
            <Badge variant="sage" size="sm">Open-Weight Vision</Badge>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-forest-950 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-forest-600" /> Nature Scanner
            </h3>
            <p className="mt-1 text-xs text-forest-800/80 leading-relaxed">
              Capture or upload photos of local flora, fungi, bark, or wild pollinators.
              Uses open-weight zero-shot biology models (<code className="font-mono text-forest-900 font-semibold">BioCLIP</code>) server-side.
            </p>
          </div>

          <div className="rounded-xl border border-cream-300 bg-cream-100/60 p-3 text-xs text-forest-900 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-forest-700">
              <span>Supported Inputs</span>
              <span className="text-forest-950 font-bold">JPEG, PNG, WEBP</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-forest-700">
              <span>Target Taxonomy</span>
              <span className="text-forest-950 font-bold">400,000+ Plant & Fungi Taxa</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-cream-200 mt-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-forest-700">
            Field Camera Ready
          </span>
          <Link
            href="/scanner"
            className="inline-flex items-center gap-1.5 rounded-xl bg-forest-900 px-3.5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-800 transition-colors shadow-sm"
          >
            <span>Open Scanner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>

      {/* 2. BirdCall AI Card */}
      <Card variant="default" className="p-5 sm:p-6 flex flex-col justify-between group hover:border-earth-400/80 transition-all">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-earth-700 text-cream-100 shadow-sm">
              <Mic className="w-5 h-5 text-earth-200" />
            </div>
            <Badge variant="earth" size="sm">Open Bioacoustics</Badge>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-forest-950 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-earth-700" /> BirdCall AI
            </h3>
            <p className="mt-1 text-xs text-forest-800/80 leading-relaxed">
              Listen quietly in the trees, record acoustic chirps, or upload audio clips.
              Identifies avian species using open-weight bioacoustic spectrogram models (<code className="font-mono text-forest-900 font-semibold">BirdNET</code>).
            </p>
          </div>

          <div className="rounded-xl border border-earth-200/80 bg-earth-50/50 p-3 text-xs text-forest-900 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-earth-800">
              <span>Audio Formats</span>
              <span className="text-forest-950 font-bold">WAV, MP3, M4A, WebM</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-earth-800">
              <span>Frequency Range</span>
              <span className="text-forest-950 font-bold">1 kHz – 15 kHz Avian Spectrogram</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-cream-200 mt-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-forest-700">
            Acoustic Mic Ready
          </span>
          <Link
            href="/birdcall"
            className="inline-flex items-center gap-1.5 rounded-xl bg-forest-900 px-3.5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-800 transition-colors shadow-sm"
          >
            <span>Launch BirdCall</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
