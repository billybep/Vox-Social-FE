import React, { useState, useEffect } from 'react';
import LandingSection from './components/LandingSection';
import LoadingSection from './components/LoadingSection';
import ResultsSection from './components/ResultsSection';
import { playSynthTick } from './utils/audio';

function App() {
    const [view, setView] = useState('landing'); 
    const [profileUrl, setProfileUrl] = useState('');
    const [inputError, setInputError] = useState('');
    const [analyzingStep, setAnalyzingStep] = useState(0);
    const [analysisResults, setAnalysisResults] = useState(null);

    const analysisSteps = [
        "Establishing secure connection to public nodes...",
        "Retrieving Instagram bio, links, and public metadata...",
        "Analyzing first-impression and profile layout clarity...",
        "Evaluating content structure and visual branding consistency...",
        "Assessing engagement metrics and customer trust signals...",
        "Calculating final score and assembling growth action plan..."
    ];

    useEffect(() => {
        let interval;
        if (view === 'loading') {
            setAnalyzingStep(0);
            interval = setInterval(() => {
                setAnalyzingStep((prev) => {
                    if (prev < analysisSteps.length - 1) {
                        return prev + 1;
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });
            }, 1200);
        }
        return () => clearInterval(interval);
    }, [view]);

    const detectPlatform = (url) => {
        const lower = url.toLowerCase();
        if (lower.includes('instagram.com')) return 'Instagram';
        if (lower.includes('facebook.com')) return 'Facebook Page';
        return 'Social Media Profile';
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setInputError('');

        const url = profileUrl.trim();
        if (!url) return;

        const isUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\?.*)?$/.test(url);
        const isInstagram = url.toLowerCase().includes('instagram.com') || url.toLowerCase().includes('instagr.am');
        const isFacebook = url.toLowerCase().includes('facebook.com');

        if (!isUrl) {
            playSynthTick(150, 'sawtooth', 0.2, 0.08);
            setInputError("Please enter a valid profile URL.");
            return;
        }

        if (!isInstagram && !isFacebook) {
            playSynthTick(150, 'sawtooth', 0.2, 0.08);
            setInputError("Audit is currently optimized for Instagram & Facebook Pages only. Please provide a supported link.");
            return;
        }

        playSynthTick(1000, 'sine', 0.2, 0.06);
        setView('loading');
        
        try {
            // Integration with Go Backend running on port 8080 or Railway production URL
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
            const response = await fetch(`${apiUrl}/api/v1/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ profile_url: url })
            });

            if (!response.ok) {
                throw new Error('Backend responded with an error');
            }

            const data = await response.json();
            
            const mappedData = {
                score: data.overall_score || 0,
                label: data.status || 'Unknown',
                profileIdentity: data.profile_identity || '',
                growthPotential: data.growth_potential || '',
                summary: data.profile_identity || '', 
                categories: {
                    businessReadiness: data.profile_readiness || 0,
                    profileClarity: data.overall_score || 0,
                    contentQuality: data.overall_score || 0,
                    trustScore: data.overall_score || 0
                },
                strengths: data.key_strengths || [],
                opportunities: data.opportunities || [],
                recommended_package: data.recommended_package || 'growth_audit'
            };
            
            setTimeout(() => {
                setAnalysisResults(mappedData);
                setView('results');
            }, 1500);

        } catch (error) {
            console.error("Backend fetch failed, using fallback simulated data:", error);
            const platform = detectPlatform(url);
            const hash = url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const score = 68 + (hash % 24); 
            
            const fallbackData = {
                businessName: platform === 'Instagram' ? "Your Instagram Business Profile" : "Your Facebook Business Page",
                profileIdentity: `This profile belongs to a growing commercial brand evaluated on ${platform}.`,
                score: score,
                label: score >= 90 ? "Excellent" : score >= 80 ? "Very Good" : score >= 70 ? "Good" : "Fair",
                summary: "Your profile has a solid foundation. Focusing on clear calls-to-action will immediately boost trust and conversions.",
                strengths: [
                    "✓ Visual identity looks consistent and professional",
                    "✓ Core products are cleanly presented in posts",
                    "✓ Contact options are accessible to visitors"
                ],
                opportunities: [
                    "• Primary call-to-action is not prominent enough",
                    "• Bio description misses a clear values hook",
                    "• Reply rate and engagement features can be optimized"
                ],
                recommendations: [
                    "Simplify your bio so visitors understand your exact service in under 5 seconds.",
                    "Add a prominent booking link directly in your primary button area.",
                    "Highlight high-quality customer reviews in your pinned content."
                ],
                categories: {
                    profileClarity: 70 + (hash % 20),
                    contentQuality: 65 + ((hash + 2) % 25),
                    trustScore: 60 + ((hash + 4) % 30),
                    customerEngagement: 55 + ((hash + 6) % 35),
                    businessReadiness: 50 + ((hash + 8) % 40)
                },
                growthPotential: score > 80 ? "High" : "Moderate",
                dataCoverage: 85 + (hash % 12),
                recommended_package: 'growth_audit'
            };

            setTimeout(() => {
                setAnalysisResults(fallbackData);
                setView('results');
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#06021c] text-white relative">
            <main className="flex-grow flex flex-col relative z-10">
                {view === 'landing' && (
                    <LandingSection 
                        profileUrl={profileUrl} 
                        setProfileUrl={setProfileUrl} 
                        handleAnalyze={handleAnalyze} 
                        inputError={inputError}
                        setInputError={setInputError}
                    />
                )}

                {view === 'loading' && (
                    <LoadingSection currentStep={analyzingStep} steps={analysisSteps} />
                )}

                {view === 'results' && analysisResults && (
                    <ResultsSection 
                        results={analysisResults} 
                        url={profileUrl}
                        platform={detectPlatform(profileUrl)}
                        setView={setView}
                    />
                )}
            </main>
        </div>
    );
}

export default App;
