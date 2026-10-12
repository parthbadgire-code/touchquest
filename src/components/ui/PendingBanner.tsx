import React from "react";
import { AlertCircle, KeyRound, ExternalLink } from "lucide-react";

export interface PendingBannerProps {
  featureName: string;
  reason?: string;
  envKeyName?: string;
  docUrl?: string;
  className?: string;
}

export function PendingBanner({
  featureName,
  reason = "This capability connects directly to genuine open-weight models via hosted inference.",
  envKeyName = "HF_API_TOKEN",
  docUrl,
  className = "",
}: PendingBannerProps) {
  return (
    <div
      className={`rounded-xl border border-amber-300/80 bg-amber-50/70 p-4 text-amber-900 transition-colors ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
          <KeyRound className="w-4 h-4" />
        </div>
        <div className="flex-1 text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-amber-950">{featureName}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-200/70 px-2 py-0.5 text-xs font-medium text-amber-800">
              <AlertCircle className="w-3 h-3" /> Pending Environment Key
            </span>
          </div>
          <p className="mt-1 text-amber-800/90 text-xs leading-relaxed">{reason}</p>
          <div className="mt-2.5 flex items-center gap-3 text-xs">
            <code className="rounded bg-amber-100/90 px-2 py-0.5 font-mono text-amber-900 font-medium">
              {envKeyName}
            </code>
            {docUrl && (
              <a
                href={docUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-amber-950 font-medium hover:underline"
              >
                Docs <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
