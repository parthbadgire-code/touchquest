"use client";

import React, { useState } from "react";
import { Sparkles, Timer, Footprints, Wind, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PendingBanner } from "@/components/ui/PendingBanner";
import { MissionDuration, Mission } from "@/types";

export function QuickMissionSelector() {
  const [selectedDuration, setSelectedDuration] = useState<MissionDuration>(15);
  const [generating, setGenerating] = useState(false);
  const [generatedMission, setGeneratedMission] = useState<Mission | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);

  const durationPresets: Record<
    MissionDuration,
    {
      title: string;
      subtitle: string;
      focus: string;
      sampleTasks: string[];
      groundingTip: string;
      difficulty: string;
    }
  > = {
    15: {
      title: "15-Min Micro Grounding",
      subtitle: "A swift reset between meetings or coding sessions.",
      focus: "Tactile & Audio Awareness",
      sampleTasks: [
        "Step outside and identify 3 distinct tree bark textures with your fingertips.",
        "Close your eyes for 60 seconds; catalog the furthest natural sound.",
        "Locate a single wild plant thriving through sidewalk stone or fence.",
      ],
      groundingTip: "Keep phone screen locked; trust your senses.",
      difficulty: "Effortless",
    },
    30: {
      title: "30-Min Canopy & Flora Quest",
      subtitle: "Delve deeper into neighborhood green pockets or parks.",
      focus: "Botany & Sunlight Observation",
      sampleTasks: [
        "Find a canopy opening and observe light filtration through leaves.",
        "Discover 2 different fungi, lichen, or native moss patches.",
        "Track a foraging bird or pollinator for 3 uninterrupted minutes.",
      ],
      groundingTip: "Walk at half your typical pace. Breathe with the trees.",
      difficulty: "Balanced",
    },
    60: {
      title: "60-Min Wilderness Immersion",
      subtitle: "Complete sensory detachment from digital alerts.",
      focus: "Deep Ecological Observation & Trail Walking",
      sampleTasks: [
        "Hike an unfamiliar trail loop or wooded perimeter.",
        "Document 3 separate bird species calls with your ears.",
        "Sit on a fallen trunk or rock for 10 minutes of silent presence.",
        "Write a field note in your nature journal before heading home.",
      ],
      groundingTip: "Airplane mode recommended. Soak in the forest aroma (phytoncides).",
      difficulty: "Immersive",
    },
  };

  const currentPreset = durationPresets[selectedDuration];

  const handleGenerate = async () => {
    setGenerating(true);
    setFeedbackMessage(null);
    setPendingNotice(null);

    try {
      const res = await fetch("/api/ai/mission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationMinutes: selectedDuration,
          terrain: "park or neighborhood green space",
        }),
      });

      const data = await res.json();

      if (res.status === 503) {
        setPendingNotice(
          data.error || "Model API key (HF_API_TOKEN) is not configured in .env.local."
        );
      } else if (!res.ok) {
        throw new Error(data.error || `Server responded with status ${res.status}`);
      } else if (data.mission) {
        setGeneratedMission(data.mission);
        setFeedbackMessage(`Generated fresh ${selectedDuration}-minute quest via open-weight model!`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate mission.";
      setFeedbackMessage(msg);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card variant="default" className="p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-bold text-forest-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-forest-600" /> Outdoor Mission Generator
            </h3>
            <Badge variant="sage" size="sm">Qwen-2.5-7B / Mistral-7B</Badge>
          </div>
          <p className="text-xs text-forest-800/80 mt-1">
            Choose your window to step away from screens and connect with living earth.
          </p>
        </div>

        {/* Duration Segmented Control */}
        <div className="flex items-center gap-1 rounded-xl bg-cream-200/90 p-1 border border-cream-300">
          {([15, 30, 60] as MissionDuration[]).map((dur) => (
            <button
              key={dur}
              onClick={() => {
                setSelectedDuration(dur);
                setGeneratedMission(null);
                setFeedbackMessage(null);
                setPendingNotice(null);
              }}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                selectedDuration === dur
                  ? "bg-forest-900 text-cream-50 shadow-xs"
                  : "text-forest-800 hover:text-forest-950 hover:bg-cream-300/50"
              }`}
            >
              <Timer className="w-3 h-3" />
              <span>{dur}m</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Mission Preview Box (preset or real generated) */}
      <div className="rounded-xl border border-sage-200/90 bg-sage-50/60 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sage-200/80 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700">
              Quest Blueprint ({selectedDuration} Minutes) {generatedMission && "• AI Generated"}
            </span>
            <h4 className="font-serif text-lg font-bold text-forest-950">
              {generatedMission ? generatedMission.title : currentPreset.title}
            </h4>
            <p className="text-xs text-forest-800/80 mt-0.5">
              {generatedMission ? generatedMission.description : currentPreset.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="earth" size="sm">
              Focus: {generatedMission ? generatedMission.theme : currentPreset.focus}
            </Badge>
            <Badge variant="cream" size="sm">
              {generatedMission ? generatedMission.difficulty : currentPreset.difficulty}
            </Badge>
          </div>
        </div>

        {/* Tasks list */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-forest-900 flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-forest-700" /> Actionable Micro-Goals:
          </span>
          <ul className="space-y-2 text-xs text-forest-900/90">
            {generatedMission
              ? generatedMission.steps.map((step, idx) => (
                  <li
                    key={step.id || idx}
                    className="flex items-start gap-2.5 rounded-lg bg-cream-50/80 p-2.5 border border-cream-200"
                  >
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-800 text-[10px] font-bold">
                      {idx + 1}
                    </div>
                    <span className="leading-relaxed">
                      {step.instruction}
                      {step.hint && <span className="block text-[11px] text-forest-700 italic mt-0.5">{step.hint}</span>}
                    </span>
                  </li>
                ))
              : currentPreset.sampleTasks.map((task, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg bg-cream-50/80 p-2.5 border border-cream-200"
                  >
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-800 text-[10px] font-bold">
                      {idx + 1}
                    </div>
                    <span className="leading-relaxed">{task}</span>
                  </li>
                ))}
          </ul>
        </div>

        {/* Grounding Reminder */}
        <div className="rounded-lg bg-forest-900/5 p-3 border border-forest-900/10 flex items-center gap-2.5 text-xs text-forest-900">
          <Wind className="w-4 h-4 text-forest-700 shrink-0" />
          <span>
            <strong className="text-forest-950">Grounding Tip:</strong>{" "}
            {generatedMission ? generatedMission.outdoorFocusTip : currentPreset.groundingTip}
          </span>
        </div>
      </div>

      {feedbackMessage && (
        <div className="rounded-xl bg-forest-50 border border-forest-200 p-3 text-xs text-forest-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {pendingNotice && (
        <PendingBanner
          featureName="Server-Side Open-Weight Mission Generator"
          reason={pendingNotice}
          envKeyName="HF_API_TOKEN"
        />
      )}

      <div className="flex items-center justify-end gap-3 pt-1">
        <Button
          variant="secondary"
          size="md"
          onClick={() => {
            alert(`Selected ${selectedDuration}-min quest. Pocket phone and step outdoors!`);
          }}
        >
          Use This Blueprint
        </Button>
        <Button
          variant="primary"
          size="md"
          isLoading={generating}
          onClick={handleGenerate}
        >
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Generate With AI Model
        </Button>
      </div>
    </Card>
  );
}
