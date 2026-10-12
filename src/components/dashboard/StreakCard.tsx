import React from "react";
import { Flame, Clock, Award, Shield, WifiOff, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface StreakCardProps {
  streakDays?: number;
  digitalBreakMinutesToday?: number;
  totalOutdoorMinutes?: number;
  levelTitle?: string;
  levelProgress?: number;
}

export function StreakCard({
  streakDays = 3,
  digitalBreakMinutesToday = 45,
  totalOutdoorMinutes = 320,
  levelTitle = "Woodland Wanderer",
  levelProgress = 65,
}: StreakCardProps) {
  return (
    <Card variant="glass" className="overflow-hidden p-5 sm:p-6 relative border-sage-200">
      {/* Background ambient gradient */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-forest-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-earth-200/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Streak & Detox Metrics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Badge variant="earth" size="md" className="gap-1.5 shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-earth-600 text-earth-700" />
              <span>{streakDays} Day Nature Streak</span>
            </Badge>

            <Badge variant="sage" size="md" className="gap-1.5">
              <WifiOff className="w-3.5 h-3.5 text-forest-700" />
              <span>{digitalBreakMinutesToday}m Offline Today</span>
            </Badge>

            <span className="text-xs text-forest-700/80 font-medium hidden sm:inline">
              Goal: 60m daily outdoor focus
            </span>
          </div>

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-forest-950">
              Welcome Back, Explorer
            </h2>
            <p className="mt-1 text-sm text-forest-800/80 leading-relaxed max-w-xl">
              You are {100 - levelProgress}% away from unlocking <span className="font-semibold text-forest-950">Forest Ranger</span>.
              Step outside, feel the crisp air, and let the real world replace the algorithm.
            </p>
          </div>

          {/* Level Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold text-forest-900">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-earth-600" />
                Level 2: {levelTitle}
              </span>
              <span>{levelProgress}%</span>
            </div>
            <div className="h-2 w-full max-w-md rounded-full bg-cream-300/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-forest-600 to-forest-400 transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Quick Action Banner */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-cream-300/80 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
          <div className="rounded-xl bg-forest-900/5 p-3 border border-forest-900/10">
            <div className="flex items-center gap-2 text-xs font-bold text-forest-950">
              <Clock className="w-3.5 h-3.5 text-forest-700" />
              <span>All-Time Outing</span>
            </div>
            <div className="mt-1 font-serif text-xl font-bold text-forest-950">
              {Math.floor(totalOutdoorMinutes / 60)}h {totalOutdoorMinutes % 60}m
            </div>
            <span className="text-[11px] text-forest-700/80">Real world presence logged</span>
          </div>

          <Link
            href="/missions"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-forest-900 px-4 py-2.5 text-xs font-bold text-cream-50 hover:bg-forest-800 transition-colors shadow-sm"
          >
            <span>Start Quick Quest</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
