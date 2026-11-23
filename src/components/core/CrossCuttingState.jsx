import React from 'react';

/**
 * Cross-cutting States Component
 * Built-in states designed once and reused everywhere:
 * - empty
 * - loading skeleton
 * - error with retry
 * - source unavailable
 * - permission denied
 */
export default function CrossCuttingState({
  state = 'empty', // 'empty' | 'loading' | 'error' | 'unavailable' | 'permission_denied'
  title = '',
  description = '',
  onRetry = null,
  actionLabel = 'Try Again',
  className = ''
}) {
  if (state === 'loading') {
    return (
      <div className={`p-8 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-4 ${className}`}>
        <div className="h-4 bg-slate-200 rounded-md w-1/3"></div>
        <div className="h-8 bg-slate-100 rounded-md w-1/2"></div>
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-slate-100 rounded w-full"></div>
          <div className="h-3 bg-slate-100 rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className={`p-8 rounded-2xl bg-red-50/60 border border-red-200 text-center space-y-3 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-lg">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h4 className="text-base font-bold text-red-950">{title || "Audit Engine Check Failed"}</h4>
        <p className="text-xs text-red-700 max-w-md mx-auto">
          {description || "One of the crawler nodes encountered a timeout while reading the target endpoint. Your credit was not deducted."}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    );
  }

  if (state === 'unavailable') {
    return (
      <div className={`p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2 ${className}`}>
        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto text-sm">
          <i className="fa-solid fa-plug-circle-xmark"></i>
        </div>
        <h5 className="text-xs font-bold text-slate-800">{title || "Data Source Unavailable"}</h5>
        <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
          {description || "This data point requires an active client API connection or verified domain ownership."}
        </p>
      </div>
    );
  }

  if (state === 'permission_denied') {
    return (
      <div className={`p-8 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-3 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-lg">
          <i className="fa-solid fa-lock"></i>
        </div>
        <h4 className="text-base font-bold text-amber-950">{title || "Restricted to Agency Workspace"}</h4>
        <p className="text-xs text-amber-800 max-w-md mx-auto">
          {description || "Your current user role does not have authorization to view or edit this section. Switch your role in the top bar to test."}
        </p>
      </div>
    );
  }

  // Default: empty
  return (
    <div className={`p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-lg">
        <i className="fa-regular fa-folder-open"></i>
      </div>
      <h4 className="text-base font-bold text-slate-800">{title || "No audit runs on record yet"}</h4>
      <p className="text-xs text-slate-500 max-w-md mx-auto">
        {description || "Start a new audit to crawl the target domain and generate real multi-pillar diagnostic insights."}
      </p>
    </div>
  );
}
