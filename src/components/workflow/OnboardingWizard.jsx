import React, { useState, useEffect } from 'react';

/**
 * Onboarding Wizard (6 Steps)
 * Guides new users from signup to a fully configured workspace:
 * 1. Role & Workspace Type
 * 2. Business / Client Details
 * 3. Locations (Single vs Multi-location)
 * 4. Competitors (with Skip option)
 * 5. Integrations (with Skip option)
 * 6. Launch Readiness & Data Transparency (Integrity Rule)
 * 
 * Features:
 * - Resume persistence via localStorage
 * - Strict RTL logical properties support
 * - Light Analysis Canvas styling
 */
export default function OnboardingWizard({
  t,
  isRtl,
  onComplete,
  onCancel,
  initialRole = 'agency_owner'
}) {
  const STORAGE_KEY = 'vox_onboarding_progress';

  // Wizard state with defaults
  const [currentStep, setCurrentStep] = useState(1);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  const [formData, setFormData] = useState({
    role: initialRole,
    brandName: 'Cedar & Co. Dental',
    domain: 'cedarandcodental.com',
    industry: 'Healthcare & Cosmetic Dentistry',
    primaryMarket: 'Jordan',
    auditLanguage: 'both', // 'en' | 'ar' | 'both'
    locationMode: 'multi', // 'single' | 'multi'
    locations: [
      { id: 'loc-1', name: 'Amman Clinic', city: 'Amman', country: 'Jordan', isPrimary: true },
      { id: 'loc-2', name: 'Fairfax Clinic', city: 'Fairfax, VA', country: 'USA', isPrimary: false }
    ],
    competitors: [
      { id: 'comp-1', name: 'Apex Dental Studio', domain: 'apexdental.jo' },
      { id: 'comp-2', name: 'Pearl White Care', domain: 'pearlwhitecare.com' },
      { id: 'comp-3', name: 'SmileCraft Clinic', domain: 'smilecraft.com' }
    ],
    integrations: {
      ga4: false,
      gsc: false,
      instagram: true,
      facebook: false
    }
  });

  // Check for saved progress on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step && parsed.step > 1) {
          setHasSavedProgress(true);
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // Save progress on step/form change
  const saveProgress = (step, data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
    } catch (e) {
      // ignore
    }
  };

  const handleResume = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) setFormData(parsed.data);
        if (parsed.step) setCurrentStep(parsed.step);
      }
    } catch (e) {
      // ignore
    }
    setHasSavedProgress(false);
  };

  const handleStartOver = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasSavedProgress(false);
    setCurrentStep(1);
  };

  const handleNext = () => {
    const next = Math.min(6, currentStep + 1);
    setCurrentStep(next);
    saveProgress(next, formData);
  };

  const handleBack = () => {
    const prev = Math.max(1, currentStep - 1);
    setCurrentStep(prev);
    saveProgress(prev, formData);
  };

  const handleFinish = () => {
    localStorage.removeItem(STORAGE_KEY);
    if (onComplete) {
      onComplete(formData);
    }
  };

  // Skip handlers
  const handleSkipCompetitors = () => {
    setFormData(prev => ({ ...prev, competitors: [] }));
    const next = 5;
    setCurrentStep(next);
    saveProgress(next, { ...formData, competitors: [] });
  };

  const handleSkipIntegrations = () => {
    setFormData(prev => ({
      ...prev,
      integrations: { ga4: false, gsc: false, instagram: false, facebook: false }
    }));
    const next = 6;
    setCurrentStep(next);
    saveProgress(next, formData);
  };

  // Location mutators
  const addLocation = () => {
    const newLoc = {
      id: `loc-${Date.now()}`,
      name: 'New Branch Clinic',
      city: 'Riyadh',
      country: 'Saudi Arabia',
      isPrimary: false
    };
    setFormData(prev => ({ ...prev, locations: [...prev.locations, newLoc] }));
  };

  const removeLocation = (id) => {
    if (formData.locations.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter(l => l.id !== id)
    }));
  };

  // Competitor mutators
  const updateCompetitor = (index, field, val) => {
    const updated = [...formData.competitors];
    updated[index][field] = val;
    setFormData(prev => ({ ...prev, competitors: updated }));
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Resume Progress Alert Banner */}
        {hasSavedProgress && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <i className="fa-solid fa-clock-rotate-left text-amber-600 text-sm"></i>
              <div>
                <strong className="block text-amber-950 font-bold">{t.onboarding.resumeNotice}</strong>
                <span className="text-amber-800 text-[11px]">Saved setup session detected in browser storage.</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleResume}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors"
              >
                {t.onboarding.resumeBtn}
              </button>
              <button
                onClick={handleStartOver}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold transition-colors"
              >
                {t.onboarding.restartBtn}
              </button>
            </div>
          </div>
        )}

        {/* Wizard Header & Progress Bar */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-brand-v flex items-center justify-center text-white font-black text-base shadow-xs">
                V
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
                  {t.onboarding.title}
                </h1>
                <p className="text-xs text-slate-500">{t.onboarding.subtitle}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-brand-blue bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              {t.onboarding.stepIndicator} {currentStep} {t.onboarding.of} 6
            </span>
          </div>

          {/* Stepper Dots / Bars */}
          <div className="grid grid-cols-6 gap-2 pt-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === currentStep
                    ? 'bg-brand-blue'
                    : s < currentStep
                    ? 'bg-emerald-500'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            {currentStep === 1 && t.onboarding.steps.role}
            {currentStep === 2 && t.onboarding.steps.details}
            {currentStep === 3 && t.onboarding.steps.locations}
            {currentStep === 4 && t.onboarding.steps.competitors}
            {currentStep === 5 && t.onboarding.steps.integrations}
            {currentStep === 6 && t.onboarding.steps.transparency}
          </div>
        </div>

        {/* ============================================================== */}
        {/* STEP 1: ROLE & WORKSPACE TYPE */}
        {/* ============================================================== */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-fade-in">
            <h2 className="text-lg font-bold text-slate-900">1. Select Workspace Type & Role</h2>
            <p className="text-xs text-slate-500">Choose how you plan to use VoxAudit Intelligence. You can adjust this later in settings.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                {
                  id: 'agency_owner',
                  title: 'Agency Workspace',
                  desc: 'Multi-client portfolio, white-label PDF reports, proposals & service catalog.',
                  icon: 'fa-solid fa-briefcase',
                  badge: 'Full Platform'
                },
                {
                  id: 'consultant',
                  title: 'Solo Consultant',
                  desc: 'Individual advisory workspace, proposals, diagnostic roadmaps for client accounts.',
                  icon: 'fa-solid fa-user-tie',
                  badge: 'Advisory'
                },
                {
                  id: 'business_owner',
                  title: 'Business Owner',
                  desc: 'Self-audit own brand, plain-language executive metrics & 90-day action roadmaps.',
                  icon: 'fa-solid fa-store',
                  badge: 'Direct Brand'
                }
              ].map((roleOption) => (
                <button
                  key={roleOption.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: roleOption.id })}
                  className={`p-4 rounded-2xl border text-start transition-all flex flex-col justify-between space-y-3 ${
                    formData.role === roleOption.id
                      ? 'border-brand-blue bg-blue-50/40 shadow-xs ring-2 ring-brand-blue/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-brand-blue flex items-center justify-center text-sm">
                        <i className={roleOption.icon}></i>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {roleOption.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{roleOption.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{roleOption.desc}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-blue">
                    <span>{formData.role === roleOption.id ? 'Selected' : 'Select'}</span>
                    {formData.role === roleOption.id && <i className="fa-solid fa-circle-check"></i>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: BUSINESS / CLIENT DETAILS */}
        {/* ============================================================== */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-fade-in text-xs">
            <h2 className="text-lg font-bold text-slate-900">2. Business / Client Information</h2>
            <p className="text-xs text-slate-500">Provide the primary domain and brand identity for the target entity.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand / Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  placeholder="e.g. Cedar & Co. Dental"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Website Domain URL</label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="e.g. cedarandcodental.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-semibold focus:border-brand-blue focus:outline-none text-start"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Industry Sector</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none cursor-pointer"
                >
                  <option value="Healthcare & Cosmetic Dentistry">Healthcare & Cosmetic Dentistry</option>
                  <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                  <option value="Hospitality & Travel">Hospitality & Travel</option>
                  <option value="Real Estate & Property">Real Estate & Property</option>
                  <option value="Freight & Logistics">Freight & Logistics</option>
                  <option value="Professional & Legal Services">Professional & Legal Services</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Market Focus</label>
                <select
                  value={formData.primaryMarket}
                  onChange={(e) => setFormData({ ...formData, primaryMarket: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none cursor-pointer"
                >
                  <option value="Jordan">Jordan 🇯🇴 (Amman & Regional)</option>
                  <option value="Saudi Arabia">Saudi Arabia 🇸🇦 (Riyadh, Jeddah, Eastern)</option>
                  <option value="UAE">United Arab Emirates 🇦🇪 (Dubai, Abu Dhabi)</option>
                  <option value="USA">United States 🇺🇸</option>
                  <option value="Global">Global / Multi-National</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Audit Report Language</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'en', label: 'English Only' },
                  { id: 'ar', label: 'Arabic Only (عربي)' },
                  { id: 'both', label: 'Bilingual (EN + AR)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, auditLanguage: opt.id })}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition-colors ${
                      formData.auditLanguage === opt.id
                        ? 'bg-brand-blue text-white border-brand-blue shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: LOCATIONS (SINGLE VS MULTI-LOCATION) */}
        {/* ============================================================== */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-fade-in text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">3. Physical Location Setup</h2>
                <p className="text-xs text-slate-500">Configure single-location or multi-branch local search presence.</p>
              </div>

              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, locationMode: 'single' })}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                    formData.locationMode === 'single' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Single Branch
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, locationMode: 'multi' })}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                    formData.locationMode === 'multi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Multi-Location (e.g. Amman & Fairfax)
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {formData.locations.map((loc, idx) => (
                <div key={loc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-location-dot text-brand-blue"></i>
                      <strong className="text-slate-900 font-bold">{loc.name}</strong>
                      {loc.isPrimary && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-100 text-brand-blue">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px]">{loc.city}, {loc.country}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {formData.locations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLocation(loc.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                        title="Remove Location"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {formData.locationMode === 'multi' && (
                <button
                  type="button"
                  onClick={addLocation}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-brand-blue hover:text-brand-blue text-slate-600 font-bold text-xs transition-colors flex items-center justify-center gap-2 bg-slate-50/50"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Add Another Practice Branch</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 4: COMPETITORS (WITH SKIP BUTTON) */}
        {/* ============================================================== */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-fade-in text-xs">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">4. Regional Competitor Watchlist</h2>
                <p className="text-xs text-slate-500">Benchmark your digital footprint against up to 3 competitors in your market.</p>
              </div>
              <button
                type="button"
                onClick={handleSkipCompetitors}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-bold text-xs transition-colors shrink-0"
              >
                {t.onboarding.skipCompetitorsBtn}
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {formData.competitors.map((comp, idx) => (
                <div key={comp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Competitor #{idx + 1} Name</label>
                    <input
                      type="text"
                      value={comp.name}
                      onChange={(e) => updateCompetitor(idx, 'name', e.target.value)}
                      placeholder="e.g. Apex Dental Studio"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Domain URL</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={comp.domain}
                      onChange={(e) => updateCompetitor(idx, 'domain', e.target.value)}
                      placeholder="e.g. apexdental.jo"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-semibold focus:border-brand-blue focus:outline-none text-start"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 5: INTEGRATIONS (WITH SKIP BUTTON) */}
        {/* ============================================================== */}
        {currentStep === 5 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-fade-in text-xs">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">5. Authorize First-Party Integrations (Optional)</h2>
                <p className="text-xs text-slate-500">Connecting first-party analytics turns CRO hypotheses into measured data points.</p>
              </div>
              <button
                type="button"
                onClick={handleSkipIntegrations}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-bold text-xs transition-colors shrink-0"
              >
                {t.onboarding.skipIntegrationsBtn}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                {
                  id: 'ga4',
                  title: 'Google Analytics 4',
                  desc: 'Unlocks actual patient conversion funnels and bounce rates.',
                  icon: 'fa-solid fa-chart-line text-amber-500',
                  connected: formData.integrations.ga4
                },
                {
                  id: 'gsc',
                  title: 'Google Search Console',
                  desc: 'Real impression queries and CTR indexing coverage.',
                  icon: 'fa-brands fa-google text-blue-500',
                  connected: formData.integrations.gsc
                },
                {
                  id: 'instagram',
                  title: 'Instagram Business',
                  desc: 'Direct bio metrics and engagement authenticity insights.',
                  icon: 'fa-brands fa-instagram text-pink-500',
                  connected: formData.integrations.instagram
                },
                {
                  id: 'facebook',
                  title: 'Facebook Page Insights',
                  desc: 'Patient recommendation sentiment and review verification.',
                  icon: 'fa-brands fa-facebook text-blue-600',
                  connected: formData.integrations.facebook
                }
              ].map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-base shrink-0">
                      <i className={item.icon}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        integrations: {
                          ...prev.integrations,
                          [item.id]: !prev.integrations[item.id]
                        }
                      }));
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shrink-0 ${
                      item.connected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {item.connected ? '✓ Connected' : '+ Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 6: LAUNCH READINESS & DATA TRANSPARENCY (INTEGRITY RULE) */}
        {/* ============================================================== */}
        {currentStep === 6 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 animate-fade-in text-xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900">6. Launch Readiness & Evidence Integrity</h2>
              <p className="text-xs text-slate-500">Review what data will be collected before your workspace activates.</p>
            </div>

            {/* Integrity Rule Box */}
            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-cyan-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-cyan-900">
                <i className="fa-solid fa-shield-halved text-cyan-700"></i>
                <span>{t.onboarding.transparencyNotice}</span>
              </div>
              <p className="text-[11px] text-cyan-900/90 leading-relaxed">
                {t.onboarding.transparencyText}
              </p>
            </div>

            {/* Summary Grid */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
                Workspace Configuration Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Brand Entity</span>
                  <strong className="text-slate-800">{formData.brandName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Domain</span>
                  <strong className="font-mono text-slate-800">{formData.domain}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Workspace Role</span>
                  <strong className="text-slate-800 capitalize">{formData.role.replace('_', ' ')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Locations</span>
                  <strong className="text-slate-800">{formData.locations.length} Branch Clinic(s)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Competitors</span>
                  <strong className="text-slate-800">
                    {formData.competitors.length ? `${formData.competitors.length} Monitored` : 'Skipped'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Report Language</span>
                  <strong className="text-slate-800 uppercase font-mono">{formData.auditLanguage}</strong>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
              <i className="fa-solid fa-circle-check text-emerald-600 text-lg"></i>
              <div>
                <strong className="block text-emerald-950 font-bold">Workspace Ready to Launch</strong>
                <span className="text-emerald-800 text-[11px]">You can now launch your first unified four-pillar growth audit.</span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Bottom Controls */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                {t.onboarding.backBtn}
              </button>
            ) : (
              onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
              )
            )}
          </div>

          <div>
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-all"
              >
                {t.onboarding.nextBtn}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl gradient-brand-cta text-slate-950 font-extrabold text-xs shadow-md hover:brightness-105 transition-all"
              >
                {t.onboarding.launchWorkspaceBtn}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
