"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PendingBanner } from "@/components/ui/PendingBanner";
import { Camera, Upload, Leaf, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { SpeciesSighting } from "@/types";

export default function NatureScannerPage() {
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speciesResults, setSpeciesResults] = useState<SpeciesSighting[] | null>(null);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSpeciesResults(null);
    setPendingNotice(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image format (JPEG, PNG, or WEBP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg("File size must be under 8MB for transmission.");
      return;
    }

    setFileSelected(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleAnalyze = async () => {
    if (!fileSelected) return;
    setIsAnalyzing(true);
    setErrorMsg(null);
    setSpeciesResults(null);
    setPendingNotice(null);

    try {
      const formData = new FormData();
      formData.append("file", fileSelected);

      const res = await fetch("/api/ai/vision", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.status === 503) {
        setPendingNotice(
          data.error || "Open-weight vision model endpoint is pending HF_API_TOKEN environment configuration."
        );
      } else if (!res.ok) {
        throw new Error(data.error || `Server responded with status ${res.status}`);
      } else {
        setSpeciesResults(data.species || []);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to analyze specimen.";
      setErrorMsg(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-forest-950">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-16 pt-6 sm:pt-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-cream-300 pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="forest" size="sm">Vision Intelligence</Badge>
              <span className="text-xs text-forest-700 font-medium">Flora Classification</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-forest-950 mt-1">
              Nature Scanner
            </h1>
            <p className="text-sm text-forest-800/80 mt-1">
              Photograph plants, mushrooms, bark, or wildflowers to classify taxonomy via serverless open-weight models.
            </p>
          </div>

          {/* Scanner Upload Container */}
          <Card variant="default" className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-sage-300 rounded-2xl p-8 bg-cream-50/70 hover:bg-cream-100/70 transition-colors text-center relative cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  aria-label="Upload nature photo"
                />

                {previewUrl ? (
                  <div className="space-y-3 max-w-xs">
                    <img
                      src={previewUrl}
                      alt="Field preview"
                      className="max-h-64 rounded-xl mx-auto object-cover border border-cream-300 shadow-sm"
                    />
                    <div className="text-xs font-semibold text-forest-900">
                      {fileSelected?.name} ({(fileSelected!.size / 1024).toFixed(0)} KB)
                    </div>
                    <span className="text-[11px] text-forest-700 underline">Tap to change image</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-900 text-cream-100 shadow-sm">
                      <Camera className="w-7 h-7 text-forest-300" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-forest-950">
                        Take Photo or Upload Specimen
                      </h3>
                      <p className="text-xs text-forest-800/80 mt-1">
                        High-contrast shots of leaves, flower petals, or fungus yield highest accuracy.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-sage-200/80 px-3 py-1.5 text-xs font-semibold text-forest-900">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Select From Device</span>
                    </div>
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {pendingNotice && (
                <PendingBanner
                  featureName="Open-Weight Vision Service"
                  reason={pendingNotice}
                  envKeyName="HF_API_TOKEN"
                />
              )}

              {/* Real Prediction Results if Inference Succeeded */}
              {speciesResults && speciesResults.length > 0 && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Inference Results from Open-Weight Model ({speciesResults[0].openWeightModelUsed})</span>
                  </div>
                  <div className="space-y-2">
                    {speciesResults.map((sighting) => (
                      <div
                        key={sighting.id}
                        className="rounded-lg bg-white/90 p-3 border border-emerald-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-forest-950">{sighting.commonName}</div>
                          <div className="font-serif italic text-forest-800">{sighting.scientificName}</div>
                        </div>
                        <Badge variant="success" size="sm">
                          {(sighting.confidence * 100).toFixed(0)}% Match
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-cream-200">
              <span className="text-xs text-forest-700">
                Model: <code className="font-mono font-semibold">Qwen/Qwen2.5-VL-72B-Instruct (Router v1)</code>
              </span>
              <Button
                variant="primary"
                size="md"
                disabled={!fileSelected || isAnalyzing}
                isLoading={isAnalyzing}
                onClick={handleAnalyze}
              >
                <Leaf className="w-3.5 h-3.5 mr-1" />
                Analyze Specimen
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
