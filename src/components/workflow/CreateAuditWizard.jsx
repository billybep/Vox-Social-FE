import React, { useState } from 'react';
import EvidenceTag from '../core/EvidenceTag';

/**
 * Real-world competitor samples pool (live healthcare/dental clinics & organizations)
 */
const REAL_COMPETITOR_POOL = [
  { name: 'Tend Dental Studios', domain: 'hellotend.com' },
  { name: 'Aspen Dental Care', domain: 'aspendental.com' },
  { name: 'Dental Care Alliance', domain: 'dentalcarealliance.net' },
  { name: 'Heartland Dental', domain: 'heartland.com' },
  { name: 'Pacific Dental Services', domain: 'pacificdentalservices.com' },
  { name: 'Gentle Dental Clinics', domain: 'gentledental.com' },
  { name: 'Cleveland Clinic Dentistry', domain: 'clevelandclinic.org' },
  { name: 'Mayo Clinic Dental Specialties', domain: 'mayoclinic.org' }
];

function getRandomRealSamples(count = 3) {
  const shuffled = [...REAL_COMPETITOR_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(item => ({ ...item, active: true }));
}

/**
 * Diagnostic Pillars Definition (Step A)
 */
const PILLAR_ITEMS = [
  {
    id: 'seo',
    title: 'VoxSEO Inspection',
    badge: '51 Checkpoints',
    credits: 4,
    icon: 'fa-solid fa-magnifying-glass',
    color: 'text-cyan-500 bg-cyan-50 border-cyan-200',
    description: 'Technical crawl covering indexability, Core Web Vitals, Schema.org hierarchy, and mobile usability.'
  },
  {
    id: 'social',
    title: 'VoxSocial Engine',
    badge: 'Gemini 1.5 Pro AI',
    credits: 4,
    icon: 'fa-brands fa-instagram',
    color: 'text-fuchsia-500 bg-fuchsia-50 border-fuchsia-200',
    description: 'Multimodal vision diagnostics on reel pacing, visual branding, hook retention, and audience sentiment.'
  },
  {
    id: 'ai',
    title: 'VoxAI Visibility',
    badge: 'LLM Search Probes',
    credits: 4,
    icon: 'fa-solid fa-wand-magic-sparkles',
    color: 'text-purple-500 bg-purple-50 border-purple-200',
    description: 'Generative prominence matrix probing Perplexity, ChatGPT, and Gemini for local brand recommendations.'
  },
  {
    id: 'cro',
    title: 'Journey & CRO Funnel',
    badge: 'Sprint 3 & 4 Roadmap',
    credits: 3,
    icon: 'fa-solid fa-arrow-trend-up',
    color: 'text-slate-400 bg-slate-100 border-slate-200',
    description: 'Friction point detection, CTA visibility, social proof trust signals, and appointment booking flow.',
    disabled: true,
    disabledNote: 'This feature is scheduled for Sprint 3 & 4 in accordance with the VA-Intelligence-Design milestone roadmap.'
  }
];

/**
 * Create Audit Wizard (Steps A–E)
 * Unified audit launcher feeding all diagnostic pillars:
 * - Step A: Diagnostic Pillars Selection (Fully selectable)
 * - Step B: Target Domain & Report Languages (Location scope omitted)
 * - Step C: Competitors (Skip button, Add Competitor URL, Real Random Samples)
 * - Step D: Data Sources & Stream Transparency
 * - Step E: Review, Credit Estimation & Launch with balance deduction
 */
export default function CreateAuditWizard({
  client,
  t,
  isRtl,
  workspaceCredits = 50,
  onDeductCredits,
  onLaunchAudit,
  onCancel
}) {
  const [currentStep, setCurrentStep] = useState('A'); // 'A' | 'B' | 'C' | 'D' | 'E'
  const [simulateInsufficientCredits, setSimulateInsufficientCredits] = useState(false);
  const [returnToReview, setReturnToReview] = useState(false);

  // Step C Competitor input state
  const [newCompetitorUrl, setNewCompetitorUrl] = useState('');
  const [newCompetitorName, setNewCompetitorName] = useState('');
  const [competitorInputError, setCompetitorInputError] = useState('');

  // Audit Configuration State
  const [config, setConfig] = useState({
    auditType: 'complete', // 'complete' | 'custom'
    pillars: {
      seo: true,
      social: true,
      ai: true,
      cro: false // Disabled for Sprint 2 (Scheduled for Sprint 3 & 4)
    },
    targetDomain: client?.domain || 'cedarandcodental.com',
    brandName: client?.name || 'Cedar & Co. Dental',
    languages: {
      en: true,
      ar: true
    },
    competitors: getRandomRealSamples(3),
    sources: [
      { id: 'web_crawler', name: 'SEOptimer Multi-Node Web Crawler', type: 'measured', connected: false, label: 'Public Crawl' },
      { id: 'gemini_ai', name: 'Gemini 1.5 Pro Multimodal Vision', type: 'measured', connected: false, label: 'Public Profile' },
      { id: 'llm_grounding', name: 'LLM Search Probes (Perplexity/ChatGPT)', type: 'estimated', connected: false, label: 'Simulated Matrix' },
      { id: 'ga4_analytics', name: 'Google Analytics 4 API', type: 'disconnected', connected: false, label: 'Disconnected · OAuth Pending' }
    ]
  });

  // Calculate required credits dynamically based on active pillars
  const calculateRequiredCredits = () => {
    let credits = 0;
    if (config.pillars.seo) credits += 4;
    if (config.pillars.social) credits += 4;
    if (config.pillars.ai) credits += 4;
    return credits;
  };

  const requiredCredits = calculateRequiredCredits();
  const availableCredits = simulateInsufficientCredits ? 10 : workspaceCredits;
  const isInsufficient = requiredCredits > availableCredits;
  // Count only selectable active pillars (seo, social, ai)
  const selectedPillarsCount = [config.pillars.seo, config.pillars.social, config.pillars.ai].filter(Boolean).length;

  // Toggle individual pillar selection (Step A)
  const handleTogglePillar = (pillarId) => {
    if (pillarId === 'cro') return; // Cannot toggle disabled pillar
    setConfig(prev => {
      const nextPillars = {
        ...prev.pillars,
        [pillarId]: !prev.pillars[pillarId]
      };
      const allActiveSelected = nextPillars.seo && nextPillars.social && nextPillars.ai;
      return {
        ...prev,
        pillars: nextPillars,
        auditType: allActiveSelected ? 'complete' : 'custom'
      };
    });
  };

  // Select all or reset available pillars
  const handleSelectAllPillars = () => {
    setConfig(prev => ({
      ...prev,
      auditType: 'complete',
      pillars: {
        seo: true,
        social: true,
        ai: true,
        cro: false
      }
    }));
  };

  // Step C: Add custom competitor
  const handleAddCompetitor = (e) => {
    if (e) e.preventDefault();
    if (!newCompetitorUrl.trim()) {
      setCompetitorInputError('Please enter a website URL or domain');
      return;
    }

    // Clean and normalize domain
    let cleanDomain = newCompetitorUrl.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^https?:\/\//i, '');
    cleanDomain = cleanDomain.replace(/^www\./i, '');
    cleanDomain = cleanDomain.split('/')[0].split('?')[0];

    if (!cleanDomain || !cleanDomain.includes('.')) {
      setCompetitorInputError('Please enter a valid domain (e.g. competitor.com)');
      return;
    }

    // Check duplicate
    const exists = config.competitors.some(c => c.domain.toLowerCase() === cleanDomain);
    if (exists) {
      setCompetitorInputError('This competitor is already in your list');
      return;
    }

    const inferredName = newCompetitorName.trim() ||
      cleanDomain.split('.')[0].replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    setConfig(prev => ({
      ...prev,
      competitors: [
        ...prev.competitors,
        { name: inferredName, domain: cleanDomain, active: true }
      ]
    }));

    setNewCompetitorUrl('');
    setNewCompetitorName('');
    setCompetitorInputError('');
  };

  // Step C: Remove competitor
  const handleRemoveCompetitor = (indexToRemove) => {
    setConfig(prev => ({
      ...prev,
      competitors: prev.competitors.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Step C: Randomize 3 real samples
  const handleRandomizeSamples = () => {
    const samples = getRandomRealSamples(3);
    setConfig(prev => ({
      ...prev,
      competitors: samples
    }));
    setCompetitorInputError('');
  };

  // Step C: Skip competitors
  const handleSkipCompetitors = () => {
    setConfig(prev => ({
      ...prev,
      competitors: prev.competitors.map(c => ({ ...c, active: false }))
    }));
    handleNextStep('D');
  };

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
    if (isInsufficient || selectedPillarsCount === 0) return;
    if (onDeductCredits) {
      onDeductCredits(requiredCredits);
    }
    if (onLaunchAudit) {
      onLaunchAudit(config, requiredCredits);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6 text-slate-800 font-sans">
      
      {/* Dev / Reviewer Insufficient Credit State Switcher */}
      <div className="bg-slate-200/90 border border-slate-300 px-4 py-2 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs select-none">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-sliders text-slate-600"></i>
          <span className="font-bold text-slate-700">Sprint 2 Credit State Tester:</span>
          <span className="text-slate-500">Toggle insufficient credits state (10 vs {workspaceCredits} credits)</span>
        </div>
        <button
          onClick={() => setSimulateInsufficientCredits(!simulateInsufficientCredits)}
          className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
            simulateInsufficientCredits
              ? 'bg-red-600 text-white'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {simulateInsufficientCredits ? '⚠️ Simulating Insufficient Credits (10/15)' : `✓ Sufficient Balance (${workspaceCredits} Credits)`}
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
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs">
              <i className="fa-solid fa-coins text-amber-500 text-xs"></i>
              <span>Balance: <strong className="text-slate-900 font-black">{availableCredits} Credits</strong></span>
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
      {/* STEP A: AUDIT SCOPE / PILLARS (SELECTABLE) */}
      {/* ============================================================== */}
      {currentStep === 'A' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 animate-fade-in text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step A: Select Diagnostic Pillars & Audit Scope</h2>
              <p className="text-xs text-slate-500">Choose all available pillars for a growth audit or click individual pillars to customize.</p>
            </div>
            
            <button
              type="button"
              onClick={handleSelectAllPillars}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                selectedPillarsCount === 3
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <i className="fa-solid fa-check-double me-1.5"></i>
              {selectedPillarsCount === 3 ? 'All 3 Available Pillars Selected (12 Cr)' : 'Select All Available (12 Credits)'}
            </button>
          </div>

          {/* 4 Interactive Diagnostic Pillar Cards (CRO Disabled for Sprint 3/4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PILLAR_ITEMS.map((pillar) => {
              const isSelected = !!config.pillars[pillar.id];
              const isDisabled = !!pillar.disabled;

              return (
                <div
                  key={pillar.id}
                  onClick={() => !isDisabled && handleTogglePillar(pillar.id)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all relative flex flex-col justify-between gap-3 select-none ${
                    isDisabled
                      ? 'border-slate-200/80 bg-slate-50/70 opacity-65 cursor-not-allowed'
                      : isSelected
                      ? 'border-[#0094ea] bg-blue-50/30 shadow-xs ring-1 ring-[#0094ea]/20 cursor-pointer'
                      : 'border-slate-200 bg-white hover:border-slate-300 opacity-80 hover:opacity-100 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${pillar.color}`}>
                        <i className={pillar.icon}></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold text-sm ${isDisabled ? 'text-slate-600' : 'text-slate-900'}`}>{pillar.title}</h3>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">{pillar.badge}</span>
                      </div>
                    </div>

                    {/* Interactive Custom Checkbox / Disabled Lock */}
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isDisabled
                          ? 'border-slate-300 bg-slate-100 text-slate-400'
                          : isSelected
                          ? 'border-[#0094ea] bg-[#0094ea] text-white shadow-xs'
                          : 'border-slate-300 bg-white text-transparent'
                      }`}
                    >
                      {isDisabled ? (
                        <i className="fa-solid fa-lock text-[10px]"></i>
                      ) : (
                        <i className="fa-solid fa-check text-xs"></i>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Disabled Note for Sprint 3 & 4 Roadmap */}
                  {isDisabled && (
                    <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-[10px] flex items-start gap-2 leading-relaxed">
                      <i className="fa-solid fa-clock-rotate-left text-amber-600 shrink-0 mt-0.5 text-xs"></i>
                      <span className="font-medium">
                        This feature is scheduled for Sprint 3 & 4 in accordance with the VA-Intelligence-Design milestone roadmap.
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <span className="font-mono text-slate-400 font-medium">Diagnostic Module</span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                      isDisabled
                        ? 'bg-slate-100 text-slate-400'
                        : isSelected
                        ? 'bg-blue-100/80 text-brand-blue'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isDisabled ? 'Roadmap' : `${pillar.credits} Credits`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Validation Notice if 0 selected */}
          {selectedPillarsCount === 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-amber-600"></i>
              <span>Please select at least one diagnostic pillar to continue with the audit setup.</span>
            </div>
          )}

          {/* Pillar Summary Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Selected Pillars:</span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono font-bold text-xs text-slate-900">
                {selectedPillarsCount} of 3 Available Modules
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Estimated Cost:</span>
              <span className="text-sm font-black font-mono text-slate-900">{requiredCredits} Credits</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              disabled={selectedPillarsCount === 0}
              onClick={() => handleNextStep('B')}
              className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue to Target & Language →
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP B: TARGET & LANGUAGE (NO BRANCH LOCATION SCOPE) */}
      {/* ============================================================== */}
      {currentStep === 'B' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-fade-in text-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step B: Confirm Target Domain & Report Language</h2>
            <p className="text-xs text-slate-500">Configure target URLs and bilingual report generation output for this audit run.</p>
          </div>

          {/* Target Website Domain (Full Width, Location Scope Removed) */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">Target Website Domain / URL</label>
            <div className="relative">
              <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                <i className="fa-solid fa-globe"></i>
              </span>
              <input
                type="text"
                dir="ltr"
                value={config.targetDomain}
                onChange={(e) => setConfig({ ...config, targetDomain: e.target.value })}
                placeholder="example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-9 pe-3.5 py-2.5 font-mono text-slate-900 font-semibold focus:border-brand-blue focus:outline-none text-start text-xs"
              />
            </div>
            <p className="text-[11px] text-slate-400">The primary domain crawl entrypoint inspected across SEO, citations, and journey funnel.</p>
          </div>

          {/* Report Language Output */}
          <div className="pt-2 space-y-2">
            <label className="block font-bold text-slate-700">Report Language Output</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
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

              <label className="p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
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
      {/* STEP C: COMPETITORS (SKIP BUTTON, ADD URL, 3 REAL SAMPLES) */}
      {/* ============================================================== */}
      {currentStep === 'C' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 animate-fade-in text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step C: Competitor Benchmark Matrix Selection</h2>
              <p className="text-xs text-slate-500">Benchmark your speed, rankings, and AI citations against peer clinic websites.</p>
            </div>

            <button
              type="button"
              onClick={handleRandomizeSamples}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
              title="Replace with 3 random real healthcare clinic websites"
            >
              <i className="fa-solid fa-dice text-[#0094ea]"></i>
              <span>Randomize Real Samples</span>
            </button>
          </div>

          {/* Add Competitor Input Form */}
          <form onSubmit={handleAddCompetitor} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
              <i className="fa-solid fa-plus text-[#0094ea]"></i>
              <span>Add Custom Competitor URL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-7">
                <input
                  type="text"
                  dir="ltr"
                  value={newCompetitorUrl}
                  onChange={(e) => {
                    setNewCompetitorUrl(e.target.value);
                    if (competitorInputError) setCompetitorInputError('');
                  }}
                  placeholder="https://competitor.com or domain.com"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-slate-900 font-semibold focus:border-brand-blue focus:outline-none text-xs"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={newCompetitorName}
                  onChange={(e) => setNewCompetitorName(e.target.value)}
                  placeholder="Brand Name (optional)"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full min-h-[36px] px-3 py-2 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Add</span>
                </button>
              </div>
            </div>

            {competitorInputError && (
              <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{competitorInputError}</span>
              </p>
            )}
          </form>

          {/* Competitor List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
              <span>Competitor Watchlist ({config.competitors.filter(c => c.active).length} active)</span>
              <span>Evidence Level</span>
            </div>

            {config.competitors.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p>No competitors added. You can skip this step or add sample URLs above.</p>
              </div>
            ) : (
              config.competitors.map((comp, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={comp.active}
                      onChange={(e) => {
                        const updated = [...config.competitors];
                        updated[idx].active = e.target.checked;
                        setConfig({ ...config, competitors: updated });
                      }}
                      className="rounded text-brand-blue cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">{comp.name}</strong>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          REAL SITE
                        </span>
                      </div>
                      <a
                        href={`https://${comp.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-slate-500 hover:text-brand-blue text-[11px] hover:underline flex items-center gap-1"
                      >
                        <span>{comp.domain}</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <EvidenceTag type="estimated" source="Third-Party Benchmark" />
                    <button
                      type="button"
                      onClick={() => handleRemoveCompetitor(idx)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                      title="Remove Competitor"
                    >
                      <i className="fa-regular fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Navigation Controls with Prominent Skip Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep('B')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              ← Back
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Skip Competitors Button */}
              <button
                type="button"
                onClick={handleSkipCompetitors}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
                title="Skip competitor benchmarking and continue"
              >
                Skip Competitors →
              </button>

              <button
                type="button"
                onClick={() => handleNextStep('D')}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-xs"
              >
                Continue to Data Sources →
              </button>
            </div>
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
                    {src.type === 'disconnected' ? (
                      <i className="fa-solid fa-plug-circle-xmark text-slate-400 text-sm"></i>
                    ) : (
                      <i className="fa-solid fa-server"></i>
                    )}
                  </div>
                  <div>
                    <strong className="text-slate-900 block">{src.name}</strong>
                    <span className="text-slate-500 text-[11px]">{src.label}</span>
                  </div>
                </div>
                <EvidenceTag type={src.type} reason="OAuth integration scheduled for Sprint 4" />
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
      {/* STEP E: REVIEW & CREDIT ESTIMATION (WITH BALANCE DEDUCTION) */}
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
                Your available balance ({availableCredits} credits) is less than the required amount ({requiredCredits} credits). Please top up your workspace credits to launch this audit.
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
                  {selectedPillarsCount === 3 ? 'Active 3-Pillar Growth Audit' : `Custom Diagnostic (${selectedPillarsCount} Pillars)`}
                </strong>
                <p className="text-[11px] text-slate-500">
                  {[
                    config.pillars.seo && 'VoxSEO',
                    config.pillars.social && 'VoxSocial',
                    config.pillars.ai && 'VoxAI'
                  ].filter(Boolean).join(' · ')}
                  <span className="block text-[10px] text-slate-400 mt-0.5">(Journey & CRO: Scheduled for Sprint 3 & 4)</span>
                </p>
              </div>
              <button
                onClick={() => handleEditFromReview('A')}
                className="text-brand-blue font-bold text-xs hover:underline"
              >
                {t.createAudit.editStep}
              </button>
            </div>

            {/* Block 2: Target & Language (Location Scope Omitted) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Target & Languages</span>
                <strong className="text-slate-900 font-mono text-xs">{config.targetDomain}</strong>
                <p className="text-[11px] text-slate-500">
                  Languages: {config.languages.en ? 'English ' : ''}{config.languages.ar ? 'Arabic' : ''}
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
                  {config.competitors.filter(c => c.active).length > 0
                    ? `${config.competitors.filter(c => c.active).length} Competitors Active`
                    : 'Skipped (No Competitors Benchmark)'}
                </strong>
                <p className="text-[11px] text-slate-500">
                  {config.competitors.filter(c => c.active).map(c => c.name).join(', ') || 'Direct single-site audit mode'}
                </p>
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
                <span className="text-slate-400 text-xs">Credits Deducted Upon Launch</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span>Current Balance: <strong className={isInsufficient ? 'text-red-400' : 'text-slate-200'}>{availableCredits} Cr</strong></span>
                <span>•</span>
                <span>Remaining After Run: <strong className={isInsufficient ? 'text-red-400' : 'text-emerald-400'}>{Math.max(0, availableCredits - requiredCredits)} Cr</strong></span>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <button
                disabled={isInsufficient || selectedPillarsCount === 0}
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
