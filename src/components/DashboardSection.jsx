import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { playSynthTick } from '../utils/audio';
import LogoutModal from './LogoutModal';
import RoleAwareSidebar from './RoleAwareSidebar';
import WorkspaceDashboard from './WorkspaceDashboard';
import { translations } from '../utils/translations';
import {
  SAMPLE_CLIENTS,
  SAMPLE_AUDIT_DATA,
  getActiveClientsList,
  getClientDiagnostics
} from '../utils/sampleData';

const LOGO_URL = "/New_Logo_Voxlumedia.webp";

export default function DashboardSection({
  setView,
  analysisResults,
  seoAuditData,
  isTrialExpired = false,
  trialDaysLeft = 14,
  userRole = 'agency',
  setUserRole,
  language = 'en',
  setLanguage
}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [clientsList, setClientsList] = useState(() => getActiveClientsList());
  const [activeClient, setActiveClient] = useState(() => {
    const list = getActiveClientsList();
    return list.find(c => c.isReal) || list[0] || SAMPLE_CLIENTS[0];
  });
  const [isSampleData, setIsSampleData] = useState(true);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Read saved preferences or fallback
  const currentRole = userRole || 'agency';
  const currentLang = language || 'en';
  const t = translations[currentLang] || translations.en;
  const isRtl = currentLang === 'ar';

  const user = auth.currentUser;

  // Refresh client list when audit data changes or on mount
  useEffect(() => {
    const list = getActiveClientsList();
    setClientsList(list);
    // If active client is dummy and a real client exists, auto-select real client
    if (!activeClient?.isReal) {
      const realOne = list.find(c => c.isReal);
      if (realOne) setActiveClient(realOne);
    }
  }, [seoAuditData, analysisResults]);

  // Compute diagnostics (handles real vs dummy gracefully)
  const diag = getClientDiagnostics(activeClient, seoAuditData, analysisResults);

  // Handle Logout
  const handleLogout = async () => {
    playSynthTick(400, 'sine', 0.08, 0.1);
    try {
      await signOut(auth);
      localStorage.removeItem('auth_token');
      setView('login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const handleRoleChange = (newRole) => {
    playSynthTick(850, 'sine', 0.05, 0.06);
    if (setUserRole) setUserRole(newRole);
    localStorage.setItem('vox_user_role', newRole);
    setShowRoleMenu(false);
    if (newRole === 'business' && (activeNav.startsWith('agency_') || activeNav === 'growth_proposals' || activeNav === 'admin_team')) {
      setActiveNav('dashboard');
    }
  };

  const handleLangToggle = () => {
    playSynthTick(900, 'sine', 0.04, 0.05);
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    if (setLanguage) setLanguage(nextLang);
    localStorage.setItem('vox_language', nextLang);
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

  const getEvidenceBadge = (type) => {
    switch (type) {
      case 'measured':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0094ea]/15 border border-[#0094ea]/30 text-[#00e5ff] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]"></span>
            MEASURED
          </span>
        );
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono">
            <i className="fa-solid fa-plug text-[9px]"></i>
            CONNECTED
          </span>
        );
      case 'estimated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 border-dashed text-amber-400 font-mono">
            ESTIMATED
          </span>
        );
      case 'ai':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#cf41b2]/15 border border-[#cf41b2]/30 text-[#cf41b2] font-mono">
            <i className="fa-solid fa-brain text-[9px]"></i>
            AI SYNTHESIS
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`min-h-screen flex bg-[#07041d] text-white font-sans overflow-x-hidden ${isRtl ? 'font-arabic' : ''}`}
    >
      {/* 1. ROLE-AWARE SIDEBAR (5 GROUPS) */}
      <RoleAwareSidebar
        currentRole={currentRole}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        language={currentLang}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onStartNewAudit={() => {
          playSynthTick(880, 'sine', 0.05, 0.05);
          setView('seo_audit');
        }}
        activeClient={activeClient}
        onSelectClient={setActiveClient}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#090524] overflow-y-auto">

        {/* PERSISTENT REAL VS DUMMY STATUS BANNER */}
        <div className={`w-full border-b px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 select-none ${
          diag.isRealScore
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
            : 'bg-amber-500/15 border-amber-500/30 text-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${diag.isRealScore ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
            <strong className="font-mono tracking-wider text-[11px] uppercase">
              {diag.isRealScore ? "REAL DATA CONNECTED" : "SIMULATED / DUMMY DATA MODE"}
            </strong>
            <span className="hidden sm:inline text-white/80">
              {diag.isRealScore
                ? `· Displaying verified live audit data for domain: ${diag.domain}. Crawler nodes verified.`
                : `· No live audit data found for this domain yet. Metrics below are simulated dummy estimates.`}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!diag.isRealScore ? (
              <button
                onClick={() => setView('seo_audit')}
                className="px-3 py-1 rounded-lg bg-amber-500 text-black font-black text-[10px] hover:bg-amber-400 transition-all font-mono shadow"
              >
                Run Live Audit Scan Now →
              </button>
            ) : (
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                ✓ LIVE ENGINE VERIFIED
              </span>
            )}
          </div>
        </div>

        {/* TOPBAR / APP SHELL HEADER */}
        <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3.5 bg-[#07041d]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-4">
          
          {/* Left: Active Client Picker (Agency) or Current Section Title */}
          <div className="flex items-center gap-4">
            {currentRole === 'agency' ? (
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
                <i className="fa-solid fa-briefcase text-[#00e5ff] text-xs"></i>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="block text-[9px] uppercase tracking-wider text-white/40 font-mono font-bold">
                      {t.topbar.clientSelect}
                    </span>
                    {renderDataTag(activeClient.isReal, "REAL", "DUMMY")}
                  </div>
                  <select
                    value={activeClient.id}
                    onChange={(e) => {
                      const sel = clientsList.find(c => c.id === e.target.value);
                      if (sel) {
                        playSynthTick(700, 'sine', 0.04, 0.04);
                        setActiveClient(sel);
                      }
                    }}
                    className="bg-transparent text-xs font-black text-white focus:outline-none cursor-pointer"
                  >
                    {clientsList.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#0c0735] text-white">
                        {c.name} {c.isReal ? "★ (REAL)" : "(DUMMY)"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white/40 uppercase font-mono tracking-wider">
                  {currentRole === 'consultant' ? 'CONSULTANT WORKSPACE' : 'CLIENT PORTAL'}
                </span>
                <span className="text-white/20">/</span>
                <span className="text-xs font-black text-white flex items-center gap-2">
                  <span>{activeClient.name}</span>
                  {renderDataTag(activeClient.isReal, "REAL", "DUMMY")}
                </span>
              </div>
            )}
          </div>

          {/* Right: Role Switcher, Language Toggle, Trial Badge, Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">

            {/* Trial Status Badge */}
            {isTrialExpired ? (
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase text-rose-400 bg-rose-500/10 border border-rose-500/30 font-mono">
                <i className="fa-solid fa-lock text-[10px]"></i>
                {t.topbar.trialEnded}
              </span>
            ) : (
              <span className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono ${
                trialDaysLeft <= 3
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                  : 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
              }`}>
                <i className="fa-solid fa-clock text-[10px]"></i>
                {trialDaysLeft} {t.topbar.trialLeft}
              </span>
            )}

            {/* 3-Role Switcher (Sprint 1 Testing Feature) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-black transition-all"
                title={t.topbar.switchRole}
              >
                <i className="fa-solid fa-user-gear text-[#00e5ff] text-xs"></i>
                <span className="capitalize">{currentRole}</span>
                <i className="fa-solid fa-chevron-down text-[9px] text-white/50"></i>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0c0735] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in text-xs space-y-1">
                  <div className="px-2 py-1 text-[9px] font-black text-white/40 uppercase font-mono">
                    Select Active Role
                  </div>
                  <button
                    onClick={() => handleRoleChange('agency')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-bold transition-all ${
                      currentRole === 'agency' ? 'bg-[#0094ea] text-white' : 'hover:bg-white/5 text-white/80'
                    }`}
                  >
                    <span>Agency Owner</span>
                    {currentRole === 'agency' && <i className="fa-solid fa-check text-[10px]"></i>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('consultant')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-bold transition-all ${
                      currentRole === 'consultant' ? 'bg-[#0094ea] text-white' : 'hover:bg-white/5 text-white/80'
                    }`}
                  >
                    <span>Consultant (Solo)</span>
                    {currentRole === 'consultant' && <i className="fa-solid fa-check text-[10px]"></i>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('business')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-bold transition-all ${
                      currentRole === 'business' ? 'bg-[#0094ea] text-white' : 'hover:bg-white/5 text-white/80'
                    }`}
                  >
                    <span>Business Owner</span>
                    {currentRole === 'business' && <i className="fa-solid fa-check text-[10px]"></i>}
                  </button>
                </div>
              )}
            </div>

            {/* Language Switcher (EN / AR) */}
            <button
              onClick={handleLangToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold font-mono transition-all"
              title="Toggle English / Arabic (RTL)"
            >
              <i className="fa-solid fa-globe text-xs text-[#cf41b2]"></i>
              <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-white/60 hover:text-rose-400 flex items-center justify-center transition-all text-xs"
              title={t.topbar.logout}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </header>

        {/* MAIN CANVAS VIEWS DRIVEN BY activeNav */}
        <main className="flex-1 w-full max-w-[1360px] mx-auto p-4 sm:p-8">

          {/* VIEW 1: WORKSPACE DASHBOARD */}
          {activeNav === 'dashboard' && (
            <WorkspaceDashboard
              currentRole={currentRole}
              isSampleData={isSampleData}
              setIsSampleData={setIsSampleData}
              language={currentLang}
              activeClient={activeClient}
              setActiveClient={setActiveClient}
              onStartSocialScan={() => setView('landing')}
              onStartSeoAudit={() => setView('seo_audit')}
              onOpenIntelligence={() => setActiveNav('intelligence_overview')}
              isTrialExpired={isTrialExpired}
              runtimeSeo={seoAuditData}
              runtimeSocial={analysisResults}
              clientsList={clientsList}
            />
          )}

          {/* VIEW 2: INTELLIGENCE OVERVIEW */}
          {activeNav === 'intelligence_overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#00e5ff] uppercase">INTELLIGENCE HUB</span>
                    {renderDataTag(diag.isRealScore, "REAL AUDIT DATA", "DUMMY DATA (UNSCANNED)")}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Unified Digital Presence Overview</h2>
                  <p className="text-xs sm:text-sm text-white/60">Comprehensive audit metrics, evidence coverage, and diagnostic status.</p>
                </div>
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all"
                >
                  ← Back to Dashboard
                </button>
              </div>

              {/* Status & Ring Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0c0735] via-[#120a44] to-[#1a0e5c] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono">
                      STATUS: {diag.overallScore >= 80 ? "STRONG VISIBILITY" : diag.overallScore >= 60 ? "SOLID FOOTPRINT" : "CRITICAL GAP"}
                    </span>
                    {renderDataTag(diag.isRealScore, "REAL SCORE", "DUMMY SCORE")}
                  </div>
                  <h3 className="text-2xl font-black text-white">{diag.client.name}</h3>
                  <p className="text-xs text-white/60 max-w-lg">
                    {diag.isRealScore
                      ? `Weighted score from verified live audit: 55% SEO (${diag.seoScore}/100) and 45% Social (${diag.socialScore}/100).`
                      : `Simulated benchmark score. Domain and profile have not undergone a live audit scan yet.`}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <span className="text-4xl font-black text-white">{diag.overallScore}</span>
                    <span className="block text-[9px] text-white/40 uppercase font-mono">Index / 100</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-[11px] text-[#00e5ff] font-mono font-bold">
                      {diag.isRealScore ? "100% Measured" : "92% Simulated"}
                    </p>
                    <p className="text-[11px] text-emerald-400 font-mono font-bold">
                      {diag.hasRealSeo ? "94% Evaluated" : "88% Estimated"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dual Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">Search Engine Visibility</h4>
                      {renderDataTag(diag.hasRealSeo, "REAL DATA", "DUMMY DATA")}
                    </div>
                    <span className="text-xs font-black text-green-400 font-mono">{diag.seoScore}/100</span>
                  </div>
                  <p className="text-xs text-white/60">
                    {diag.hasRealSeo
                      ? `Verified live crawl results for domain: ${diag.domain}. 51 audit checkpoints evaluated.`
                      : `Website has not been audited yet. Values shown are simulated dummy metrics.`}
                  </p>
                  <button
                    onClick={() => setActiveNav('intelligence_seo')}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all text-center"
                  >
                    View VoxSEO Breakdown →
                  </button>
                </div>

                <div className="p-6 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">Social Media Readiness</h4>
                      {renderDataTag(diag.hasRealSocial, "REAL DATA", "DUMMY DATA")}
                    </div>
                    <span className="text-xs font-black text-pink-400 font-mono">{diag.socialScore}/100</span>
                  </div>
                  <p className="text-xs text-white/60">
                    {diag.hasRealSocial
                      ? `Gemini AI multimodal evaluation for profile: ${diag.socialUrl}.`
                      : `Social media profile has not been audited yet. Values shown are simulated dummy metrics.`}
                  </p>
                  <button
                    onClick={() => setActiveNav('intelligence_social')}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all text-center"
                  >
                    View VoxSocial Breakdown →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: VOXSEO INTELLIGENCE */}
          {activeNav === 'intelligence_seo' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-green-400 uppercase">TECHNICAL DIAGNOSTICS</span>
                    {renderDataTag(diag.hasRealSeo, "LIVE SEO SCAN (SEOptimer)", "DUMMY DATA (UNSCANNED)")}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">VoxSEO Technical Scorecard</h2>
                  <p className="text-xs sm:text-sm text-white/60">
                    Target Domain: <strong className="text-white font-mono">{diag.domain}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setView('seo_audit')}
                  className="px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-black text-xs transition-all shadow-md"
                >
                  {diag.hasRealSeo ? "Re-scan Full SEO Runner →" : "Launch Live SEO Runner →"}
                </button>
              </div>

              {/* 6 Diagnostic Pillar Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(diag.pillars).map(([key, pillar]) => (
                  <div key={key} className="p-5 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white/70">{pillar.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black font-mono text-white">{pillar.score}/100</span>
                        {renderDataTag(pillar.isReal, "REAL", "DUMMY")}
                      </div>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pillar.score >= 80 ? 'bg-emerald-400' : pillar.score >= 60 ? 'bg-amber-400' : 'bg-rose-400'}`}
                        style={{ width: `${pillar.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: VOXSOCIAL INTELLIGENCE */}
          {activeNav === 'intelligence_social' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-pink-400 uppercase">SOCIAL AUTHORITY ENGINE</span>
                    {renderDataTag(diag.hasRealSocial, "LIVE AI SCAN (Gemini)", "DUMMY DATA (UNSCANNED)")}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">VoxSocial Intelligence</h2>
                  <p className="text-xs sm:text-sm text-white/60">
                    Profile URL: <strong className="text-white font-mono">{diag.socialUrl}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setView('landing')}
                  className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-black text-xs transition-all shadow-md"
                >
                  {diag.hasRealSocial ? "Re-scan Profile →" : "Analyze Live Profile →"}
                </button>
              </div>

              <div className="p-6 bg-gradient-to-r from-[#0c0735] via-[#1a0833] to-[#240b44] border border-pink-500/20 rounded-3xl shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-pink-400 uppercase font-black">AUDITED PROFILE</span>
                  {renderDataTag(diag.hasRealSocial, "REAL AUDIT", "DUMMY PROFILE")}
                </div>
                <h3 className="text-2xl font-black text-white">{diag.socialUrl}</h3>
                <p className="text-xs sm:text-sm text-white/70 italic max-w-xl">
                  {diag.hasRealSocial && diag.effectiveSocial?.details?.summary
                    ? `"${diag.effectiveSocial.details.summary}"`
                    : `"Bio clarity score: 76/100. High conversion potential if WhatsApp direct booking query parameters are enabled."`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-white/40 font-mono">PROFILE CLARITY</span>
                    {renderDataTag(diag.hasRealSocial, "REAL", "DUMMY")}
                  </div>
                  <p className="text-2xl font-black text-white">
                    {diag.hasRealSocial ? (diag.effectiveSocial?.details?.categories?.profileClarity || diag.socialScore) : 76}/100
                  </p>
                </div>
                <div className="p-5 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-white/40 font-mono">CONTENT CONSISTENCY</span>
                    {renderDataTag(diag.hasRealSocial, "REAL", "DUMMY")}
                  </div>
                  <p className="text-2xl font-black text-white">
                    {diag.hasRealSocial ? (diag.effectiveSocial?.details?.categories?.contentQuality || diag.socialScore) : 74}/100
                  </p>
                </div>
                <div className="p-5 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-white/40 font-mono">TRUST & PROOF SIGNALS</span>
                    {renderDataTag(diag.hasRealSocial, "REAL", "DUMMY")}
                  </div>
                  <p className="text-2xl font-black text-white">
                    {diag.hasRealSocial ? (diag.effectiveSocial?.details?.categories?.trustScore || diag.socialScore) : 70}/100
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: VOXAI VISIBILITY (MARKED AS DUMMY SPRINT 1 PREVIEW) */}
          {activeNav === 'intelligence_ai' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#cf41b2] uppercase">GENERATIVE AI ENGINE DISCOVERY</span>
                    {renderDataTag(false, "REAL", "DUMMY DATA · SIMULATED")}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">VoxAI Visibility & LLM Readiness</h2>
                  <p className="text-xs sm:text-sm text-white/60">How generative assistants recommend your business. (Live AI crawler engine scheduled for Sprint 3).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/60">Perplexity Citation Rate</span>
                    {renderDataTag(false, "REAL", "DUMMY")}
                  </div>
                  <p className="text-2xl font-black text-white">68%</p>
                  <p className="text-[10px] text-white/40">Simulated prototype data.</p>
                </div>

                <div className="p-6 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/60">ChatGPT Search Grounding</span>
                    {renderDataTag(false, "REAL", "DUMMY")}
                  </div>
                  <p className="text-2xl font-black text-amber-400">45%</p>
                  <p className="text-[10px] text-white/40">Simulated prototype data.</p>
                </div>

                <div className="p-6 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/60">Google Gemini Live Query</span>
                    {renderDataTag(false, "REAL", "DUMMY")}
                  </div>
                  <p className="text-2xl font-black text-emerald-400">79%</p>
                  <p className="text-[10px] text-white/40">Simulated prototype data.</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: COMPETITIVE INTELLIGENCE (MARKED AS DUMMY SPRINT 1 PREVIEW) */}
          {activeNav === 'intelligence_competitors' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">MARKET POSITIONING</span>
                    {renderDataTag(false, "REAL", "DUMMY DATA · SIMULATED")}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Competitive Intelligence Benchmark</h2>
                  <p className="text-xs sm:text-sm text-white/60">Simulated benchmark for {diag.client.name} (Live multi-competitor crawling engine scheduled for Sprint 3).</p>
                </div>
              </div>

              <div className="p-6 bg-[#0c0735]/80 border border-white/10 rounded-3xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 font-mono uppercase text-[10px]">
                      <th className="py-3 px-4">Entity</th>
                      <th className="py-3 px-4">Digital Score</th>
                      <th className="py-3 px-4">Data Source Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {SAMPLE_AUDIT_DATA.competitors.map((comp, idx) => (
                      <tr key={idx} className={comp.isSelf ? 'bg-[#0094ea]/10 font-bold' : ''}>
                        <td className="py-3 px-4 flex items-center gap-2">
                          {comp.isSelf ? `${diag.client.name} (YOU)` : comp.name}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {comp.isSelf ? `${diag.overallScore}/100` : `${comp.score}/100`}
                        </td>
                        <td className="py-3 px-4">
                          {comp.isSelf && diag.isRealScore
                            ? renderDataTag(true, "REAL AUDIT")
                            : renderDataTag(false, "REAL", "DUMMY SIMULATION")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 7: AGENCY CLIENTS (AGENCY ONLY) */}
          {activeNav === 'agency_clients' && currentRole === 'agency' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#0094ea] uppercase">PORTFOLIO OVERVIEW</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Agency Client Workspaces</h2>
                  <p className="text-xs sm:text-sm text-white/60">Manage all client workspaces. Real audited clients are automatically populated upon scanning and marked with the <strong className="text-emerald-400">REAL</strong> badge.</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    Auto-Synced via Scanner
                  </span>
                </div>
              </div>

              <div className="p-6 bg-[#0c0735]/80 border border-white/10 rounded-3xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 font-mono uppercase text-[10px]">
                      <th className="py-3 px-4">Client Name</th>
                      <th className="py-3 px-4">Domain</th>
                      <th className="py-3 px-4">Data Type</th>
                      <th className="py-3 px-4">Digital Index</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {clientsList.map((client) => (
                      <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-bold text-white">{client.name}</td>
                        <td className="py-3 px-4 font-mono text-white/60">{client.domain}</td>
                        <td className="py-3 px-4">{renderDataTag(client.isReal, "REAL CLIENT", "DUMMY CLIENT")}</td>
                        <td className="py-3 px-4 font-mono font-bold">
                          <span className={`px-2 py-0.5 rounded border ${client.overallScore >= 80 ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400 border-amber-500/30'}`}>
                            {client.overallScore}/100
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setActiveClient(client);
                              setActiveNav('dashboard');
                            }}
                            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#00e5ff] font-bold transition-all"
                          >
                            Open Dashboard →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 8: PROPOSALS (AGENCY & CONSULTANT ONLY) */}
          {activeNav === 'growth_proposals' && currentRole !== 'business' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">COMMERCIAL ACCELERATOR</span>
                    {renderDataTag(false, "REAL", "DUMMY TEMPLATES")}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Proposal & Services Builder</h2>
                  <p className="text-xs sm:text-sm text-white/60">Template proposal layanan agensi untuk {diag.client.name}.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-white">Vox Starter Retainer</h4>
                    {renderDataTag(false, "REAL", "DUMMY")}
                  </div>
                  <p className="text-2xl font-black text-emerald-400">$1,800<span className="text-xs text-white/40">/mo</span></p>
                  <p className="text-xs text-white/60">CWV Optimization, On-Page tags, monthly re-audit tracking.</p>
                </div>

                <div className="p-6 bg-[#0c0735]/80 border border-[#0094ea]/40 rounded-2xl space-y-3 relative overflow-hidden">
                  <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded bg-[#0094ea] text-white font-mono">RECOMMENDED</span>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-white">Vox Growth Engine</h4>
                    {renderDataTag(false, "REAL", "DUMMY")}
                  </div>
                  <p className="text-2xl font-black text-[#00e5ff]">$3,800<span className="text-xs text-white/40">/mo</span></p>
                  <p className="text-xs text-white/60">Full technical SEO, Google Maps citation sync, weekly social hooks.</p>
                </div>

                <div className="p-6 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-white">Vox Scale Advisory</h4>
                    {renderDataTag(false, "REAL", "DUMMY")}
                  </div>
                  <p className="text-2xl font-black text-[#cf41b2]">$5,500<span className="text-xs text-white/40">/mo</span></p>
                  <p className="text-xs text-white/60">Multi-location entity injection, AI LLM visibility seeding, dedicated analyst.</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 9: 90-DAY ROADMAP */}
          {(activeNav === 'growth_roadmap' || activeNav === 'growth_strategy') && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#cf41b2] uppercase">EXECUTIVE ACTION PLAN</span>
                    {renderDataTag(false, "REAL", "DUMMY TEMPLATES")}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Strategic 90-Day Intervention Roadmap</h2>
                  <p className="text-xs sm:text-sm text-white/60">Prioritized engineering and content sprints to lift organic revenue.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SAMPLE_AUDIT_DATA.roadmap30Days.map((step, idx) => (
                  <div key={idx} className="p-5 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#00e5ff] font-bold">{step.day}</span>
                      {renderDataTag(false, "REAL", "DUMMY")}
                    </div>
                    <h5 className="text-sm font-black text-white">{step.title}</h5>
                    <div className="flex items-center justify-between text-[10px] text-white/50 pt-2 border-t border-white/5">
                      <span>Owner: <strong className="text-white">{step.owner}</strong></span>
                      <span className="text-emerald-400 font-bold">{step.impact} Impact</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 10: WHITE LABEL & BRANDING */}
          {activeNav === 'agency_whitelabel' && currentRole !== 'business' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#0094ea] uppercase">WHITE LABEL SUITE</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Brand Customization & PDF Covers</h2>
                  <p className="text-xs sm:text-sm text-white/60">Deliver audit reports and client portals completely under your agency's brand.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-4">
                  <h4 className="text-sm font-black text-white">Agency Brand Settings</h4>
                  <div className="space-y-2 text-xs">
                    <label className="block text-white/60">Agency Display Name</label>
                    <input
                      type="text"
                      defaultValue="Voxlumedia Digital"
                      className="w-full bg-[#07041d] border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold"
                    />
                  </div>
                  <div className="space-y-2 text-xs">
                    <label className="block text-white/60">Primary Brand Accent</label>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0094ea] border border-white/20"></div>
                      <span className="font-mono text-white">#0094ea (Brand Blue)</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-3">
                  <h4 className="text-sm font-black text-white">PDF Cover Live Preview</h4>
                  <div className="p-6 bg-white text-black rounded-xl shadow-2xl space-y-3 select-none">
                    <div className="w-8 h-8 rounded-lg bg-[#0094ea] flex items-center justify-center text-white font-black text-xs">
                      V
                    </div>
                    <h5 className="text-base font-black">{diag.client.name} — Growth Audit</h5>
                    <p className="text-[10px] text-gray-500 font-mono">Prepared by Voxlumedia · Verified on {diag.client.lastAudit}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 11: WORKSPACE ADMIN / SETTINGS */}
          {activeNav.startsWith('admin_') && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono font-bold text-white/40 uppercase">ADMINISTRATION</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {activeNav === 'admin_team' && "Team & Role Permissions"}
                    {activeNav === 'admin_integrations' && "Connected Data Integrations"}
                    {activeNav === 'admin_billing' && "Usage, Credits & Billing"}
                    {activeNav === 'admin_settings' && "Workspace Configuration"}
                  </h2>
                </div>
              </div>

              <div className="p-6 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-4">
                <p className="text-xs text-white/60">
                  Settings active for current workspace: <strong className="text-white">{diag.client.name}</strong> ({currentRole.toUpperCase()} MODE).
                </p>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Client Data Type:</span>
                    <span>{renderDataTag(diag.client.isReal, "REAL CLIENT", "DUMMY CLIENT")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Default Language:</span>
                    <span className="font-mono text-white">{currentLang.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Multi-Role Support:</span>
                    <span className="font-mono text-emerald-400">Active (Agency / Consultant / Business)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
}
