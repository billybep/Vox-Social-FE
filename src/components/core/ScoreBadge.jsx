import React from 'react';

/**
 * Score Badge & Coverage Meter
 * Displays 0-100 score with named bands:
 * - Strong: 85-100 (Accessible Green)
 * - Solid: 70-84 (Accessible Blue/Indigo)
 * - Needs Work: 50-69 (Accessible Amber)
 * - Critical: 0-49 (Accessible Red)
 * Includes an integrated Evidence Coverage meter.
 */
export default function ScoreBadge({
  score = 0,
  band = '',
  coverage = null,
  size = 'md', // 'sm' | 'md' | 'lg'
  isReal = false,
  showMeter = true,
  className = ''
}) {
  const numericScore = typeof score === 'number' ? Math.round(score) : 0;

  // Determine band and colors if not explicitly passed
  let bandName = band;
  let colorClasses = {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    accentBg: 'bg-emerald-600',
    barBg: 'bg-emerald-500'
  };

  if (numericScore >= 85) {
    bandName = bandName || 'Strong';
    colorClasses = {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      accentBg: 'bg-emerald-600',
      barBg: 'bg-emerald-500'
    };
  } else if (numericScore >= 70) {
    bandName = bandName || 'Solid';
    colorClasses = {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      accentBg: 'bg-blue-600',
      barBg: 'bg-blue-500'
    };
  } else if (numericScore >= 50) {
    bandName = bandName || 'Needs Work';
    colorClasses = {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      accentBg: 'bg-amber-600',
      barBg: 'bg-amber-500'
    };
  } else {
    bandName = bandName || 'Critical';
    colorClasses = {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      accentBg: 'bg-red-600',
      barBg: 'bg-red-500'
    };
  }

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className={`px-2 py-0.5 rounded text-xs font-bold tabular-nums border ${colorClasses.bg} ${colorClasses.border} ${colorClasses.text}`}>
          {numericScore}/100
        </span>
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
          {bandName}
        </span>
        {!isReal && (
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300">
            SAMPLE
          </span>
        )}
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm ${className}`}>
        <div className="flex items-center gap-5">
          <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 ${colorClasses.bg} ${colorClasses.border}`}>
            <span className={`text-3xl font-black tabular-nums tracking-tight ${colorClasses.text}`}>
              {numericScore}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-[-2px]">
              / 100
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${colorClasses.bg} ${colorClasses.text} border ${colorClasses.border}`}>
                {bandName}
              </span>
              {!isReal && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  SAMPLE DATA
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Digital Presence Index</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-0.5">
              Weighted composite of Search Visibility (55%) and Social Readiness (45%).
            </p>
          </div>
        </div>

        {showMeter && coverage !== null && (
          <div className="w-full sm:w-56 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-600">Evidence Coverage</span>
              <span className="font-bold tabular-nums text-slate-800">{coverage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${colorClasses.barBg}`}
                style={{ width: `${Math.min(100, Math.max(0, coverage))}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 leading-tight">
              Validated through multi-node crawl checkpoints.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Medium (default)
  return (
    <div className={`inline-flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs ${className}`}>
      <div className={`px-2.5 py-1 rounded-lg border font-black text-sm tabular-nums ${colorClasses.bg} ${colorClasses.border} ${colorClasses.text}`}>
        {numericScore}
      </div>
      <div>
        <div className="text-xs font-bold text-slate-900">{bandName}</div>
        {coverage !== null && (
          <div className="text-[10px] text-slate-500 tabular-nums">
            {coverage}% Coverage
          </div>
        )}
      </div>
    </div>
  );
}
