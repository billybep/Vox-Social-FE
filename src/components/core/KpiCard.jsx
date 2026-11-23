import React, { useState } from 'react';
import EvidenceTag from './EvidenceTag';

/**
 * KPI Card Component
 * Analysis Canvas: Pure white card (#FFFFFF) with 1px neutral gray border.
 * Features:
 * - Tabular metric numeral
 * - Evidence Tag / Source badge
 * - Info tooltip detailing exact definition & data source
 * - Period / interval label
 */
export default function KpiCard({
  title,
  value,
  max = 100,
  band = '',
  period = '',
  definition = '',
  source = '',
  evidenceType = 'measured',
  isReal = false,
  onAction = null,
  actionLabel = '',
  icon = null,
  isUnavailable = false,
  unavailableReason = '',
  className = ''
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Status color for score band
  let statusBadge = null;
  if (!isUnavailable && typeof value === 'number') {
    if (value >= 85) {
      statusBadge = <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Strong</span>;
    } else if (value >= 70) {
      statusBadge = <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Solid</span>;
    } else if (value >= 50) {
      statusBadge = <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Needs Work</span>;
    } else {
      statusBadge = <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">Critical</span>;
    }
  }

  return (
    <div className={`relative p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between ${className}`}>
      
      {/* Top row: Title, Tooltip Trigger & Evidence Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-700">{title}</span>
            {definition && (
              <div className="relative inline-block">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip(!showTooltip)}
                  className="w-4 h-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-[10px] transition-colors"
                  aria-label="Metric definition"
                >
                  <i className="fa-solid fa-info"></i>
                </button>

                {/* Tooltip Popup */}
                {showTooltip && (
                  <div className="absolute z-30 bottom-full start-0 mb-2 w-64 p-3 rounded-xl bg-slate-900 text-white text-[11px] shadow-xl border border-slate-700 animate-fade-in pointer-events-none">
                    <p className="font-semibold text-slate-200 mb-1">{title}</p>
                    <p className="text-slate-300 leading-relaxed mb-2">{definition}</p>
                    {source && (
                      <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Source:</span>
                        <span className="font-medium text-cyan-400">{source}</span>
                      </div>
                    )}
                    {period && (
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>Period:</span>
                        <span className="text-slate-300">{period}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!isUnavailable && !isReal && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300">
                SAMPLE
              </span>
            )}
            <EvidenceTag 
              type={isUnavailable ? 'unavailable' : evidenceType} 
              source={source} 
              reason={unavailableReason}
            />
          </div>
        </div>

        {/* Metric Value */}
        <div className="flex items-baseline gap-2 mt-2">
          {isUnavailable ? (
            <div className="space-y-1">
              <span className="text-3xl font-black text-slate-300 font-mono tracking-tight">—</span>
              <p className="text-[11px] text-slate-500 italic leading-snug">
                {unavailableReason || 'Data stream not connected or unavailable.'}
              </p>
            </div>
          ) : (
            <>
              <span className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">
                {typeof value === 'number' ? value : '—'}
              </span>
              {max && (
                <span className="text-xs font-semibold text-slate-400 tabular-nums">
                  / {max}
                </span>
              )}
              {statusBadge && <div className="ms-auto">{statusBadge}</div>}
            </>
          )}
        </div>
      </div>

      {/* Footer / Context row */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {period && (
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <i className="fa-regular fa-clock text-[10px] text-slate-400"></i>
            <span>{period}</span>
          </span>
        )}

        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="text-[11px] font-bold text-brand-blue hover:text-blue-700 transition-colors flex items-center gap-1 ms-auto"
          >
            <span>{actionLabel}</span>
            <i className="fa-solid fa-arrow-right text-[9px] rtl:rotate-180"></i>
          </button>
        )}
      </div>
    </div>
  );
}
