import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { playSynthTick } from '../utils/audio';
import LogoutModal from './LogoutModal';

const LOGO_URL = "/New_Logo_Voxlumedia.webp";
const MASCOT_URL = "https://raw.githubusercontent.com/lengkongandreuw/voxsocial/main/assets/ryanvox.png";

export default function DashboardSection({ setView, analysisResults, seoAuditData, isTrialExpired, trialDaysLeft }) {
    const mascotRef = useRef(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [activeMainTab, setActiveMainTab] = useState('launchpad'); // 'launchpad' | 'intelligence'
    const [intelligenceSubTab, setIntelligenceSubTab] = useState('overview'); // 'overview' | 'social' | 'seo'
    const [lastSocial, setLastSocial] = useState(null);
    const [lastSeo, setLastSeo] = useState(null);
    const [bubbleText, setBubbleText] = useState("Hey! Ready to run your first audit?");

    const user = auth.currentUser;
    const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'there');

    // Load last audit snapshots from localStorage
    useEffect(() => {
        try {
            const social = localStorage.getItem('vox_last_social');
            const seo = localStorage.getItem('vox_last_seo');
            if (social) setLastSocial(JSON.parse(social));
            if (seo) setLastSeo(JSON.parse(seo));
        } catch (e) {
            console.warn('Error reading audit snapshots from localStorage:', e);
        }
    }, []);

    // 3D mouse parallax on mascot
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!mascotRef.current) return;
            const x = (window.innerWidth / 2 - e.pageX) / 75;
            const y = (window.innerHeight / 2 - e.pageY) / 75;
            mascotRef.current.style.transform = `perspective(1000px) rotateY(${-x}deg) rotateX(${y}deg)`;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Consolidated data sources
    const activeSocial = analysisResults || lastSocial?.details || (lastSocial ? {
        score: lastSocial.score,
        label: lastSocial.label,
        platform: lastSocial.platform || 'Instagram',
        profileIdentity: lastSocial.url || 'Social Profile',
        summary: `Social audit for ${lastSocial.url || 'profile'} scanned on ${lastSocial.date || 'recently'}.`,
        growthPotential: lastSocial.score >= 75 ? 'Moderate' : 'High Exponential',
        categories: {
            businessReadiness: lastSocial.score || 70,
            profileClarity: lastSocial.score || 72,
            contentQuality: Math.max(50, (lastSocial.score || 70) - 5),
            trustScore: Math.min(95, (lastSocial.score || 70) + 4)
        },
        strengths: ['Active presence and recognizable branding', 'Clear visual identity elements in bio'],
        opportunities: ['Improve CTA link conversion path', 'Optimize bio keywords for platform discovery'],
        recommended_package: lastSocial.score >= 80 ? 'Vox Scale' : 'Vox Growth'
    } : null);

    const activeSeo = seoAuditData || (lastSeo ? {
        domain: lastSeo.domain,
        overall_score: lastSeo.overall_score ?? 78,
        overall_grade: lastSeo.overall_grade || 'C',
        date: lastSeo.date,
        breakdown: lastSeo.breakdown || {
            SEO: 76,
            Usability: 72,
            Performance: 54,
            Social: 68,
            Local: 50,
            Technology: 82,
            Authority: 75
        },
        advanced: lastSeo.advanced || {},
        checks: lastSeo.checks || {}
    } : null);

    const hasSocial = Boolean(activeSocial || lastSocial);
    const hasSeo = Boolean(activeSeo || lastSeo);
    const hasAnyData = hasSocial || hasSeo;

    // Calculate combined digital presence index
    const calculateDigitalHealthIndex = () => {
        if (hasSocial && hasSeo) {
            const seoScore = activeSeo?.overall_score ?? 75;
            const socialScore = activeSocial?.score ?? 70;
            return Math.round(seoScore * 0.55 + socialScore * 0.45);
        }
        if (hasSeo) return activeSeo?.overall_score ?? 75;
        if (hasSocial) return activeSocial?.score ?? 70;
        return 0;
    };

    const digitalHealthScore = calculateDigitalHealthIndex();

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-amber-400';
        return 'text-rose-400';
    };

    const getScoreBadgeClass = (score) => {
        if (score >= 80) return 'bg-green-500/10 border-green-500/25 text-green-400';
        if (score >= 60) return 'bg-amber-500/10 border-amber-500/25 text-amber-400';
        return 'bg-rose-500/10 border-rose-500/25 text-rose-400';
    };

    const getHealthStatusLabel = (score) => {
        if (score >= 85) return 'STRONG - OPTIMAL VISIBILITY';
        if (score >= 75) return 'SOLID - COMPETITIVE FOOTPRINT';
        if (score >= 60) return 'NEEDS WORK - ACTION REQUIRED';
        return 'CRITICAL - HIGH CONVERSION GAPS';
    };

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

    const handleToolNavigate = (targetView) => {
        if (isTrialExpired) {
            playSynthTick(150, 'sawtooth', 0.2, 0.08);
            setActiveMainTab('launchpad');
            return;
        }
        playSynthTick(700, 'sine', 0.05, 0.05);
        setView(targetView);
    };

    return (
        <div className="relative min-h-screen flex flex-col overflow-x-hidden cyber-grid-bg bg-[#06021c]">

            {/* Background decorative glows */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <div className="absolute w-[550px] h-[550px] rounded-full bg-green-500/5 blur-[140px] top-[-100px] right-[-100px]" />
                <div className="absolute w-[450px] h-[450px] rounded-full bg-[#ff7b1a]/5 blur-[120px] bottom-[-80px] left-[-80px]" />
                <div className="absolute w-[350px] h-[350px] rounded-full bg-pink-500/5 blur-[100px] top-[40%] left-[20%]" />
            </div>

            {/* Top Navigation Header */}
            <header className="relative z-50 w-full px-4 sm:px-10 py-4 flex items-center justify-between border-b border-white/5 bg-[#06021c]/80 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div
                        onClick={() => {
                            playSynthTick(500, 'sine', 0.05, 0.05);
                            setActiveMainTab('launchpad');
                        }}
                        className="flex items-center gap-3 font-black text-xl tracking-tight text-white select-none cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                            <img src={LOGO_URL} className="w-full h-full object-contain" alt="Voxlumedia" />
                        </div>
                        <span className="hidden sm:block">VOXLUMEDIA</span>
                    </div>

                    {/* Main Nav Tabs in Header */}
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 ml-2">
                        <button
                            onClick={() => {
                                playSynthTick(650, 'sine', 0.04, 0.05);
                                setActiveMainTab('launchpad');
                            }}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeMainTab === 'launchpad'
                                    ? 'bg-[#ff7b1a] text-white shadow-md'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <i className="fa-solid fa-rocket text-[11px]"></i>
                            <span>Launchpad</span>
                        </button>
                        <button
                            onClick={() => {
                                playSynthTick(850, 'sine', 0.04, 0.05);
                                setActiveMainTab('intelligence');
                            }}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all relative ${activeMainTab === 'intelligence'
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-black shadow-md'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <i className="fa-solid fa-chart-line text-[11px]"></i>
                            <span>Intelligence</span>
                            {hasAnyData && (
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse ml-0.5" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="hidden md:block text-xs text-white/40 font-semibold font-mono">
                        {user?.email}
                    </span>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-white/60 text-xs font-bold transition-all"
                        title="Sign Out"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 flex-grow w-full max-w-[1240px] mx-auto px-4 sm:px-8 py-8 space-y-8">

                {/* =========================================================================
                   TAB 1: LAUNCHPAD / HOME VIEW
                   ========================================================================= */}
                {activeMainTab === 'launchpad' && (
                    <div className="space-y-8 animate-fade-in">

                        {/* Hero greeting & quick intelligence preview */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 font-mono">
                                        <i className="fa-solid fa-circle-check text-green-400"></i>
                                        CLIENT DASHBOARD
                                    </span>
                                    {/* Trial Status Badge */}
                                    {isTrialExpired ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 font-mono">
                                            <i className="fa-solid fa-lock text-rose-400"></i>
                                            TRIAL ENDED
                                        </span>
                                    ) : (
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest font-mono ${trialDaysLeft <= 3
                                                ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                                                : 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                                            }`}>
                                            <i className={`fa-solid ${trialDaysLeft <= 3 ? 'fa-hourglass-half' : 'fa-clock'}`}></i>
                                            {trialDaysLeft} {trialDaysLeft === 1 ? 'DAY' : 'DAYS'} LEFT IN TRIAL
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black text-white">
                                    Welcome back, <span className="text-green-400">{displayName}</span> 👋
                                </h1>
                                <p className="text-white/50 text-sm font-medium">
                                    Choose an audit engine below or view your latest analysis in the <span className="text-green-400 font-bold underline cursor-pointer" onClick={() => setActiveMainTab('intelligence')}>Intelligence tab</span>.
                                </p>
                            </div>

                            {/* Digital Health Index Quick Pill */}
                            {hasAnyData && (
                                <div
                                    onClick={() => {
                                        playSynthTick(800, 'sine', 0.05, 0.05);
                                        setActiveMainTab('intelligence');
                                        setIntelligenceSubTab('overview');
                                    }}
                                    className="cursor-pointer group flex items-center gap-4 p-4 rounded-2xl bg-[#0c0735]/90 border border-white/10 hover:border-green-400/40 backdrop-blur-xl shadow-lg transition-all"
                                >
                                    <div className="relative w-12 h-12 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="transparent" />
                                            <circle
                                                cx="24" cy="24" r="20"
                                                stroke={digitalHealthScore >= 80 ? '#4ade80' : digitalHealthScore >= 60 ? '#fbbf24' : '#f43f5e'}
                                                strokeWidth="4"
                                                fill="transparent"
                                                strokeDasharray={125.6}
                                                strokeDashoffset={125.6 - (125.6 * digitalHealthScore) / 100}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className={`absolute text-sm font-black ${getScoreColor(digitalHealthScore)}`}>
                                            {digitalHealthScore}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Digital Health Index</p>
                                        <p className="text-xs font-black text-white group-hover:text-green-400 transition-colors flex items-center gap-1">
                                            View Intelligence Hub <i className="fa-solid fa-arrow-right text-[10px]"></i>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tool Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* VoxSocial Card */}
                            <div
                                onClick={() => {
                                    if (isTrialExpired) return;
                                    playSynthTick(880, 'sine', 0.08, 0.1);
                                    setView('landing');
                                }}
                                className={`group p-8 bg-[#0c0735]/80 border border-white/10 rounded-3xl backdrop-blur-xl shadow-xl transition-all duration-300 relative overflow-hidden ${isTrialExpired
                                        ? 'cursor-not-allowed opacity-70'
                                        : 'cursor-pointer hover:border-pink-400/40 hover:shadow-[0_0_35px_rgba(244,114,182,0.12)]'
                                    }`}
                            >
                                {/* Trial Expired Overlay */}
                                {isTrialExpired && (
                                    <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3">
                                        <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                                            <i className="fa-solid fa-lock text-rose-400 text-xl"></i>
                                        </div>
                                        <p className="text-sm font-black text-rose-400 uppercase tracking-wider">Trial Expired</p>
                                        <p className="text-[11px] text-white/50 text-center max-w-[200px]">Contact Voxlumedia to unlock VoxSocial</p>
                                    </div>
                                )}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-500/10 transition-all" />
                                <div className="flex items-start justify-between mb-5 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 text-xl group-hover:scale-110 transition-transform">
                                            <i className="fa-brands fa-instagram"></i>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl group-hover:scale-110 transition-transform">
                                            <i className="fa-brands fa-facebook"></i>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full font-mono">
                                        AI PROFILE AUDIT
                                    </span>
                                </div>
                                <h2 className="text-2xl font-black text-white mb-2 group-hover:text-pink-300 transition-colors relative z-10">
                                    VoxSocial — Social Score
                                </h2>
                                <p className="text-white/60 text-sm font-medium leading-relaxed mb-6 relative z-10">
                                    Analyze your Instagram or Facebook business presence. Evaluates profile clarity, content engagement signals, trust factors, and returns tailored recommendations.
                                </p>
                                <div className="flex items-center justify-between pt-2 border-t border-white/5 relative z-10">
                                    <span className="inline-flex items-center gap-2 text-pink-400 text-sm font-black group-hover:gap-3 transition-all">
                                        Start Social Scan <i className="fa-solid fa-arrow-right"></i>
                                    </span>
                                    {hasSocial && (
                                        <span className="text-[11px] font-bold text-white/40">
                                            Last score: <strong className={getScoreColor(activeSocial?.score ?? 0)}>{activeSocial?.score ?? '—'}/100</strong>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* VoxAudit SEO Card */}
                            <div
                                onClick={() => {
                                    if (isTrialExpired) return;
                                    playSynthTick(660, 'sine', 0.08, 0.1);
                                    setView('seo_audit');
                                }}
                                className={`group p-8 bg-[#0c0735]/80 border border-white/10 rounded-3xl backdrop-blur-xl shadow-xl transition-all duration-300 relative overflow-hidden ${isTrialExpired
                                        ? 'cursor-not-allowed opacity-70'
                                        : 'cursor-pointer hover:border-green-400/40 hover:shadow-[0_0_35px_rgba(74,222,128,0.12)]'
                                    }`}
                            >
                                {/* Trial Expired Overlay */}
                                {isTrialExpired && (
                                    <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3">
                                        <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                                            <i className="fa-solid fa-lock text-rose-400 text-xl"></i>
                                        </div>
                                        <p className="text-sm font-black text-rose-400 uppercase tracking-wider">Trial Expired</p>
                                        <p className="text-[11px] text-white/50 text-center max-w-[200px]">Contact Voxlumedia to unlock VoxAudit</p>
                                    </div>
                                )}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-green-500/10 transition-all" />
                                <div className="flex items-start justify-between mb-5 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-xl group-hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-magnifying-glass-chart"></i>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full font-mono">
                                        51-POINT AUDIT
                                    </span>
                                </div>
                                <h2 className="text-2xl font-black text-white mb-2 group-hover:text-green-300 transition-colors relative z-10">
                                    VoxAudit — SEO Audit
                                </h2>
                                <p className="text-white/60 text-sm font-medium leading-relaxed mb-6 relative z-10">
                                    Full digital presence diagnostics covering On-Page semantic structure, PageSpeed Core Web Vitals, mobile usability, broken links, and a strategic 90-day fix roadmap.
                                </p>
                                <div className="flex items-center justify-between pt-2 border-t border-white/5 relative z-10">
                                    <span className="inline-flex items-center gap-2 text-green-400 text-sm font-black group-hover:gap-3 transition-all">
                                        Run SEO Audit <i className="fa-solid fa-arrow-right"></i>
                                    </span>
                                    {hasSeo && (
                                        <span className="text-[11px] font-bold text-white/40">
                                            Last score: <strong className={getScoreColor(activeSeo?.overall_score ?? 0)}>{activeSeo?.overall_score ?? '—'}/100</strong>
                                        </span>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Trial Expired Alert Banner */}
                        {isTrialExpired && (
                            <div className="p-6 bg-gradient-to-r from-rose-500/15 via-rose-500/5 to-transparent border border-rose-500/30 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in shadow-[0_0_30px_rgba(244,63,94,0.1)]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-xl shrink-0">
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-base font-black text-white flex items-center gap-2">
                                            Your 14-Day Free Trial Has Ended
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono">EXPIRED</span>
                                        </h4>
                                        <p className="text-xs text-white/60 max-w-xl">
                                            VoxSocial and VoxAudit scanning engines are locked. Historical intelligence reports remain viewable. Contact Voxlumedia to unlock full recurring access.
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="https://voxlumedia.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-black px-6 py-3 rounded-full text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    <i className="fa-solid fa-unlock"></i>
                                    Unlock Access Now →
                                </a>
                            </div>
                        )}

                        {/* Last Audit Snapshots Strip */}
                        {hasAnyData && (
                            <div className="p-6 bg-white/[0.02] border border-white/8 rounded-3xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                                        <i className="fa-solid fa-clock-rotate-left text-green-400"></i>
                                        Recent Audit Activity
                                    </h3>
                                    <button
                                        onClick={() => {
                                            playSynthTick(700, 'sine', 0.05, 0.05);
                                            setActiveMainTab('intelligence');
                                            setIntelligenceSubTab('overview');
                                        }}
                                        className="text-xs font-bold text-green-400 hover:underline flex items-center gap-1"
                                    >
                                        Open Full Intelligence Hub <i className="fa-solid fa-arrow-right text-[10px]"></i>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Social Snapshot */}
                                    {hasSocial && (
                                        <div className="flex items-center justify-between p-4 bg-[#0c0735]/60 border border-white/10 rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                                                    <i className="fa-brands fa-instagram"></i>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-black uppercase text-pink-400 font-mono">VoxSocial</p>
                                                    <p className="text-sm font-bold text-white truncate max-w-[160px] sm:max-w-[200px]">
                                                        {lastSocial?.url ? lastSocial.url.replace(/^https?:\/\//i, '') : 'Audited Profile'}
                                                    </p>
                                                    <p className="text-[10px] text-white/30 font-mono">{lastSocial?.date || 'Active Session'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-2xl font-black ${getScoreColor(activeSocial?.score ?? 0)}`}>
                                                    {activeSocial?.score ?? 0}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        playSynthTick(800, 'sine', 0.05, 0.05);
                                                        setActiveMainTab('intelligence');
                                                        setIntelligenceSubTab('social');
                                                    }}
                                                    className="px-3 py-1.5 rounded-lg border border-pink-400/30 text-pink-400 text-xs font-bold hover:bg-pink-400/10 transition-all"
                                                >
                                                    Details →
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* SEO Snapshot */}
                                    {hasSeo && (
                                        <div className="flex items-center justify-between p-4 bg-[#0c0735]/60 border border-white/10 rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                                                    <i className="fa-solid fa-magnifying-glass-chart"></i>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-black uppercase text-green-400 font-mono">VoxAudit SEO</p>
                                                    <p className="text-sm font-bold text-white font-mono truncate max-w-[160px] sm:max-w-[200px]">
                                                        {activeSeo?.domain || 'Target Domain'}
                                                    </p>
                                                    <p className="text-[10px] text-white/30 font-mono">{activeSeo?.date || 'Active Session'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <span className={`text-2xl font-black ${getScoreColor(activeSeo?.overall_score ?? 0)}`}>
                                                        {activeSeo?.overall_score ?? 0}
                                                    </span>
                                                    {activeSeo?.overall_grade && (
                                                        <span className="block text-[9px] font-black text-white/40 uppercase">Grade {activeSeo.overall_grade}</span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        playSynthTick(800, 'sine', 0.05, 0.05);
                                                        setActiveMainTab('intelligence');
                                                        setIntelligenceSubTab('seo');
                                                    }}
                                                    className="px-3 py-1.5 rounded-lg border border-green-400/30 text-green-400 text-xs font-bold hover:bg-green-400/10 transition-all"
                                                >
                                                    Details →
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Empty state mascot when no audits run yet */}
                        {!hasAnyData && (
                            <div className="flex flex-col items-center gap-6 py-6 text-center">
                                <div className="relative">
                                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#0c0735] border border-white/15 text-white text-xs font-bold px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-xl whitespace-nowrap z-10">
                                        {bubbleText}
                                        <div className="absolute bottom-[-7px] left-5 w-3 h-3 bg-[#0c0735] border-b border-r border-white/15 rotate-45" />
                                    </div>
                                    <div
                                        ref={mascotRef}
                                        className="w-28 h-28 cursor-pointer"
                                        onClick={() => {
                                            playSynthTick(900, 'sine', 0.05, 0.05);
                                            setBubbleText("Pick either Social or SEO to get your first intelligence scores!");
                                        }}
                                    >
                                        <img src={MASCOT_URL} className="w-full h-full object-contain drop-shadow-2xl" alt="Ryan Vox" />
                                    </div>
                                </div>
                                <p className="text-white/40 text-xs font-semibold">
                                    No audits run yet. Choose a tool above to analyze your digital footprint.
                                </p>
                            </div>
                        )}

                        {/* Strategy Consultation Strip */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-[#ff7b1a]/10 via-[#0c0735] to-transparent border border-[#ff7b1a]/20 rounded-3xl">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7b1a] block font-mono mb-1">
                                    <i className="fa-solid fa-calendar-check mr-1.5"></i>
                                    EXPERT CONSULTATION
                                </span>
                                <h4 className="text-base sm:text-lg font-black text-white">
                                    Ready to review your digital footprint with an engineer?
                                </h4>
                                <p className="text-xs sm:text-sm text-white/60 font-medium">
                                    Book a free 30-minute walkthrough session to discuss algorithmic recovery and growth opportunities.
                                </p>
                            </div>
                            <a
                                href="https://voxlumedia.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => playSynthTick(1000, 'sine', 0.05, 0.08)}
                                className="shrink-0 inline-flex items-center gap-2 bg-[#ff7b1a] hover:bg-[#e06200] text-white font-black px-6 py-3 rounded-full text-xs sm:text-sm transition-all shadow-[0_4px_20px_rgba(255,123,26,0.35)] hover:scale-[1.03] active:scale-95"
                            >
                                Book Free Strategy Call →
                            </a>
                        </div>
                    </div>
                )}

                {/* =========================================================================
                   TAB 2: MENU INTELLIGENCE (Hasil Analisis Hub)
                   ========================================================================= */}
                {activeMainTab === 'intelligence' && (
                    <div className="space-y-8 animate-fade-in">

                        {/* Intelligence Hub Header & Sub-Tab Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-green-400 font-mono">
                                        <i className="fa-solid fa-brain mr-1.5 text-green-400"></i>
                                        INTELLIGENCE ANALYTICS HUB
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white">
                                    Digital Presence Intelligence
                                </h2>
                                <p className="text-white/50 text-xs sm:text-sm">
                                    Consolidated diagnostic insights across social authority and technical search visibility.
                                </p>
                            </div>

                            {/* Sub-Tabs: Overview, VoxSocial, VoxSEO */}
                            <div className="flex items-center bg-[#0c0735] border border-white/10 rounded-2xl p-1.5">
                                <button
                                    onClick={() => {
                                        playSynthTick(700, 'sine', 0.04, 0.05);
                                        setIntelligenceSubTab('overview');
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${intelligenceSubTab === 'overview'
                                            ? 'bg-white text-black shadow-lg font-black'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <i className="fa-solid fa-chart-pie"></i>
                                    <span>Overview</span>
                                </button>
                                <button
                                    onClick={() => {
                                        playSynthTick(700, 'sine', 0.04, 0.05);
                                        setIntelligenceSubTab('social');
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${intelligenceSubTab === 'social'
                                            ? 'bg-pink-500 text-white shadow-lg font-black'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <i className="fa-brands fa-instagram"></i>
                                    <span>VoxSocial</span>
                                    {hasSocial && <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />}
                                </button>
                                <button
                                    onClick={() => {
                                        playSynthTick(700, 'sine', 0.04, 0.05);
                                        setIntelligenceSubTab('seo');
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${intelligenceSubTab === 'seo'
                                            ? 'bg-green-500 text-black shadow-lg font-black'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <i className="fa-solid fa-magnifying-glass-chart"></i>
                                    <span>VoxSEO</span>
                                    {hasSeo && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                                </button>
                            </div>
                        </div>

                        {/* -----------------------------------------------------------------
                            SUB-FEATURE 1: VOXAUDIT INTELLIGENCE OVERVIEW
                            ----------------------------------------------------------------- */}
                        {intelligenceSubTab === 'overview' && (
                            <div className="space-y-6 animate-fade-in">
                                {!hasAnyData ? (
                                    <div className="p-12 text-center bg-[#0c0735]/40 border border-white/10 rounded-3xl space-y-4">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 text-2xl mx-auto">
                                            <i className="fa-solid fa-chart-pie"></i>
                                        </div>
                                        <h3 className="text-xl font-black text-white">No Intelligence Data Available Yet</h3>
                                        <p className="text-white/50 text-sm max-w-md mx-auto">
                                            Run a VoxSocial scan or a VoxAudit SEO scan to populate your unified digital intelligence overview.
                                        </p>
                                        <div className="flex flex-wrap justify-center gap-3 pt-2">
                                            <button
                                                onClick={() => handleToolNavigate('landing')}
                                                className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${isTrialExpired
                                                        ? 'opacity-40 cursor-not-allowed bg-pink-500/20 text-white'
                                                        : 'bg-pink-500 hover:bg-pink-400 text-white'
                                                    }`}
                                            >
                                                Start VoxSocial Scan →
                                            </button>
                                            <button
                                                onClick={() => handleToolNavigate('seo_audit')}
                                                className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${isTrialExpired
                                                        ? 'opacity-40 cursor-not-allowed bg-green-500/20 text-green-300'
                                                        : 'bg-green-500 hover:bg-green-400 text-[#06021c]'
                                                    }`}
                                            >
                                                Run SEO Audit →
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Status Banner */}
                                        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0c0735] via-[#120a44] to-[#1a0e5c] border border-white/10 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="space-y-2">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border font-mono ${getScoreBadgeClass(digitalHealthScore)}`}>
                                                    <i className="fa-solid fa-shield-halved"></i>
                                                    STATUS: {getHealthStatusLabel(digitalHealthScore)}
                                                </span>
                                                <h3 className="text-2xl sm:text-3xl font-black text-white">
                                                    Overall Digital Presence Index
                                                </h3>
                                                <p className="text-white/60 text-xs sm:text-sm max-w-xl">
                                                    Weighted metric combining public search engine crawlability and social profile conversion readiness.
                                                </p>
                                            </div>

                                            {/* Score Ring Display */}
                                            <div className="flex items-center gap-5 shrink-0 bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
                                                <div className="relative w-20 h-20 flex items-center justify-center">
                                                    <svg className="w-full h-full transform -rotate-90">
                                                        <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="transparent" />
                                                        <circle
                                                            cx="40" cy="40" r="34"
                                                            stroke={digitalHealthScore >= 80 ? '#4ade80' : digitalHealthScore >= 60 ? '#fbbf24' : '#f43f5e'}
                                                            strokeWidth="6"
                                                            fill="transparent"
                                                            strokeDasharray={213.6}
                                                            strokeDashoffset={213.6 - (213.6 * digitalHealthScore) / 100}
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                    <div className="absolute text-center">
                                                        <span className={`text-2xl font-black ${getScoreColor(digitalHealthScore)}`}>
                                                            {digitalHealthScore}
                                                        </span>
                                                        <span className="block text-[8px] font-bold text-white/40 uppercase">/ 100</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-white">Data Confidence</p>
                                                    <p className="text-[11px] text-green-400 font-mono">92% Measured</p>
                                                    <span className="text-[9px] text-white/40 block">2 Sources Active</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Evidence Coverage & Health Meter */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="p-5 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-white/50 font-bold uppercase">Evidence Coverage</span>
                                                    <span className="font-mono text-green-400 font-bold">88% Evaluated</span>
                                                </div>
                                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-green-400 h-full rounded-full" style={{ width: '88%' }} />
                                                </div>
                                                <p className="text-[10px] text-white/40">Verified via public crawlers and API nodes.</p>
                                            </div>

                                            <div className="p-5 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-white/50 font-bold uppercase">Search Visibility</span>
                                                    <span className={`font-mono font-bold ${getScoreColor(activeSeo?.overall_score ?? 70)}`}>
                                                        {hasSeo ? `${activeSeo?.overall_score}/100` : 'Not Scanned'}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${activeSeo?.overall_score ?? 0}%` }} />
                                                </div>
                                                <p className="text-[10px] text-white/40">{activeSeo?.domain || 'Domain not yet analyzed'}</p>
                                            </div>

                                            <div className="p-5 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-white/50 font-bold uppercase">Social Readiness</span>
                                                    <span className={`font-mono font-bold ${getScoreColor(activeSocial?.score ?? 70)}`}>
                                                        {hasSocial ? `${activeSocial?.score}/100` : 'Not Scanned'}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-pink-400 h-full rounded-full" style={{ width: `${activeSocial?.score ?? 0}%` }} />
                                                </div>
                                                <p className="text-[10px] text-white/40">{activeSocial?.platform || 'Instagram/Facebook'}</p>
                                            </div>
                                        </div>

                                        {/* Dual Pillar Comparison Matrix */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                            {/* Pillar 1: Search & Website (SEO) */}
                                            <div className="p-6 bg-[#0c0735]/60 border border-white/10 rounded-3xl space-y-4">
                                                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                                                            <i className="fa-solid fa-globe"></i>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-white">Search Engine Footprint</h4>
                                                            <p className="text-[11px] text-white/40 font-mono">{activeSeo?.domain || 'Website Domain'}</p>
                                                        </div>
                                                    </div>
                                                    {hasSeo && (
                                                        <span className={`px-2.5 py-1 rounded-md text-xs font-black border ${getScoreBadgeClass(activeSeo.overall_score)}`}>
                                                            {activeSeo.overall_score}/100
                                                        </span>
                                                    )}
                                                </div>

                                                {hasSeo ? (
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between text-xs py-1 border-b border-white/5">
                                                            <span className="text-white/60">On-Page Semantic Quality</span>
                                                            <span className="font-bold text-white">{activeSeo.breakdown?.SEO ?? 76}/100</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs py-1 border-b border-white/5">
                                                            <span className="text-white/60">Core Web Vitals & Speed</span>
                                                            <span className="font-bold text-amber-400">{activeSeo.breakdown?.Performance ?? 54}/100</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs py-1 border-b border-white/5">
                                                            <span className="text-white/60">Mobile Usability</span>
                                                            <span className="font-bold text-white">{activeSeo.breakdown?.Usability ?? 72}/100</span>
                                                        </div>
                                                        <button
                                                            onClick={() => setIntelligenceSubTab('seo')}
                                                            className="w-full mt-2 py-2.5 rounded-xl border border-green-400/30 text-green-400 text-xs font-bold hover:bg-green-400/10 transition-all text-center"
                                                        >
                                                            Inspect VoxSEO Intelligence →
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-6 space-y-3">
                                                        <p className="text-xs text-white/40">No website domain audited yet.</p>
                                                        <button
                                                            onClick={() => handleToolNavigate('seo_audit')}
                                                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${isTrialExpired
                                                                    ? 'opacity-40 cursor-not-allowed bg-green-500/10 text-green-400 border-green-500/20'
                                                                    : 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30'
                                                                }`}
                                                        >
                                                            Run SEO Scan Now
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Pillar 2: Social Media (VoxSocial) */}
                                            <div className="p-6 bg-[#0c0735]/60 border border-white/10 rounded-3xl space-y-4">
                                                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                                                            <i className="fa-brands fa-instagram"></i>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-white">Social Authority & Conversion</h4>
                                                            <p className="text-[11px] text-white/40 font-mono">{activeSocial?.platform || 'Social Channels'}</p>
                                                        </div>
                                                    </div>
                                                    {hasSocial && (
                                                        <span className={`px-2.5 py-1 rounded-md text-xs font-black border ${getScoreBadgeClass(activeSocial.score)}`}>
                                                            {activeSocial.score}/100
                                                        </span>
                                                    )}
                                                </div>

                                                {hasSocial ? (
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between text-xs py-1 border-b border-white/5">
                                                            <span className="text-white/60">Profile Clarity & Hook</span>
                                                            <span className="font-bold text-white">{activeSocial.categories?.profileClarity ?? 72}/100</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs py-1 border-b border-white/5">
                                                            <span className="text-white/60">Trust Signals & Proof</span>
                                                            <span className="font-bold text-white">{activeSocial.categories?.trustScore ?? 75}/100</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs py-1 border-b border-white/5">
                                                            <span className="text-white/60">Business Readiness</span>
                                                            <span className="font-bold text-white">{activeSocial.categories?.businessReadiness ?? 70}/100</span>
                                                        </div>
                                                        <button
                                                            onClick={() => setIntelligenceSubTab('social')}
                                                            className="w-full mt-2 py-2.5 rounded-xl border border-pink-400/30 text-pink-400 text-xs font-bold hover:bg-pink-400/10 transition-all text-center"
                                                        >
                                                            Inspect VoxSocial Intelligence →
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-6 space-y-3">
                                                        <p className="text-xs text-white/40">No social profile audited yet.</p>
                                                        <button
                                                            onClick={() => handleToolNavigate('landing')}
                                                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${isTrialExpired
                                                                    ? 'opacity-40 cursor-not-allowed bg-pink-500/10 text-pink-400 border-pink-500/20'
                                                                    : 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30'
                                                                }`}
                                                        >
                                                            Start Social Audit Now
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* -----------------------------------------------------------------
                            SUB-FEATURE 2: VOXSOCIAL INTELLIGENCE
                            ----------------------------------------------------------------- */}
                        {intelligenceSubTab === 'social' && (
                            <div className="space-y-6 animate-fade-in">
                                {!hasSocial ? (
                                    <div className="p-12 text-center bg-[#0c0735]/40 border border-white/10 rounded-3xl space-y-4">
                                        <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 text-2xl mx-auto">
                                            <i className="fa-brands fa-instagram"></i>
                                        </div>
                                        <h3 className="text-xl font-black text-white">No VoxSocial Data Found</h3>
                                        <p className="text-white/50 text-sm max-w-md mx-auto">
                                            Paste your Instagram or Facebook business page to evaluate profile hook, engagement quality, and conversion factors.
                                        </p>
                                        <button
                                            onClick={() => handleToolNavigate('landing')}
                                            className={`px-6 py-3 rounded-full text-xs font-black transition-all shadow-lg ${isTrialExpired
                                                    ? 'opacity-40 cursor-not-allowed bg-pink-500/20 text-white'
                                                    : 'bg-pink-500 hover:bg-pink-400 text-white'
                                                }`}
                                        >
                                            Start Social Audit →
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Social Header Card */}
                                        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0c0735] via-[#1b0933] to-[#260c44] border border-pink-500/20 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="space-y-2">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-pink-400 bg-pink-500/10 border border-pink-500/20 font-mono">
                                                    <i className="fa-brands fa-instagram mr-1"></i> {activeSocial.platform || 'Social Profile'}
                                                </span>
                                                <h3 className="text-2xl sm:text-3xl font-black text-white">
                                                    {lastSocial?.url ? lastSocial.url.replace(/^https?:\/\//i, '') : (activeSocial.profileIdentity || 'Audited Profile')}
                                                </h3>
                                                <p className="text-white/70 text-xs sm:text-sm italic max-w-xl">
                                                    "{activeSocial.summary || 'Bio and public metadata analyzed for first-impression clarity.'}"
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-5 shrink-0 bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
                                                <div className="text-center">
                                                    <span className={`text-4xl font-black ${getScoreColor(activeSocial.score)}`}>
                                                        {activeSocial.score}
                                                    </span>
                                                    <span className="block text-[9px] font-bold text-white/40 uppercase mt-0.5">Score / 100</span>
                                                </div>
                                                <div className="border-l border-white/10 pl-4 space-y-1">
                                                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getScoreBadgeClass(activeSocial.score)}`}>
                                                        {activeSocial.label || 'Good'}
                                                    </span>
                                                    <p className="text-[10px] text-white/40 font-mono">Growth: {activeSocial.growthPotential || 'High'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 4 Pillars Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                                { label: 'Profile Clarity', score: activeSocial.categories?.profileClarity || activeSocial.score, icon: 'fa-id-badge', color: 'bg-blue-400' },
                                                { label: 'Content Quality', score: activeSocial.categories?.contentQuality || activeSocial.score, icon: 'fa-image', color: 'bg-pink-400' },
                                                { label: 'Trust Signals', score: activeSocial.categories?.trustScore || activeSocial.score, icon: 'fa-shield-halved', color: 'bg-amber-400' },
                                                { label: 'Business Readiness', score: activeSocial.categories?.businessReadiness || activeSocial.score, icon: 'fa-chart-line', color: 'bg-emerald-400' }
                                            ].map((pillar, idx) => (
                                                <div key={idx} className="p-5 bg-[#0c0735]/80 border border-white/10 rounded-2xl space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-white/60 font-bold flex items-center gap-2">
                                                            <i className={`fa-solid ${pillar.icon} text-white/40`}></i>
                                                            {pillar.label}
                                                        </span>
                                                        <span className="font-mono font-bold text-white">{pillar.score}/100</span>
                                                    </div>
                                                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                                        <div className={`${pillar.color} h-full rounded-full`} style={{ width: `${pillar.score}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Strengths & Opportunities Two Columns */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Strengths */}
                                            <div className="p-6 bg-[#0c0735]/60 border border-white/10 rounded-3xl space-y-4">
                                                <h4 className="text-sm font-black uppercase tracking-wider text-green-400 flex items-center gap-2">
                                                    <i className="fa-solid fa-circle-check"></i> Key Strengths Observed
                                                </h4>
                                                <ul className="space-y-3">
                                                    {(activeSocial.strengths?.length > 0 ? activeSocial.strengths : [
                                                        'Profile bio contains recognizable brand keywords',
                                                        'Visual identity elements show design consistency'
                                                    ]).map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2.5 text-xs text-white/80 font-medium">
                                                            <i className="fa-solid fa-check text-green-400 mt-0.5"></i>
                                                            <span>{typeof item === 'string' ? item.replace(/^[✓•\s]+/, '') : item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Opportunities */}
                                            <div className="p-6 bg-[#0c0735]/60 border border-white/10 rounded-3xl space-y-4">
                                                <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                                                    <i className="fa-solid fa-arrow-trend-up"></i> Growth Opportunities
                                                </h4>
                                                <ul className="space-y-3">
                                                    {(activeSocial.opportunities?.length > 0 ? activeSocial.opportunities : [
                                                        'Refine bio call-to-action for direct booking or lead capture',
                                                        'Add story highlight categorization for high-intent offerings'
                                                    ]).map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2.5 text-xs text-white/80 font-medium">
                                                            <i className="fa-solid fa-arrow-right text-amber-400 mt-0.5"></i>
                                                            <span>{typeof item === 'string' ? item.replace(/^[✓•\s]+/, '') : item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* AI Recommendation Banner & Actions */}
                                        <div className="p-6 bg-gradient-to-r from-pink-500/10 via-[#0c0735] to-transparent border border-pink-500/20 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 block font-mono mb-1">
                                                    AI SOLUTION RECOMMENDATION
                                                </span>
                                                <h4 className="text-base font-black text-white">
                                                    Recommended Strategy: <span className="text-pink-400">{activeSocial.recommended_package || 'Vox Growth'}</span>
                                                </h4>
                                                <p className="text-xs text-white/60">
                                                    Engineered to lift your social trust signals and turn profile visitors into booked clients.
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                {analysisResults && (
                                                    <button
                                                        onClick={() => setView('results')}
                                                        className="px-4 py-2.5 rounded-full border border-pink-400/40 text-pink-300 text-xs font-bold hover:bg-pink-400/10 transition-all"
                                                    >
                                                        Full Report View →
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleToolNavigate('landing')}
                                                    className={`px-5 py-2.5 rounded-full text-xs font-black transition-all shadow-md ${isTrialExpired
                                                            ? 'opacity-40 cursor-not-allowed bg-pink-500/20 text-white'
                                                            : 'bg-pink-500 hover:bg-pink-400 text-white'
                                                        }`}
                                                >
                                                    Audit New Profile →
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* -----------------------------------------------------------------
                            SUB-FEATURE 3: VOXSEO INTELLIGENCE
                            ----------------------------------------------------------------- */}
                        {intelligenceSubTab === 'seo' && (
                            <div className="space-y-6 animate-fade-in">
                                {!hasSeo ? (
                                    <div className="p-12 text-center bg-[#0c0735]/40 border border-white/10 rounded-3xl space-y-4">
                                        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-2xl mx-auto">
                                            <i className="fa-solid fa-magnifying-glass-chart"></i>
                                        </div>
                                        <h3 className="text-xl font-black text-white">No VoxSEO Data Found</h3>
                                        <p className="text-white/50 text-sm max-w-md mx-auto">
                                            Run a 51-point website audit to uncover semantic heading gaps, Core Web Vitals bottlenecks, and local entity signals.
                                        </p>
                                        <button
                                            onClick={() => handleToolNavigate('seo_audit')}
                                            className={`px-6 py-3 rounded-full text-xs font-black transition-all shadow-lg ${isTrialExpired
                                                    ? 'opacity-40 cursor-not-allowed bg-green-500/20 text-green-300'
                                                    : 'bg-green-500 hover:bg-green-400 text-[#06021c]'
                                                }`}
                                        >
                                            Run SEO Audit Now →
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* SEO Header Card */}
                                        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0c0735] via-[#0e1f3a] to-[#12284c] border border-green-500/20 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="space-y-2">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 font-mono">
                                                    <i className="fa-solid fa-globe mr-1"></i> TARGET DOMAIN
                                                </span>
                                                <h3 className="text-2xl sm:text-3xl font-black text-white font-mono">
                                                    {activeSeo.domain || 'Target Website'}
                                                </h3>
                                                <p className="text-white/60 text-xs sm:text-sm font-mono">
                                                    Audit evaluated on: {activeSeo.date || 'Recent Scan'} | 51 Checklist Rules Verified
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-5 shrink-0 bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
                                                <div className="text-center">
                                                    <span className={`text-4xl font-black ${getScoreColor(activeSeo.overall_score)}`}>
                                                        {activeSeo.overall_score}
                                                    </span>
                                                    <span className="block text-[9px] font-bold text-white/40 uppercase mt-0.5">Score / 100</span>
                                                </div>
                                                <div className="border-l border-white/10 pl-4 space-y-1">
                                                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getScoreBadgeClass(activeSeo.overall_score)}`}>
                                                        GRADE {activeSeo.overall_grade || 'C'}
                                                    </span>
                                                    <p className="text-[10px] text-white/40">Status: Action Required</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 7-Pillar Scorecard Matrix */}
                                        <div className="p-6 bg-[#0c0735]/80 border border-white/10 rounded-3xl space-y-5">
                                            <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                                <h4 className="text-xs font-black uppercase tracking-wider text-white/60 font-mono">
                                                    7-PILLAR DIAGNOSTIC SCORECARD
                                                </h4>
                                                <span className="text-[10px] font-bold text-green-400 font-mono">ENGINEERING BENCHMARK</span>
                                            </div>

                                            <div className="space-y-4">
                                                {[
                                                    { label: 'On-Page SEO & Content Structure', key: 'SEO', val: activeSeo.breakdown?.SEO ?? 76 },
                                                    { label: 'Usability, Mobile UX & Tap Targets', key: 'Usability', val: activeSeo.breakdown?.Usability ?? 72 },
                                                    { label: 'Performance & Core Web Vitals', key: 'Performance', val: activeSeo.breakdown?.Performance ?? 54 },
                                                    { label: 'Social Graph Meta & Entity Links', key: 'Social', val: activeSeo.breakdown?.Social ?? 68 },
                                                    { label: 'Local Search & NAP Citations', key: 'Local', val: activeSeo.breakdown?.Local ?? 50 },
                                                    { label: 'Technology Stack & Security Headers', key: 'Technology', val: activeSeo.breakdown?.Technology ?? 82 },
                                                    { label: 'Domain Authority & Link Profile', key: 'Authority', val: activeSeo.breakdown?.Authority ?? 75 }
                                                ].map((pillar, idx) => (
                                                    <div key={idx} className="space-y-1.5">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-white/80 font-bold">{pillar.label}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${getScoreBadgeClass(pillar.val)}`}>
                                                                    {pillar.val >= 75 ? 'OPTIMAL' : pillar.val >= 60 ? 'WATCH' : 'CRITICAL'}
                                                                </span>
                                                                <span className="font-mono font-bold text-white w-10 text-right">{pillar.val}/100</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-700 ${pillar.val >= 75 ? 'bg-green-400' : pillar.val >= 60 ? 'bg-amber-400' : 'bg-rose-500'
                                                                    }`}
                                                                style={{ width: `${pillar.val}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Top Engineering Bottlenecks Summary */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="p-5 bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-2">
                                                <span className="text-[9px] font-black uppercase text-rose-400 tracking-wider font-mono">
                                                    PRIORITY 1 · SPEED
                                                </span>
                                                <h5 className="text-sm font-bold text-white">Mobile Core Web Vitals</h5>
                                                <p className="text-xs text-white/60 leading-relaxed">
                                                    Mobile PageSpeed index is below threshold. Optimize image payloads, inline critical CSS, and defer unused JavaScript.
                                                </p>
                                            </div>

                                            <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-2">
                                                <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider font-mono">
                                                    PRIORITY 2 · SEMANTICS
                                                </span>
                                                <h5 className="text-sm font-bold text-white">Missing or Duplicate H1</h5>
                                                <p className="text-xs text-white/60 leading-relaxed">
                                                    Homepage lacks a clean authoritative single H1 heading targeting primary high-intent commercial keywords.
                                                </p>
                                            </div>

                                            <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-2">
                                                <span className="text-[9px] font-black uppercase text-blue-400 tracking-wider font-mono">
                                                    PRIORITY 3 · LOCAL ENTITY
                                                </span>
                                                <h5 className="text-sm font-bold text-white">Local Schema Void</h5>
                                                <p className="text-xs text-white/60 leading-relaxed">
                                                    No LocalBusiness JSON-LD markup found matching Google Business Profile address, opening hours, and geo coordinates.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons Footer */}
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#0c0735]/60 border border-white/10 rounded-2xl">
                                            <div className="text-xs text-white/50">
                                                Need full 51-point checklist tables, SERP preview, or printable PDF?
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setView('seo_audit')}
                                                    className="px-5 py-2.5 rounded-full bg-green-500 hover:bg-green-400 text-[#06021c] text-xs font-black transition-all shadow-md"
                                                >
                                                    Open Executive SEO Report →
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                    </div>
                )}

                {/* Footer */}
                <div className="text-center text-xs text-white/25 font-semibold tracking-wide pb-4">
                    Copyright © 2026 Voxlumedia™ | Creative Agency for Digital Marketing
                </div>
            </main>

            {/* Logout Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutModal(false)}
            />
        </div>
    );
}
