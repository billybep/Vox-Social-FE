import React, { useState, useEffect } from 'react';
import EvidenceTag from '../core/EvidenceTag';

/**
 * Audit Progress Center Component
 * Integrity Rule:
 * - NEVER show a fake smooth percentage bar.
 * - Show transparent, discrete Stage Statuses per engine/source with timestamps and technical explanations.
 * 
 * Required States:
 * 1. Running: Active stage with subtle pulse indicators and completed stages with checkmarks.
 * 2. Source Failed / Partial: Clearly marked failure (e.g., Instagram API rate limit) with plain-language reason and a working "Retry Source" button.
 * 3. Completed: All stages finished with primary CTA to open VoxAudit Intelligence Overview.
 */
export default function AuditProgressCenter({
  auditConfig,
  t,
  isRtl,
  onOpenOverview
}) {
  // Reviewer State Mode: 'running' | 'failed' | 'completed'
  const [simulationState, setSimulationState] = useState('running');
  const [activeStageIndex, setActiveStageIndex] = useState(2); // In running mode, stage 3 is active
  const [elapsedSeconds, setElapsedSeconds] = useState(14);
  const [isRetrying, setIsRetrying] = useState(false);

  // Discrete Stages definition
  const [stages, setStages] = useState([
    {
      id: 'stage-1',
      name: 'Website Crawl & VoxSEO Engine',
      engine: 'Multi-Node Crawler (SEOptimer Core)',
      timestamp: '00:03',
      status: 'completed', // 'completed' | 'running' | 'failed' | 'pending'
      details: '51 technical checkpoints evaluated: DNS, SSL, Core Web Vitals, mobile viewport, schema markup.',
      error: null
    },
    {
      id: 'stage-2',
      name: 'Social Authority & Gemini Multimodal AI',
      engine: 'Google Gemini 1.5 Pro',
      timestamp: '00:09',
      status: 'completed',
      details: 'Bio clarity, visual consistency, and direct booking conversion parameters inspected.',
      error: null
    },
    {
      id: 'stage-3',
      name: 'Generative AI Visibility Grounding',
      engine: 'LLM Search Probes (Perplexity & ChatGPT)',
      timestamp: '00:14',
      status: 'running',
      details: 'Querying 12 localized cosmetic dentistry queries across ChatGPT Search & Perplexity Pro.',
      error: null
    },
    {
      id: 'stage-4',
      name: 'Regional Competitor Benchmarking',
      engine: 'Competitive Multi-Domain Parser',
      timestamp: 'Pending',
      status: 'pending',
      details: 'Calculating comparative market score for Apex Dental, Pearl White Care, and SmileCraft.',
      error: null
    },
    {
      id: 'stage-5',
      name: 'Executive Synthesis & Growth Roadmap',
      engine: 'VoxAudit Rule-Based Synthesis',
      timestamp: 'Pending',
      status: 'pending',
      details: 'Assembling weighted Digital Presence Index and human-reviewable findings.',
      error: null
    }
  ]);

  // Handle Simulation State Switching (Sprint 2 Requirement)
  useEffect(() => {
    if (simulationState === 'running') {
      setStages([
        { id: 'stage-1', name: 'Website Crawl & VoxSEO Engine', engine: 'Multi-Node Crawler', timestamp: '00:03', status: 'completed', details: '51 technical checkpoints evaluated: DNS, SSL, Core Web Vitals, schema markup.', error: null },
        { id: 'stage-2', name: 'Social Authority & Gemini Multimodal AI', engine: 'Google Gemini 1.5 Pro', timestamp: '00:09', status: 'completed', details: 'Bio clarity, visual consistency, and direct booking parameters inspected.', error: null },
        { id: 'stage-3', name: 'Generative AI Visibility Grounding', engine: 'LLM Search Probes', timestamp: '00:14', status: 'running', details: 'Querying 12 localized cosmetic dentistry queries across ChatGPT Search & Perplexity Pro.', error: null },
        { id: 'stage-4', name: 'Regional Competitor Benchmarking', engine: 'Competitive Multi-Domain Parser', timestamp: 'Pending', status: 'pending', details: 'Calculating comparative market score for 3 competitors.', error: null },
        { id: 'stage-5', name: 'Executive Synthesis & Growth Roadmap', engine: 'VoxAudit Synthesis', timestamp: 'Pending', status: 'pending', details: 'Assembling weighted Digital Presence Index and action items.', error: null }
      ]);
    } else if (simulationState === 'failed') {
      setStages([
        { id: 'stage-1', name: 'Website Crawl & VoxSEO Engine', engine: 'Multi-Node Crawler', timestamp: '00:03', status: 'completed', details: '51 technical checkpoints evaluated: DNS, SSL, Core Web Vitals, schema markup.', error: null },
        { id: 'stage-2', name: 'Social Authority & Gemini Multimodal AI', engine: 'Instagram / Meta Graph API', timestamp: '00:08', status: 'failed', details: 'Instagram public node rate-limit reached during bio media download. Data temporarily unavailable (never shown as zero).', error: 'HTTP 429 Too Many Requests (Rate Limit Exceeded)' },
        { id: 'stage-3', name: 'Generative AI Visibility Grounding', engine: 'LLM Search Probes', timestamp: '00:15', status: 'completed', details: 'Completed using cached benchmark grounding queries.', error: null },
        { id: 'stage-4', name: 'Regional Competitor Benchmarking', engine: 'Competitive Multi-Domain Parser', timestamp: '00:20', status: 'completed', details: 'Regional matrix evaluated against 3 competitors.', error: null },
        { id: 'stage-5', name: 'Executive Synthesis & Growth Roadmap', engine: 'VoxAudit Synthesis', timestamp: '00:22', status: 'completed', details: 'Report assembled with Partial Result flag on social pillar.', error: null }
      ]);
    } else if (simulationState === 'completed') {
      setStages([
        { id: 'stage-1', name: 'Website Crawl & VoxSEO Engine', engine: 'Multi-Node Crawler', timestamp: '00:03', status: 'completed', details: '51 technical checkpoints evaluated: DNS, SSL, Core Web Vitals, schema markup.', error: null },
        { id: 'stage-2', name: 'Social Authority & Gemini Multimodal AI', engine: 'Google Gemini 1.5 Pro', timestamp: '00:08', status: 'completed', details: 'Bio clarity, visual consistency, and direct booking conversion anchors.', error: null },
        { id: 'stage-3', name: 'Generative AI Visibility Grounding', engine: 'LLM Search Probes', timestamp: '00:14', status: 'completed', details: '12 localized queries analyzed with verified Perplexity citations.', error: null },
        { id: 'stage-4', name: 'Regional Competitor Benchmarking', engine: 'Competitive Multi-Domain Parser', timestamp: '00:19', status: 'completed', details: 'Benchmarked Cedar & Co. Dental against 3 regional market competitors.', error: null },
        { id: 'stage-5', name: 'Executive Synthesis & Growth Roadmap', engine: 'VoxAudit Synthesis', timestamp: '00:23', status: 'completed', details: 'Digital Presence Index: 71/100 (Solid). Evidence Coverage: 87%.', error: null }
      ]);
    }
  }, [simulationState]);

  // Working "Retry Source" handler
  const handleRetrySource = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setStages(prev => prev.map(s => {
        if (s.id === 'stage-2') {
          return {
            ...s,
            status: 'completed',
            engine: 'Google Gemini 1.5 Pro (Fallback Mirror)',
            error: null,
            details: 'Recovered via auxiliary public crawler node. Profile clarity score: 82/100.'
          };
        }
        return s;
      }));
      setIsRetrying(false);
      setSimulationState('completed');
    }, 1800);
  };

  const domain = auditConfig?.targetDomain || 'cedarandcodental.com';
  const brand = auditConfig?.brandName || 'Cedar & Co. Dental';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6 text-slate-800 font-sans">
      
      {/* Dev / Reviewer State Switcher Bar */}
      <div className="bg-slate-200/90 border border-slate-300 px-4 py-2 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs select-none">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-sliders text-slate-600"></i>
          <span className="font-bold text-slate-700">{t.progressCenter.stateSwitcherTitle}</span>
        </div>
        <div className="inline-flex rounded-xl bg-white p-0.5 border border-slate-300 shadow-xs">
          <button
            onClick={() => setSimulationState('running')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
              simulationState === 'running' ? 'bg-brand-blue text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.progressCenter.stateRunning}
          </button>
          <button
            onClick={() => setSimulationState('failed')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
              simulationState === 'failed' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.progressCenter.stateFailed}
          </button>
          <button
            onClick={() => setSimulationState('completed')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
              simulationState === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.progressCenter.stateCompleted}
          </button>
        </div>
      </div>

      {/* Progress Center Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-500">AUDIT RUN MONITOR</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                simulationState === 'running'
                  ? 'bg-blue-50 text-blue-700 border border-blue-300'
                  : simulationState === 'failed'
                  ? 'bg-amber-50 text-amber-800 border border-amber-300'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
              }`}>
                {simulationState === 'running' && '● RUNNING IN REAL TIME'}
                {simulationState === 'failed' && '⚠️ PARTIAL EXECUTION'}
                {simulationState === 'completed' && '✓ RUN COMPLETED'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display mt-1">
              {brand} ({domain})
            </h1>
            <p className="text-xs text-slate-500">
              Run ID: <code className="font-mono text-slate-700">run-20261123-cedar-04</code> · Multi-Node Four-Pillar Crawler
            </p>
          </div>

          <div className="text-end self-start sm:self-auto bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
              {t.progressCenter.elapsedTime}
            </span>
            <span className="text-xl font-black font-mono text-slate-800">
              00:{elapsedSeconds < 10 ? `0${elapsedSeconds}` : elapsedSeconds}
            </span>
          </div>
        </div>

        {/* Integrity Rule Banner: No Fake Percentage Bar */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center gap-2.5">
          <i className="fa-solid fa-circle-info text-cyan-600 text-sm shrink-0"></i>
          <span>{t.progressCenter.noFakeBarNotice}</span>
        </div>
      </div>

      {/* Discrete Stages List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
          Diagnostic Engine Execution Pipeline
        </h3>

        <div className="divide-y divide-slate-100">
          {stages.map((stage, idx) => (
            <div key={stage.id} className="py-4 first:pt-1 last:pb-1 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Status Indicator Icon */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                    stage.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700 font-bold'
                      : stage.status === 'running'
                      ? 'bg-blue-100 text-blue-700 animate-pulse font-bold'
                      : stage.status === 'failed'
                      ? 'bg-red-100 text-red-600 font-bold'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {stage.status === 'completed' && <i className="fa-solid fa-check"></i>}
                    {stage.status === 'running' && <i className="fa-solid fa-spinner fa-spin"></i>}
                    {stage.status === 'failed' && <i className="fa-solid fa-xmark"></i>}
                    {stage.status === 'pending' && <span className="font-mono">{idx + 1}</span>}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 text-xs">{stage.name}</strong>
                      <span className="text-[10px] font-mono text-slate-400">({stage.engine})</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block leading-tight">{stage.details}</span>
                  </div>
                </div>

                <div className="text-end shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    stage.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : stage.status === 'running'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : stage.status === 'failed'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {stage.status}
                  </span>
                  <span className="block text-[10px] font-mono text-slate-400 mt-0.5">
                    {stage.timestamp}
                  </span>
                </div>
              </div>

              {/* Error Message & Retry Source Button if Failed */}
              {stage.status === 'failed' && (
                <div className="ms-11 p-3.5 rounded-xl bg-red-50/70 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <strong className="text-red-900 font-bold block">{stage.error}</strong>
                    <span className="text-red-700 text-[11px]">
                      Source was marked Unavailable and skipped from calculation. Never rendered as 0.
                    </span>
                  </div>
                  <button
                    disabled={isRetrying}
                    onClick={handleRetrySource}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shrink-0 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isRetrying && <i className="fa-solid fa-spinner fa-spin text-xs"></i>}
                    <span>{t.progressCenter.retrySourceBtn}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Completion Banner with CTA to Overview */}
      {simulationState === 'completed' && (
        <div className="p-6 rounded-3xl bg-emerald-950 text-white shadow-lg space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg shrink-0">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div>
                <h4 className="font-extrabold text-base tracking-tight">{t.progressCenter.completed}</h4>
                <p className="text-xs text-emerald-300">
                  Digital Presence Index compiled at 71/100 (Solid) with 87% evidence coverage.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenOverview}
              className="px-6 py-3 rounded-xl gradient-brand-cta text-slate-950 font-extrabold text-xs shadow-md hover:brightness-105 transition-all shrink-0"
            >
              {t.progressCenter.openOverviewBtn}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
