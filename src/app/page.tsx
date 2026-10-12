import React from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  Camera,
  Mic,
  MapPin,
  BookOpen,
  ArrowRight,
  Flame,
  TreePine,
  Wind,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Cpu,
  Smartphone,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-forest-950 selection:bg-forest-200">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-cream-300">
          {/* Ambient organic background orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-sage-200/50 blur-3xl -z-10 pointer-events-none" />
          <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-earth-200/40 blur-3xl -z-10 pointer-events-none" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-forest-900/5 border border-forest-900/10 px-3.5 py-1 text-xs font-semibold text-forest-900 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Hacktoberfest 2026: Touch Grass AI Challenge</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-forest-950 leading-[1.08]">
                Explore More. <br />
                <span className="text-forest-700 italic font-normal">Scroll Less.</span>
              </h1>
              <p className="mx-auto max-w-2xl text-base sm:text-lg text-forest-800/80 leading-relaxed font-sans pt-2">
                The open-source AI companion designed to break algorithmic dopamine loops.
                Undertake 15-to-60 minute micro-missions, identify living flora, classify bird calls,
                and reclaim real sensory presence outdoors.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-forest-900 px-7 py-3.5 text-sm font-bold text-cream-50 hover:bg-forest-800 transition-all shadow-md shadow-forest-950/10 active:scale-95"
              >
                <span>Launch Explorer Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/missions"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-cream-400 bg-cream-50 px-6 py-3.5 text-sm font-bold text-forest-900 hover:bg-cream-200 transition-all shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-forest-700" />
                <span>Try 15-Min Mission</span>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-forest-700/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600" /> 100% Genuine Open Weights
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-forest-600" /> Zero Infinite Feeds
              </span>
              <span className="flex items-center gap-1.5">
                <TreePine className="w-4 h-4 text-forest-600" /> Mobile-First Field Ready
              </span>
            </div>
          </div>
        </section>

        {/* CORE PILLARS SECTION */}
        <section className="py-16 sm:py-20 border-b border-cream-300 bg-cream-50/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <Badge variant="earth">Purpose-Built Outdoors</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
                Engineered to get you off the screen
              </h2>
              <p className="text-sm text-forest-800/80">
                Most applications compete for your attention. TouchQuest is calibrated to give you
                a prompt and gently send you into the woods, backyard, or local park.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <Card variant="glass" className="p-6 space-y-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-900 text-cream-100 shadow-sm">
                  <Clock className="w-5 h-5 text-forest-300" />
                </div>
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  Micro-Missions (15, 30, 60m)
                </h3>
                <p className="text-xs text-forest-800/80 leading-relaxed">
                  Generate sensory quests calibrated precisely to your available time.
                  Whether taking a 15-minute screen break or embarking on a 1-hour weekend trail walk.
                </p>
                <div className="text-[11px] font-semibold text-forest-700 flex items-center gap-1 pt-1">
                  <span>Powered by Qwen-2.5 & Mistral Open Weights</span>
                </div>
              </Card>

              {/* Pillar 2 */}
              <Card variant="glass" className="p-6 space-y-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-900 text-cream-100 shadow-sm">
                  <Camera className="w-5 h-5 text-forest-300" />
                </div>
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  Zero-Shot Nature Scanner
                </h3>
                <p className="text-xs text-forest-800/80 leading-relaxed">
                  Snap plants, moss, fungi, and natural specimens. Server-side vision models classify
                  likely taxonomy without sending telemetry to big tech ad brokers.
                </p>
                <div className="text-[11px] font-semibold text-forest-700 flex items-center gap-1 pt-1">
                  <span>Targeting BioCLIP zero-shot biological taxonomy</span>
                </div>
              </Card>

              {/* Pillar 3 */}
              <Card variant="glass" className="p-6 space-y-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-earth-700 text-cream-100 shadow-sm">
                  <Mic className="w-5 h-5 text-earth-200" />
                </div>
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  BirdCall AI Bioacoustics
                </h3>
                <p className="text-xs text-forest-800/80 leading-relaxed">
                  Record singing birds overhead. Open-weight acoustic models process frequencies
                  to reveal species identities, teaching you to recognize your local avian canopy.
                </p>
                <div className="text-[11px] font-semibold text-earth-800 flex items-center gap-1 pt-1">
                  <span>Engineered with BirdNET bioacoustic architectures</span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* OPEN-WEIGHT AI TRANSPARENCY SECTION */}
        <section className="py-16 sm:py-20 border-b border-cream-300 bg-forest-950 text-cream-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <Badge variant="forest" size="md">Open-Weight Architecture</Badge>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-cream-50 leading-tight">
                  Transparent Open AI Models. <br />
                  <span className="text-forest-300 font-normal italic">No Proprietary Lock-In.</span>
                </h2>
                <p className="text-sm text-cream-300/90 leading-relaxed">
                  In compliance with the Hacktoberfest Open-Source AI Challenge, TouchQuest relies
                  strictly on genuine open-weight models accessed via hosted inference APIs.
                  Zero fake mocks, zero local Ollama installations required.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="rounded-xl bg-forest-900/60 p-3.5 border border-forest-800 flex items-start gap-3">
                    <Cpu className="w-4 h-4 text-forest-300 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-cream-100">Text & Mission Intelligence</div>
                      <div className="text-xs text-cream-300/80">Qwen/Qwen2.5-7B-Instruct & Mistral-7B-Instruct-v0.3</div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-forest-900/60 p-3.5 border border-forest-800 flex items-start gap-3">
                    <Camera className="w-4 h-4 text-forest-300 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-cream-100">Biological Computer Vision</div>
                      <div className="text-xs text-cream-300/80">imageomics/bioclip (Zero-Shot Tree of Life Classifier)</div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-forest-900/60 p-3.5 border border-forest-800 flex items-start gap-3">
                    <Mic className="w-4 h-4 text-forest-300 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-cream-100">Avian Bioacoustic Classification</div>
                      <div className="text-xs text-cream-300/80">DBD-research-group/BirdNET (Acoustic Species Identification)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adapter Pattern Visual */}
              <div className="rounded-2xl border border-forest-800 bg-forest-900/40 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-forest-800/80 pb-3">
                  <span className="font-mono text-xs text-forest-300 uppercase tracking-wider font-semibold">
                    TouchQuest Adapter Pattern
                  </span>
                  <Badge variant="forest" size="sm">Server-Side Only</Badge>
                </div>
                <div className="space-y-2 text-xs font-mono text-cream-200/90 leading-relaxed">
                  <p className="text-forest-300">// Clean abstraction isolating inference providers</p>
                  <p>interface IMissionGeneratorAdapter &#123;</p>
                  <p className="pl-4">generateMission(params): Promise&lt;Mission&gt;;</p>
                  <p>&#125;</p>
                  <p className="pt-2 text-forest-300">// Zero secret leakage to the client</p>
                  <p className="text-emerald-300">const adapter = new OpenWeightsMissionAdapter();</p>
                </div>
                <div className="rounded-lg bg-forest-900 p-3 text-xs text-cream-300/80 border border-forest-800">
                  Switch hosted inference backends or local clusters without changing UI components or business logic.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-16 sm:py-20 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest-950">
              Ready to Touch Grass?
            </h2>
            <p className="text-sm sm:text-base text-forest-800/80 max-w-xl mx-auto">
              Your next outdoor micro-quest takes just 15 minutes. Experience how small moments in
              living nature sharpen focus, lower heart rate, and clear mental fatigue.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-forest-900 px-8 py-4 text-sm font-bold text-cream-50 hover:bg-forest-800 transition-all shadow-lg shadow-forest-950/15"
              >
                <span>Enter TouchQuest Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
