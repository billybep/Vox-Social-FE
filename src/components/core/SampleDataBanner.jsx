import React, { useState } from 'react';

/**
 * Sample Data Banner Component
 * Persistent, dismissible-resistant top notice indicating prototype/sample data mode.
 * Informs the reviewer that data is simulated for "Cedar & Co. Dental" or live scanned.
 */
export default function SampleDataBanner({
  isReal = false,
  isDemo = false,
  targetDomain = '',
  onRunAudit = null,
  t
}) {
  const [isMinimized, setIsMinimized] = useState(false);

  const bannerTitle = isReal
    ? "LIVE AUDIT MODE ACTIVE"
    : isDemo
    ? "SAMPLE DATA DEMO (CEDAR & CO. DENTAL)"
    : "WORKSPACE READY (NO AUDIT YET)";

  const bannerText = isReal
    ? `Displaying verified live audit findings for ${targetDomain || 'workspace'}. Crawler nodes verified.`
    : isDemo
    ? `Viewing simulated multi-location dataset for Cedar & Co. Dental (Amman & Fairfax). Real audit engine activates upon running a live scan.`
    : `No audit run recorded yet for this workspace. Launch a growth audit to inspect SEO, social authority, and AI search presence.`;

  if (isMinimized) {
    return (
      <div className="w-full bg-slate-900 text-white text-[10px] font-mono px-4 py-1 flex items-center justify-between border-b border-slate-800 select-none">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isReal ? 'bg-emerald-400' : isDemo ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
          <span className="text-slate-400">
            {bannerTitle}
          </span>
        </div>
        <button
          onClick={() => setIsMinimized(false)}
          className="text-cyan-400 hover:text-cyan-300 underline font-sans text-[10px]"
        >
          Expand Details
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full px-4 sm:px-6 py-2 border-b select-none transition-colors ${
      isReal 
        ? 'bg-emerald-950/70 border-emerald-800 text-emerald-200' 
        : 'bg-slate-900 border-slate-800 text-slate-300'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full shrink-0 ${isReal ? 'bg-emerald-400 animate-pulse' : isDemo ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
          <div>
            <strong className="font-mono text-[11px] uppercase tracking-wider text-white me-2">
              {isReal ? "LIVE SCAN CONNECTED" : isDemo ? "PROTOTYPE SAMPLE DATA" : "WORKSPACE READY"}
            </strong>
            <span className="text-slate-400 text-[11px]">
              {bannerText}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ms-auto sm:ms-0">
          {!isReal && onRunAudit && (
            <button
              onClick={onRunAudit}
              className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] transition-all shadow-xs"
            >
              Run Real Audit →
            </button>
          )}
          <button
            onClick={() => setIsMinimized(true)}
            className="text-slate-400 hover:text-white text-[11px] transition-colors"
            title="Minimize banner"
          >
            <i className="fa-solid fa-chevron-up"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
