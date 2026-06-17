import React, { useState } from 'react';

const LOGO_URL = "https://raw.githubusercontent.com/lengkongandreuw/voxsocial/main/assets/vsllogo.png";

export default function ResultsSection({ results, url, platform, setView }) {
    const [leadSubmitted, setLeadSubmitted] = useState(false);
    const [leadData, setLeadData] = useState({ name: '', email: '', phone: '', company: '' });

    const handleLeadSubmit = (e) => {
        e.preventDefault();
        setLeadSubmitted(true);
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
        if (score >= 80) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        if (score >= 70) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
        return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    };

    const bookingUrl = `https://voxlumedia.com/home/book-meeting`;

    return (
        <div className="min-h-screen bg-[#06021c] text-white w-full relative z-20 pb-20">

            {/* Top Result Navigation Header */}
            <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 font-black text-xl cursor-pointer" onClick={() => setView('landing')}>
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                            <img src={LOGO_URL} className="w-full h-full object-contain" alt="Logo" />
                        </div>
                        VOXLUMEDIA
                    </div>
                    <button onClick={() => setView('landing')} className="text-sm border border-white/20 hover:border-white bg-white/5 hover:bg-white/10 font-bold py-2.5 px-6 rounded-full transition duration-300">
                        Run New Scan &rarr;
                    </button>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto py-12 px-6 space-y-10 animate-fade-in-up">

                {/* PERFORMANCE SUMMARY SECTION */}
                <div className="solid-glassmorphic rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                    <div className="text-center mb-10 relative z-10">
                        <span className="text-xs font-black tracking-widest text-[#ff7b1a] uppercase mb-2 block">Performance Summary</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white">Your Business Health Report</h2>
                        <p className="text-white/50 font-medium mt-2 flex items-center justify-center gap-2">
                            <i className="fa-solid fa-chart-pie text-[#ff7b1a]"></i> {platform} Analysis
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center relative z-10">
                        {/* Circular Gauge */}
                        <div className="md:col-span-5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 pb-8 md:pb-0">
                            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                                <svg className="absolute w-full h-full transform -rotate-90">
                                    <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.03)" strokeWidth="12" fill="transparent" />
                                    <circle
                                        cx="96" cy="96" r="88"
                                        stroke={results.score >= 90 ? "#00f0ff" : results.score >= 80 ? "#60a5fa" : results.score >= 70 ? "#fbbf24" : "#ff007f"}
                                        strokeWidth="12" fill="transparent" strokeDasharray={553}
                                        strokeDashoffset={553 - (553 * results.score) / 100}
                                        strokeLinecap="round" className="transition-all duration-1500 ease-out"
                                    />
                                </svg>
                                <div className="text-center relative z-10 flex flex-col items-center mt-2">
                                    <span className="text-6xl font-black text-white tracking-tighter">{results.score}</span>
                                    <span className="text-xs font-bold text-white/40 uppercase mt-1">Score / 100</span>
                                </div>
                            </div>
                            <span className={`px-6 py-2 rounded-full text-sm font-black border uppercase tracking-wider ${getScoreColor(results.score)}`}>
                                {results.label}
                            </span>
                        </div>

                        {/* Narrative Report Description */}
                        <div className="md:col-span-7 space-y-6">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
                                <div className="mb-4 pb-4 border-b border-white/5">
                                    <span className="text-[10px] font-black tracking-widest text-[#ff7b1a] uppercase mb-1 block">Profile Identity</span>
                                    <p className="text-white font-bold text-lg leading-snug">
                                        {results.profileIdentity}
                                    </p>
                                </div>
                                <p className="text-white/80 font-medium text-base leading-relaxed italic">
                                    "{results.summary}"
                                </p>
                                <div className="mt-6 flex flex-col items-start gap-2">
                                    <button
                                        onClick={() => window.open(bookingUrl, '_blank')}
                                        className="bg-[#ff7b1a] hover:bg-[#e06200] text-white font-black px-6 py-3 rounded-xl transition-all duration-200 text-sm whitespace-nowrap shadow-md hover:scale-[1.02] active:scale-95"
                                    >
                                        Book Expert Consultation &rarr;
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-sm flex items-start gap-3">
                                    <i className="fa-solid fa-arrow-trend-up text-[#ff7b1a] mt-1"></i>
                                    <div>
                                        <p className="text-[10px] text-white/50 font-bold uppercase">Growth Potential</p>
                                        <p className="text-base font-black text-white">{results.growthPotential}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-sm flex items-start gap-3">
                                    <i className="fa-solid fa-check-double text-pink-500 mt-1"></i>
                                    <div>
                                        <p className="text-[10px] text-white/50 font-bold uppercase">Profile Readiness</p>
                                        <p className="text-base font-black text-white">{results.categories?.businessReadiness || 0}/100</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Strengths & Opportunities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="solid-glassmorphic rounded-3xl p-8 border border-white/10 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-400/10 text-emerald-400 flex items-center justify-center"><i className="fa-solid fa-check text-sm"></i></div>
                            Key Strengths
                        </h3>
                        <ul className="space-y-4">
                            {results.strengths?.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-white/80 font-medium">
                                    <i className="fa-solid fa-circle-check text-emerald-400 mt-1"></i>
                                    {item.replace('✓', '').trim()}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="solid-glassmorphic rounded-3xl p-8 border border-white/10 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center"><i className="fa-solid fa-lightbulb text-sm"></i></div>
                            Opportunities
                        </h3>
                        <ul className="space-y-4">
                            {results.opportunities?.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-white/80 font-medium">
                                    <i className="fa-solid fa-arrow-right text-amber-400 mt-1"></i>
                                    {item.replace('•', '').trim()}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Detailed Metrics */}
                <div className="solid-glassmorphic text-white rounded-[2rem] p-8 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
                    <h3 className="text-2xl font-black mb-8 relative z-10">Metric Breakdown</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
                        {[
                            { label: 'Profile Clarity', score: results.categories?.profileClarity || 0, icon: 'fa-id-badge', color: 'bg-cyber-neonBlue' },
                            { label: 'Content Quality', score: results.categories?.contentQuality || 0, icon: 'fa-image', color: 'bg-pink-500' },
                            { label: 'Trust Signals', score: results.categories?.trustScore || 0, icon: 'fa-shield-halved', color: 'bg-cyber-gold' }
                        ].map((cat, i) => (
                            <div key={i} className="bg-white/5 border border-white/15 p-5 rounded-2xl animate-pulse" style={{ animationDuration: '3s', animationDelay: `${i * 0.3}s` }}>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-bold text-white/70 flex items-center gap-2">
                                        <i className={`fa-solid ${cat.icon} text-white/40`}></i> {cat.label}
                                    </span>
                                    <span className="text-xl font-black">{cat.score}</span>
                                </div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.score}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lead Capture form */}
                {/* <div className="solid-glassmorphic rounded-[2rem] border border-white/10 p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
                    {!leadSubmitted ? (
                        <div className="max-w-xl mx-auto space-y-6 relative z-10">
                            <div className="w-16 h-16 bg-white/5 border border-white/10 text-cyber-neonBlue rounded-full flex items-center justify-center mx-auto text-2xl mb-4">
                                <i className="fa-solid fa-file-pdf"></i>
                            </div>
                            <h3 className="text-3xl font-black text-white">Get Your Complete PDF Report</h3>
                            <p className="text-white/60 font-medium">Enter your details to receive a full breakdown and an invitation to a free 30-minute growth consultation with our experts.</p>
                            
                            <form onSubmit={handleLeadSubmit} className="space-y-4 pt-4 text-left">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="text" required placeholder="Full Name" value={leadData.name} onChange={(e) => setLeadData({...leadData, name: e.target.value})} className="w-full border border-white/10 focus:border-[#ff7b1a] rounded-xl px-4 py-3.5 focus:outline-none bg-white/5 text-white font-bold" />
                                    <input type="email" required placeholder="Business Email" value={leadData.email} onChange={(e) => setLeadData({...leadData, email: e.target.value})} className="w-full border border-white/10 focus:border-[#ff7b1a] rounded-xl px-4 py-3.5 focus:outline-none bg-white/5 text-white font-bold" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="tel" required placeholder="Phone Number" value={leadData.phone} onChange={(e) => setLeadData({...leadData, phone: e.target.value})} className="w-full border border-white/10 focus:border-[#ff7b1a] rounded-xl px-4 py-3.5 focus:outline-none bg-white/5 text-white font-bold" />
                                    <input type="text" required placeholder="Company Name" value={leadData.company} onChange={(e) => setLeadData({...leadData, company: e.target.value})} className="w-full border border-white/10 focus:border-[#ff7b1a] rounded-xl px-4 py-3.5 focus:outline-none bg-white/5 text-white font-bold" />
                                </div>
                                <button type="submit" className="w-full bg-[#ff7b1a] hover:bg-[#e06200] text-white font-black py-4 rounded-xl transition duration-300 shadow-md">
                                    Send Me The Report &rarr;
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="py-10 space-y-4 relative z-10 animate-fade-in-up">
                            <div className="w-20 h-20 bg-emerald-400/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-4xl border border-emerald-400/20 shadow-xl">
                                <i className="fa-solid fa-check"></i>
                            </div>
                            <h4 className="text-3xl font-black text-white">Success!</h4>
                            <p className="text-white/60 font-medium max-w-md mx-auto">Your comprehensive report is being generated. Our team will reach out to you shortly to schedule your growth strategy session.</p>
                            <div className="pt-6">
                                <button 
                                    onClick={() => window.open(bookingUrl, '_blank')}
                                    className="bg-white hover:bg-gray-200 text-[#06021c] font-black px-8 py-3.5 rounded-xl transition-all shadow-md"
                                >
                                    Book Strategy Call Now &rarr;
                                </button>
                            </div>
                        </div>
                    )}
                </div> */}

                {/* Copyright Footer */}
                <div className="mt-8 text-center text-xs text-white/40 font-semibold tracking-wide select-none">
                    Copyright © 2026 Voxlumedia™ | Creative Agency for Digital Marketing
                </div>

            </div>
        </div>
    );
}
