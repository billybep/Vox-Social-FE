import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { playSynthTick } from '../utils/audio';
import LogoutModal from './LogoutModal';

const LOGO_URL = "https://raw.githubusercontent.com/lengkongandreuw/voxsocial/main/assets/vsllogo.png";
const MASCOT_URL = "https://raw.githubusercontent.com/lengkongandreuw/voxsocial/main/assets/ryanvox.png";
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export default function SeoAuditSection({ setView }) {
    const mascotRef = useRef(null);
    const [domain, setDomain] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [targetKeyword, setTargetKeyword] = useState('');
    const [targetLocation, setTargetLocation] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [gbpUrl, setGbpUrl] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [error, setError] = useState('');

    // Scanning state
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(100);
    const [currentAction, setCurrentAction] = useState('Initializing scan sequences...');
    const [auditResults, setAuditResults] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // View state
    const [isGateLocked, setIsGateLocked] = useState(false);
    const [webhookStatus, setWebhookStatus] = useState('idle');
    const [showResults, setShowResults] = useState(false);
    const [resultsDomain, setResultsDomain] = useState('');
    const [auditData, setAuditData] = useState(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Dashboard Accordion States
    const [activeAdvancedTab, setActiveAdvancedTab] = useState('pagespeed');
    const [expandedAction, setExpandedAction] = useState(null);
    const [expandedAuditCategory, setExpandedAuditCategory] = useState('seo');

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
        if (showResults) return; // Disable tilt listeners when viewing results to save memory
        const handleMouseMove = (e) => {
            if (!mascotRef.current) return;
            const x = (window.innerWidth / 2 - e.pageX) / 75;
            const y = (window.innerHeight / 2 - e.pageY) / 75;
            mascotRef.current.style.transform = `perspective(1000px) rotateY(${-x}deg) rotateX(${y}deg)`;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [showResults]);

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

    // Audit scanning pipeline — calls real backend
    const handleAuditSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const val = domain.trim();
        if (!val) {
            setError('Please enter a website domain.');
            return;
        }
        const isDomain = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,10}(\/.*)?$/.test(val) ||
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*(\?.*)?$/.test(val);
        if (!isDomain) {
            setError('Please enter a valid website domain (e.g. domain.com).');
            playSynthTick(160, 'sawtooth', 0.25, 0.15);
            return;
        }

        playSynthTick(880, 'sine', 0.1, 0.2);
        setIsGateLocked(true);
    };

    const handleUnlockSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');

        if (!businessName.trim() || !targetKeyword.trim() || !targetLocation.trim() || !businessAddress.trim() || !phone.trim()) {
            return; // required fields
        }

        // Send to GHL Webhook (simulated for now)
        const sendWebhook = async () => {
            setWebhookStatus('sending');
            try {
                const ghlPayload = {
                    businessName: businessName.trim(),
                    targetKeyword: targetKeyword.trim(),
                    targetLocation: targetLocation.trim(),
                    businessAddress: businessAddress.trim(),
                    phone: phone.trim(),
                    gbpUrl: gbpUrl.trim(),
                    domain: domain.trim(),
                    funnel_entry_point: "SEO Audit Tool"
                };
                console.log("Sending payload to GHL (Simulated):", ghlPayload);
                await new Promise(resolve => setTimeout(resolve, 800));
            } catch (err) {
                console.error("GHL webhook failed", err);
            } finally {
                setWebhookStatus('complete');
            }
        };
        sendWebhook();

        setIsGateLocked(false);
        setIsScanning(true);
        setScanProgress(0);
        setAuditData(null);
        playSynthTick(880, 'sine', 0.1, 0.2);

        const val = domain.trim();
        
        // Animate progress to 95% while waiting for API
        let currentProgress = 0;
        let resolved = false;
        const interval = setInterval(() => {
            if (resolved) return;
            const increment = currentProgress < 60 ? 1.2 : currentProgress < 85 ? 0.5 : 0.15;
            currentProgress = Math.min(95, currentProgress + increment);
            setScanProgress(Math.floor(currentProgress));
            if (currentProgress % 5 < 1.2) playSynthTick(1000 + currentProgress * 5, 'sine', 0.03, 0.08);
        }, 80);

        try {
            const cleanDomain = val.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '').toLowerCase();
            setCurrentAction('Generating detailed audit report...');
            const resp = await fetch(`${API_BASE}/seo/audit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    domain: cleanDomain,
                    business_name: businessName.trim(),
                    target_keyword: targetKeyword.trim(),
                    target_location: targetLocation.trim(),
                }),
            });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || `Server error ${resp.status}`);

            resolved = true;
            clearInterval(interval);
            setScanProgress(100);
            setAuditData(data);
            setResultsDomain(cleanDomain);

            // Success fanfare
            playSynthTick(523.25, 'sine', 0.12, 0.15);
            setTimeout(() => playSynthTick(659.25, 'sine', 0.12, 0.15), 100);
            setTimeout(() => playSynthTick(783.99, 'sine', 0.25, 0.2), 200);
            setTimeout(() => {
                setIsScanning(false);
                setShowResults(true);
            }, 350);
        } catch (err) {
            resolved = true;
            clearInterval(interval);
            setIsScanning(false);
            setScanProgress(35);
            setError('Audit failed: ' + (err.message || 'Unknown error. Please try again.'));
            playSynthTick(160, 'sawtooth', 0.25, 0.15);
        }
    };

    // Return back to scan input view
    const triggerNewAudit = () => {
        playSynthTick(700, 'sine', 0.06, 0.1);
        setShowResults(false);
        setDomain('');
        setCharCount(0);
        setScanProgress(35);
    };

    // Print PDF
    const triggerPrintPDF = () => {
        playSynthTick(1000, 'sine', 0.08, 0.1);
        window.print();
    };

    // Download JSON Report file — uses real audit data
    const triggerDownloadJSON = () => {
        playSynthTick(800, 'sine', 0.06, 0.1);
        const reportData = auditData || { domain: resultsDomain, error: 'No audit data available' };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(reportData, null, 2))}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', `vox_seo_report_${resultsDomain}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    // ── Derived helpers from auditData ──────────────────────────────────────
    const d = auditData || {};
    const snap = d.page_snapshot || {};
    const sw = d.sitewide || {};
    const breakdown = d.breakdown || {};
    const metrics = d.metrics_summary || {};
    const execSummary = d.executive_summary || [];
    const actionPlan = d.action_plan || [];
    const pageRows = d.page_rows || [];
    const listings = d.listings || [];
    const advanced = d.advanced || {};
    const psiMobile = advanced.pagespeed?.mobile || {};
    const psiDesktop = advanced.pagespeed?.desktop || {};
    const brokenLinks = advanced.broken_links || [];
    const techList = advanced.technology || [];
    const socialProfileList = advanced.social_profiles || [];
    const secHeaders = advanced.security_headers || {};
    const checks = d.checks || {};

    // Helper: convert status to badge styling
    const statusBadge = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'pass') return 'bg-green-500/10 border-green-500/20 text-green-400';
        if (s === 'fail') return 'bg-red-500/10 border-red-500/20 text-red-400';
        if (s === 'info') return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    };
    const statusDot = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'pass') return 'bg-green-500';
        if (s === 'fail') return 'bg-red-500 animate-pulse';
        if (s === 'info') return 'bg-blue-400';
        return 'bg-amber-400';
    };

    // Helper: render a checks array as cards
    const CheckList = ({ items }) => (
        <div className="space-y-4">
            {(items || []).map((c, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl print-border">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded border font-extrabold text-[10px] print-text-dark ${statusBadge(c.status)}`}>
                            {(c.status || 'INFO').toUpperCase()}
                        </span>
                        <strong className="text-xs text-white print-text-dark">{c.title} ({c.impact} Impact)</strong>
                    </div>
                    <p className="text-xs text-white/70 print-text-muted mb-2">{c.details}</p>
                    {c.fix && <p className="text-xs text-green-400 font-semibold print-text-dark"><strong className="text-white print-text-dark">How to fix:</strong> {c.fix}</p>}
                </div>
            ))}
            {(!items || items.length === 0) && (
                <p className="text-xs text-white/40 italic">No checks in this category.</p>
            )}
        </div>
    );

    // Helper functions for scoring grades
    const getGradeColorClass = (score) => {
        if (score >= 80) return 'text-green-400 bg-green-500/10 border-green-500/30';
        if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
        return 'text-red-400 bg-red-500/10 border-red-500/30';
    };

    const getGradeLabel = (score) => {
        if (score >= 80) return 'Good';
        if (score >= 60) return 'Needs Work';
        return 'Priority';
    };

    return (
        <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden cyber-grid-bg">
            <style dangerouslySetInnerHTML={{
                __html: `
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

                /* Print-specific overrides */
                @media print {
                    body {
                        background: #ffffff !important;
                        color: #000000 !important;
                    }
                    .cyber-grid-bg,
                    body::before,
                    body::after,
                    .no-print {
                        display: none !important;
                    }
                    .print-full-width {
                        max-width: 100% !important;
                        width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .print-border {
                        border: 1px solid #cccccc !important;
                        background: #ffffff !important;
                        color: #000000 !important;
                        box-shadow: none !important;
                    }
                    .print-text-dark {
                        color: #000000 !important;
                    }
                    .print-text-muted {
                        color: #555555 !important;
                    }
                    .print-progress-bar {
                        border: 1px solid #777777 !important;
                        background: #eeeeee !important;
                    }
                    .print-progress-fill {
                        background: #00C853 !important;
                    }
                    .print-page-break {
                        page-break-after: always;
                    }
                    header, footer {
                        display: none !important;
                    }
                }
            `}} />

            {/* Background elements (Not printed) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none no-print">
                <div className="absolute w-[450px] h-[450px] rounded-full border border-white/5 top-[10%] left-[5%] animate-spin-slow flex items-center justify-center">
                    <div className="w-[350px] h-[350px] rounded-full border border-dashed border-white/10"></div>
                </div>
                <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5 bottom-[10%] right-[10%] animate-spin-reverse flex items-center justify-center">
                    <div className="w-1 h-[140px] bg-gradient-to-b from-green-500/20 to-transparent origin-bottom animate-radar-sweep"></div>
                </div>
            </div>

            {/* Header (Not printed) */}
            <header className="absolute top-0 left-0 w-full p-4 sm:p-6 sm:px-12 z-50 flex items-center justify-between no-print">
                <div className="flex items-center gap-3 font-black text-xl tracking-tight text-white select-none">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                        <img src={LOGO_URL} className="w-full h-full object-contain" alt="Logo" />
                    </div>
                    <span className="hidden sm:block">VOXLUMEDIA</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={() => {
                            playSynthTick(600, 'sine', 0.05, 0.05);
                            setView('landing');
                        }}
                        className="relative group overflow-hidden bg-gradient-to-r from-[#ff7b1a] to-amber-500 hover:from-[#e06200] hover:to-amber-400 text-white rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-[11px] sm:text-sm font-black shadow-[0_0_15px_rgba(255,123,26,0.3)] hover:shadow-[0_0_25px_rgba(255,123,26,0.6)] hover:scale-[1.03] transition-all active:scale-95 duration-200 flex items-center gap-1.5 whitespace-nowrap"
                    >
                        <i className="fa-solid fa-arrow-left text-[10px] sm:text-xs"></i>
                        <span>Vox Social Score</span>
                    </button>
                    <a href="https://voxlumedia.com" target="_blank" rel="noopener noreferrer" className="hidden md:flex bg-[#191046] border border-white/10 rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold hover:bg-white hover:text-black transition-all active:scale-95 duration-200 whitespace-nowrap">
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

            {/* SEO GATE FORM OVERLAY */}
            {isGateLocked && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07041a]/85 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto animate-fade-in">
                    <div className="w-full max-w-2xl bg-[#0b072c] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden my-auto">
                        
                        {/* Background glowing effects for the modal */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-[#ff7b1a]/20 blur-[80px] pointer-events-none"></div>

                        <div className="text-center mb-8 relative z-10">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#ff7b1a] to-amber-500 rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-pulse-glow">
                                <i className="fa-solid fa-lock text-white text-2xl"></i>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">Unlock Your Full SEO Audit</h2>
                            <p className="text-white/60 text-sm">We are analyzing <strong className="text-white">{domain}</strong> in the background. Tell us a bit about this business so we can customize your results and save it to your CRM.</p>
                        </div>

                        <form onSubmit={handleUnlockSubmit} className="relative z-10 space-y-4 text-left">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] uppercase font-bold text-white/60 tracking-wider pl-1">Business Name *</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-building absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
                                        <input type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Voxlumedia" className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-[#ff7b1a]/50 focus:bg-white/10 transition-all placeholder-white/20" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] uppercase font-bold text-white/60 tracking-wider pl-1">Target Service / Keyword *</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
                                        <input type="text" required value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} placeholder="e.g. SEO Agency" className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-[#ff7b1a]/50 focus:bg-white/10 transition-all placeholder-white/20" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] uppercase font-bold text-white/60 tracking-wider pl-1">Target City / Area *</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
                                        <input type="text" required value={targetLocation} onChange={(e) => setTargetLocation(e.target.value)} placeholder="e.g. New York, NY" className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-[#ff7b1a]/50 focus:bg-white/10 transition-all placeholder-white/20" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] uppercase font-bold text-white/60 tracking-wider pl-1">Phone / NAP Phone *</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
                                        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-[#ff7b1a]/50 focus:bg-white/10 transition-all placeholder-white/20" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-[11px] uppercase font-bold text-white/60 tracking-wider pl-1">Business Address / NAP Address *</label>
                                <div className="relative">
                                    <i className="fa-solid fa-map-pin absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
                                    <input type="text" required value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="123 Main St, Suite 100, City, State, ZIP" className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-[#ff7b1a]/50 focus:bg-white/10 transition-all placeholder-white/20" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] uppercase font-bold text-white/60 tracking-wider pl-1">Google Business Profile / Maps URL *</label>
                                <div className="relative">
                                    <i className="fa-brands fa-google absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
                                    <input type="url" required value={gbpUrl} onChange={(e) => setGbpUrl(e.target.value)} placeholder="https://goo.gl/maps/..." className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-[#ff7b1a]/50 focus:bg-white/10 transition-all placeholder-white/20" />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={webhookStatus === 'sending'}
                                    className="w-full relative group overflow-hidden bg-gradient-to-r from-[#ff7b1a] to-amber-500 hover:from-[#e06200] hover:to-amber-400 text-white rounded-xl px-6 py-4 text-sm font-black shadow-[0_0_20px_rgba(255,123,26,0.3)] hover:shadow-[0_0_30px_rgba(255,123,26,0.5)] transition-all active:scale-[0.98] duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {webhookStatus === 'sending' ? (
                                        <>
                                            <i className="fa-solid fa-circle-notch fa-spin text-lg"></i>
                                            <span>Unlocking & Sending Data...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Unlock Audit Result</span>
                                            <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                        </>
                                    )}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsGateLocked(false)} 
                                    className="w-full mt-4 text-white/40 hover:text-white/80 text-xs font-semibold transition-colors"
                                >
                                    Cancel & Return
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Switching logic */}
            {!showResults ? (
                /* ==========================================================================
                   VIEW 1: DOMAIN SCANNER INPUT VIEW
                   ========================================================================== */
                <div className="flex-grow flex items-center justify-center w-full pt-32 pb-16 relative z-10 no-print">
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

                                {/* Advanced Settings Toggle */}
                                <div className="text-left mt-3 px-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                        className="text-xs font-semibold text-white/50 hover:text-white/80 transition-colors flex items-center gap-2"
                                    >
                                        <i className={`fa-solid fa-chevron-${showAdvanced ? 'up' : 'down'} text-[10px]`}></i>
                                        {showAdvanced ? 'Hide Advanced Settings' : 'Advanced Settings (Optional)'}
                                    </button>
                                </div>

                                {/* Advanced Settings Fields */}
                                {showAdvanced && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 animate-fade-in-up mt-3">
                                        {/* Old Advanced Settings fields removed because they are now in the lock screen form */}
                                    </div>
                                )}

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
            ) : (
                /* ==========================================================================
                   VIEW 2: DETAILED SEO AUDIT RESULTS DASHBOARD
                   ========================================================================== */
                <div className="flex-grow w-full max-w-[1300px] mx-auto px-4 sm:px-6 pt-32 pb-16 relative z-10 print-full-width">

                    {/* Floating Action Header Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl no-print">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black tracking-widest text-green-400 uppercase block">SEO Audit Completed</span>
                            <h2 className="text-xl sm:text-2xl font-black text-white">
                                SEO Audit Report for <span className="text-green-400 underline font-mono">{resultsDomain}</span>
                            </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={triggerDownloadJSON}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-extrabold border border-white/10 hover:border-white hover:bg-white/5 transition-all text-white"
                            >
                                <i className="fa-solid fa-download text-green-400"></i> Download JSON
                            </button>
                            <button
                                onClick={triggerPrintPDF}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-extrabold border border-white/10 hover:border-white hover:bg-white/5 transition-all text-white"
                            >
                                <i className="fa-solid fa-file-pdf text-[#ff73e6]"></i> Save/Print PDF
                            </button>
                            <button
                                onClick={triggerNewAudit}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-black bg-green-500 hover:bg-green-400 text-[#06021c] transition-all shadow-lg hover:shadow-green-500/20"
                            >
                                <i className="fa-solid fa-rotate text-xs"></i> New Audit
                            </button>
                        </div>
                    </div>

                    {/* Dashboard Header Info (Printed) */}
                    <div className="hidden print:block mb-8">
                        <h1 className="text-3xl font-black text-black">VOXLUMEDIA SEO Audit Report</h1>
                        <p className="text-gray-600 font-mono">Domain: {resultsDomain}</p>
                        <p className="text-gray-500 text-xs">Audited on: {new Date().toLocaleDateString()} | Prepared by Voxlumedia</p>
                    </div>

                    {/* Subtitle & Professional Audit Description */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-green-500/5 to-white/5 border border-white/10 rounded-2xl shadow-lg print-border">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <span className="px-3.5 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest print-text-dark">
                                <i className="fa-solid fa-square-poll-vertical mr-1"></i> Technical Analysis
                            </span>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-[10px] bg-white/5 border border-white/10 rounded-md px-2.5 py-1 text-white/50 font-bold print-text-muted">Prepared by: Voxlumedia</span>
                                <span className="text-[10px] bg-white/5 border border-white/10 rounded-md px-2.5 py-1 text-white/50 font-bold print-text-muted">Date: {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                        <p className="text-sm sm:text-base text-white/70 leading-relaxed print-text-muted">
                            A comprehensive technical audit covering search engine optimization (SEO), mobile usability, Core Web Vitals performance, backlink domain authority, local listings readiness, security protocols, and rule-based diagnostic improvements.
                        </p>

                        {/* Badges metadata list */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            <span className="px-3 py-1 bg-white/5 border border-white/5 text-white/60 text-[10px] font-bold rounded-lg font-mono print-text-dark">{resultsDomain}</span>
                            <span className="px-3 py-1 bg-white/5 border border-white/5 text-white/60 text-[10px] font-bold rounded-lg print-text-dark">
                                {metrics.sitemaps_scanned ?? 0} {metrics.sitemaps_scanned === 1 ? 'Sitemap' : 'Sitemaps'} Scanned
                            </span>
                            <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold rounded-lg print-text-dark">
                                {metrics.passed ?? 0} Passed
                            </span>
                            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold rounded-lg print-text-dark">
                                {metrics.warnings ?? 0} Warnings
                            </span>
                            <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold rounded-lg print-text-dark">
                                {metrics.failed ?? 0} Failed Checks
                            </span>
                        </div>
                    </div>

                    {/* Grade and Metrics Split View */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                        {/* Overall Score Circle */}
                        <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 bg-[#0c0735]/80 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-md relative overflow-hidden print-border">
                            <h3 className="text-xs font-black uppercase text-white/50 tracking-wider mb-6 print-text-muted">OVERALL SEO SCORE</h3>

                            <div className="relative w-[180px] h-[180px] flex items-center justify-center rounded-full bg-white/[0.02] border border-white/5 shadow-inner">
                                <div className="text-center z-10">
                                    <div className={`font-heading text-6xl font-black text-shadow-glow ${d.overall_score >= 80 ? 'text-green-400' : d.overall_score >= 60 ? 'text-amber-400' : 'text-rose-500'}`}>
                                        {d.overall_score ?? 0}
                                    </div>
                                    <div className="text-sm font-black text-white/40 tracking-widest mt-1">GRADE {d.overall_grade || '—'}</div>
                                </div>
                                <svg className="absolute top-[-4px] left-[-4px] w-[188px] h-[188px] rotate-[-90deg]">
                                    <circle
                                        cx="94"
                                        cy="94"
                                        r="90"
                                        strokeWidth="6"
                                        fill="transparent"
                                        stroke={d.overall_score >= 80 ? '#00E676' : d.overall_score >= 60 ? '#F59E0B' : '#EF4444'}
                                        strokeLinecap="round"
                                        strokeDasharray="565"
                                        strokeDashoffset={565 - (565 * (d.overall_score ?? 0)) / 100}
                                        style={{ filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))' }}
                                    />
                                </svg>
                            </div>

                            <p className="text-xs text-white/40 font-bold text-center mt-6 uppercase tracking-wider print-text-muted">Domain scanned successfully</p>
                        </div>

                        {/* Executive Summary Tag Highlights */}
                        <div className="lg:col-span-8 p-6 sm:p-8 bg-[#0c0735]/50 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-md print-border flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                                    <h3 className="text-sm font-black uppercase text-white/50 tracking-wider print-text-muted">EXECUTIVE SUMMARY</h3>
                                    <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/25 print-text-dark">SCAN COMPLETE</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                                    {/* Overall Grade Card */}
                                    <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all p-4 rounded-2xl print-border relative overflow-hidden group flex flex-col">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 blur-2xl rounded-full group-hover:bg-white/10 transition-all"></div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-1.5"><i className="fa-solid fa-ranking-star text-white/40"></i> OVERALL GRADE</span>
                                        </div>
                                        <div className="flex-1 flex items-center gap-3 mt-1">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-2xl font-black text-white shadow-inner">
                                                {d.overall_grade || '—'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-0.5">Score</span>
                                                <span className="text-lg font-black text-white leading-none">{d.overall_score ?? '—'} <span className="text-[10px] font-bold text-white/30 ml-0.5">pts</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Audit Results Card */}
                                    <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all p-4 rounded-2xl print-border relative overflow-hidden group flex flex-col">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 blur-2xl rounded-full group-hover:bg-white/10 transition-all"></div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-1.5"><i className="fa-solid fa-list-check text-white/40"></i> AUDIT RESULTS</span>
                                        </div>
                                        <div className="flex gap-1.5 mt-auto">
                                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1.5 rounded-xl text-xs font-black flex-1 text-center flex flex-col justify-center leading-tight shadow-[0_0_10px_rgba(0,230,118,0.05)]">
                                                <span className="text-lg">{metrics.passed ?? 0}</span>
                                                <span className="text-[8px] uppercase tracking-wider opacity-70 mt-0.5">Pass</span>
                                            </span>
                                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1.5 rounded-xl text-xs font-black flex-1 text-center flex flex-col justify-center leading-tight shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                                                <span className="text-lg">{metrics.warnings ?? 0}</span>
                                                <span className="text-[8px] uppercase tracking-wider opacity-70 mt-0.5">Warn</span>
                                            </span>
                                            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1.5 rounded-xl text-xs font-black flex-1 text-center flex flex-col justify-center leading-tight shadow-[0_0_10px_rgba(244,63,94,0.05)]">
                                                <span className="text-lg">{metrics.failed ?? 0}</span>
                                                <span className="text-[8px] uppercase tracking-wider opacity-70 mt-0.5">Fail</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Pages Scanned Card */}
                                    <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all p-4 rounded-2xl print-border relative overflow-hidden group flex flex-col">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 blur-2xl rounded-full group-hover:bg-white/10 transition-all"></div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-1.5"><i className="fa-solid fa-file-magnifying-glass text-white/40"></i> PAGES SCANNED</span>
                                        </div>
                                        <div className="flex gap-2 mt-auto">
                                            <span className="bg-[#a882ff]/10 text-[#a882ff] border border-[#a882ff]/20 px-2 py-1.5 rounded-xl text-xs font-black flex-1 text-center flex flex-col justify-center leading-tight shadow-[0_0_10px_rgba(168,130,255,0.05)]">
                                                <span className="text-lg">{metrics.urls_discovered ?? '—'}</span>
                                                <span className="text-[8px] uppercase tracking-wider opacity-70 mt-0.5">URLs</span>
                                            </span>
                                            <span className="bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20 px-2 py-1.5 rounded-xl text-xs font-black flex-1 text-center flex flex-col justify-center leading-tight shadow-[0_0_10px_rgba(0,230,118,0.05)]">
                                                <span className="text-lg">{metrics.sitemaps_scanned ?? '—'}</span>
                                                <span className="text-[8px] uppercase tracking-wider opacity-70 mt-0.5">Sitemaps</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Executive Summary Bullet Logs — dynamic from API */}
                                <div className="space-y-2">
                                    {execSummary.length > 0 ? execSummary.map((line, i) => {
                                        const colors = ['text-amber-400', 'text-red-400', 'text-green-400', 'text-amber-400', 'text-green-400', 'text-amber-400', 'text-[#ff73e6]', 'text-blue-400'];
                                        const icons = ['fa-circle-exclamation', 'fa-triangle-exclamation', 'fa-circle-check', 'fa-circle-exclamation', 'fa-circle-check', 'fa-circle-exclamation', 'fa-chart-line', 'fa-link'];
                                        const col = colors[i % colors.length];
                                        const ico = icons[i % icons.length];
                                        return (
                                            <div key={i} className="flex items-start gap-2 text-xs text-white/70 print-text-muted">
                                                <span className={`${col} shrink-0 font-bold`}><i className={`fa-solid ${ico}`}></i> Note</span>
                                                <p>{line}</p>
                                            </div>
                                        );
                                    }) : (
                                        <p className="text-xs text-white/40 italic">Loading executive summary…</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Print page break */}
                    <div className="print-page-break"></div>

                    {/* Section: Component Score Breakdowns */}
                    <div className="mb-8">
                        <h3 className="text-sm font-black uppercase text-white/50 tracking-wider mb-4 print-text-muted">SCORE BREAKDOWN MATRIX</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                                { name: 'SEO', key: 'SEO' },
                                { name: 'Usability', key: 'Usability' },
                                { name: 'Performance', key: 'Performance' },
                                { name: 'Social', key: 'Social' },
                                { name: 'Local SEO', key: 'LocalSEO' },
                                { name: 'Technology', key: 'Technology' },
                                { name: 'Links', key: 'Links' },
                                { name: 'Rankings', key: 'Rankings' },
                                { name: 'Authority', key: 'Authority' },
                                { name: 'Security', key: 'Security' }
                            ].map((item) => {
                                const score = breakdown[item.key] ?? 0;
                                return (
                                    <div key={item.name} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all print-border">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-black text-white print-text-dark">{item.name}</span>
                                            <span className={`text-[9px] font-black border rounded px-1.5 py-0.2 uppercase ${getGradeColorClass(score)}`}>
                                                {getGradeLabel(score)}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-baseline">
                                                <span className="text-xs text-white/40 font-bold print-text-muted">Score</span>
                                                <span className="text-base font-black text-white print-text-dark">{score}/100</span>
                                            </div>
                                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden print-progress-bar">
                                                <div
                                                    className={`h-full rounded-full print-progress-fill ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                    style={{ width: `${score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section: Google SERP Preview */}
                    <div className="mb-8 p-6 bg-[#0c0735]/40 border border-white/10 rounded-2xl shadow-xl print-border">
                        <h3 className="text-xs font-black uppercase text-white/50 tracking-wider mb-4 print-text-muted">GOOGLE SERP PREVIEW</h3>

                        <div className="p-5 bg-white border border-gray-200 rounded-xl font-sans text-left text-black shadow-inner max-w-[650px] mb-4">
                            <span className="text-[11px] text-gray-500 font-mono block mb-1">{d.website_url || resultsDomain}</span>
                            <h4 className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug line-clamp-1">
                                {snap.title || '(No title tag found)'}
                            </h4>
                            <p className="text-sm text-[#4d5156] mt-1 leading-normal line-clamp-2">
                                {snap.description || '(No meta description found)'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-white/5 border border-white/5 rounded-xl print-border">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-white/50 print-text-muted">Title Tag length</span>
                                    <span className={`text-xs font-mono font-bold ${(snap.title_length || 0) >= 30 && (snap.title_length || 0) <= 65 ? 'text-green-400' : 'text-amber-400'}`}>{snap.title_length ?? 0} / 65 characters</span>
                                </div>
                                <p className="text-[11px] text-white/70 print-text-muted">Recommended: 30 - 65 characters. Keep keywords first.</p>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/5 rounded-xl print-border">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-white/50 print-text-muted">Meta Description length</span>
                                    <span className={`text-xs font-mono font-bold ${(snap.description_length || 0) >= 70 && (snap.description_length || 0) <= 165 ? 'text-green-400' : 'text-amber-400'}`}>{snap.description_length ?? 0} / 165 characters</span>
                                </div>
                                <p className="text-[11px] text-white/70 print-text-muted">Recommended: 70 - 165 characters. Make it a compelling CTA.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section: 30-Day Priority Action Plan */}
                    <div className="mb-8 p-6 bg-[#0c0735]/40 border border-white/10 rounded-2xl shadow-xl print-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-black uppercase text-white/50 tracking-wider print-text-muted">30-DAY PRIORITY ACTION PLAN</h3>
                            <span className="text-[9px] font-bold bg-[#ff73e6]/15 border border-[#ff73e6]/30 text-[#ff73e6] px-2 py-0.5 rounded uppercase print-text-dark">CRITICAL FIXES FIRST</span>
                        </div>

                        <div className="space-y-3">
                            {actionPlan.length > 0 ? actionPlan.map((action, i) => (
                                <div key={action.id || i} className="border border-white/10 rounded-xl overflow-hidden print-border bg-[#06021c]/50">
                                    <button
                                        onClick={() => {
                                            playSynthTick(900, 'sine', 0.04, 0.05);
                                            setExpandedAction(expandedAction === i ? null : i);
                                        }}
                                        className="w-full flex justify-between items-center p-4 text-left font-bold text-xs sm:text-sm text-white hover:bg-white/5 transition-all no-print"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2.5 h-2.5 rounded-full ${(action.state || 'Warning') === 'Fail' ? 'bg-red-500 animate-pulse' : 'bg-amber-400'}`}></span>
                                            <span>{action.title}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/50">
                                            <span className="text-[10px] uppercase font-bold">{action.impact || 'High Impact'}</span>
                                            <i className={`fa-solid ${expandedAction === i ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                        </div>
                                    </button>
                                    <div className="hidden print:flex justify-between items-center p-3 border-b border-gray-200">
                                        <span className="font-bold text-sm text-black">{action.title} ({action.impact || 'High Impact'})</span>
                                    </div>
                                    {(expandedAction === i || window.matchMedia('print').matches) && (
                                        <div className="p-4 bg-white/[0.01] border-t border-white/5 space-y-2 text-xs text-white/80 print-text-muted print-border">
                                            <p><strong className="text-white print-text-dark">Current State:</strong> {action.desc || '—'}</p>
                                            {action.fix && <p><strong className="text-green-400 print-text-dark">Recommended Fix:</strong> {action.fix}</p>}
                                        </div>
                                    )}
                                </div>
                            )) : [
                                {
                                    id: 'h1',
                                    title: 'H1 Heading Configuration',
                                    impact: 'High Impact',
                                    state: 'Fail',
                                    desc: 'No H1 tag was detected on your homepage root document.',
                                    fix: 'Use exactly one H1 tag near the top of the homepage containing your primary keyword target and core service tagline.'
                                },
                                {
                                    id: 'jsload',
                                    title: 'JavaScript Script Tag Load',
                                    impact: 'High Impact',
                                    state: 'Warning',
                                    desc: '80 script tags detected; 5 are third-party tracking scripts.',
                                    fix: 'Remove unused scripts, defer loading of non-critical analytics codes, and leverage script consolidation.'
                                },
                                {
                                    id: 'titletag',
                                    title: 'Title Tag Character Length Optimization',
                                    impact: 'Medium Impact',
                                    state: 'Warning',
                                    desc: 'Homepage title exceeds recommended bounds (69 characters).',
                                    fix: 'Rewrite title to keep primary keyword and brand name within 30-65 characters to prevent truncation in search result previews.'
                                },
                                {
                                    id: 'meta_desc',
                                    title: 'Meta Description Compression',
                                    impact: 'High Impact',
                                    state: 'Warning',
                                    desc: 'Meta description contains 238 characters, causing snippet clipping.',
                                    fix: 'Rewrite the description to be within 70-165 characters while maintaining an active voice and a clear value proposition.'
                                },
                                {
                                    id: 'sitemap_titles',
                                    title: 'Sitewide Titles & Descriptions Audit',
                                    impact: 'Medium Impact',
                                    state: 'Warning',
                                    desc: '0 missing titles, 65 missing descriptions, 0 duplicate titles, and 24 duplicate description entries found across sitemaps.',
                                    fix: 'Ensure every crawlable page inside sitemaps has a distinct, descriptive meta title and meta description tag.'
                                },
                                {
                                    id: 'heading_struct',
                                    title: 'Sitemap Headings Structure Integrity',
                                    impact: 'Medium Impact',
                                    state: 'Warning',
                                    desc: '40 sitemap page(s) missing H1 tags, and 21 page(s) contain multiple H1 elements.',
                                    fix: 'Ensure exactly one H1 header is designated per page, using a clean tree structure of H2 and H3 tags below it.'
                                },
                                {
                                    id: 'homepage_seo',
                                    title: 'Strengthen Homepage SEO Foundations',
                                    impact: 'High Impact',
                                    state: 'Warning',
                                    desc: 'Homepage copy is not optimized for core service keyword density.',
                                    fix: 'Refactor title, description, H1 tags, and the first 200 words of copy to align with your primary services and locations.'
                                },
                                {
                                    id: 'local_signals',
                                    title: 'Local SEO Geotagging & citation signals',
                                    impact: 'High Impact',
                                    state: 'Warning',
                                    desc: 'Inconsistent NAP details, missing LocalBusiness schema patterns.',
                                    fix: 'Embed unified Name-Address-Phone (NAP) data, link your Google Business Profile, and apply LocalBusiness JSON-LD schemas.'
                                }
                            ].map((action, i) => (
                                <div key={action.id} className="border border-white/10 rounded-xl overflow-hidden print-border bg-[#06021c]/50">
                                    <button
                                        onClick={() => {
                                            playSynthTick(900, 'sine', 0.04, 0.05);
                                            setExpandedAction(expandedAction === action.id ? null : action.id);
                                        }}
                                        className="w-full flex justify-between items-center p-4 text-left font-bold text-xs sm:text-sm text-white hover:bg-white/5 transition-all no-print"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2.5 h-2.5 rounded-full ${action.state === 'Fail' ? 'bg-red-500 animate-pulse' : 'bg-amber-400'}`}></span>
                                            <span>{action.title}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/50">
                                            <span className="text-[10px] uppercase font-bold">{action.impact}</span>
                                            <i className={`fa-solid ${expandedAction === action.id ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                        </div>
                                    </button>
                                    <div className="hidden print:flex justify-between items-center p-3 border-b border-gray-200">
                                        <span className="font-bold text-sm text-black">{action.title} ({action.impact})</span>
                                    </div>
                                    {(expandedAction === action.id || window.matchMedia('print').matches) && (
                                        <div className="p-4 bg-white/[0.01] border-t border-white/5 space-y-2 text-xs text-white/80 print-text-muted print-border">
                                            <p><strong className="text-white print-text-dark">Current State:</strong> {action.desc}</p>
                                            <p><strong className="text-green-400 print-text-dark">Recommended Fix:</strong> {action.fix}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Print page break */}
                    <div className="print-page-break"></div>

                    {/* Section: Page & Technical Snapshot */}
                    <div className="mb-8 p-6 bg-[#0c0735]/40 border border-white/10 rounded-2xl shadow-xl print-border">
                        <h3 className="text-xs font-black uppercase text-white/50 tracking-wider mb-4 print-text-muted font-heading">PAGE & TECHNICAL SNAPSHOT</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-white/50 print-text-muted">
                                        <th className="py-3 px-4 font-bold">Signal</th>
                                        <th className="py-3 px-4 font-bold">Result</th>
                                        <th className="py-3 px-4 font-bold">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white/80 print-text-muted">
                                    <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                                        <td className="py-3 px-4 font-black">Title</td>
                                        <td className="py-3 px-4 font-mono text-[11px]">{snap.title || '—'}</td>
                                        <td className={`py-3 px-4 font-bold ${(snap.title_length || 0) >= 30 && (snap.title_length || 0) <= 65 ? 'text-green-400' : 'text-amber-400'}`}>{snap.title_length ?? 0} characters</td>
                                    </tr>
                                    <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                                        <td className="py-3 px-4 font-black">Meta Description</td>
                                        <td className="py-3 px-4 font-mono text-[11px] leading-relaxed">{snap.description || '—'}</td>
                                        <td className={`py-3 px-4 font-bold ${(snap.description_length || 0) >= 70 && (snap.description_length || 0) <= 165 ? 'text-green-400' : 'text-amber-400'}`}>{snap.description_length ?? 0} characters</td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.01] transition-all">
                                        <td className="py-3 px-4 font-black">H1 Tags</td>
                                        <td className="py-3 px-4 font-mono text-[11px]">{snap.h1_count ?? 0}</td>
                                        <td className={`py-3 px-4 font-bold ${(snap.h1_count || 0) === 1 ? 'text-green-400' : (snap.h1_count || 0) === 0 ? 'text-red-500' : 'text-amber-400'}`}>{snap.h1_tags || 'None found'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Section: Site-Wide Sitemap Audit */}
                    <div className="mb-8 p-6 bg-[#0c0735]/40 border border-white/10 rounded-2xl shadow-xl print-border">
                        <h3 className="text-xs font-black uppercase text-white/50 tracking-wider mb-4 print-text-muted font-heading">SITE-WIDE SITEMAP AUDIT</h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'Sitemap URLs', count: sw.sitewide_stats ? '' : (metrics.urls_discovered ?? '—'), sub: 'Discovered', val: metrics.urls_discovered ?? sw.MissingTitles ?? '—' },
                                { label: 'Pages Scanned', count: sw.pages_scanned ?? '—', sub: 'HTML' },
                                { label: 'Avg Page Score', count: sw.avg_page_score ?? '—', sub: 'Sitewide' },
                                { label: 'Failed/Skipped', count: sw.failed_skipped ?? '—', sub: 'Fetch' }
                            ].map((card) => (
                                <div key={card.label} className="p-4 bg-white/5 border border-white/5 rounded-xl text-center print-border">
                                    <span className="text-[10px] font-bold text-white/40 uppercase block mb-1">{card.label}</span>
                                    <p className="text-3xl font-black text-white print-text-dark">{card.count}</p>
                                    <span className="text-[9px] font-semibold text-white/40 block mt-1">{card.sub}</span>
                                </div>
                            ))}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-white/50 print-text-muted">
                                        <th className="py-3 px-4 font-bold">Site-Wide Issue</th>
                                        <th className="py-3 px-4 font-bold">Count</th>
                                        <th className="py-3 px-4 font-bold">Recommended Fix</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white/80 print-text-muted">
                                    <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                                        <td className="py-3 px-4 font-bold text-red-400">Missing Meta Titles</td>
                                        <td className="py-3 px-4 font-mono font-bold">{sw.missing_titles ?? 0}</td>
                                        <td className="py-3 px-4">Add unique SEO titles to every sitemap page.</td>
                                    </tr>
                                    <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                                        <td className="py-3 px-4 text-amber-400 font-bold">Missing Meta Descriptions</td>
                                        <td className="py-3 px-4 font-mono font-bold text-amber-400">{sw.missing_descriptions ?? 0}</td>
                                        <td className="py-3 px-4">Add conversion-focused descriptions to every indexable page.</td>
                                    </tr>
                                    <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                                        <td className="py-3 px-4 font-bold text-amber-400">Duplicate Titles</td>
                                        <td className="py-3 px-4 font-mono font-bold">{sw.duplicate_titles ?? 0}</td>
                                        <td className="py-3 px-4">Ensure every page has a unique title tag.</td>
                                    </tr>
                                    <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                                        <td className="py-3 px-4 font-bold text-amber-400">Pages Missing H1</td>
                                        <td className="py-3 px-4 font-mono font-bold">{sw.missing_h1 ?? 0}</td>
                                        <td className="py-3 px-4">Add one clear H1 to every page.</td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.01] transition-all">
                                        <td className="py-3 px-4 font-bold text-amber-400">Images Missing Alt</td>
                                        <td className="py-3 px-4 font-mono font-bold">{sw.images_missing_alt ?? 0}</td>
                                        <td className="py-3 px-4">Add descriptive alt text to all images.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Print page break */}
                    <div className="print-page-break"></div>

                    {/* Section: Page-Level Breakdown */}
                    <div className="mb-8 p-6 bg-[#0c0735]/40 border border-white/10 rounded-2xl shadow-xl print-border">
                        <h3 className="text-xs font-black uppercase text-white/50 tracking-wider mb-4 print-text-muted font-heading">PAGE-LEVEL BREAKDOWN</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-white/50 print-text-muted">
                                        <th className="py-3 px-4 font-bold">Page URL</th>
                                        <th className="py-3 px-4 font-bold">Score</th>
                                        <th className="py-3 px-4 font-bold">Words</th>
                                        <th className="py-3 px-4 font-bold">Main Issues</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white/80 print-text-muted">
                                    {pageRows.length > 0 ? pageRows.map((row, idx) => (
                                        <tr key={idx} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.01] transition-all">
                                            <td className="py-3 px-4 font-mono text-[11px] text-green-400 print-text-dark">{row.url}</td>
                                            <td className={`py-3 px-4 font-mono font-bold ${(row.score || 0) >= 80 ? 'text-green-400' : (row.score || 0) >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{row.score}</td>
                                            <td className="py-3 px-4 font-mono">{row.words}</td>
                                            <td className="py-3 px-4 text-white/60 print-text-muted leading-relaxed">{row.issues}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="py-4 px-4 text-white/40 text-xs italic">No page data available.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Section: Local Listings & Citation Readiness */}
                    <div className="mb-8 p-6 bg-[#0c0735]/40 border border-white/10 rounded-2xl shadow-xl print-border">
                        <h3 className="text-xs font-black uppercase text-white/50 tracking-wider mb-4 print-text-muted font-heading">LOCAL LISTINGS & CITATION READINESS</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-white/50 print-text-muted">
                                        <th className="py-3 px-4 font-bold">Platform</th>
                                        <th className="py-3 px-4 font-bold">Status</th>
                                        <th className="py-3 px-4 font-bold">Verification</th>
                                        <th className="py-3 px-4 font-bold">Note</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white/80 print-text-muted">
                                    {listings.length > 0 ? listings.map((l, i) => (
                                        <tr key={i} className="border-t border-white/5">
                                            <td className="py-3.5 px-4 font-bold">{l.platform}</td>
                                            <td className="py-3.5 px-4"><span className={`px-2 py-0.5 rounded border font-extrabold uppercase text-[10px] print-text-dark ${l.status === 'API Found' ? 'bg-green-500/10 border-green-500/35 text-green-400' :
                                                l.status === 'Provided' ? 'bg-blue-500/10 border-blue-500/35 text-blue-400' :
                                                    'bg-amber-500/10 border-amber-500/35 text-amber-400'
                                                }`}>{l.status}</span></td>
                                            <td className="py-3.5 px-4">{l.link ? <a href={l.link} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline font-bold print-text-dark">Open Link &rarr;</a> : <span className="text-white/40">—</span>}</td>
                                            <td className="py-3.5 px-4 text-white/60 print-text-muted">{l.note}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="py-4 px-4 text-white/40 text-xs italic">Listing data not available.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Section: AI Recommendations Engine Status */}
                    <div className="mb-8 p-6 bg-purple-500/5 border border-purple-500/20 rounded-2xl shadow-xl print-border">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/35 flex items-center justify-center text-purple-400">
                                <i className="fa-solid fa-brain"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm print-text-dark">AI Recommendation Engine status</h4>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mt-0.5">Model: {d.ai?.source || 'Rule-based fallback'}</p>
                            </div>
                        </div>
                        <p className="text-xs text-white/70 print-text-muted leading-relaxed">
                            <span className="font-bold text-purple-400">{d.ai?.available ? 'AI recommendations generated.' : (d.ai?.reason || 'AI API key not configured.')}</span> {d.ai?.available ? 'The executive summary and action plan were generated using the Google Gemini API based on your full audit data.' : 'Rule-based recommendations were used to build this report. The action plan and executive summary dynamically leverage full LLM analysis when an active API key is connected, otherwise defaulting back to our client-side SEO rule matrices.'}
                        </p>
                    </div>

                    {/* Print page break */}
                    <div className="print-page-break"></div>

                    {/* Section: Advanced SEOptimer-Style Tabs */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                            <h3 className="text-xs font-black uppercase text-white/50 tracking-wider print-text-muted">ADVANCED SEOPTIMER-STYLE DATA</h3>
                            <span className="text-[9px] font-bold text-green-400 uppercase font-mono print-text-dark">INTEGRATED MODULES</span>
                        </div>

                        {/* Tabs Navbar (No print) */}
                        <div className="flex flex-wrap gap-2 mb-4 no-print">
                            {[
                                { id: 'pagespeed', label: 'PageSpeed Core', icon: 'fa-gauge-high' },
                                { id: 'links', label: 'Broken Links Sample', icon: 'fa-circle-nodes' },
                                { id: 'tech', label: 'Technology Stack', icon: 'fa-layer-group' },
                                { id: 'social', label: 'Social & Security', icon: 'fa-shield-halved' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        playSynthTick(1100, 'sine', 0.04, 0.05);
                                        setActiveAdvancedTab(tab.id);
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-extrabold border transition-all ${activeAdvancedTab === tab.id
                                        ? 'bg-green-500 border-green-500 text-[#06021c]'
                                        : 'bg-white/5 border-white/5 hover:border-white/20 text-white/75'
                                        }`}
                                >
                                    <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content Display (Always printed fully as stacked sheets) */}
                        <div className="bg-[#0c0735]/40 border border-white/10 rounded-2xl p-6 shadow-xl print-border">

                            {/* TAB 1: PageSpeed Core */}
                            {(activeAdvancedTab === 'pagespeed' || window.matchMedia('print').matches) && (
                                <div className="space-y-6 print-page-break">
                                    <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2 print-text-dark"><i className="fa-solid fa-gauge-high text-green-400 mr-2"></i> PageSpeed Mobile vs Desktop</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white/5 p-5 rounded-xl border border-white/5 print-border">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-bold text-xs uppercase text-white/50 print-text-muted">PageSpeed Mobile</span>
                                                <span className={`text-xl font-black ${psiMobile.available ? (psiMobile.score >= 80 ? 'text-green-400' : psiMobile.score >= 50 ? 'text-amber-400' : 'text-red-500') : 'text-white/30'}`}>{psiMobile.available ? `${psiMobile.score}/100` : 'N/A'}</span>
                                            </div>
                                            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden print-progress-bar mb-4">
                                                <div className={`h-full rounded-full ${psiMobile.available ? (psiMobile.score >= 80 ? 'bg-green-500' : psiMobile.score >= 50 ? 'bg-amber-500' : 'bg-red-500') : 'bg-white/10'}`} style={{ width: `${psiMobile.score || 0}%` }}></div>
                                            </div>
                                            <p className="text-[11px] text-white/60 print-text-muted">{psiMobile.available ? `LCP: ${psiMobile.lcp || '—'} | CLS: ${psiMobile.cls || '—'} | INP: ${psiMobile.inp || '—'}` : (psiMobile.message || 'PageSpeed API key not configured.')}</p>
                                        </div>

                                        <div className="bg-white/5 p-5 rounded-xl border border-white/5 print-border">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-bold text-xs uppercase text-white/50 print-text-muted">PageSpeed Desktop</span>
                                                <span className={`text-xl font-black ${psiDesktop.available ? (psiDesktop.score >= 80 ? 'text-green-400' : psiDesktop.score >= 60 ? 'text-amber-400' : 'text-red-500') : 'text-white/30'}`}>{psiDesktop.available ? `${psiDesktop.score}/100` : 'N/A'}</span>
                                            </div>
                                            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden print-progress-bar mb-4">
                                                <div className={`h-full rounded-full ${psiDesktop.available ? (psiDesktop.score >= 80 ? 'bg-green-500' : psiDesktop.score >= 60 ? 'bg-amber-500' : 'bg-red-500') : 'bg-white/10'}`} style={{ width: `${psiDesktop.score || 0}%` }}></div>
                                            </div>
                                            <p className="text-[11px] text-white/60 print-text-muted">{psiDesktop.available ? `LCP: ${psiDesktop.lcp || '—'} | CLS: ${psiDesktop.cls || '—'}` : (psiDesktop.message || 'PageSpeed API key not configured.')}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: Broken Links Sample */}
                            {(activeAdvancedTab === 'links' || window.matchMedia('print').matches) && (
                                <div className="space-y-4 print-page-break">
                                    <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2 print-text-dark"><i className="fa-solid fa-circle-nodes text-green-400 mr-2"></i> Broken / Blocked Links Sample</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/10 text-white/50 print-text-muted">
                                                    <th className="py-2.5 px-4 font-bold">Link URL</th>
                                                    <th className="py-2.5 px-4 font-bold">Status</th>
                                                    <th className="py-2.5 px-4 font-bold">Source Page</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-white/80 print-text-muted">
                                                {brokenLinks.length > 0 ? brokenLinks.map((l, i) => (
                                                    <tr key={i} className="border-b border-white/5 last:border-b-0">
                                                        <td className="py-2.5 px-4 font-mono text-[11px]">{l.url}</td>
                                                        <td className={`py-2.5 px-4 font-bold font-mono ${l.status === 'blocked' ? 'text-amber-400' : 'text-red-500'}`}>{l.status}</td>
                                                        <td className="py-2.5 px-4 font-mono text-[11px]">{l.source}</td>
                                                    </tr>
                                                )) : (
                                                    <tr><td colSpan={3} className="py-3 px-4 text-white/40 text-xs italic">No broken links detected.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: Technology Stack */}
                            {(activeAdvancedTab === 'tech' || window.matchMedia('print').matches) && (
                                <div className="space-y-4 print-page-break">
                                    <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2 print-text-dark"><i className="fa-solid fa-layer-group text-green-400 mr-2"></i> Technology Stack Detected</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {techList.length > 0 ? techList.map((t, i) => (
                                            <span key={i} className="px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white print-border">
                                                <i className="fa-solid fa-layer-group text-green-400 mr-1.5"></i>{t}
                                            </span>
                                        )) : <p className="text-xs text-white/40 italic">No technology signatures detected.</p>}
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: Social & Security Headers */}
                            {(activeAdvancedTab === 'social' || window.matchMedia('print').matches) && (
                                <div className="space-y-6 print-page-break">
                                    <div>
                                        <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2 mb-4 print-text-dark"><i className="fa-solid fa-share-nodes text-green-400 mr-2"></i> Linked Social Profiles</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {socialProfileList.length > 0 ? socialProfileList.map((s, i) => (
                                                <span key={i} className="px-3.5 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white print-border">
                                                    <i className="fa-solid fa-share-nodes text-blue-400 mr-1.5"></i>{s}
                                                </span>
                                            )) : <p className="text-xs text-white/40 italic">No social profiles detected.</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2 mb-4 print-text-dark"><i className="fa-solid fa-lock text-green-400 mr-2"></i> HTTP Security Headers Checklist</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { name: 'HSTS Header', ok: secHeaders.hsts },
                                                { name: 'CSP Directive', ok: secHeaders.csp },
                                                { name: 'X-Frame-Options', ok: secHeaders.x_frame_options },
                                                { name: 'X-Content-Type', ok: secHeaders.x_content_type },
                                                { name: 'Referrer-Policy', ok: secHeaders.referrer_policy },
                                                { name: 'Permissions-Policy', ok: secHeaders.permissions_policy },
                                            ].map((header) => (
                                                <div key={header.name} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl print-border">
                                                    <span className="text-xs font-semibold text-white/70 print-text-muted">{header.name}</span>
                                                    <i className={`fa-solid ${header.ok ? 'fa-circle-check text-green-400' : 'fa-circle-xmark text-red-400'}`}></i>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Print page break */}
                    <div className="print-page-break"></div>

                    {/* Section: Category Audit Details Checklist */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                            <h3 className="text-xs font-black uppercase text-white/50 tracking-wider print-text-muted">DETAILED COMPONENT CHECKLISTS</h3>
                            <span className="text-[9px] font-bold text-green-400 uppercase font-mono print-text-dark">RULE AUDITING</span>
                        </div>

                        {/* Audit Category Selector Navbar (No Print) */}
                        <div className="flex flex-wrap gap-2 mb-4 no-print">
                            {[
                                { id: 'seo', label: 'SEO Audit', icon: 'fa-magnifying-glass' },
                                { id: 'usability', label: 'Usability', icon: 'fa-mobile-screen' },
                                { id: 'performance', label: 'Performance', icon: 'fa-gauge' },
                                { id: 'social', label: 'Social', icon: 'fa-hashtag' },
                                { id: 'local', label: 'Local SEO', icon: 'fa-location-dot' },
                                { id: 'tech', label: 'Technology Stack', icon: 'fa-network-wired' },
                                { id: 'links', label: 'Links Audit', icon: 'fa-circle-nodes' },
                                { id: 'rankings', label: 'Rankings Audit', icon: 'fa-arrow-trend-up' },
                                { id: 'authority', label: 'Authority Audit', icon: 'fa-award' }
                            ].map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        playSynthTick(1000, 'sine', 0.04, 0.05);
                                        setExpandedAuditCategory(expandedAuditCategory === category.id ? null : category.id);
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-extrabold border transition-all ${expandedAuditCategory === category.id
                                        ? 'bg-green-500 border-green-500 text-[#06021c]'
                                        : 'bg-white/5 border-white/5 hover:border-white/20 text-white/75'
                                        }`}
                                >
                                    <i className={`fa-solid ${category.icon}`}></i> {category.label}
                                </button>
                            ))}
                        </div>

                        {/* Auditing lists cards (Always printed fully) */}
                        <div className="space-y-4">

                            {/* SEO Category Audit — dynamic */}
                            {(expandedAuditCategory === 'seo' || window.matchMedia('print').matches) && (
                                <div className="p-6 bg-white/[0.01] border border-white/10 rounded-2xl print-border print-page-break">
                                    <h4 className="text-sm font-black text-white uppercase border-b border-white/5 pb-2 mb-4 print-text-dark">
                                        <i className="fa-solid fa-magnifying-glass text-green-400 mr-2"></i> SEO Audit Checklist
                                    </h4>
                                    <CheckList items={checks.seo} />
                                </div>
                            )}

                            {/* Usability Category Audit — dynamic */}
                            {(expandedAuditCategory === 'usability' || window.matchMedia('print').matches) && (
                                <div className="p-6 bg-white/[0.01] border border-white/10 rounded-2xl print-border print-page-break">
                                    <h4 className="text-sm font-black text-white uppercase border-b border-white/5 pb-2 mb-4 print-text-dark">
                                        <i className="fa-solid fa-mobile-screen text-green-400 mr-2"></i> Usability Audit Checklist
                                    </h4>
                                    <CheckList items={checks.usability} />
                                </div>
                            )}

                            {/* Performance Category Audit — dynamic */}
                            {(expandedAuditCategory === 'performance' || window.matchMedia('print').matches) && (
                                <div className="p-6 bg-white/[0.01] border border-white/10 rounded-2xl print-border print-page-break">
                                    <h4 className="text-sm font-black text-white uppercase border-b border-white/5 pb-2 mb-4 print-text-dark">
                                        <i className="fa-solid fa-gauge text-green-400 mr-2"></i> Performance Audit Checklist
                                    </h4>
                                    <CheckList items={checks.performance} />
                                </div>
                            )}

                            {/* Social Category Audit — dynamic */}
                            {(expandedAuditCategory === 'social' || window.matchMedia('print').matches) && (
                                <div className="p-6 bg-white/[0.01] border border-white/10 rounded-2xl print-border print-page-break">
                                    <h4 className="text-sm font-black text-white uppercase border-b border-white/5 pb-2 mb-4 print-text-dark">
                                        <i className="fa-solid fa-hashtag text-green-400 mr-2"></i> Social Audit Checklist
                                    </h4>
                                    <CheckList items={checks.social} />
                                </div>
                            )}

                            {/* Local SEO Category Audit — dynamic */}
                            {(expandedAuditCategory === 'local' || window.matchMedia('print').matches) && (
                                <div className="p-6 bg-white/[0.01] border border-white/10 rounded-2xl print-border print-page-break">
                                    <h4 className="text-sm font-black text-white uppercase border-b border-white/5 pb-2 mb-4 print-text-dark">
                                        <i className="fa-solid fa-location-dot text-green-400 mr-2"></i> Local SEO Audit Checklist
                                    </h4>
                                    <CheckList items={checks.local} />
                                </div>
                            )}

                            {/* Technology Category Audit — dynamic */}
                            {(expandedAuditCategory === 'tech' || window.matchMedia('print').matches) && (
                                <div className="p-6 bg-white/[0.01] border border-white/10 rounded-2xl print-border print-page-break">
                                    <h4 className="text-sm font-black text-white uppercase border-b border-white/5 pb-2 mb-4 print-text-dark">
                                        <i className="fa-solid fa-network-wired text-green-400 mr-2"></i> Technology & Security Audit Checklist
                                    </h4>
                                    <CheckList items={checks.tech} />
                                </div>
                            )}

                            {/* Links Category Audit — dynamic */}
                            {(expandedAuditCategory === 'links' || window.matchMedia('print').matches) && (
                                <div className="p-6 bg-white/[0.01] border border-white/10 rounded-2xl print-border print-page-break">
                                    <h4 className="text-sm font-black text-white uppercase border-b border-white/5 pb-2 mb-4 print-text-dark">
                                        <i className="fa-solid fa-circle-nodes text-green-400 mr-2"></i> Links Audit Checklist
                                    </h4>
                                    <CheckList items={checks.links} />
                                </div>
                            )}

                            {/* Rankings Category Audit — dynamic */}
                            {(expandedAuditCategory === 'rankings' || window.matchMedia('print').matches) && (
                                <div className="p-6 bg-white/[0.01] border border-white/10 rounded-2xl print-border print-page-break">
                                    <h4 className="text-sm font-black text-white uppercase border-b border-white/5 pb-2 mb-4 print-text-dark">
                                        <i className="fa-solid fa-arrow-trend-up text-green-400 mr-2"></i> Rankings Audit Checklist
                                    </h4>
                                    <CheckList items={checks.rankings} />
                                </div>
                            )}

                            {/* Authority Category Audit — dynamic */}
                            {(expandedAuditCategory === 'authority' || window.matchMedia('print').matches) && (
                                <div className="p-6 bg-white/[0.01] border border-white/10 rounded-2xl print-border print-page-break">
                                    <h4 className="text-sm font-black text-white uppercase border-b border-white/5 pb-2 mb-4 print-text-dark">
                                        <i className="fa-solid fa-award text-green-400 mr-2"></i> Authority Audit Checklist
                                    </h4>
                                    <CheckList items={checks.authority} />
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Section: Consultation CTA banner (Printed) */}
                    <div className="hidden print:block border border-gray-400 p-6 rounded-xl mt-8">
                        <h4 className="font-bold text-lg text-black mb-2">Want to fix these SEO bottlenecks?</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Book a free 30-minute consultation call with a Voxlumedia marketing engineer to review this report and receive a step-by-step action roadmap.
                        </p>
                        <p className="text-xs text-gray-500 mt-2 font-mono">Go to: https://voxlumedia.com or contact our representatives directly.</p>
                    </div>

                </div>
            )}
        </div>
    );
}
