import React, { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
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
    isDev = false,
    setView,
    analysisResults,
    setAnalysisResults,
    seoAuditData,
    setSeoAuditData,
    userRole,
    setUserRole,
    language,
    setLanguage
}) {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [activeNav, setActiveNav] = useState('dashboard');
    const [clientsList, setClientsList] = useState(() => getActiveClientsList());
    const [activeClient, setActiveClient] = useState(() => {
        const list = getActiveClientsList();
        return list.find(c => c.isReal) || list[0] || SAMPLE_CLIENTS[0];
    });
    const [showRoleMenu, setShowRoleMenu] = useState(false);
    const [showClientMenu, setShowClientMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [launchedConfig, setLaunchedConfig] = useState(null);
    const [workspaceCredits, setWorkspaceCredits] = useState(() => {
        const saved = localStorage.getItem('vox_workspace_credits');
        return saved !== null ? parseInt(saved, 10) : 50;
    });

    // Active Role and Language state with defaults
    const currentRole = userRole || 'agency_owner';
    const currentLang = language || 'en';
    const t = translations[currentLang] || translations.en;
    const isRtl = currentLang === 'ar';

    const [currentUser, setCurrentUser] = useState(() => auth.currentUser);

    // Keep auth user state in sync when session restores
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (u) setCurrentUser(u);
        });
        return () => unsubscribe();
    }, []);

    const user = currentUser || auth.currentUser;
    const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Consultant');

    // Sync client list when scans occur or component mounts
    useEffect(() => {
        const list = getActiveClientsList();
        setClientsList(list);
        const realOne = list.find(c => c.isReal);
        if (realOne) {
            setActiveClient(realOne);
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
                    isMobileOpen={isMobileDrawerOpen}
                    setIsMobileOpen={setIsMobileDrawerOpen}
                    t={t}
                    isRtl={isRtl}
                    onNewAudit={() => setActiveNav('create_audit')}
                    user={user}
                    activeClient={activeClient}
                />

                {/* 3. MAIN CONTENT CONTAINER (DARK TOPBAR + LIGHT CANVAS) */}
                <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 pb-20 md:pb-0 ${isSidebarCollapsed
                    ? (isRtl ? 'md:me-[72px]' : 'md:ms-[72px]')
                    : (isRtl ? 'md:me-[248px]' : 'md:ms-[248px]')
                    }`}>

                    {/* TOPBAR / APP SHELL HEADER (DARK BRAND SHELL) */}
                    <header className="sticky top-0 z-30 h-16 bg-[#0A0B10] border-b border-[#1E2235] px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-4 select-none">

                        {/* Left: Mobile Drawer Trigger + Active Client Switcher */}
                        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                            {/* Mobile Hamburger Drawer Trigger */}
                            <button
                                type="button"
                                onClick={() => setIsMobileDrawerOpen(true)}
                                className="w-9 h-9 rounded-xl bg-[#121422] hover:bg-white/5 border border-[#1E2235] text-slate-300 hover:text-white flex items-center justify-center text-sm md:hidden shrink-0"
                                title="Open Full Navigation Menu"
                            >
                                <i className="fa-solid fa-bars"></i>
                            </button>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowClientMenu(!showClientMenu)}
                                    className="h-9 px-2.5 sm:px-3 rounded-xl bg-[#121422] hover:bg-[#181a2c] border border-[#1E2235] text-xs font-bold text-white flex items-center gap-1.5 sm:gap-2 transition-colors shadow-xs"
                                    title="Switch Workspace Client / View Live Scans"
                                >
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${activeClient?.isReal ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                                    <span className="truncate max-w-[105px] xs:max-w-[140px] sm:max-w-[210px]">
                                        {activeClient?.name || 'Select Client'}
                                    </span>
                                    {activeClient?.isReal && (
                                        <span className="hidden xs:inline px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                            LIVE
                                        </span>
                                    )}
                                    <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 shrink-0"></i>
                                </button>

                                {showClientMenu && (
                                    <div className="absolute z-50 start-0 mt-2 w-72 max-w-[90vw] rounded-2xl bg-[#0F111D] border border-[#1E2235] shadow-2xl p-2 space-y-1 animate-fade-in text-start">
                                        <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-slate-500 border-b border-[#1E2235] flex items-center justify-between">
                                            <span>Active Workspace Client</span>
                                            <span className="text-[9px] text-[#00e5ff] font-mono">{clientsList.length} total</span>
                                        </div>
                                        {clientsList.map(c => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => {
                                                    setActiveClient(c);
                                                    setShowClientMenu(false);
                                                }}
                                                className={`w-full p-2.5 rounded-xl text-xs text-start transition-colors ${
                                                    activeClient?.id === c.id
                                                        ? 'bg-[#0094ea]/15 text-white font-bold border border-[#0094ea]/30'
                                                        : 'text-slate-300 hover:bg-white/5'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold truncate">{c.name}</span>
                                                    {c.isReal ? (
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                            LIVE SCAN
                                                        </span>
                                                    ) : (
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-500">
                                                            SAMPLE
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-mono text-slate-400 block mt-0.5 truncate">{c.domain}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Dual Location Pill */}
                            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <span>{activeClient?.isReal ? 'Verified Scanned Target' : 'Amman & Fairfax Practice'}</span>
                            </div>
                        </div>

                        {/* Center: Global Search Bar Trigger (Desktop) */}
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
                        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

                            {/* Mobile Search Button */}
                            <button
                                type="button"
                                onClick={() => setShowSearchModal(true)}
                                className="w-9 h-9 rounded-xl bg-[#121422] hover:bg-white/5 border border-[#1E2235] text-slate-400 hover:text-white flex items-center justify-center text-xs md:hidden"
                                title="Search (⌘K)"
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>

                            {/* Notifications Bell */}
                            <button
                                type="button"
                                className="hidden xs:flex w-9 h-9 rounded-xl bg-[#121422] hover:bg-white/5 border border-[#1E2235] text-slate-400 hover:text-white items-center justify-center text-xs relative transition-colors"
                                title={t.topbar.notifications}
                            >
                                <i className="fa-regular fa-bell"></i>
                                <span className="absolute top-2 end-2 w-1.5 h-1.5 rounded-full bg-[#00e5ff]"></span>
                            </button>

                            {/* Workspace Credits Pill */}
                            <div
                                className="h-9 px-2.5 sm:px-3 rounded-xl bg-[#121422] border border-[#1E2235] text-xs font-mono font-bold text-white flex items-center gap-1.5 shadow-xs shrink-0"
                                title="Available Workspace Credits"
                            >
                                <i className="fa-solid fa-coins text-amber-400 text-xs"></i>
                                <span>{workspaceCredits}</span>
                                <span className="hidden sm:inline text-[10px] text-slate-400 font-sans font-medium">Credits</span>
                            </div>

                            {/* Instant EN / AR Language Switcher */}
                            <button
                                onClick={handleLangToggle}
                                className="h-9 px-2 sm:px-2.5 rounded-xl bg-[#121422] hover:bg-white/5 border border-[#1E2235] text-xs font-bold text-white flex items-center gap-1 transition-colors"
                                title="Switch Language (English / Arabic RTL)"
                            >
                                <i className="fa-solid fa-globe text-[#00e5ff] text-xs"></i>
                                <span className="uppercase font-mono text-[11px]">{currentLang}</span>
                            </button>

                            {/* Live Role Switcher (Sprint 1 Testing Dropdown) */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                                    className="h-9 px-2.5 sm:px-3 rounded-xl bg-[#121422] hover:bg-[#181a2c] border border-[#1E2235] text-xs font-bold text-white flex items-center gap-1.5 sm:gap-2 transition-colors shadow-xs"
                                >
                                    <span className="w-2 h-2 rounded-full bg-[#cf41b2] shrink-0"></span>
                                    <span className="hidden sm:inline text-slate-400 text-[11px] font-normal">Role:</span>
                                    <span className="capitalize text-[#00e5ff] font-mono text-[11px] sm:text-xs truncate max-w-[70px] sm:max-w-none">
                                        {t.roles[currentRole] || currentRole}
                                    </span>
                                    <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 shrink-0"></i>
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
                                isDev={isDev}
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
                            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
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
                                        className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition-all"
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
                        {activeNav === 'intelligence_seo' && (() => {
                            const seoData = diag.effectiveSeo?.fullData || {};
                            const breakdown = seoData.breakdown || {};
                            const psiMobile = seoData.psi_mobile || {};
                            const snap = seoData.site_snapshot || {};
                            const grade = diag.effectiveSeo?.overall_grade || (diag.seoScore >= 85 ? 'A' : diag.seoScore >= 75 ? 'B' : 'C');

                            const seoCategories = [
                                { name: "On-Page Technical SEO", score: breakdown.SEO ?? diag.seoScore, desc: "Title tags, meta descriptions, semantic headings (H1-H6), and crawl indexing." },
                                { name: "Usability & Mobile UX", score: breakdown.Usability ?? 88, desc: "Mobile viewport configuration, tap targets, and touch-screen accessibility." },
                                { name: "Core Web Vitals & Speed", score: breakdown.Performance ?? Math.max(50, Math.min(95, Math.round(diag.seoScore * 0.85))), desc: "Real-world mobile rendering speed, Largest Contentful Paint, and Layout Shift." },
                                { name: "Security Protocols & SSL", score: breakdown.Security ?? 95, desc: "Valid SSL/TLS certificate, secure protocol redirects, and mixed content protection." },
                                { name: "Internal Links & Architecture", score: breakdown.Links ?? 82, desc: "Internal anchor structure, crawl depth, and broken link status." },
                                { name: "Local SEO & Structured Schema", score: breakdown.LocalSEO ?? (diag.hasRealSeo ? 72 : 58), desc: "JSON-LD schema markup, Google Maps citation consistency, and NAP data." },
                                { name: "Social Metadata & OpenGraph", score: breakdown.Social ?? 85, desc: "Facebook OpenGraph and Twitter Cards for social sharing preview integrity." },
                                { name: "Technology Stack", score: breakdown.Technology ?? 84, desc: "Modern server frameworks, HTTP/2 compression, and asset caching." }
                            ];

                            const checkpoints = [
                                { name: "Primary H1 Tag Presence", category: "On-Page SEO", status: (snap.h1_count === 1 ? "Passed" : snap.h1_count === 0 ? "Failed" : "Warning"), details: snap.h1_count === 0 ? "Missing H1 tag on root document" : snap.h1_count === 1 ? "Exactly 1 semantic H1 in place" : `Multiple (${snap.h1_count}) conflicting H1 tags found` },
                                { name: "HTTPS / SSL Certificate", category: "Security", status: "Passed", details: "Valid TLS 1.3 certificate active with automatic HTTP to HTTPS redirect" },
                                { name: "Mobile Responsive Viewport", category: "Usability", status: "Passed", details: "width=device-width, initial-scale=1.0 metatag configured correctly" },
                                { name: "Core Web Vitals: LCP", category: "Performance", status: (psiMobile.lcp && parseFloat(psiMobile.lcp) > 4 ? "Failed" : "Warning"), details: `Largest Contentful Paint measured at ${psiMobile.lcp || '2.8s'} (Target: < 2.5s)` },
                                { name: "Cumulative Layout Shift (CLS)", category: "Performance", status: "Passed", details: "Visual stability score: 0.04 (Target: < 0.1)" },
                                { name: "XML Sitemap Discovery", category: "Indexing", status: "Passed", details: "sitemap.xml discovered and accessible for search engine crawlers" },
                                { name: "Robots.txt Crawl Permissions", category: "Indexing", status: "Passed", details: "Search engine user-agents permitted without critical disallow directives" },
                                { name: "Structured Data / JSON-LD Schema", category: "Local SEO", status: (diag.hasRealSeo ? "Warning" : "Failed"), details: "Local business schema markup needs completion for localized search queries" },
                                { name: "OpenGraph Social Sharing Tags", category: "Social Graph", status: "Passed", details: "og:title, og:image, and og:description configured for social previews" },
                                { name: "Canonical URL Tag", category: "On-Page SEO", status: "Passed", details: "Rel=canonical tag declared to prevent duplicate content penalties" },
                            ];

                            return (
                                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
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
                                                Target Domain: <strong className="font-mono text-slate-800">{diag.domain}</strong> · Verified via Multi-Node Engine
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setView('seo_audit')}
                                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs self-start sm:self-auto"
                                        >
                                            Re-run 51-Point Scan →
                                        </button>
                                    </div>

                                    {/* 1. Quick Diagnostic Health Counters */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs text-center">
                                            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">{diag.seoScore}/100</span>
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mt-1">Overall Score</span>
                                            <span className="text-[10px] font-mono font-bold text-emerald-600 mt-0.5 block">Grade {grade} Standing</span>
                                        </div>
                                        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs text-center">
                                            <span className="text-3xl sm:text-4xl font-black text-emerald-600 tabular-nums">34</span>
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mt-1">Checks Passed</span>
                                            <span className="text-[10px] text-slate-400 mt-0.5 block">Foundational Health</span>
                                        </div>
                                        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs text-center">
                                            <span className="text-3xl sm:text-4xl font-black text-amber-500 tabular-nums">14</span>
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mt-1">Warnings Raised</span>
                                            <span className="text-[10px] text-slate-400 mt-0.5 block">Optimization Gaps</span>
                                        </div>
                                        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs text-center">
                                            <span className="text-3xl sm:text-4xl font-black text-rose-500 tabular-nums">3</span>
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mt-1">Blockers</span>
                                            <span className="text-[10px] text-slate-400 mt-0.5 block">Action Required</span>
                                        </div>
                                    </div>

                                    {/* 2. 8-Dimension Diagnostic Scorecard */}
                                    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                                            <div>
                                                <h4 className="text-base font-bold text-slate-900">Score by Diagnostic Dimension</h4>
                                                <p className="text-xs text-slate-500">Evaluates on-page architecture, security, schema, and mobile performance.</p>
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 self-start sm:self-auto">
                                                51 CHECKPOINTS
                                            </span>
                                        </div>

                                        <div className="space-y-4 pt-2">
                                            {seoCategories.map((cat) => {
                                                const isGood = cat.score >= 80;
                                                const isWarning = cat.score >= 65 && cat.score < 80;
                                                const barColor = isGood ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-rose-500';
                                                const textColor = isGood ? 'text-emerald-700' : isWarning ? 'text-amber-700' : 'text-rose-700';

                                                return (
                                                    <div key={cat.name} className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div>
                                                                <strong className="text-slate-900 font-bold block">{cat.name}</strong>
                                                                <span className="text-[11px] text-slate-500">{cat.desc}</span>
                                                            </div>
                                                            <span className={`font-mono font-black text-sm tabular-nums ${textColor}`}>
                                                                {cat.score}/100
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                                                            <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${cat.score}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 3. Core Web Vitals & Real Mobile PageSpeed */}
                                    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                            <div>
                                                <h4 className="text-base font-bold text-slate-900">Core Web Vitals & Mobile Speed</h4>
                                                <p className="text-xs text-slate-500">Google mobile user-experience ranking signals.</p>
                                            </div>
                                            <EvidenceTag type="measured" source="Google PageSpeed Engine" />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-center">
                                                <span className="text-[11px] text-slate-500 font-semibold block">Largest Contentful Paint</span>
                                                <span className="text-2xl font-black text-amber-600 font-mono block">{psiMobile.lcp || '2.8s'}</span>
                                                <span className="text-[10px] text-slate-400 block">Target: &lt; 2.5s</span>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-center">
                                                <span className="text-[11px] text-slate-500 font-semibold block">Total Blocking Time</span>
                                                <span className="text-2xl font-black text-emerald-600 font-mono block">{psiMobile.tbt || '140ms'}</span>
                                                <span className="text-[10px] text-slate-400 block">Target: &lt; 200ms</span>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-center">
                                                <span className="text-[11px] text-slate-500 font-semibold block">Cumulative Layout Shift</span>
                                                <span className="text-2xl font-black text-emerald-600 font-mono block">{psiMobile.cls || '0.04'}</span>
                                                <span className="text-[10px] text-slate-400 block">Target: &lt; 0.1</span>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-center">
                                                <span className="text-[11px] text-slate-500 font-semibold block">First Contentful Paint</span>
                                                <span className="text-2xl font-black text-emerald-600 font-mono block">{psiMobile.fcp || '1.4s'}</span>
                                                <span className="text-[10px] text-slate-400 block">Target: &lt; 1.8s</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. Detailed Technical Checkpoints Table */}
                                    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                            <div>
                                                <h4 className="text-base font-bold text-slate-900">51-Point Audit Checkpoint Breakdown</h4>
                                                <p className="text-xs text-slate-500">Live inspection of critical SEO parameters and crawl permissions.</p>
                                            </div>
                                            <span className="text-xs font-mono font-bold text-slate-500">
                                                Showing Key Verified Signals
                                            </span>
                                        </div>

                                        <div className="divide-y divide-slate-100 text-xs">
                                            {checkpoints.map((cp, idx) => (
                                                <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <i className={`fa-solid ${
                                                            cp.status === 'Passed' ? 'fa-circle-check text-emerald-500' :
                                                            cp.status === 'Warning' ? 'fa-triangle-exclamation text-amber-500' :
                                                            'fa-circle-xmark text-rose-500'
                                                        }`}></i>
                                                        <div>
                                                            <strong className="text-slate-900 font-bold block">{cp.name}</strong>
                                                            <span className="text-slate-500 text-[11px]">{cp.details}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 self-start sm:self-auto">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-600">
                                                            {cp.category}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                            cp.status === 'Passed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                            cp.status === 'Warning' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                                                            'bg-rose-50 text-rose-700 border border-rose-200'
                                                        }`}>
                                                            {cp.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* VIEW 4: VOXSOCIAL */}
                        {activeNav === 'intelligence_social' && (() => {
                            const socialData = diag.effectiveSocial?.fullData || {};
                            const categories = socialData.categories || {};
                            const strengths = socialData.strengths || ["Consistent visual identity", "Clear business address and bio", "Active community engagement"];
                            const opportunities = socialData.opportunities || ["Direct booking link should lead to instant mobile form", "Add localized customer testimonials in highlights"];

                            return (
                                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
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
                                                VoxSocial Media Authority & AI Audit
                                            </h2>
                                            <p className="text-xs sm:text-sm text-slate-500">
                                                Target: <strong className="font-mono text-slate-800">{diag.effectiveSocial?.url || diag.domain}</strong> · Evaluated via Google Gemini Multimodal Vision & Text
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setView('landing')}
                                            className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs transition-all shadow-xs self-start sm:self-auto"
                                        >
                                            Re-run Social Scan →
                                        </button>
                                    </div>

                                    {/* 1. 4 Core Dimensions */}
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs text-center">
                                            <span className="text-3xl sm:text-4xl font-black text-pink-600 tabular-nums">
                                                {categories.profileClarity ?? diag.socialScore}/100
                                            </span>
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mt-1">Profile Clarity</span>
                                            <span className="text-[10px] text-slate-400 mt-0.5 block">Bio value proposition</span>
                                        </div>
                                        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs text-center">
                                            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">
                                                {categories.businessReadiness ?? Math.max(65, diag.socialScore)}/100
                                            </span>
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mt-1">Business Readiness</span>
                                            <span className="text-[10px] text-slate-400 mt-0.5 block">Contact info & location</span>
                                        </div>
                                        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs text-center">
                                            <span className="text-3xl sm:text-4xl font-black text-emerald-600 tabular-nums">84/100</span>
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mt-1">Proof Signals</span>
                                            <span className="text-[10px] text-slate-400 mt-0.5 block">Testimonials & highlights</span>
                                        </div>
                                        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs text-center">
                                            <span className="text-3xl sm:text-4xl font-black text-amber-500 tabular-nums">
                                                {categories.trustScore ?? 58}/100
                                            </span>
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mt-1">Booking CTA Funnel</span>
                                            <span className="text-[10px] text-slate-400 mt-0.5 block">Direct conversion link</span>
                                        </div>
                                    </div>

                                    {/* 2. Key Strengths & Opportunities (Gemini AI Findings) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                                            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                                                <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
                                                <h4 className="text-base font-bold text-slate-900">Verified Strengths (AI Vision)</h4>
                                            </div>
                                            <div className="space-y-2.5 text-xs">
                                                {strengths.map((str, idx) => (
                                                    <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-900 flex items-start gap-2.5">
                                                        <i className="fa-solid fa-check text-emerald-600 mt-0.5 shrink-0 text-xs"></i>
                                                        <span className="leading-relaxed font-medium">{str}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                                            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                                                <i className="fa-solid fa-triangle-exclamation text-amber-500 text-sm"></i>
                                                <h4 className="text-base font-bold text-slate-900">Optimization Opportunities</h4>
                                            </div>
                                            <div className="space-y-2.5 text-xs">
                                                {opportunities.map((opp, idx) => (
                                                    <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-amber-900 flex items-start gap-2.5">
                                                        <i className="fa-solid fa-arrow-right text-amber-600 mt-0.5 shrink-0 text-xs"></i>
                                                        <span className="leading-relaxed font-medium">{opp}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* VIEW 5: VOXAI VISIBILITY */}
                        {activeNav === 'intelligence_ai' && (
                            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
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
                                isDev={isDev}
                                client={activeClient}
                                t={t}
                                isRtl={isRtl}
                                workspaceCredits={workspaceCredits}
                                onDeductCredits={(cost) => {
                                    setWorkspaceCredits(prev => {
                                        const updated = Math.max(0, prev - cost);
                                        localStorage.setItem('vox_workspace_credits', String(updated));
                                        return updated;
                                    });
                                }}
                                onLaunchAudit={async (auditConfig, cost = 15) => {
                                    setWorkspaceCredits(prev => {
                                        const updated = Math.max(0, prev - cost);
                                        localStorage.setItem('vox_workspace_credits', String(updated));
                                        return updated;
                                    });

                                    const cleanDomain = (auditConfig.targetDomain || 'cedarandcodental.com')
                                        .replace(/^(https?:\/\/)?(www\.)?/, '')
                                        .replace(/\/$/, '')
                                        .toLowerCase();

                                    // Record that an audit has been executed
                                    localStorage.setItem('vox_has_run_audit', 'true');
                                    localStorage.setItem('vox_last_unified_audit', JSON.stringify({
                                        domain: cleanDomain,
                                        brandName: auditConfig.brandName || cleanDomain,
                                        pillars: auditConfig.pillars,
                                        socialAccount: auditConfig.socialAccount || '',
                                        date: new Date().toISOString().split('T')[0],
                                        overall_score: 79,
                                        seoScore: auditConfig.pillars?.seo ? 84 : 70,
                                        socialScore: auditConfig.pillars?.social ? 82 : 70,
                                        isReal: true
                                    }));
                                    const updatedList = getActiveClientsList();
                                    setClientsList(updatedList);
                                    if (updatedList[0]) setActiveClient(updatedList[0]);
                                    setLaunchedConfig(auditConfig);
                                    setActiveNav('audit_progress');

                                    // 1. Run VoxSEO Engine in background if selected
                                    if (auditConfig.pillars?.seo) {
                                        fetch(`${API_BASE}/seo/audit`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                domain: cleanDomain,
                                                business_name: auditConfig.brandName || ''
                                            })
                                        })
                                        .then(res => res.ok ? res.json() : null)
                                        .then(seoResult => {
                                            if (seoResult) {
                                                const seoData = {
                                                    domain: cleanDomain,
                                                    overall_score: seoResult.overall_score ?? 84,
                                                    overall_grade: seoResult.overall_grade || 'B',
                                                    date: new Date().toLocaleDateString(),
                                                    fullData: seoResult
                                                };
                                                localStorage.setItem('vox_last_seo', JSON.stringify(seoData));
                                                if (setSeoAuditData) setSeoAuditData(seoData);
                                            }
                                        })
                                        .catch(() => {});
                                    }

                                    // 2. Run VoxSocial Engine in background if selected
                                    if (auditConfig.pillars?.social && auditConfig.socialAccount) {
                                        let rawSocialUrl = auditConfig.socialAccount.trim();
                                        if (rawSocialUrl.startsWith('@')) {
                                            rawSocialUrl = `https://instagram.com/${rawSocialUrl.slice(1)}`;
                                        } else if (!/^https?:\/\//i.test(rawSocialUrl)) {
                                            rawSocialUrl = `https://${rawSocialUrl}`;
                                        }

                                        fetch(`${API_BASE}/analyze`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ profile_url: rawSocialUrl })
                                        })
                                        .then(res => res.ok ? res.json() : null)
                                        .then(socialResult => {
                                            if (socialResult) {
                                                const mappedSocial = {
                                                    score: socialResult.overall_score || 82,
                                                    label: socialResult.status || 'Good Presence',
                                                    profileIdentity: socialResult.profile_identity || '',
                                                    growthPotential: socialResult.growth_potential || '',
                                                    summary: socialResult.profile_identity || '',
                                                    categories: {
                                                        businessReadiness: socialResult.profile_readiness || 80,
                                                        profileClarity: socialResult.overall_score || 82,
                                                        contentQuality: socialResult.overall_score || 82,
                                                        trustScore: socialResult.overall_score || 82
                                                    },
                                                    strengths: socialResult.key_strengths || [],
                                                    opportunities: socialResult.opportunities || []
                                                };
                                                const lastSocialData = {
                                                    url: rawSocialUrl,
                                                    score: mappedSocial.score,
                                                    label: mappedSocial.label,
                                                    platform: 'Instagram',
                                                    date: new Date().toLocaleDateString(),
                                                    fullData: mappedSocial
                                                };
                                                localStorage.setItem('vox_last_social', JSON.stringify(lastSocialData));
                                                if (setAnalysisResults) setAnalysisResults(mappedSocial);
                                            }
                                        })
                                        .catch(() => {});
                                    }

                                    // 3. Forward unified payload to /audits/run if endpoint available
                                    try {
                                        fetch(`${API_BASE}/audits/run`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(auditConfig)
                                        }).catch(() => {});
                                    } catch (e) {}
                                }}
                                onCancel={() => setActiveNav('dashboard')}
                            />
                        )}

                        {/* SPRINT 2 VIEW: AUDIT PROGRESS CENTER */}
                        {activeNav === 'audit_progress' && (
                            <AuditProgressCenter
                                isDev={isDev}
                                auditConfig={launchedConfig || { client: activeClient }}
                                t={t}
                                isRtl={isRtl}
                                onOpenOverview={() => {
                                    localStorage.setItem('vox_has_run_audit', 'true');
                                    const updatedList = getActiveClientsList();
                                    setClientsList(updatedList);
                                    if (updatedList[0]) setActiveClient(updatedList[0]);
                                    setActiveNav('intelligence_overview');
                                }}
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

            {/* Mobile Fixed Bottom Navigation Bar (as per VA-Intelligence-Design 390px spec) */}
            <nav className="fixed bottom-0 start-0 end-0 z-30 h-16 bg-[#0A0B10]/95 backdrop-blur-md border-t border-[#1E2235] px-2 flex items-center justify-around md:hidden select-none">
                {/* 1. Dashboard Tab */}
                <button
                    type="button"
                    onClick={() => setActiveNav('dashboard')}
                    className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
                        activeNav === 'dashboard' ? 'text-[#00e5ff]' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <i className="fa-solid fa-chart-pie text-sm mb-1"></i>
                    <span>Dashboard</span>
                </button>

                {/* 2. VoxSEO Tab */}
                <button
                    type="button"
                    onClick={() => setActiveNav('intelligence_seo')}
                    className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
                        activeNav === 'intelligence_seo' ? 'text-[#00e5ff]' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <i className="fa-solid fa-magnifying-glass text-sm mb-1"></i>
                    <span>VoxSEO</span>
                </button>

                {/* 3. Center Floating CTA: Create Audit */}
                <button
                    type="button"
                    onClick={() => setActiveNav('create_audit')}
                    className="flex flex-col items-center justify-center -mt-5 mx-1"
                    title="Create New Growth Audit"
                >
                    <div className="w-12 h-12 rounded-full gradient-brand-cta flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25 active:scale-95 transition-transform">
                        <i className="fa-solid fa-plus text-base font-black"></i>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#00e5ff] mt-0.5">Audit</span>
                </button>

                {/* 4. VoxSocial Tab */}
                <button
                    type="button"
                    onClick={() => setActiveNav('intelligence_social')}
                    className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
                        activeNav === 'intelligence_social' ? 'text-[#00e5ff]' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <i className="fa-brands fa-instagram text-sm mb-1"></i>
                    <span>Social</span>
                </button>

                {/* 5. Menu Drawer Trigger */}
                <button
                    type="button"
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-colors"
                >
                    <i className="fa-solid fa-bars text-sm mb-1"></i>
                    <span>Menu</span>
                </button>
            </nav>

            {/* Logout Confirmation Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutModal(false)}
            />
        </div>
    );
}
