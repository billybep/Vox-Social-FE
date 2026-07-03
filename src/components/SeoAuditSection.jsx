import React, { useState, useEffect, useRef } from 'react';
import { playSynthTick } from '../utils/audio';

const LOGO_URL = "https://raw.githubusercontent.com/lengkongandreuw/voxsocial/main/assets/vsllogo.png";
const MASCOT_URL = "https://raw.githubusercontent.com/lengkongandreuw/voxsocial/main/assets/ryanvox.png";

export default function SeoAuditSection({ setView }) {
    const mascotRef = useRef(null);
    const [domain, setDomain] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [error, setError] = useState('');
    
    // Scanning state
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(35); // Default initial calibration level
    const [isScanReady, setIsScanReady] = useState(false);
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [resultsDomain, setResultsDomain] = useState('');
    const [modalRingOffset, setModalRingOffset] = useState(440); // 440 is empty, 70 is 84% score

    // Mascot Bubble Quotes
    const mascotQuotes = [
        "Hey there! Ready to audit your website?",
        "Did you know 93% of online experiences start with a search engine?",
        "Slow loading speeds increase bounce rates by 123%! Let's inspect yours.",
        "No credit card required. Pure, transparent technical indicators.",
        "Enter your domain name on the right to start scanning!",
        "Let's see if your site is fully crawlable by Google & Bing."
    ];
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [bubbleText, setBubbleText] = useState(mascotQuotes[0]);

    // Mascot mouselook tilt effect
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

    // Mascot quote rotation on click
    const rotateQuote = () => {
        const nextIndex = (quoteIndex + 1) % mascotQuotes.length;
        setQuoteIndex(nextIndex);
        setBubbleText(mascotQuotes[nextIndex]);
        playSynthTick(600 + (nextIndex * 80), 'sine', 0.1, 0.12);
    };

    // Form input character counter & tick sound
    const handleInputChange = (e) => {
        const val = e.target.value;
        setDomain(val);
        setCharCount(val.length);
        setError('');
        playSynthTick(1300, 'sine', 0.02, 0.05);
    };

    // Audit scanning pipeline simulation
    const handleAuditSubmit = (e) => {
        e.preventDefault();
        setError('');

        const val = domain.trim();
        if (!val) {
            setError("Please enter a website domain.");
            return;
        }

        // Regular Expression validation for URL or Domain name
        const isDomain = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,10}(\/.*)?$/.test(val) || 
                         /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\?.*)?$/.test(val);

        if (!isDomain) {
            setError("Please enter a valid website domain (e.g. domain.com).");
            playSynthTick(160, 'sawtooth', 0.25, 0.15);
            return;
        }

        // Start scanning animation
        setIsScanning(true);
        setScanProgress(0);
        setIsScanReady(false);
        playSynthTick(880, 'sine', 0.1, 0.2);

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 1;
            setScanProgress(currentProgress);

            // Audio feedback at steps
            if (currentProgress % 5 === 0) {
                playSynthTick(1000 + (currentProgress * 5), 'sine', 0.03, 0.08);
            }

            if (currentProgress === 25 || currentProgress === 60 || currentProgress === 90) {
                playSynthTick(1200 + (currentProgress * 3), 'triangle', 0.1, 0.15);
            }

            if (currentProgress >= 100) {
                clearInterval(interval);
                setIsScanning(false);
                setIsScanReady(true);
                
                // Success fanfares
                playSynthTick(523.25, 'sine', 0.12, 0.15); // C5
                setTimeout(() => playSynthTick(659.25, 'sine', 0.12, 0.15), 100); // E5
                setTimeout(() => playSynthTick(783.99, 'sine', 0.25, 0.2), 200); // G5
                
                // Open results modal
                let cleanDomain = val.replace(/^(https?:\/\/)?(www\.)?/, '').toLowerCase();
                setResultsDomain(cleanDomain);
                setShowModal(true);
                
                // Animate SVG Ring offset for score (84% score = 70.4 offset)
                setTimeout(() => {
                    setModalRingOffset(70);
                }, 300);
            }
        }, 35);
    };

    const closeResultsModal = () => {
        setShowModal(false);
        setModalRingOffset(440);
    };

    return (
        <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden cyber-grid-bg">
            <style dangerouslySetInnerHTML={{__html: `
                :root {
                    --seo-accent: #00E676;
                    --seo-accent-hover: #00C853;
                    --seo-accent-glow: rgba(0, 230, 118, 0.2);
                    --seo-accent-glow-strong: rgba(0, 230, 118, 0.4);
                }
                
                .seo-accent-text {
                    color: var(--seo-accent);
                }
                
                .seo-badge-pill i {
                    color: var(--seo-accent);
                }
                
                .seo-btn-submit {
                    background: var(--seo-accent);
                    color: #06021c;
                    box-shadow: 0 4px 15px var(--seo-accent-glow-strong);
                }
                
                .seo-btn-submit:hover:not(:disabled) {
                    background: var(--seo-accent-hover);
                    box-shadow: 0 6px 22px rgba(0, 230, 118, 0.6);
                }
                
                .seo-diag-status {
                    color: var(--seo-accent);
                }
                
                .seo-progress-fill {
                    background: linear-gradient(90deg, #00C853, var(--seo-accent));
                    box-shadow: 0 0 8px var(--seo-accent);
                }
                
                .seo-diag-badge {
                    border-color: var(--seo-accent);
                    color: var(--seo-accent);
                    background: rgba(0, 230, 118, 0.05);
                }
                
                .seo-status-dot.active::before {
                    background: var(--seo-accent);
                    box-shadow: 0 0 8px var(--seo-accent);
                }
                
                .seo-check-icon {
                    color: var(--seo-accent);
                    background: var(--seo-accent-glow);
                    border: 1px solid rgba(0, 230, 118, 0.3);
                }
                
                .seo-results-modal {
                    border-color: rgba(0, 230, 118, 0.3);
                    box-shadow: 0 25px 60px rgba(0, 230, 118, 0.15);
                }
                
                .seo-results-domain {
                    color: var(--seo-accent);
                    background: var(--seo-accent-glow);
                    border: 1px solid rgba(0, 230, 118, 0.3);
                }
                
                .seo-score-number {
                    color: var(--seo-accent);
                    text-shadow: 0 0 15px rgba(0, 230, 118, 0.4);
                }
                
                .seo-svg-ring circle {
                    stroke: var(--seo-accent);
                    filter: drop-shadow(0 0 6px var(--seo-accent));
                }
                
                .seo-breakdown-icon {
                    color: var(--seo-accent);
                }
                
                .seo-breakdown-score {
                    color: var(--seo-accent);
                }
                
                .seo-btn-modal-cta {
                    background: linear-gradient(135deg, var(--seo-accent), #00b0ff);
                    color: #06021c;
                    box-shadow: 0 10px 25px rgba(0, 230, 118, 0.3);
                }
                
                .seo-btn-modal-cta:hover {
                    box-shadow: 0 15px 30px rgba(0, 230, 118, 0.5);
                }
            `}} />

            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <div className="absolute w-[450px] h-[450px] rounded-full border border-white/5 top-[10%] left-[5%] animate-spin-slow flex items-center justify-center">
                    <div className="w-[350px] h-[350px] rounded-full border border-dashed border-white/10"></div>
                </div>
                <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5 bottom-[10%] right-[10%] animate-spin-reverse flex items-center justify-center">
                    <div className="w-1 h-[140px] bg-gradient-to-b from-green-500/20 to-transparent origin-bottom animate-radar-sweep"></div>
                </div>
            </div>

            {/* Header */}
            <header className="absolute top-0 left-0 w-full p-6 sm:px-12 z-50 flex items-center justify-between">
                <div 
                    onClick={() => {
                        playSynthTick(600, 'sine', 0.05, 0.05);
                        setView('landing');
                    }}
                    className="flex items-center gap-3 font-black text-xl tracking-tight text-white select-none cursor-pointer hover:opacity-85 transition-opacity"
                >
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                        <img src={LOGO_URL} className="w-full h-full object-contain" alt="Logo" />
                    </div>
                    VOXLUMEDIA
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                    <button 
                        onClick={() => {
                            playSynthTick(600, 'sine', 0.05, 0.05);
                            setView('landing');
                        }}
                        className="relative group overflow-hidden bg-gradient-to-r from-[#ff7b1a] to-amber-500 hover:from-[#e06200] hover:to-amber-400 text-white rounded-full px-5 py-2.5 text-xs sm:text-sm font-black shadow-[0_0_15px_rgba(255,123,26,0.3)] hover:shadow-[0_0_25px_rgba(255,123,26,0.6)] hover:scale-[1.03] transition-all active:scale-95 duration-200 flex items-center gap-1.5"
                    >
                        <i className="fa-solid fa-arrow-left text-xs"></i>
                        Vox Social Score
                    </button>
                    <a href="https://voxlumedia.com" target="_blank" rel="noopener noreferrer" className="bg-[#191046] border border-white/10 rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold hover:bg-white hover:text-black transition-all active:scale-95 duration-200">
                        Book Free Consultation &rarr;
                    </a>
                </div>
            </header>

            {/* Main Hero content */}
            <div className="flex-grow flex items-center justify-center w-full pt-32 pb-16 relative z-10">
                <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-4">
                    
                    {/* Left Side: Mascot visual with 3D mouse look */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                        <div 
                            ref={mascotRef}
                            className="w-full h-[550px] transition-transform duration-300 ease-out flex justify-center items-center relative z-20"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="absolute w-[420px] h-[420px] border border-dashed border-white/10 rounded-full animate-spin-slow pointer-events-none"></div>
                            <div className="absolute w-[320px] h-[320px] border border-white/10 rounded-full bg-gradient-to-r from-green-500/5 to-transparent pointer-events-none"></div>

                            {/* Mascot Image with green hue rotation filter */}
                            <img
                                src={MASCOT_URL}
                                alt="SEO Robot Mascot"
                                onClick={rotateQuote}
                                className="w-[80%] max-w-[420px] h-auto object-contain filter drop-shadow-2xl animate-float transition-all cursor-pointer hover:brightness-105"
                                style={{ filter: 'hue-rotate(85deg) drop-shadow(0 20px 40px rgba(0,0,0,0.6)) saturate(1.15)' }}
                            />

                            {/* Dialogue Bubble */}
                            <div 
                                onClick={rotateQuote}
                                className="absolute top-[8%] right-[-2%] z-30 bg-[#0c0735]/95 text-white px-5 py-4 rounded-2xl rounded-bl-none shadow-2xl border border-white/15 max-w-[250px] text-xs font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all"
                            >
                                <div className="flex items-center justify-between mb-1.5 gap-2">
                                    <span className="text-[10px] seo-accent-text font-black uppercase tracking-wider">Ryan Vox</span>
                                    <span className="text-[8px] bg-white/10 text-white/50 px-1 rounded font-extrabold uppercase">Tap Me</span>
                                </div>
                                <p className="leading-snug text-white/90">{bubbleText}</p>
                            </div>

                            {/* Bottom Card */}
                            <div className="absolute bottom-[12%] left-[-4%] z-30 max-w-[280px] bg-[#0c0735]/90 border border-white/15 p-4 rounded-2xl shadow-2xl flex gap-3 backdrop-blur-md">
                                <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 text-lg shrink-0">
                                    <i className="fa-solid fa-brain"></i>
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-white">AI-POWERED INSIGHTS</h4>
                                    <p className="text-[10px] text-white/70 font-semibold leading-normal">
                                        Our business-first engine automatically scans your site's SEO indicators instantly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Copywriting & Domain scanner form */}
                    <div className="lg:col-span-7 space-y-8 text-center lg:text-left animate-fade-in-up relative z-30">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] sm:text-xs font-black tracking-widest text-[#a882ff] uppercase">
                                <i className="fa-solid fa-bolt text-green-400 animate-pulse"></i>
                                AI-POWERED AUDIT TOOL
                            </div>

                            <h1 className="text-[2.8rem] sm:text-6xl lg:text-[4.8rem] font-black uppercase leading-[1.05] tracking-tighter text-white">
                                VOX SEO <br />
                                <span className="seo-accent-text">AUDIT</span>
                            </h1>

                            <p className="text-white/80 text-sm sm:text-lg lg:text-[20px] max-w-[620px] mx-auto lg:mx-0 font-medium leading-relaxed">
                                Get an instant technical and on-page evaluation. Learn how easily search engines crawl, index, and rank your website to drive organic traffic.
                            </p>
                        </div>

                        {/* Input form */}
                        <div className="relative w-full max-w-[650px] mx-auto lg:mx-0 space-y-4 pt-2">
                            <form onSubmit={handleAuditSubmit} className="flex flex-col sm:flex-row gap-2.5 bg-white/5 p-2 rounded-2xl border border-white/15 backdrop-blur-xl shadow-2xl relative transition-all duration-300 focus-within:border-green-400">
                                <div className="relative flex-grow flex items-center px-4">
                                    <span className={`transition-colors duration-300 text-xl font-mono ${domain ? 'seo-accent-text font-black' : 'text-white/40'}`}>@</span>
                                    <input
                                        type="text"
                                        required
                                        maxLength={100}
                                        value={domain}
                                        onChange={handleInputChange}
                                        placeholder="Enter Website Domain (e.g. domain.com)"
                                        disabled={isScanning}
                                        className="w-full bg-transparent text-white font-bold placeholder-white/40 focus:outline-none text-[15px] sm:text-base py-3"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isScanning}
                                    className="seo-btn-submit text-black font-black px-10 py-4 rounded-xl transition-all duration-200 text-sm whitespace-nowrap shadow-md flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isScanning ? (
                                        <>Scanning... <i className="fa-solid fa-spinner fa-spin"></i></>
                                    ) : (
                                        <>Get My Score <i className="fa-solid fa-arrow-right"></i></>
                                    )}
                                </button>
                            </form>

                            {/* Error display */}
                            {error && (
                                <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 mt-2 w-max mx-auto lg:mx-0 animate-fade-in-up">
                                    <i className="fa-solid fa-circle-exclamation text-rose-400"></i>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Simulated handwritten note */}
                            <div className="hidden md:flex absolute right-[-140px] top-[15px] items-center gap-2 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
                                <svg className="w-12 h-12 text-green-400 rotate-[-20deg]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="text-xs font-brush text-green-400 text-medium tracking-wide rotate-[-5deg]">Start your free audit!</span>
                            </div>

                            {/* Calibration indicator box */}
                            <div className="bg-[#0b072c] border border-white/10 rounded-2xl p-5 text-left shadow-2xl relative overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    <div className="md:col-span-5 space-y-1.5">
                                        <span className="text-[10px] font-black text-white/50 tracking-wider block">DIAGNOSTIC CALIBRATION</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black seo-accent-text tracking-tight">{scanProgress}%</span>
                                            <span className="text-[10px] font-mono text-white/40 uppercase">{isScanning ? 'AUDITING' : 'READY'}</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                                            <div 
                                                className="seo-progress-fill h-full rounded-full transition-all duration-300" 
                                                style={{ width: `${scanProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-7 flex flex-wrap gap-2 justify-start md:justify-end">
                                        <div className="px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all cursor-default bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_15px_rgba(0,230,118,0.15)]">
                                            <i className="fa-solid fa-bolt"></i> Core Web Vitals
                                        </div>
                                        <div className="px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all cursor-default bg-pink-500/10 border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(255,0,127,0.15)]">
                                            <i className="fa-solid fa-link"></i> Backlink Profile
                                        </div>
                                        <div className="px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all cursor-default bg-amber-400/10 border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(255,184,0,0.15)]">
                                            <i className="fa-solid fa-bullseye"></i> Keyword Gap
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3.5 pt-3.5 border-t border-white/5 flex gap-4 text-[10px] font-mono text-white/60">
                                    <span className="flex items-center gap-1.5">
                                        <i className={`fa-solid ${scanProgress >= 25 ? 'fa-circle-check text-green-400' : 'fa-circle text-white/20'}`}></i> 
                                        URL FORMAT
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <i className={`fa-solid ${scanProgress >= 60 ? 'fa-circle-check text-green-400' : 'fa-circle text-white/20'}`}></i> 
                                        SCAN DEPTH
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <i className={`fa-solid ${scanProgress >= 90 ? 'fa-circle-check text-green-400' : 'fa-circle text-white/20'}`}></i> 
                                        SSL SAFE
                                    </span>
                                </div>
                            </div>

                            {/* Trust badges and constraints row */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-bold text-white/70 pt-1">
                                <span className="flex items-center gap-1.5"><i className="fa-solid fa-circle-check seo-accent-text"></i> No credit card required</span>
                                <span className="flex items-center gap-1.5"><i className="fa-solid fa-circle-check seo-accent-text"></i> Free instant report</span>
                                <span className="flex items-center gap-1.5"><i className="fa-solid fa-circle-check seo-accent-text"></i> Finished in 60s</span>
                            </div>

                            <div className="flex justify-between items-center text-[11px] text-white/40 font-semibold px-2">
                                <span>Optimized for Google & Bing Search Algorithms</span>
                                <span className="font-mono">{charCount}/100 characters</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Stats block */}
            <div className="w-full relative z-30 px-6 sm:px-12 pb-10">
                <div className="max-w-[1300px] mx-auto solid-glassmorphic rounded-[2.5rem] p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xl">
                    
                    <div className="md:col-span-3 flex items-center gap-4 justify-center md:justify-start group cursor-default transition-transform duration-300 hover:scale-[1.03]">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center seo-accent-text text-xl transition-all duration-300 group-hover:bg-green-500 group-hover:text-black">
                            <i className="fa-solid fa-globe"></i>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black uppercase text-white/50 tracking-wider">TRUSTED BY</p>
                            <p className="text-sm font-black text-white leading-tight">50+ Agencies Around the World</p>
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
                            <p className="text-[10px] font-black uppercase text-white/50 tracking-wider">PAGES ANALYZED</p>
                            <p className="text-lg font-black text-white">50M+ Across the Web</p>
                        </div>
                    </div>

                    <div className="md:col-span-3 flex flex-col items-center md:items-end justify-center gap-2">
                        <p className="text-[10px] font-black uppercase text-white/50 tracking-wider">SUPPORTED ENGINES</p>
                        <div className="flex items-center gap-4 text-xl">
                            <div className="flex items-center gap-1.5 group cursor-pointer" title="Google Search Supported">
                                <i className="fa-brands fa-google text-blue-400 transition-transform duration-300 group-hover:scale-125"></i>
                                <span className="text-[10px] font-bold text-white/60">Google</span>
                            </div>
                            <div className="flex items-center gap-1.5 group cursor-pointer" title="Bing Search Supported">
                                <i className="fa-brands fa-microsoft text-emerald-400 transition-transform duration-300 group-hover:scale-125"></i>
                                <span className="text-[10px] font-bold text-white/60">Bing</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-8 text-center text-xs text-white/40 font-semibold tracking-wide select-none">
                    Copyright © 2026 Voxlumedia™ | Creative Agency for Digital Marketing
                </div>
            </div>

            {/* Results Modal Backdrop */}
            {showModal && (
                <div 
                    onClick={closeResultsModal}
                    className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in"
                >
                    {/* Modal Content container */}
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="seo-results-modal bg-[#0c0735]/95 border-2 rounded-[2rem] w-full max-w-[650px] p-8 sm:p-10 shadow-2xl relative overflow-hidden animate-zoom-in"
                    >
                        <button 
                            onClick={closeResultsModal}
                            className="absolute top-5 right-5 bg-white/5 border border-white/10 text-white/60 hover:text-white w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
                        >
                            <i className="fa-solid fa-xmark text-lg"></i>
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="font-heading text-2xl sm:text-3xl font-black mb-1.5">SEO Audit Complete!</h2>
                            <div className="seo-results-domain text-xs sm:text-sm font-bold tracking-wider px-5 py-1.5 rounded-full inline-block">
                                {resultsDomain}
                            </div>
                        </div>

                        {/* Animated Score Circle */}
                        <div className="flex justify-center items-center mb-8">
                            <div className="relative w-[140px] h-[140px] display flex items-center justify-center rounded-full bg-white/[0.02] border border-white/5 shadow-inner">
                                <div className="text-center">
                                    <div className="font-heading text-5xl font-black seo-score-number">84</div>
                                    <div className="text-[9px] font-black text-white/40 tracking-wider">OVERALL</div>
                                </div>
                                <svg className="seo-svg-ring absolute top-[-4px] left-[-4px] w-[148px] h-[148px] rotate-[-90deg]">
                                    <circle 
                                        cx="74" 
                                        cy="74" 
                                        r="70" 
                                        strokeWidth="6" 
                                        fill="transparent" 
                                        strokeLinecap="round" 
                                        strokeDasharray="440" 
                                        strokeDashoffset={modalRingOffset}
                                        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.1, 0.8, 0.2, 1)' }}
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Breakdown Categories */}
                        <div className="flex flex-col gap-4 mb-8">
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex justify-between items-center gap-4 sm:flex-row flex-col sm:items-center items-start">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-green-400 text-lg shrink-0">
                                        <i className="fa-solid fa-bolt"></i>
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-xs sm:text-sm font-black text-white">Core Web Vitals</h4>
                                        <p className="text-[10px] sm:text-xs text-white/60 leading-normal">Good performance indicators. Site loads in 1.4s.</p>
                                    </div>
                                </div>
                                <div className="seo-breakdown-score font-black text-lg self-end sm:self-auto">
                                    92<span className="text-xs text-white/30 font-bold">/100</span>
                                </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex justify-between items-center gap-4 sm:flex-row flex-col sm:items-center items-start">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-pink-400 text-lg shrink-0">
                                        <i className="fa-solid fa-link"></i>
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-xs sm:text-sm font-black text-white">Backlink Profile</h4>
                                        <p className="text-[10px] sm:text-xs text-white/60 leading-normal">Needs action. Found 12 broken backlink paths.</p>
                                    </div>
                                </div>
                                <div className="text-pink-400 font-black text-lg self-end sm:self-auto">
                                    68<span className="text-xs text-white/30 font-bold">/100</span>
                                </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex justify-between items-center gap-4 sm:flex-row flex-col sm:items-center items-start">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-amber-400 text-lg shrink-0">
                                        <i className="fa-solid fa-bullseye"></i>
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-xs sm:text-sm font-black text-white">Keyword Gap</h4>
                                        <p className="text-[10px] sm:text-xs text-white/60 leading-normal">Competitors outrank you in 24 major keywords.</p>
                                    </div>
                                </div>
                                <div className="text-amber-400 font-black text-lg self-end sm:self-auto">
                                    74<span className="text-xs text-white/30 font-bold">/100</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Consultation booking */}
                        <div className="flex flex-col gap-3 items-center">
                            <a 
                                href="https://voxlumedia.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="seo-btn-modal-cta w-full text-center py-4 rounded-full font-black text-base flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
                            >
                                <span>Book Free Consultation to Fix Issues</span> <i class="fa-solid fa-calendar-days"></i>
                            </a>
                            <p className="text-[10px] text-white/40 font-bold text-center">
                                Get a full 30-minute breakdown with our technical specialists absolutely free.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
