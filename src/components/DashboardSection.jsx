import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { playSynthTick } from '../utils/audio';
import LogoutModal from './LogoutModal';
import RoleAwareSidebar from './RoleAwareSidebar';
import WorkspaceDashboard from './WorkspaceDashboard';
import SampleDataBanner from './core/SampleDataBanner';
import EvidenceTag from './core/EvidenceTag';
import ScoreBadge from './core/ScoreBadge';
import BusinessProfileSection from './workflow/BusinessProfileSection';
import CreateAuditWizard from './workflow/CreateAuditWizard';
import AuditProgressCenter from './workflow/AuditProgressCenter';
import OnboardingWizard from './workflow/OnboardingWizard';
import { translations } from '../utils/translations';
import {
    SAMPLE_CLIENTS,
    SAMPLE_AUDIT_DATA,
    getActiveClientsList,
    getClientDiagnostics
} from '../utils/sampleData';

export default function DashboardSection({
    setView,
    analysisResults,
    seoAuditData,
    userRole,
    setUserRole,
    language,
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
    const [showRoleMenu, setShowRoleMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [launchedConfig, setLaunchedConfig] = useState(null);

    // Active Role and Language state with defaults
    const currentRole = userRole || 'agency_owner';
    const currentLang = language || 'en';
    const t = translations[currentLang] || translations.en;
    const isRtl = currentLang === 'ar';

    const user = auth.currentUser;
    const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Consultant');

    // Sync client list when scans occur
    useEffect(() => {
        const list = getActiveClientsList();
        setClientsList(list);
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

        // Enforce role navigation constraint: if current view is forbidden for new role, redirect to dashboard
        if (newRole === 'business_owner' && activeNav.startsWith('agency_')) {
            setActiveNav('dashboard');
        }
        if (newRole === 'client_portal' && (activeNav.startsWith('agency_') || activeNav.startsWith('admin_') || activeNav === 'growth_proposals')) {
            setActiveNav('dashboard');
        }
    };

    const handleLangToggle = () => {
        playSynthTick(900, 'sine', 0.04, 0.05);
        const nextLang = currentLang === 'en' ? 'ar' : 'en';
        if (setLanguage) setLanguage(nextLang);
        localStorage.setItem('vox_language', nextLang);
    };

    return (
        <div className={`min-h-screen flex flex-col bg-[#0A0B10] text-slate-100 relative ${isRtl ? 'rtl' : 'ltr'}`}>

            {/* 1. TOP PERSISTENT SAMPLE DATA BANNER */}
            <SampleDataBanner
                isReal={diag.isRealScore}
                targetDomain={diag.domain}
                onRunAudit={() => setView('seo_audit')}
                t={t}
            />

            {/* Container for Sidebar + Content */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* 2. ROLE-AWARE SIDEBAR (DARK BRAND SHELL) */}
                <RoleAwareSidebar
                    activeNav={activeNav}
                    setActiveNav={setActiveNav}
                    currentRole={currentRole}
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                    t={t}
                    isRtl={isRtl}
                    onNewAudit={() => setActiveNav('create_audit')}
                />

                {/* 3. MAIN CONTENT CONTAINER (DARK TOPBAR + LIGHT CANVAS) */}
                <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarCollapsed
                    ? (isRtl ? 'me-[72px]' : 'ms-[72px]')
                    : (isRtl ? 'me-[248px]' : 'ms-[248px]')
                    }`}>

                    {/* TOPBAR / APP SHELL HEADER (DARK BRAND SHELL) */}
                    <header className="sticky top-0 z-30 h-16 bg-[#0A0B10] border-b border-[#1E2235] px-4 sm:px-8 flex items-center justify-between gap-4 select-none">

                        {/* Right: Actions, Role Switcher, Language Toggle, Profile */}
                        <div className="flex items-center gap-2.5 shrink-0">

                            {/* Sprint 2 Onboarding Wizard Trigger */}
                            <button
                                type="button"
                                onClick={() => setActiveNav(activeNav === 'onboarding' ? 'dashboard' : 'onboarding')}
                                className={`h-9 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs ${activeNav === 'onboarding'
                                    ? 'bg-brand-blue text-white border-brand-blue'
                                    : 'bg-[#121422] hover:bg-white/5 border-[#1E2235] text-slate-300'
                                    }`}
                                title="Launch 6-Step Onboarding Wizard"
                            >
                                <i className="fa-solid fa-wand-magic-sparkles text-[#00e5ff] text-xs"></i>
                                <span className="hidden lg:inline">Onboarding Wizard</span>
                            </button>

                            {/* Notifications Bell */}
                            <button
                                type="button"
                                className="w-9 h-9 rounded-xl bg-[#121422] hover:bg-white/5 border border-[#1E2235] text-slate-400 hover:text-white flex items-center justify-center text-xs relative transition-colors"
                                title={t.topbar.notifications}
                            >
                                <i className="fa-regular fa-bell"></i>
                                <span className="absolute top-2 end-2 w-1.5 h-1.5 rounded-full bg-[#00e5ff]"></span>
                            </button>

                            {/* Dual Location Pill */}
                            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <span>Amman & Fairfax Practice</span>
                            </div>
                        </div>

                        {/* Center: Global Search Bar Trigger (⌘K) */}
                        <div className="hidden md:flex flex-1 max-w-md mx-4">
                            <button
                                type="button"
                                onClick={() => setShowSearchModal(true)}
                                className="w-full h-9 px-3.5 rounded-xl bg-[#121422] hover:bg-[#16192a] border border-[#1E2235] text-slate-400 hover:text-slate-200 text-xs flex items-center justify-between transition-colors shadow-xs"
                            >
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-magnifying-glass text-slate-500"></i>
                                    <span>{t.topbar.searchPlaceholder}</span>
                                </div>
                                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px] border border-slate-700">
                                    ⌘K
                                </kbd>
                            </button>
                        </div>

                        {/* Right: Actions, Role Switcher, Language Toggle, Profile */}
                        <div className="flex items-center gap-2.5 shrink-0">

                            {/* Notifications Bell */}
                            <button
                                type="button"
                                className="w-9 h-9 rounded-xl bg-[#121422] hover:bg-white/5 border border-[#1E2235] text-slate-400 hover:text-white flex items-center justify-center text-xs relative transition-colors"
                                title={t.topbar.notifications}
                            >
                                <i className="fa-regular fa-bell"></i>
                                <span className="absolute top-2 end-2 w-1.5 h-1.5 rounded-full bg-[#00e5ff]"></span>
                            </button>

                            {/* Instant EN / AR Language Switcher */}
                            <button
                                onClick={handleLangToggle}
                                className="h-9 px-2.5 rounded-xl bg-[#121422] hover:bg-white/5 border border-[#1E2235] text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                                title="Switch Language (English / Arabic RTL)"
                            >
                                <i className="fa-solid fa-globe text-[#00e5ff] text-xs"></i>
                                <span className="uppercase font-mono text-[11px]">{currentLang}</span>
                            </button>

                            {/* Live Role Switcher (Sprint 1 Testing Dropdown) */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                                    className="h-9 px-3 rounded-xl bg-[#121422] hover:bg-[#181a2c] border border-[#1E2235] text-xs font-bold text-white flex items-center gap-2 transition-colors shadow-xs"
                                >
                                    <span className="w-2 h-2 rounded-full bg-[#cf41b2]"></span>
                                    <span className="hidden sm:inline text-slate-400 text-[11px] font-normal">Role:</span>
                                    <span className="capitalize text-[#00e5ff] font-mono text-xs">
                                        {t.roles[currentRole] || currentRole}
                                    </span>
                                    <i className="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
                                </button>

                                {showRoleMenu && (
                                    <div className="absolute z-50 end-0 mt-2 w-64 rounded-2xl bg-[#0F111D] border border-[#1E2235] shadow-2xl p-2 space-y-1 animate-fade-in text-start">
                                        <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-slate-500 border-b border-[#1E2235]">
                                            Sprint 1 RBAC Testing Switcher
                                        </div>
                                        {[
                                            { id: 'agency_owner', label: t.roles.agency_owner, desc: 'Full agency tools, team & billing' },
                                            { id: 'agency_member', label: t.roles.agency_member, desc: 'Agency audits & proposals; no billing' },
                                            { id: 'consultant', label: t.roles.consultant, desc: 'Solo advisor, proposals, white-label' },
                                            { id: 'business_owner', label: t.roles.business_owner, desc: 'Self-audit, roadmap; no agency tools' },
                                            { id: 'client_portal', label: t.roles.client_portal, desc: 'Read-only portal for agency clients' },
                                        ].map(r => (
                                            <button
                                                key={r.id}
                                                onClick={() => handleRoleChange(r.id)}
                                                className={`w-full p-2.5 rounded-xl text-xs text-start transition-colors ${currentRole === r.id
                                                    ? 'bg-[#0094ea]/15 text-white font-bold border border-[#0094ea]/30'
                                                    : 'text-slate-300 hover:bg-white/5'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold">{r.label}</span>
                                                    {currentRole === r.id && <i className="fa-solid fa-check text-xs text-[#00e5ff]"></i>}
                                                </div>
                                                <span className="text-[10px] text-slate-400 block mt-0.5">{r.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Profile & Sign Out Trigger */}
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="w-9 h-9 rounded-xl bg-[#121422] hover:bg-rose-500/10 border border-[#1E2235] hover:border-rose-500/30 text-slate-400 hover:text-rose-400 flex items-center justify-center text-xs transition-colors"
                                title={t.topbar.signOut}
                            >
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            </button>
                        </div>
                    </header>

                    {/* 4. LIGHT ANALYSIS CANVAS AREA (#F8FAFC) */}
                    <main className="flex-1 bg-[#F8FAFC] text-slate-800 overflow-y-auto">

                        {/* VIEW 1: WORKSPACE DASHBOARD */}
                        {activeNav === 'dashboard' && (
                            <WorkspaceDashboard
                                diag={diag}
                                t={t}
                                isRtl={isRtl}
                                onStartAudit={() => setActiveNav('create_audit')}
                                onOpenSeo={() => setActiveNav('intelligence_seo')}
                                onOpenSocial={() => setActiveNav('intelligence_social')}
                                onOpenAi={() => setActiveNav('intelligence_ai')}
                                onOpenJourney={() => setActiveNav('intelligence_journey')}
                                onOpenReport={() => setActiveNav('intelligence_report')}
                            />
                        )}

                        {/* VIEW 2: INTELLIGENCE OVERVIEW */}
                        {activeNav === 'intelligence_overview' && (
                            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold uppercase text-slate-500">INTELLIGENCE PLATFORM</span>
                                            {!diag.isRealScore && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                    SAMPLE DATA
                                                </span>
                                            )}
                                            <EvidenceTag type="measured" source="Multi-Pillar Matrix" />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
                                            Unified Digital Presence Overview
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-500">
                                            Cross-pillar diagnostics for {diag.client.name} ({diag.domain}).
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setActiveNav('dashboard')}
                                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition-all"
                                    >
                                        ← Back to Dashboard
                                    </button>
                                </div>

                                <ScoreBadge
                                    score={diag.overallScore}
                                    band={diag.overallScore >= 85 ? "Strong" : diag.overallScore >= 70 ? "Solid" : "Needs Work"}
                                    coverage={diag.evidenceCoverage}
                                    isReal={diag.isRealScore}
                                    size="lg"
                                />

                                {/* Technical SEO & Social Split View */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-slate-900">VoxSEO Search Engine Visibility</h4>
                                                {!diag.hasRealSeo && (
                                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300">
                                                        SAMPLE
                                                    </span>
                                                )}
                                                <EvidenceTag type={diag.hasRealSeo ? "measured" : "estimated"} />
                                            </div>
                                            <span className="text-xs font-black text-emerald-700 font-mono bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                                                {diag.seoScore}/100
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            {diag.hasRealSeo
                                                ? `Live crawl validated for domain: ${diag.domain}. 51 checkpoints evaluated.`
                                                : `Simulated baseline for Cedar & Co. Dental. Real crawl activates upon running VoxSEO.`
                                            }
                                        </p>
                                        <button
                                            onClick={() => setView('seo_audit')}
                                            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all text-center"
                                        >
                                            Open VoxSEO Inspector →
                                        </button>
                                    </div>

                                    <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-slate-900">VoxSocial Readiness</h4>
                                                {!diag.hasRealSocial && (
                                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300">
                                                        SAMPLE
                                                    </span>
                                                )}
                                                <EvidenceTag type={diag.hasRealSocial ? "measured" : "estimated"} />
                                            </div>
                                            <span className="text-xs font-black text-pink-700 font-mono bg-pink-50 px-2 py-1 rounded border border-pink-200">
                                                {diag.socialScore}/100
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            {diag.hasRealSocial
                                                ? `Gemini AI multimodal evaluation completed for public profile.`
                                                : `Simulated social conversion baseline for cosmetic dentistry practice.`
                                            }
                                        </p>
                                        <button
                                            onClick={() => setView('landing')}
                                            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all text-center"
                                        >
                                            Open VoxSocial Analyzer →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIEW 3: VOXSEO TECHNICAL SCORECARD */}
                        {activeNav === 'intelligence_seo' && (
                            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold uppercase text-emerald-600">TECHNICAL ENGINE</span>
                                            {!diag.hasRealSeo && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300">
                                                    SAMPLE DATA
                                                </span>
                                            )}
                                            <EvidenceTag type={diag.hasRealSeo ? "measured" : "estimated"} />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
                                            VoxSEO Technical Scorecard
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-500">
                                            Target Domain: <strong className="font-mono text-slate-800">{diag.domain}</strong>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setView('seo_audit')}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs"
                                    >
                                        Run Live 51-Point Scan Now →
                                    </button>
                                </div>

                                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-base font-bold text-slate-900">51-Point Audit Checkpoints</h4>
                                            <p className="text-xs text-slate-500">Includes Core Web Vitals, schema markup, header hierarchy, and mobile usability.</p>
                                        </div>
                                        <span className="text-2xl font-black text-emerald-700 tabular-nums">
                                            {diag.seoScore}/100
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                            <span className="text-slate-500 block text-[11px]">Crawlability & Indexing</span>
                                            <strong className="text-emerald-700 font-mono text-base">Pass · 100%</strong>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                            <span className="text-slate-500 block text-[11px]">Mobile Core Web Vitals</span>
                                            <strong className="text-amber-700 font-mono text-base">Needs Work · 68%</strong>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                            <span className="text-slate-500 block text-[11px]">Local Schema Coverage</span>
                                            <strong className="text-red-700 font-mono text-base">Missing · 0%</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIEW 4: VOXSOCIAL */}
                        {activeNav === 'intelligence_social' && (
                            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold uppercase text-pink-600">MULTIMODAL AI</span>
                                            {!diag.hasRealSocial && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300">
                                                    SAMPLE DATA
                                                </span>
                                            )}
                                            <EvidenceTag type={diag.hasRealSocial ? "measured" : "estimated"} />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
                                            VoxSocial Media Authority
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-500">
                                            Evaluates bio clarity, content proof, and conversion links.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setView('landing')}
                                        className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs transition-all shadow-xs"
                                    >
                                        Analyze Live Profile →
                                    </button>
                                </div>

                                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-base font-bold text-slate-900">Profile Conversion Readiness</h4>
                                            <p className="text-xs text-slate-500">Analyzed via Google Gemini multimodal vision and text evaluation.</p>
                                        </div>
                                        <span className="text-2xl font-black text-pink-700 tabular-nums">
                                            {diag.socialScore}/100
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                            <span className="text-slate-500 block text-[11px]">First-Impression Clarity</span>
                                            <strong className="text-slate-900 font-mono text-base">78 / 100</strong>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                            <span className="text-slate-500 block text-[11px]">Testimonial Proof Signals</span>
                                            <strong className="text-slate-900 font-mono text-base">84 / 100</strong>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                            <span className="text-slate-500 block text-[11px]">Direct Booking Call-to-Action</span>
                                            <strong className="text-amber-700 font-mono text-base">52 / 100</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIEW 5: VOXAI VISIBILITY */}
                        {activeNav === 'intelligence_ai' && (
                            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold uppercase text-[#cf41b2]">GENERATIVE DISCOVERY</span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300">
                                                SAMPLE SIMULATION
                                            </span>
                                            <EvidenceTag type="estimated" />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
                                            VoxAI Visibility & LLM Citations
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-500">
                                            How ChatGPT, Perplexity, and Gemini recommend your business for regional queries.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-600">Perplexity Citation Rate</span>
                                            <EvidenceTag type="estimated" />
                                        </div>
                                        <p className="text-3xl font-black text-slate-900 tabular-nums">68%</p>
                                        <p className="text-[11px] text-slate-500">Based on 12 localized cosmetic dentistry queries.</p>
                                    </div>

                                    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-600">ChatGPT Search Grounding</span>
                                            <EvidenceTag type="estimated" />
                                        </div>
                                        <p className="text-3xl font-black text-amber-600 tabular-nums">45%</p>
                                        <p className="text-[11px] text-slate-500">Competitors cited more frequently in Fairfax, VA.</p>
                                    </div>

                                    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-600">Google Gemini Live Grounding</span>
                                            <EvidenceTag type="estimated" />
                                        </div>
                                        <p className="text-3xl font-black text-emerald-600 tabular-nums">79%</p>
                                        <p className="text-[11px] text-slate-500">Strong presence on Google Business Profile nodes.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SPRINT 2 VIEW: ONBOARDING WIZARD */}
                        {activeNav === 'onboarding' && (
                            <OnboardingWizard
                                t={t}
                                isRtl={isRtl}
                                initialRole={currentRole}
                                onComplete={(configuredData) => {
                                    if (configuredData.role && setUserRole) {
                                        handleRoleChange(configuredData.role);
                                    }
                                    setActiveNav('create_audit');
                                }}
                                onCancel={() => setActiveNav('dashboard')}
                            />
                        )}

                        {/* SPRINT 2 VIEW: BUSINESS PROFILE */}
                        {activeNav === 'business_profile' && (
                            <BusinessProfileSection
                                client={activeClient}
                                t={t}
                                isRtl={isRtl}
                                onSaveClient={(updatedProfile) => {
                                    setActiveClient(prev => ({ ...prev, ...updatedProfile, name: updatedProfile.brandName || prev.name }));
                                }}
                            />
                        )}

                        {/* SPRINT 2 VIEW: CREATE AUDIT WIZARD (STEPS A–E) */}
                        {activeNav === 'create_audit' && (
                            <CreateAuditWizard
                                client={activeClient}
                                t={t}
                                isRtl={isRtl}
                                onLaunchAudit={(auditConfig) => {
                                    setLaunchedConfig(auditConfig);
                                    setActiveNav('audit_progress');
                                }}
                                onCancel={() => setActiveNav('dashboard')}
                            />
                        )}

                        {/* SPRINT 2 VIEW: AUDIT PROGRESS CENTER */}
                        {activeNav === 'audit_progress' && (
                            <AuditProgressCenter
                                auditConfig={launchedConfig || { client: activeClient }}
                                t={t}
                                isRtl={isRtl}
                                onOpenOverview={() => setActiveNav('intelligence_overview')}
                            />
                        )}

                        {/* OTHER SUB-VIEWS FALLBACK */}
                        {!['dashboard', 'onboarding', 'business_profile', 'create_audit', 'audit_progress', 'intelligence_overview', 'intelligence_seo', 'intelligence_social', 'intelligence_ai'].includes(activeNav) && (
                            <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto text-2xl shadow-xs">
                                    <i className="fa-regular fa-folder-open"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 capitalize">
                                    {t.navItems[activeNav] || activeNav.replace('_', ' ')}
                                </h3>
                                <p className="text-xs text-slate-500 max-w-md mx-auto">
                                    This screen is scheduled for Sprint 3 & 4 in accordance with the VA-Intelligence-Design milestone roadmap.
                                </p>
                                <button
                                    onClick={() => setActiveNav('dashboard')}
                                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        )}

                    </main>
                </div>
            </div>

            {/* Global Search Modal (⌘K) */}
            {showSearchModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
                    <div className="bg-[#0F111D] border border-[#1E2235] rounded-2xl p-4 max-w-lg w-full text-slate-200 space-y-4 shadow-2xl animate-fade-in">
                        <div className="flex items-center gap-3 pb-3 border-b border-[#1E2235]">
                            <i className="fa-solid fa-magnifying-glass text-slate-500"></i>
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search across audits, findings, clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent text-sm text-white focus:outline-none w-full"
                            />
                            <button
                                onClick={() => setShowSearchModal(false)}
                                className="text-xs text-slate-500 hover:text-white"
                            >
                                ESC
                            </button>
                        </div>
                        <div className="space-y-1 text-xs">
                            <span className="text-[10px] font-mono text-slate-500 uppercase px-2">Quick Navigation</span>
                            <button
                                onClick={() => { setActiveNav('dashboard'); setShowSearchModal(false); }}
                                className="w-full text-start px-3 py-2 rounded-xl hover:bg-white/5 flex items-center justify-between"
                            >
                                <span>Workspace Dashboard</span>
                                <span className="font-mono text-slate-500 text-[10px]">Jump ↵</span>
                            </button>
                            <button
                                onClick={() => { setActiveNav('intelligence_seo'); setShowSearchModal(false); }}
                                className="w-full text-start px-3 py-2 rounded-xl hover:bg-white/5 flex items-center justify-between"
                            >
                                <span>VoxSEO Technical Scorecard</span>
                                <span className="font-mono text-slate-500 text-[10px]">Jump ↵</span>
                            </button>
                            <button
                                onClick={() => { setActiveNav('intelligence_social'); setShowSearchModal(false); }}
                                className="w-full text-start px-3 py-2 rounded-xl hover:bg-white/5 flex items-center justify-between"
                            >
                                <span>VoxSocial Intelligence</span>
                                <span className="font-mono text-slate-500 text-[10px]">Jump ↵</span>
                            </button>
                            <button
                                onClick={() => { setActiveNav('create_audit'); setShowSearchModal(false); }}
                                className="w-full text-start px-3 py-2 rounded-xl hover:bg-white/5 flex items-center justify-between text-cyan-400 font-bold"
                            >
                                <span>Create New Growth Audit (Steps A–E)</span>
                                <span className="font-mono text-cyan-400 text-[10px]">Jump ↵</span>
                            </button>
                            <button
                                onClick={() => { setActiveNav('audit_progress'); setShowSearchModal(false); }}
                                className="w-full text-start px-3 py-2 rounded-xl hover:bg-white/5 flex items-center justify-between"
                            >
                                <span>Audit Progress Center (Real-Time Monitor)</span>
                                <span className="font-mono text-slate-500 text-[10px]">Jump ↵</span>
                            </button>
                            <button
                                onClick={() => { setActiveNav('business_profile'); setShowSearchModal(false); }}
                                className="w-full text-start px-3 py-2 rounded-xl hover:bg-white/5 flex items-center justify-between"
                            >
                                <span>Business Profile & Locations</span>
                                <span className="font-mono text-slate-500 text-[10px]">Jump ↵</span>
                            </button>
                            <button
                                onClick={() => { setActiveNav('onboarding'); setShowSearchModal(false); }}
                                className="w-full text-start px-3 py-2 rounded-xl hover:bg-white/5 flex items-center justify-between text-amber-400"
                            >
                                <span>Onboarding Wizard (6 Steps)</span>
                                <span className="font-mono text-amber-400 text-[10px]">Jump ↵</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutModal(false)}
            />
        </div>
    );
}
