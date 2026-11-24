import React from 'react';

/**
 * Evidence Tag Component
 * Represents the 5 evidence states specified in VA-Intelligence-Design.md:
 * 1. Measured: Solid fill, source and date on hover
 * 2. Connected: Solid fill + plug icon (client's own analytics/CRM)
 * 3. Estimated: Hatched / outlined fill + "Est." tag (modeled benchmark)
 * 4. AI Interpretation: Brand Magenta marker (never decorative)
 * 5. Unavailable / N/A: Neutral gray dash with reason (never 0)
 */
export default function EvidenceTag({ 
  type = 'measured', 
  source = '', 
  date = '', 
  reason = '',
  className = '' 
}) {
  const normType = (type || 'measured').toLowerCase();

  switch (normType) {
    case 'measured':
      return (
        <span 
          title={source ? `Measured via ${source} ${date ? `· ${date}` : ''}` : 'Measured directly in this audit run'}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 select-none ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span>Measured</span>
        </span>
      );

    case 'connected':
      return (
        <span 
          title={source ? `Connected to ${source}` : 'Direct sync from client analytics / CRM'}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 select-none ${className}`}
        >
          <i className="fa-solid fa-plug text-[9px] text-sky-600 shrink-0"></i>
          <span>Connected</span>
        </span>
      );

    case 'disconnected':
      return (
        <span 
          title={reason || 'Integration disconnected · OAuth pending'}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-300 select-none ${className}`}
        >
          <i className="fa-solid fa-plug-circle-xmark text-[10px] text-slate-500 shrink-0"></i>
          <span>Disconnected</span>
        </span>
      );

    case 'estimated':
      return (
        <span 
          title={source ? `Estimated via ${source}` : 'Modeled or third-party estimate'}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50/80 text-amber-800 border border-dashed border-amber-300 select-none ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full border border-amber-500 bg-transparent shrink-0"></span>
          <span>Estimated (Est.)</span>
        </span>
      );

    case 'ai':
    case 'ai_interpretation':
    case 'ai interpretation':
      return (
        <span 
          title={source ? `AI Synthesis: ${source}` : 'Synthesized by AI from verified findings'}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-fuchsia-50 text-fuchsia-800 border border-[#cf41b2]/30 select-none ${className}`}
        >
          <span className="w-2 h-2 rounded-sm bg-[#cf41b2] shrink-0"></span>
          <span>AI Interpretation</span>
        </span>
      );

    case 'unavailable':
    case 'na':
    case 'n/a':
    default:
      return (
        <span 
          title={reason || 'Source API unreachable or not connected yet'}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 select-none ${className}`}
        >
          <span className="font-mono font-bold">—</span>
          <span>Unavailable</span>
        </span>
      );
  }
}
