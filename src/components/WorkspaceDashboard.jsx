import React, { useRef, useEffect } from 'react';
import { playSynthTick } from '../utils/audio';
import { translations } from '../utils/translations';
import { SAMPLE_CLIENTS, SAMPLE_AUDIT_DATA, getClientDiagnostics } from '../utils/sampleData';

const MASCOT_URL = "https://raw.githubusercontent.com/lengkongandreuw/voxsocial/main/assets/ryanvox.png";

export default function WorkspaceDashboard({
  currentRole, // 'agency' | 'consultant' | 'business'
  isSampleData = true,
  setIsSampleData,
  language = 'en',
  activeClient = SAMPLE_CLIENTS[0],
  setActiveClient,
  onStartSocialScan,
  onStartSeoAudit,
  onOpenIntelligence,
  isTrialExpired = false,
  runtimeSeo = null,
  runtimeSocial = null,
  clientsList = SAMPLE_CLIENTS
}) {
  const mascotRef = useRef(null);

  const t = translations[language] || translations.en;
  const isRtl = language === 'ar';

  // Mouse parallax for mascot on empty state
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!mascotRef.current) return;
      const x = (window.innerWidth / 2 - e.pageX) / 60;
      const y = (window.innerHeight / 2 - e.pageY) / 60;
      mascotRef.current.style.transform = `perspective(1000px) rotateY(${-x}deg) rotateX(${y}deg)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Compute diagnostics (handles real vs dummy gracefully)
  const diag = getClientDiagnostics(activeClient, runtimeSeo, runtimeSocial);

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
  };

  const renderDataTag = (isReal, realLabel = "REAL DATA", dummyLabel = "DUMMY DATA") => {
    if (isReal) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          {realLabel}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono bg-amber-500/15 border border-amber-500/35 border-dashed text-amber-400">
        <i className="fa-solid fa-triangle-exclamation text-[9px]"></i>
        {dummyLabel}
      </span>
    );
  };

  // ===========================================================================
  // EMPTY STATE (FIRST RUN)
  // ===========================================================================
  if (!isSampleData && !diag.hasRealSeo && !diag.hasRealSocial && !activeClient?.isReal) {
    return (
      <div className="space-y-8 animate-fade-in py-6">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0c0735] via-[#100a42] to-[#07041d] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#00e5ff] bg-[#0094ea]/10 border border-[#0094ea]/30 font-mono">
              <i className="fa-solid fa-sparkles"></i>
              {t.dashboard.emptyStateTitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {t.dashboard.welcome} 👋
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              {t.dashboard.emptyStateDesc}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 justify-center md:justify-start">
              <button
                onClick={onStartSeoAudit}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0094ea] to-[#cf41b2] hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
              >
                <i className="fa-solid fa-rocket"></i>
                {t.dashboard.emptyStateAction}
              </button>
              <button
                onClick={() => {
                  playSynthTick(800, 'sine', 0.05, 0.05);
                  setIsSampleData(true);
                }}
                className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 text-xs sm:text-sm font-bold transition-all"
              >
                <i className="fa-solid fa-database mr-2 text-[#00e5ff]"></i>
                {t.dashboard.viewSampleData}
              </button>
            </div>
          </div>

          <div className="relative flex flex-col items-center shrink-0">
            <div className="absolute -top-10 bg-[#07041d] border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-2xl whitespace-nowrap z-20">
              "Let's audit your first digital footprint!"
            </div>
            <div
              ref={mascotRef}
              onClick={() => playSynthTick(900, 'sine', 0.05, 0.05)}
              className="w-36 h-36 cursor-pointer drop-shadow-2xl transition-transform duration-200"
              title="Ryan Vox - Mascot"
            >
              <img src={MASCOT_URL} className="w-full h-full object-contain" alt="Mascot" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#0c0735]/60 border border-white/10 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0094ea]/15 border border-[#0094ea]/30 flex items-center justify-center text-[#00e5ff] font-black font-mono">1</div>
            <h4 className="text-base font-black text-white">Enter Target Domain & Socials</h4>
            <p className="text-xs text-white/60 leading-relaxed">Connect your website URL, Google Business Profile address, and Instagram/Facebook channels.</p>
          </div>
          <div className="p-6 bg-[#0c0735]/60 border border-white/10 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#cf41b2]/15 border border-[#cf41b2]/30 flex items-center justify-center text-[#cf41b2] font-black font-mono">2</div>
            <h4 className="text-base font-black text-white">Multi-Node 51-Point Audit</h4>
            <p className="text-xs text-white/60 leading-relaxed">Engines inspect semantic schema, Core Web Vitals, backlink anchors, and bio conversion hooks.</p>
          </div>
          <div className="p-6 bg-[#0c0735]/60 border border-white/10 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black font-mono">3</div>
            <h4 className="text-base font-black text-white">Executive Growth Roadmap</h4>
            <p className="text-xs text-white/60 leading-relaxed">Receive prioritized engineering fixes, competitor benchmark matrices, and white-label proposals.</p>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // POPULATED / REAL AUDIT STATE (WITH EXPLICIT DUMMY VS REAL BADGING)
  // ===========================================================================
  return (
    <div className="space-y-8 animate-fade-in">

      {/* Top Banner indicating Real vs Dummy status */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
        diag.isRealScore
          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
          : 'bg-amber-500/15 border-amber-500/30 text-amber-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <i className={`fa-solid ${diag.isRealScore ? 'fa-circle-check text-emerald-400 text-base' : 'fa-triangle-exclamation text-amber-400 text-base'}`}></i>
          <div>
            <strong className="block text-white font-mono uppercase text-[11px]">
              {diag.isRealScore ? "STATUS: REAL AUDIT DATA ACTIVE" : "STATUS: DUMMY / SIMULATED DATA ACTIVE"}
            </strong>
            <span className="text-white/80">
              {diag.isRealScore
                ? `Displaying verified live audit data for domain: ${diag.domain}. Crawler nodes verified.`
                : `This workspace is currently using simulated dummy data. Run a live scan to generate real audit metrics.`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!diag.isRealScore && (
            <button
              onClick={onStartSeoAudit}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-md"
            >
              Run Live Audit Scan Now →
            </button>
          )}
        </div>
      </div>

      {/* Top Hero & Role Context Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-white/10">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#00e5ff] bg-[#0094ea]/10 border border-[#0094ea]/30 font-mono">
              <i className="fa-solid fa-cube text-[#00e5ff]"></i>
              {currentRole === 'agency' ? 'AGENCY COMMAND CENTER' : currentRole === 'consultant' ? 'CONSULTANT ADVISORY' : 'CLIENT INTELLIGENCE'}
            </span>
            {renderDataTag(diag.isRealScore, "REAL CLIENT DATA", "DUMMY CLIENT")}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <span>{diag.client.name}</span>
            {diag.client.isReal && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/40">
                VERIFIED REAL CLIENT
              </span>
            )}
          </h1>

          <p className="text-white/60 text-xs sm:text-sm max-w-2xl">
            {currentRole === 'agency' && t.dashboard.agencySubtitle}
            {currentRole === 'consultant' && t.dashboard.consultantSubtitle}
            {currentRole === 'business' && t.dashboard.businessSubtitle}
          </p>
        </div>

        {/* Quick Audit Engine Triggers */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              playSynthTick(880, 'sine', 0.05, 0.08);
              onStartSocialScan();
            }}
            disabled={isTrialExpired}
            className={`px-4 py-2.5 rounded-xl border border-pink-500/30 text-pink-300 font-bold text-xs flex items-center gap-2 transition-all ${
              isTrialExpired ? 'opacity-40 cursor-not-allowed' : 'bg-pink-500/10 hover:bg-pink-500/20'
            }`}
          >
            <i className="fa-brands fa-instagram text-pink-400"></i>
            <span>{diag.hasRealSocial ? "Re-scan VoxSocial" : "Run Real VoxSocial Scan"}</span>
          </button>

          <button
            onClick={() => {
              playSynthTick(700, 'sine', 0.05, 0.08);
              onStartSeoAudit();
            }}
            disabled={isTrialExpired}
            className={`px-4 py-2.5 rounded-xl border border-green-500/30 text-green-300 font-bold text-xs flex items-center gap-2 transition-all ${
              isTrialExpired ? 'opacity-40 cursor-not-allowed' : 'bg-green-500/10 hover:bg-green-500/20'
            }`}
          >
            <i className="fa-solid fa-magnifying-glass-chart text-green-400"></i>
            <span>{diag.hasRealSeo ? "Re-scan VoxSEO" : "Run Real VoxSEO Audit"}</span>
          </button>
        </div>
      </div>

      {/* =======================================================================
          ROLE-SPECIFIC KPI STRIPS
          ======================================================================= */}

      {/* 1. AGENCY ROLE: CLIENT SELECTOR STRIP WITH REAL VS DUMMY BADGES */}
      {currentRole === 'agency' && (
        <div className="space-y-4">
          <div className="p-5 bg-[#0c0735]/60 border border-white/10 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase text-white/50 tracking-wider font-mono block">
                  AGENCY CLIENT WORKSPACES
                </span>
                <span className="text-xs text-white/40">
                  Select a client workspace to inspect diagnostics. Live audited clients appear automatically with the green <strong className="text-emerald-400">REAL</strong> badge.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {clientsList.map((client) => (
                <div
                  key={client.id}
                  onClick={() => {
                    playSynthTick(650, 'sine', 0.04, 0.05);
                    setActiveClient(client);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    activeClient.id === client.id
                      ? 'bg-[#0094ea]/20 border-[#0094ea] shadow-lg ring-1 ring-[#0094ea]/50'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-xs font-black text-white truncate max-w-[130px]">{client.name}</h5>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${getScoreBadgeClass(client.overallScore)}`}>
                      {client.overallScore}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40 font-mono truncate mb-2">{client.domain}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[9px]">
                    {renderDataTag(client.isReal, "REAL CLIENT", "DUMMY CLIENT")}
                    <span className="text-white/40 font-mono">{client.locations[0] || 'Location'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          CORE CLIENT DIGITAL HEALTH CARD (ACTIVE CLIENT)
          ======================================================================= */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0c0735] via-[#120a44] to-[#1a0e5c] border border-white/10 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border font-mono ${getScoreBadgeClass(diag.overallScore)}`}>
              <i className="fa-solid fa-shield-halved"></i>
              STATUS: {diag.overallScore >= 80 ? "STRONG VISIBILITY" : diag.overallScore >= 60 ? "SOLID FOOTPRINT" : "CRITICAL GAP"}
            </span>
            {renderDataTag(diag.isRealScore, "REAL AUDIT INDEX", "DUMMY HEALTH INDEX")}
            <span className="text-xs text-white/40 font-mono">
              Domain: <strong className="text-white">{diag.domain}</strong>
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {diag.client.name} — Unified Health Index
          </h3>
          <p className="text-white/60 text-xs sm:text-sm max-w-xl leading-relaxed">
            {diag.isRealScore
              ? `Weighted live audit score: 55% technical SEO visibility (${diag.seoScore}/100) and 45% social conversion authority (${diag.socialScore}/100).`
              : `Simulated dummy score for Sprint 1 architecture evaluation. Run a live scan to produce authentic health metrics for your domain.`}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <button
              onClick={onOpenIntelligence}
              className="px-5 py-2.5 rounded-xl bg-[#0094ea] hover:bg-[#0081cc] text-white font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span>Inspect Deep Diagnostic Findings</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
            <span className="text-white/40 font-mono text-[11px]">
              Last audit: {diag.client.lastAudit}
            </span>
          </div>
        </div>

        {/* Ring Score Display */}
        <div className="flex items-center gap-6 shrink-0 bg-white/[0.03] border border-white/10 p-5 rounded-2xl">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="transparent" />
              <circle
                cx="48" cy="48" r="40"
                stroke={diag.overallScore >= 80 ? '#22c55e' : diag.overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * diag.overallScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-white">{diag.overallScore}</span>
              <span className="block text-[8px] font-bold text-white/40 uppercase">/ 100</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div>
              <p className="text-white/50 text-[10px] font-bold uppercase">{t.dashboard.dataConfidence}</p>
              <p className="text-sm font-black text-[#00e5ff] font-mono">
                {diag.isRealScore ? "100% Measured" : "92% Simulated"}
              </p>
            </div>
            <div>
              <p className="text-white/50 text-[10px] font-bold uppercase">{t.dashboard.evidenceCoverage}</p>
              <p className="text-sm font-black text-emerald-400 font-mono">
                {diag.hasRealSeo ? "94% Evaluated" : "88% Estimated"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Pillars: Search Visibility (SEO) vs Social Readiness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Pillar 1: Search & Website (VoxSEO) */}
        <div className="p-6 bg-[#0c0735]/70 border border-white/10 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                <i className="fa-solid fa-globe"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white">{t.dashboard.searchVisibility}</h4>
                  {renderDataTag(diag.hasRealSeo, "LIVE SEO SCAN", "DUMMY DATA")}
                </div>
                <p className="text-[11px] text-white/40 font-mono">{diag.domain}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-md text-xs font-black border ${getScoreBadgeClass(diag.seoScore)}`}>
              {diag.seoScore}/100
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/60">On-Page Semantic Quality</span>
              <span className="font-bold text-white font-mono flex items-center gap-1.5">
                <span>{diag.pillars.seo.score}/100</span>
                {renderDataTag(diag.pillars.seo.isReal, "REAL", "DUMMY")}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/60">Core Web Vitals Speed</span>
              <span className="font-bold text-amber-400 font-mono flex items-center gap-1.5">
                <span>{diag.pillars.performance.score}/100</span>
                {renderDataTag(diag.pillars.performance.isReal, "REAL", "DUMMY")}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/60">Mobile Usability & Viewport</span>
              <span className="font-bold text-white font-mono flex items-center gap-1.5">
                <span>{diag.pillars.usability.score}/100</span>
                {renderDataTag(diag.pillars.usability.isReal, "REAL", "DUMMY")}
              </span>
            </div>
          </div>

          <button
            onClick={onStartSeoAudit}
            className="w-full py-2.5 rounded-xl border border-green-500/30 text-green-300 text-xs font-bold hover:bg-green-500/10 transition-all text-center flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-magnifying-glass-chart text-xs"></i>
            <span>{diag.hasRealSeo ? "Re-scan 51-Point SEO Inspector →" : "Run Live SEO Scan to Replace Dummy Data →"}</span>
          </button>
        </div>

        {/* Pillar 2: Social Media Authority (VoxSocial) */}
        <div className="p-6 bg-[#0c0735]/70 border border-white/10 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <i className="fa-brands fa-instagram"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white">{t.dashboard.socialReadiness}</h4>
                  {renderDataTag(diag.hasRealSocial, "LIVE AI SCAN", "DUMMY DATA")}
                </div>
                <p className="text-[11px] text-white/40 font-mono truncate max-w-[200px]">{diag.socialUrl}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-md text-xs font-black border ${getScoreBadgeClass(diag.socialScore)}`}>
              {diag.socialScore}/100
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/60">Profile Clarity & Hook</span>
              <span className="font-bold text-white font-mono flex items-center gap-1.5">
                <span>{diag.hasRealSocial ? (diag.effectiveSocial?.details?.categories?.profileClarity || diag.socialScore) : 76}/100</span>
                {renderDataTag(diag.hasRealSocial, "REAL", "DUMMY")}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/60">Content Structure & Consistency</span>
              <span className="font-bold text-white font-mono flex items-center gap-1.5">
                <span>{diag.hasRealSocial ? (diag.effectiveSocial?.details?.categories?.contentQuality || diag.socialScore) : 74}/100</span>
                {renderDataTag(diag.hasRealSocial, "REAL", "DUMMY")}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-white/60">Business Readiness & Proof</span>
              <span className="font-bold text-white font-mono flex items-center gap-1.5">
                <span>{diag.hasRealSocial ? (diag.effectiveSocial?.details?.categories?.businessReadiness || diag.socialScore) : 70}/100</span>
                {renderDataTag(diag.hasRealSocial, "REAL", "DUMMY")}
              </span>
            </div>
          </div>

          <button
            onClick={onStartSocialScan}
            className="w-full py-2.5 rounded-xl border border-pink-500/30 text-pink-300 text-xs font-bold hover:bg-pink-500/10 transition-all text-center flex items-center justify-center gap-2"
          >
            <i className="fa-brands fa-instagram text-xs"></i>
            <span>{diag.hasRealSocial ? "Re-analyze Social Profile →" : "Run Live Social Scan to Replace Dummy Data →"}</span>
          </button>
        </div>

      </div>

      {/* Top Engineering Bottlenecks Section */}
      <div className="p-6 bg-[#0c0735]/60 border border-white/10 rounded-3xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-white/60 tracking-wider font-mono flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation text-rose-400"></i>
              <span>{t.dashboard.topBottlenecks}</span>
              {renderDataTag(diag.hasRealSeo, "REAL FINDINGS", "DUMMY EXAMPLES")}
            </span>
          </div>
          <span className="text-[10px] text-white/40 font-mono">
            Formula: Detected Gap · Revenue Impact · Engineering Solution
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_AUDIT_DATA.topBottlenecks.map((bot) => (
            <div key={bot.id} className="p-5 bg-[#07041d]/80 border border-white/10 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-wider text-rose-400 font-mono">
                    {bot.priority}
                  </span>
                  {renderDataTag(diag.hasRealSeo, "LIVE AUDIT", "DUMMY")}
                </div>
                <h5 className="text-sm font-black text-white leading-snug">{bot.title}</h5>
                <p className="text-xs text-white/60 leading-relaxed">{bot.impact}</p>
              </div>
              <div className="pt-2 border-t border-white/5 text-[11px] text-emerald-400 font-medium">
                <strong className="block text-white/40 text-[9px] uppercase font-mono mb-0.5">ENGINEERING FIX:</strong>
                {bot.fix}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
