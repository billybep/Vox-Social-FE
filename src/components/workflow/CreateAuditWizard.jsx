import React, { useState } from 'react';
import EvidenceTag from '../core/EvidenceTag';

/**
 * Create Audit Wizard (Steps A–E)
 * Unified audit launcher feeding all 4 diagnostic pillars:
 * - Step A: Pillar Scope Selection
 * - Step B: Target Domain, Location Scope & Languages
 * - Step C: Competitor Watchlist Confirmation
 * - Step D: Data Sources & Connected Stream Audit
 * - Step E: Review, Credit Estimation & Launch
 * 
 * Required States:
 * - Exact credit estimation before launch
 * - Insufficient credits state toggle & upgrade CTA
 * - Edit from review (jump back and forth smoothly)
 */
export default function CreateAuditWizard({
  client,
  t,
  isRtl,
  onLaunchAudit,
  onCancel
}) {
  const [currentStep, setCurrentStep] = useState('A'); // 'A' | 'B' | 'C' | 'D' | 'E'
  const [simulateInsufficientCredits, setSimulateInsufficientCredits] = useState(false);
  const [returnToReview, setReturnToReview] = useState(false);

  // Audit Configuration State
  const [config, setConfig] = useState({
    auditType: 'complete', // 'complete' | 'custom'
    pillars: {
      seo: true,
      social: true,
      ai: true,
      competitors: true,
      cro: true
    },
    targetDomain: client?.domain || 'cedarandcodental.com',
    brandName: client?.name || 'Cedar & Co. Dental',
    locationScope: 'all', // 'all' | 'amman' | 'fairfax'
    languages: {
      en: true,
      ar: true
    },
    competitors: [
      { name: 'Apex Dental Studio', domain: 'apexdental.jo', active: true },
      { name: 'Pearl White Care', domain: 'pearlwhitecare.com', active: true },
      { name: 'SmileCraft Clinic', domain: 'smilecraft.com', active: true }
    ],
    sources: [
      { id: 'web_crawler', name: 'SEOptimer Multi-Node Web Crawler', type: 'measured', connected: false, label: 'Public Crawl' },
      { id: 'gemini_ai', name: 'Gemini 1.5 Pro Multimodal Vision', type: 'measured', connected: false, label: 'Public Profile' },
      { id: 'llm_grounding', name: 'LLM Search Probes (Perplexity/ChatGPT)', type: 'estimated', connected: false, label: 'Simulated Matrix' },
      { id: 'ga4_analytics', name: 'Google Analytics 4 API', type: 'connected', connected: false, label: 'OAuth Required' }
    ]
  });

  // Calculate required credits
  const calculateRequiredCredits = () => {
    if (config.auditType === 'complete') return 15;
    let credits = 0;
    if (config.pillars.seo) credits += 4;
    if (config.pillars.social) credits += 4;
    if (config.pillars.ai) credits += 3;
    if (config.pillars.competitors) credits += 3;
    if (config.pillars.cro) credits += 2;
    return credits;
  };

  const requiredCredits = calculateRequiredCredits();
  const availableCredits = simulateInsufficientCredits ? 10 : 50;
  const isInsufficient = requiredCredits > availableCredits;

  const handleNextStep = (next) => {
    if (returnToReview) {
      setCurrentStep('E');
      setReturnToReview(false);
    } else {
      setCurrentStep(next);
    }
  };

  const handleEditFromReview = (stepTarget) => {
    setReturnToReview(true);
    setCurrentStep(stepTarget);
  };

  const handleLaunch = () => {
    if (isInsufficient) return;
    if (onLaunchAudit) {
      onLaunchAudit(config);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6 text-slate-800 font-sans">
      
      {/* Dev / Reviewer Insufficient Credit State Switcher */}
      <div className="bg-slate-200/90 border border-slate-300 px-4 py-2 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs select-none">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-sliders text-slate-600"></i>
          <span className="font-bold text-slate-700">Sprint 2 Credit State Tester:</span>
          <span className="text-slate-500">Toggle insufficient credits state (10 vs 50 credits)</span>
        </div>
        <button
          onClick={() => setSimulateInsufficientCredits(!simulateInsufficientCredits)}
          className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
            simulateInsufficientCredits
              ? 'bg-red-600 text-white'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {simulateInsufficientCredits ? '⚠️ Simulating Insufficient Credits (10/15)' : '✓ Sufficient Balance (50 Credits)'}
        </button>
      </div>

      {/* Wizard Header & Steps Progress */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
              {t.createAudit.title}
            </h1>
            <p className="text-xs text-slate-500">{t.createAudit.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              Balance: <strong className="text-slate-900">{availableCredits} Credits</strong>
            </span>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="flex sm:grid sm:grid-cols-5 gap-1.5 sm:gap-2 pt-2 text-center text-xs overflow-x-auto pb-1">
          {[
            { id: 'A', label: t.createAudit.steps.scope },
            { id: 'B', label: t.createAudit.steps.target },
            { id: 'C', label: t.createAudit.steps.competitors },
            { id: 'D', label: t.createAudit.steps.sources },
            { id: 'E', label: t.createAudit.steps.review },
          ].map(s => {
            const isActive = currentStep === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                className={`p-2 min-w-[68px] sm:min-w-0 flex-1 rounded-xl text-center border transition-all ${
                  isActive
                    ? 'border-brand-blue bg-blue-50/50 text-brand-blue font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="block font-mono text-[10px] uppercase text-slate-400">Step {s.id}</span>
                <span className="truncate block font-semibold text-[11px]">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* STEP A: AUDIT SCOPE / PILLARS */}
      {/* ============================================================== */}
      {currentStep === 'A' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-fade-in text-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step A: Select Diagnostic Pillars & Audit Scope</h2>
            <p className="text-xs text-slate-500">Choose between the recommended complete 4-pillar audit or select modular inspections.</p>
          </div>

          {/* Primary Recommended Option: Complete Growth Intelligence Audit */}
          <div
            onClick={() => setConfig({ ...config, auditType: 'complete' })}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
              config.auditType === 'complete'
                ? 'border-brand-blue bg-blue-50/30 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg gradient-brand-v flex items-center justify-center text-white text-xs font-black">
                  V
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{t.createAudit.completeAuditOption}</h3>
                  <span className="text-slate-500 text-[11px]">{t.createAudit.completeAuditDesc}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-bold text-xs border border-emerald-200">
                15 Credits · Recommended
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 font-semibold text-slate-700">
              <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5">
                <i className="fa-solid fa-check text-emerald-500"></i> VoxSEO (51 Checkpoints)
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5">
                <i className="fa-solid fa-check text-emerald-500"></i> VoxSocial (Gemini AI)
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5">
                <i className="fa-solid fa-check text-emerald-500"></i> VoxAI (LLM Citations)
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5">
                <i className="fa-solid fa-check text-emerald-500"></i> Journey & CRO Funnel
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleNextStep('B')}
              className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-all"
            >
              Continue to Target & Language →
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP B: TARGET & LANGUAGE */}
      {/* ============================================================== */}
      {currentStep === 'B' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-fade-in text-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step B: Confirm Target Domain & Report Language</h2>
            <p className="text-xs text-slate-500">Configure target URLs and bilingual report generation output.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Website Domain</label>
              <input
                type="text"
                dir="ltr"
                value={config.targetDomain}
                onChange={(e) => setConfig({ ...config, targetDomain: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-900 font-semibold focus:border-brand-blue focus:outline-none text-start"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Branch Location Scope</label>
              <select
                value={config.locationScope}
                onChange={(e) => setConfig({ ...config, locationScope: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none cursor-pointer"
              >
                <option value="all">All Locations (Amman & Fairfax Dual Practice)</option>
                <option value="amman">Amman Clinic Only (Jordan 🇯🇴)</option>
                <option value="fairfax">Fairfax Clinic Only (VA, USA 🇺🇸)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-2">Report Language Output</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={config.languages.en}
                  onChange={(e) => setConfig({
                    ...config,
                    languages: { ...config.languages, en: e.target.checked }
                  })}
                  className="rounded text-brand-blue"
                />
                <div>
                  <strong className="block text-slate-900">English Report Edition</strong>
                  <span className="text-[11px] text-slate-500">Executive, marketing, and technical breakdown in English.</span>
                </div>
              </label>

              <label className="p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={config.languages.ar}
                  onChange={(e) => setConfig({
                    ...config,
                    languages: { ...config.languages, ar: e.target.checked }
                  })}
                  className="rounded text-brand-blue"
                />
                <div>
                  <strong className="block text-slate-900">Arabic Report Edition (عربي)</strong>
                  <span className="text-[11px] text-slate-500">Tailored RTL layout localized for Jordan, KSA, and UAE markets.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-between">
            <button
              onClick={() => setCurrentStep('A')}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              ← Back
            </button>
            <button
              onClick={() => handleNextStep('C')}
              className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-xs"
            >
              Continue to Competitors →
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP C: COMPETITORS */}
      {/* ============================================================== */}
      {currentStep === 'C' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-fade-in text-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step C: Competitor Benchmark Matrix Selection</h2>
            <p className="text-xs text-slate-500">Confirm which regional competitors will be crawled and benchmarked alongside {config.brandName}.</p>
          </div>

          <div className="space-y-3">
            {config.competitors.map((comp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={comp.active}
                    onChange={(e) => {
                      const updated = [...config.competitors];
                      updated[idx].active = e.target.checked;
                      setConfig({ ...config, competitors: updated });
                    }}
                    className="rounded text-brand-blue"
                  />
                  <div>
                    <strong className="text-slate-900 block">{comp.name}</strong>
                    <span className="font-mono text-slate-500 text-[11px]">{comp.domain}</span>
                  </div>
                </div>
                <EvidenceTag type="estimated" source="Third-Party Benchmark" />
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-between">
            <button
              onClick={() => setCurrentStep('B')}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              ← Back
            </button>
            <button
              onClick={() => handleNextStep('D')}
              className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-xs"
            >
              Continue to Data Sources →
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP D: DATA SOURCES & INTEGRATIONS */}
      {/* ============================================================== */}
      {currentStep === 'D' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-fade-in text-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step D: Data Sources & Stream Verification</h2>
            <p className="text-xs text-slate-500">Full transparency into which engines will collect measured data vs public web crawl.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {config.sources.map(src => (
              <div key={src.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
                    <i className="fa-solid fa-server"></i>
                  </div>
                  <div>
                    <strong className="text-slate-900 block">{src.name}</strong>
                    <span className="text-slate-500 text-[11px]">{src.label}</span>
                  </div>
                </div>
                <EvidenceTag type={src.type} />
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-between">
            <button
              onClick={() => setCurrentStep('C')}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              ← Back
            </button>
            <button
              onClick={() => handleNextStep('E')}
              className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-xs"
            >
              Continue to Review & Credit Estimate →
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP E: REVIEW & CREDIT ESTIMATION (WITH INSUFFICIENT STATE) */}
      {/* ============================================================== */}
      {currentStep === 'E' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 animate-fade-in text-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step E: Review Audit Configuration & Cost Estimate</h2>
            <p className="text-xs text-slate-500">Verify all settings before launching the live crawler and multimodal engines.</p>
          </div>

          {/* Insufficient Credit Alert Box */}
          {isInsufficient && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-950 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2.5 font-bold text-red-900 text-xs">
                <i className="fa-solid fa-triangle-exclamation text-red-600 text-base"></i>
                <span>{t.createAudit.insufficientNotice}</span>
              </div>
              <p className="text-[11px] text-red-900/90 leading-relaxed">
                {t.createAudit.insufficientDesc}
              </p>
              <button
                type="button"
                onClick={() => alert("Credit top-up modal or Stripe checkout will open in Sprint 4.")}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                {t.createAudit.topupBtn} (+50 Credits)
              </button>
            </div>
          )}

          {/* Summary Blocks with "Edit" Links */}
          <div className="space-y-3">
            {/* Block 1: Pillar Scope */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Audit Scope</span>
                <strong className="text-slate-900 text-xs">
                  {config.auditType === 'complete' ? 'Complete 4-Pillar Growth Audit' : 'Custom Pillar Scan'}
                </strong>
                <p className="text-[11px] text-slate-500">VoxSEO, VoxSocial, VoxAI, Journey & CRO</p>
              </div>
              <button
                onClick={() => handleEditFromReview('A')}
                className="text-brand-blue font-bold text-xs hover:underline"
              >
                {t.createAudit.editStep}
              </button>
            </div>

            {/* Block 2: Target & Language */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Target & Locations</span>
                <strong className="text-slate-900 font-mono text-xs">{config.targetDomain}</strong>
                <p className="text-[11px] text-slate-500">
                  Scope: {config.locationScope.toUpperCase()} · Languages: {config.languages.en ? 'EN ' : ''}{config.languages.ar ? 'AR' : ''}
                </p>
              </div>
              <button
                onClick={() => handleEditFromReview('B')}
                className="text-brand-blue font-bold text-xs hover:underline"
              >
                {t.createAudit.editStep}
              </button>
            </div>

            {/* Block 3: Competitors */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Competitor Benchmark</span>
                <strong className="text-slate-900 text-xs">
                  {config.competitors.filter(c => c.active).length} Competitors Selected
                </strong>
                <p className="text-[11px] text-slate-500">Apex Dental Studio, Pearl White Care, SmileCraft</p>
              </div>
              <button
                onClick={() => handleEditFromReview('C')}
                className="text-brand-blue font-bold text-xs hover:underline"
              >
                {t.createAudit.editStep}
              </button>
            </div>
          </div>

          {/* Credit Calculation Card */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                {t.createAudit.creditEstimate}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black tabular-nums">{requiredCredits}</span>
                <span className="text-slate-400 text-xs">Credits Required for this Run</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Current Workspace Balance: <strong className={isInsufficient ? 'text-red-400' : 'text-emerald-400'}>{availableCredits} Credits</strong>
              </span>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <button
                disabled={isInsufficient}
                onClick={handleLaunch}
                className="w-full sm:w-auto px-6 py-3 rounded-xl gradient-brand-cta text-slate-950 font-extrabold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t.createAudit.launchAuditCta}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep('D')}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              ← Back
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-slate-500 hover:text-slate-800 font-bold text-xs"
              >
                Cancel Setup
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
