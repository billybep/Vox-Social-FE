import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { playSynthTick } from '../utils/audio';
import LogoutModal from './LogoutModal';

const LOGO_URL = "https://raw.githubusercontent.com/lengkongandreuw/voxsocial/main/assets/vsllogo.png";
const MASCOT_URL = "https://raw.githubusercontent.com/lengkongandreuw/voxsocial/main/assets/ryanvox.png";

export default function DashboardSection({ setView, analysisResults }) {
    const mascotRef = useRef(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
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
            // ignore parse errors
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

    const hasData = lastSocial || lastSeo || analysisResults;

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-amber-400';
        return 'text-rose-400';
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

    return (
        <div className="relative min-h-screen flex flex-col overflow-x-hidden cyber-grid-bg bg-[#06021c]">

            {/* Background decorative elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <div className="absolute w-[500px] h-[500px] rounded-full bg-green-500/5 blur-[120px] top-[-100px] right-[-100px]" />
                <div className="absolute w-[400px] h-[400px] rounded-full bg-[#ff7b1a]/5 blur-[100px] bottom-[-80px] left-[-80px]" />
            </div>

            {/* Header */}
            <header className="relative z-50 w-full px-6 sm:px-10 py-5 flex items-center justify-between border-b border-white/5 bg-[#06021c]/80 backdrop-blur-md">
                <div className="flex items-center gap-3 font-black text-xl tracking-tight text-white select-none">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                        <img src={LOGO_URL} className="w-full h-full object-contain" alt="Voxlumedia" />
                    </div>
                    <span className="hidden sm:block">VOXLUMEDIA</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="hidden md:block text-xs text-white/40 font-semibold font-mono">
                        {user?.email}
                    </span>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-white/60 text-xs font-bold transition-all"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="relative z-10 flex-grow w-full max-w-[1100px] mx-auto px-5 sm:px-8 py-12 space-y-10">

                {/* Hero greeting */}
                <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-400 font-mono">
                        <i className="fa-solid fa-circle-check mr-1.5"></i>
                        AUTHENTICATED
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-white">
                        Welcome back, <span className="text-green-400">{displayName}</span> 👋
                    </h1>
                    <p className="text-white/50 font-medium">
                        What do you want to audit today?
                    </p>
                </div>

                {/* Tool cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* VoxSocial card */}
                    <button
                        onClick={() => {
                            playSynthTick(880, 'sine', 0.08, 0.1);
                            setView('landing');
                        }}
                        className="group text-left p-7 bg-[#0c0735]/80 border border-white/10 rounded-3xl backdrop-blur-xl shadow-xl hover:border-pink-400/40 hover:shadow-[0_0_30px_rgba(244,114,182,0.08)] transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 text-lg">
                                    <i className="fa-brands fa-instagram"></i>
                                </div>
                                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-lg">
                                    <i className="fa-brands fa-facebook"></i>
                                </div>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-full">
                                AI-Powered
                            </span>
                        </div>
                        <h2 className="text-xl font-black text-white mb-2 group-hover:text-pink-300 transition-colors">
                            VoxSocial — Social Score
                        </h2>
                        <p className="text-white/50 text-sm font-medium leading-relaxed mb-5">
                            Analyze your Instagram or Facebook profile. Get a score, strengths, opportunities, and a recommended growth package.
                        </p>
                        <span className="inline-flex items-center gap-2 text-pink-400 text-sm font-black group-hover:gap-3 transition-all">
                            Start Scan <i className="fa-solid fa-arrow-right"></i>
                        </span>
                    </button>

                    {/* VoxAudit SEO card */}
                    <button
                        onClick={() => {
                            playSynthTick(660, 'sine', 0.08, 0.1);
                            setView('seo_audit');
                        }}
                        className="group text-left p-7 bg-[#0c0735]/80 border border-white/10 rounded-3xl backdrop-blur-xl shadow-xl hover:border-green-400/40 hover:shadow-[0_0_30px_rgba(74,222,128,0.08)] transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-lg">
                                <i className="fa-solid fa-magnifying-glass-chart"></i>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                                51-Point Audit
                            </span>
                        </div>
                        <h2 className="text-xl font-black text-white mb-2 group-hover:text-green-300 transition-colors">
                            VoxAudit — SEO Audit
                        </h2>
                        <p className="text-white/50 text-sm font-medium leading-relaxed mb-5">
                            Scan your domain for SEO gaps, Core Web Vitals, broken links, and get a 90-day fix roadmap with executive-ready report.
                        </p>
                        <span className="inline-flex items-center gap-2 text-green-400 text-sm font-black group-hover:gap-3 transition-all">
                            Run Audit <i className="fa-solid fa-arrow-right"></i>
                        </span>
                    </button>
                </div>

                {/* Last Audit Snapshot */}
                {hasData && (
                    <div className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-widest text-white/40">
                            <i className="fa-solid fa-clock-rotate-left mr-1.5"></i>
                            Last Audit Results
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Last Social Score */}
                            {(lastSocial || analysisResults) && (() => {
                                const d = lastSocial || { score: analysisResults?.score, label: analysisResults?.label, platform: 'Social', url: '', date: '' };
                                return (
                                    <div className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/8 rounded-2xl hover:border-pink-400/20 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                                                <i className="fa-brands fa-instagram text-sm"></i>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-white/40 tracking-wider">VoxSocial</p>
                                                <p className="text-sm font-black text-white truncate max-w-[140px]">
                                                    {d.url ? d.url.replace('https://', '') : d.label}
                                                </p>
                                                {d.date && <p className="text-[10px] text-white/30 font-mono">{d.date}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-2xl font-black ${getScoreColor(d.score)}`}>{d.score}</span>
                                            {analysisResults && (
                                                <button
                                                    onClick={() => { playSynthTick(800, 'sine', 0.05, 0.08); setView('results'); }}
                                                    className="text-[11px] font-black text-pink-400 border border-pink-400/30 px-3 py-1.5 rounded-lg hover:bg-pink-400/10 transition-all whitespace-nowrap"
                                                >
                                                    View →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Last SEO Audit */}
                            {lastSeo && (
                                <div className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/8 rounded-2xl hover:border-green-400/20 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                                            <i className="fa-solid fa-magnifying-glass-chart text-sm"></i>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-white/40 tracking-wider">VoxAudit SEO</p>
                                            <p className="text-sm font-black text-white font-mono truncate max-w-[140px]">{lastSeo.domain}</p>
                                            {lastSeo.date && <p className="text-[10px] text-white/30 font-mono">{lastSeo.date}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <span className={`text-2xl font-black ${getScoreColor(lastSeo.overall_score)}`}>{lastSeo.overall_score}</span>
                                            {lastSeo.overall_grade && (
                                                <p className="text-[10px] font-black text-white/40">Grade {lastSeo.overall_grade}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => { playSynthTick(660, 'sine', 0.05, 0.08); setView('seo_audit'); }}
                                            className="text-[11px] font-black text-green-400 border border-green-400/30 px-3 py-1.5 rounded-lg hover:bg-green-400/10 transition-all whitespace-nowrap"
                                        >
                                            Re-run →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Empty state mascot — only when no data */}
                {!hasData && (
                    <div className="flex flex-col items-center gap-6 py-6">
                        <div className="relative">
                            {/* Bubble */}
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#0c0735] border border-white/15 text-white text-xs font-bold px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-xl whitespace-nowrap z-10">
                                {bubbleText}
                                <div className="absolute bottom-[-7px] left-5 w-3 h-3 bg-[#0c0735] border-b border-r border-white/15 rotate-45"></div>
                            </div>
                            <div
                                ref={mascotRef}
                                className="w-28 h-28 cursor-pointer"
                                onClick={() => {
                                    playSynthTick(900, 'sine', 0.05, 0.05);
                                    setBubbleText("Pick a tool above and let's get started!");
                                }}
                            >
                                <img src={MASCOT_URL} className="w-full h-full object-contain drop-shadow-2xl" alt="Ryan Vox" />
                            </div>
                        </div>
                        <p className="text-white/30 text-xs font-semibold">No audits run yet — choose a tool above to start</p>
                    </div>
                )}

                {/* CTA Strip */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 bg-gradient-to-r from-[#ff7b1a]/8 to-transparent border border-[#ff7b1a]/15 rounded-2xl">
                    <div className="text-center sm:text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#ff7b1a] mb-0.5">
                            <i className="fa-solid fa-calendar-check mr-1"></i> Need a human review?
                        </p>
                        <p className="text-sm font-bold text-white/70">
                            Book a free 30-minute strategy session with the Voxlumedia team.
                        </p>
                    </div>
                    <a
                        href="https://voxlumedia.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playSynthTick(1000, 'sine', 0.05, 0.08)}
                        className="shrink-0 inline-flex items-center gap-2 bg-[#ff7b1a] hover:bg-[#e06200] text-white font-black px-6 py-3 rounded-full text-sm transition-all shadow-[0_4px_15px_rgba(255,123,26,0.3)] hover:scale-[1.03] active:scale-95"
                    >
                        Book Free Consultation →
                    </a>
                </div>

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
