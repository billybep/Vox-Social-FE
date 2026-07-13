import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { playSynthTick } from '../utils/audio';
import LogoutModal from './LogoutModal';

const MASCOT_URL = "https://raw.githubusercontent.com/lengkongandreuw/voxsocial/main/assets/ryanvox.png";
const LOGO_URL = "https://raw.githubusercontent.com/lengkongandreuw/voxsocial/main/assets/vsllogo.png";

export default function LandingSection({ profileUrl, setProfileUrl, handleAnalyze, inputError, setInputError, setView }) {
    const mascotRef = useRef(null);
    const [mascotBubbleText, setMascotBubbleText] = useState("Hey there! Ready to grade your profile?");
    const [bubbleClickCount, setBubbleClickCount] = useState(0);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const neuralNodes = {
        bioScan: true,
        postDensity: true,
        ctaVerification: true
    };

    const mascotQuotes = [
        "Hey there! Ready to grade your profile?",
        "Did you know 82% of buyers check social trust before buying?",
        "Click me again! I promise I don't bite. I only scan public data!",
        "Try pasting your Instagram or Facebook link on the right!",
        "No password needed. Fully secure and private!",
        "Let's see if your Bio is ready to convert clicks into sales!"
    ];

    const handleMascotClick = () => {
        playSynthTick(800 + (bubbleClickCount * 100), 'sine', 0.08, 0.04);
        const nextCount = (bubbleClickCount + 1) % mascotQuotes.length;
        setBubbleClickCount(nextCount);
        setMascotBubbleText(mascotQuotes[nextCount]);
    };


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

    const calcCalibrationLevel = () => {
        let level = 35;
        if (neuralNodes.bioScan) level += 20;
        if (neuralNodes.postDensity) level += 25;
        if (neuralNodes.ctaVerification) level += 20;
        return level;
    };

    const hasProtocolOrSocial = profileUrl.toLowerCase().includes('http') || profileUrl.toLowerCase().includes('instagram.com') || profileUrl.toLowerCase().includes('facebook.com');
    const hasUsernameSample = profileUrl.length > 15;
    const isSafeLength = profileUrl.length > 0 && profileUrl.length <= 100;

    return (
        <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden cyber-grid-bg">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <div className="absolute w-[450px] h-[450px] rounded-full border border-white/5 top-[10%] left-[5%] animate-spin-slow flex items-center justify-center">
                    <div className="w-[350px] h-[350px] rounded-full border border-dashed border-white/10"></div>
                </div>

                <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5 bottom-[10%] right-[10%] animate-spin-reverse flex items-center justify-center">
                    <div className="w-1 h-[140px] bg-gradient-to-b from-[#ff7b1a]/20 to-transparent origin-bottom animate-radar-sweep"></div>
                </div>

                <div className="absolute top-[25%] right-[12%] text-white/5 text-8xl font-black animate-float" style={{ animationDuration: '9s' }}>@</div>
                <div className="absolute bottom-[35%] left-[8%] text-white/5 text-7xl font-bold animate-float-delayed" style={{ animationDuration: '11s' }}>★</div>
            </div>

            <header className="absolute top-0 left-0 w-full p-6 sm:px-12 z-50 flex items-center justify-between">
                <div className="flex items-center gap-3 font-black text-xl tracking-tight text-white select-none">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                        <img src={LOGO_URL} className="w-full h-full object-contain" alt="Logo" />
                    </div>
                    VOXLUMEDIA
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={() => {
                            playSynthTick(600, 'sine', 0.05, 0.05);
                            setView('seo_audit');
                        }}
                        className="relative group overflow-hidden bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-black rounded-full px-5 py-2.5 text-xs sm:text-sm font-black shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:scale-[1.03] transition-all active:scale-95 duration-200 flex items-center gap-1.5 animate-pulse-glow"
                    >
                        <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
                        Vox SEO Audit
                    </button>
                    <a href="https://voxlumedia.com" target="_blank" rel="noopener noreferrer" className="bg-[#191046] border border-white/10 rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold hover:bg-white hover:text-black transition-all active:scale-95 duration-200">
                        Book Free Consultation &rarr;
                    </a>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-white/70 transition-all active:scale-95"
                        title="Logout"
                    >
                        <i className="fa-solid fa-arrow-right-from-bracket text-[13px] sm:mr-2"></i>
                        <span className="hidden sm:inline text-xs font-bold">Logout</span>
                    </button>
                </div>
            </header>

            <LogoutModal
                isOpen={showLogoutModal}
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={async () => {
                    try {
                        await signOut(auth);
                        localStorage.removeItem('auth_token');
                        setView('login');
                    } catch (error) {
                        console.error('Logout error:', error);
                    }
                }}
            />

            <div className="flex-grow flex items-center justify-center w-full pt-32 pb-16 relative z-10">
                <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-4">

                    <div className="lg:col-span-5 flex flex-col items-center justify-center relative">

                        <div
                            onClick={handleMascotClick}
                            className="absolute top-[-40px] z-50 bg-[#0c0735]/95 text-white px-4 py-3 rounded-2xl rounded-bl-none shadow-2xl border-2 border-[#ff7b1a] max-w-[220px] text-xs font-bold cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 select-none"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] text-[#ff7b1a] font-extrabold uppercase">Ryan Vox</span>
                                <span className="text-[8px] bg-white/10 text-white/50 px-1 rounded">TAP ME</span>
                            </div>
                            <p className="leading-snug text-white/95">{mascotBubbleText}</p>
                        </div>

                        <div
                            ref={mascotRef}
                            onClick={handleMascotClick}
                            className="w-full h-auto transition-transform duration-300 ease-out flex justify-center relative z-20 cursor-pointer"
                            title="Click me to talk!"
                        >
                            <img
                                src={MASCOT_URL}
                                alt="Vox Mascot"
                                className="w-[85%] sm:w-[65%] lg:w-[100%] max-w-[500px] h-auto object-contain drop-shadow-2xl animate-float hover:brightness-110 transition-all"
                            />
                        </div>

                        <div className="absolute bottom-[2%] left-[-2%] sm:left-[5%] lg:left-[-5%] z-40 max-w-[240px] solid-glassmorphic p-4 rounded-2xl shadow-2xl flex gap-3 animate-float" style={{ animationDelay: '1.5s' }}>
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyber-neonBlue shrink-0">
                                <i className="fa-solid fa-brain text-lg"></i>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[11px] font-black uppercase tracking-wider text-white">AI-POWERED INSIGHTS</h4>
                                <p className="text-[10px] text-white/70 font-semibold leading-normal">
                                    Our business-first engine automatically scans your profile indicators instantly.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-8 text-center lg:text-left animate-fade-in-up relative z-30">

                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] sm:text-xs font-black tracking-widest text-[#a882ff] uppercase">
                                <i className="fa-solid fa-bolt text-[#ff7b1a]"></i>
                                AI-POWERED AUDIT TOOL
                            </div>

                            <h1 className="text-[2.8rem] sm:text-6xl lg:text-[5.4rem] font-black uppercase leading-[1.0] tracking-tighter text-white">
                                VOX SOCIAL <br />
                                <span className="text-[#ff7b1a]">SCORE</span>
                            </h1>

                            <p className="text-white/80 text-sm sm:text-lg lg:text-[20px] max-w-[620px] mx-auto lg:mx-0 font-medium leading-relaxed">
                                Get an instant business-first evaluation. Learn how easily potential customers find, trust, and purchase products from your social channels.
                            </p>
                        </div>

                        <form onSubmit={handleAnalyze} className="relative w-full max-w-[650px] mx-auto lg:mx-0 space-y-4 pt-2">

                            <div className="flex flex-col sm:flex-row gap-2.5 bg-white/5 p-2 rounded-2xl border border-white/15 backdrop-blur-xl shadow-2xl relative transition-all duration-300 focus-within:border-[#ff7b1a]">
                                <div className="relative flex-grow flex items-center px-4">
                                    <span className={`transition-colors duration-300 text-xl font-black mr-2 font-mono ${hasProtocolOrSocial ? 'text-[#ff7b1a]' : 'text-white/40'}`}>@</span>
                                    <input
                                        type="url"
                                        required
                                        maxLength={100}
                                        value={profileUrl}
                                        onKeyDown={() => playSynthTick(1200, 'sine', 0.03, 0.015)}
                                        onChange={(e) => {
                                            setInputError('');
                                            setProfileUrl(e.target.value);
                                        }}
                                        placeholder="Enter Instagram or Facebook Page URL"
                                        className="w-full bg-transparent text-white font-bold placeholder-white/40 focus:outline-none text-[15px] sm:text-base py-3"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-[#ff7b1a] hover:bg-[#e06200] text-white font-black px-10 py-4 rounded-xl transition-all duration-200 text-sm whitespace-nowrap shadow-md flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95"
                                >
                                    Get My Score <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>

                            <div className="bg-[#0b072c] border border-white/10 rounded-2xl p-4 text-left shadow-2xl relative overflow-hidden">
                                {/* <div className="absolute right-3 top-3 flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] font-mono tracking-widest text-emerald-500">LIVE FEED</span>
                                </div> */}

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    <div className="md:col-span-4 space-y-1">
                                        <span className="text-[10px] font-black text-white/50 tracking-wider block">DIAGNOSTIC CALIBRATION</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-cyber-neonBlue tracking-tight">{calcCalibrationLevel()}%</span>
                                            <span className="text-[10px] font-mono text-white/40">READY</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                                            <div className="bg-cyber-neonBlue h-full rounded-full transition-all duration-300" style={{ width: `${calcCalibrationLevel()}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-8 flex flex-wrap gap-2 justify-start md:justify-end">
                                        <div className="px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all cursor-default bg-cyber-neonBlue/10 border-cyber-neonBlue text-cyber-neonBlue shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                                            <i className="fa-solid fa-fingerprint"></i> Bio Metadata Scan
                                        </div>
                                        <div className="px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all cursor-default bg-pink-500/10 border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(255,0,127,0.15)]">
                                            <i className="fa-solid fa-cubes"></i> Post Density Audit
                                        </div>
                                        <div className="px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all cursor-default bg-amber-400/10 border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(255,184,0,0.15)]">
                                            <i className="fa-solid fa-link"></i> CTA Check
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-white/5 flex gap-4 text-[10px] font-mono text-white/60">
                                    <span className="flex items-center gap-1"><i className={`fa-solid ${hasProtocolOrSocial ? 'fa-circle-check text-emerald-400' : 'fa-circle text-white/20'}`}></i> URL FORMAT</span>
                                    <span className="flex items-center gap-1"><i className={`fa-solid ${hasUsernameSample ? 'fa-circle-check text-emerald-400' : 'fa-circle text-white/20'}`}></i> SCAN DEPTH</span>
                                    <span className="flex items-center gap-1"><i className={`fa-solid ${isSafeLength ? 'fa-circle-check text-emerald-400' : 'fa-circle text-white/20'}`}></i> BUFFER SAFE</span>
                                </div>
                            </div>

                            <div className="hidden md:flex absolute right-[-140px] top-[15px] items-center gap-2 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
                                <svg className="w-12 h-12 text-[#ff7b1a] rotate-[-20deg]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="text-xs font-brush text-[#ff7b1a] text-medium tracking-wide rotate-[-5deg]">Start your free audit!</span>
                            </div>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-bold text-white/70 pt-1">
                                <span className="flex items-center gap-1.5"><i className="fa-solid fa-circle-check text-[#ff7b1a]"></i> No credit card required</span>
                                <span className="flex items-center gap-1.5"><i className="fa-solid fa-circle-check text-[#ff7b1a]"></i> Free instant report</span>
                                <span className="flex items-center gap-1.5"><i className="fa-solid fa-circle-check text-[#ff7b1a]"></i> Finished in 60s</span>
                            </div>

                            <div className="flex justify-between items-center text-[11px] text-white/40 font-semibold px-2">
                                <span>Optimized for Instagram & Facebook Pages</span>
                                <span>{profileUrl.length}/100 characters</span>
                            </div>

                            {inputError && (
                                <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 mt-2 w-max mx-auto lg:mx-0 animate-fade-in-up">
                                    <i className="fa-solid fa-circle-exclamation text-rose-400"></i>
                                    <span>{inputError}</span>
                                </div>
                            )}
                        </form>

                    </div>

                </div>
            </div>

            <div className="w-full relative z-30 px-6 sm:px-12 pb-10">
                <div className="max-w-[1300px] mx-auto solid-glassmorphic rounded-[2.5rem] p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xl">

                    <div className="md:col-span-3 flex items-center gap-4 justify-center md:justify-start group cursor-default transition-transform duration-300 hover:scale-[1.03]">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ff7b1a] text-xl transition-all duration-300 group-hover:bg-[#ff7b1a] group-hover:text-white">
                            <i className="fa-solid fa-globe"></i>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black uppercase text-white/50 tracking-wider">TRUSTED BY</p>
                            <p className="text-sm font-black text-white leading-tight">50+ Businesses Around the World</p>
                            <p className="text-[10px] text-white/40 font-semibold italic">Distributed team from all corners of the world</p>
                        </div>
                    </div>

                    <div className="md:col-span-3 flex items-center gap-4 justify-center group cursor-default transition-transform duration-300 hover:scale-[1.03]">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyber-gold text-xl transition-all duration-300 group-hover:bg-cyber-gold group-hover:text-[#06021c]">
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black uppercase text-white/50 tracking-wider">AVERAGE RATING</p>
                            <div className="flex items-center gap-1.5">
                                <span className="text-lg font-black text-white">4.9/5</span>
                                <div className="flex gap-0.5 text-[10px] text-cyber-gold">
                                    <i className="fa-solid fa-star animate-pulse"></i>
                                    <i className="fa-solid fa-star animate-pulse" style={{ animationDelay: '0.2s' }}></i>
                                    <i className="fa-solid fa-star animate-pulse" style={{ animationDelay: '0.4s' }}></i>
                                    <i className="fa-solid fa-star animate-pulse" style={{ animationDelay: '0.6s' }}></i>
                                    <i className="fa-solid fa-star animate-pulse" style={{ animationDelay: '0.8s' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-3 flex items-center gap-4 justify-center group cursor-default transition-transform duration-300 hover:scale-[1.03]">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-pink-400 text-xl transition-all duration-300 group-hover:bg-pink-500 group-hover:text-white">
                            <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black uppercase text-white/50 tracking-wider">POSTS ANALYZED</p>
                            <p className="text-lg font-black text-white">5M+ Across Platforms</p>
                        </div>
                    </div>

                    <div className="md:col-span-3 flex flex-col items-center md:items-end justify-center gap-2">
                        <p className="text-[10px] font-black uppercase text-white/50 tracking-wider">SUPPORTED PLATFORMS</p>
                        <div className="flex items-center gap-4 text-xl">
                            <div className="flex items-center gap-1.5 group cursor-pointer" title="Instagram Supported">
                                <i className="fa-brands fa-instagram text-pink-400 transition-transform duration-300 group-hover:scale-125"></i>
                                <span className="text-[10px] font-bold text-white/60">Instagram</span>
                            </div>
                            <div className="flex items-center gap-1.5 group cursor-pointer" title="Facebook Page Supported">
                                <i className="fa-brands fa-facebook text-blue-400 transition-transform duration-300 group-hover:scale-125"></i>
                                <span className="text-[10px] font-bold text-white/60">Facebook</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-8 text-center text-xs text-white/40 font-semibold tracking-wide select-none">
                    Copyright © 2026 Voxlumedia™ | Creative Agency for Digital Marketing
                </div>
            </div>

        </div>
    );
}
