"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PendingBanner } from "@/components/ui/PendingBanner";
import { Mic, Upload, Volume2, Radio, Square, AlertCircle, CheckCircle2 } from "lucide-react";
import { BirdAcousticClassification } from "@/types";

export default function BirdCallPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [results, setResults] = useState<BirdAcousticClassification[] | null>(null);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setErrorMsg(null);
      setResults(null);
    } else {
      setIsRecording(false);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/") && !file.name.match(/\.(wav|mp3|m4a|webm|ogg)$/i)) {
      setErrorMsg("Please upload a valid audio file (WAV, MP3, M4A, WEBM).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Audio file exceeds maximum 10MB limit.");
      return;
    }

    setAudioFile(file);
    setErrorMsg(null);
    setResults(null);
    setPendingNotice(null);
  };

  const handleClassify = async () => {
    if (!audioFile) return;
    setIsClassifying(true);
    setErrorMsg(null);
    setResults(null);
    setPendingNotice(null);

    try {
      const formData = new FormData();
      formData.append("file", audioFile);

      const res = await fetch("/api/ai/audio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.status === 503) {
        setPendingNotice(
          data.error || "Open-weight audio model endpoint is pending HF_API_TOKEN environment configuration."
        );
      } else if (!res.ok) {
        throw new Error(data.error || `Server responded with status ${res.status}`);
      } else {
        setResults(data.classifications || []);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to classify bird audio.";
      setErrorMsg(msg);
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-forest-950">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-16 pt-6 sm:pt-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-cream-300 pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="earth" size="sm">Bioacoustic AI</Badge>
              <span className="text-xs text-forest-700 font-medium">Avian Audio Classifier</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-forest-950 mt-1">
              BirdCall AI Acoustic
            </h1>
            <p className="text-sm text-forest-800/80 mt-1">
              Record chirps in the canopy or upload field recordings to classify avian species via serverless open-weight models.
            </p>
          </div>

          <Card variant="default" className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col items-center justify-center p-8 bg-cream-50/80 rounded-2xl border border-cream-300 text-center space-y-4">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full transition-all ${
                  isRecording
                    ? "bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/30 ring-8 ring-red-100"
                    : "bg-earth-700 text-cream-100 shadow-md"
                }`}
              >
                <Mic className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  {isRecording ? "Listening to Canopies..." : "Field Acoustic Recorder"}
                </h3>
                <p className="text-xs text-forest-800/80 mt-1 max-w-sm">
                  {isRecording
                    ? "Point microphone toward the trees and capture 5–10 seconds of birdsong."
                    : "Upload an audio recording or capture ambient sound to classify species."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button
                  variant={isRecording ? "earth" : "primary"}
                  size="md"
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current mr-1" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-3.5 h-3.5 mr-1" />
                      <span>Field Mic Simulation</span>
                    </>
                  )}
                </Button>

                <label className="inline-flex items-center gap-1.5 rounded-xl border border-cream-400 bg-cream-100 px-4 py-2.5 text-xs font-semibold text-forest-900 hover:bg-cream-200 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Audio File</span>
                  <input
                    type="file"
                    accept="audio/*,.wav,.mp3,.m4a,.webm"
                    className="hidden"
                    onChange={handleAudioUpload}
                  />
                </label>
              </div>

              {audioFile && (
                <div className="flex items-center gap-3 bg-cream-200/90 px-4 py-2 rounded-xl text-xs font-semibold text-forest-950">
                  <Volume2 className="w-4 h-4 text-forest-700" />
                  <span>
                    {audioFile.name} ({(audioFile.size / 1024).toFixed(0)} KB)
                  </span>
                  <Button
                    variant="earth"
                    size="sm"
                    isLoading={isClassifying}
                    disabled={isClassifying}
                    onClick={handleClassify}
                  >
                    Classify Audio
                  </Button>
                </div>
              )}

              {errorMsg && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-900 flex items-center gap-2 max-w-md">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {pendingNotice && (
                <PendingBanner
                  featureName="Open-Weight Avian Classifier"
                  reason={pendingNotice}
                  envKeyName="HF_API_TOKEN"
                  className="max-w-md text-left"
                />
              )}

              {/* Real Prediction Results if Inference Succeeded */}
              {results && results.length > 0 && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-4 space-y-3 w-full max-w-md text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Bioacoustic Predictions ({results[0].modelUsed})</span>
                  </div>
                  <div className="space-y-2">
                    {results.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg bg-white/90 p-3 border border-emerald-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-forest-950">{item.species}</div>
                          <div className="font-serif italic text-forest-800">{item.scientificName}</div>
                        </div>
                        <Badge variant="success" size="sm">
                          {(item.confidence * 100).toFixed(0)}% Confidence
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-cream-200 text-xs text-forest-700">
              <span>Endpoint: <code className="font-mono font-semibold">Dedicated Endpoint (HF_AUDIO_ENDPOINT)</code></span>
              <span className="font-medium text-amber-800">Requires Dedicated Serving</span>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
