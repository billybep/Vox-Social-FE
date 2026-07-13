import React, { useState, useEffect } from 'react';
import LandingSection from './components/LandingSection';
import LoadingSection from './components/LoadingSection';
import ResultsSection from './components/ResultsSection';
import ContactGateSection from './components/ContactGateSection';
import SeoAuditSection from './components/SeoAuditSection';
import AuthLogin from './components/AuthLogin';
import { playSynthTick } from './utils/audio';

function App() {
    const [view, setView] = useState('login');
    const [profileUrl, setProfileUrl] = useState('');
    const [inputError, setInputError] = useState('');
    const [analyzingStep, setAnalyzingStep] = useState(0);
    const [analysisResults, setAnalysisResults] = useState(null);

    const [isAiComplete, setIsAiComplete] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [leadData, setLeadData] = useState(null);
    const [webhookStatus, setWebhookStatus] = useState('idle');

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

        setAnalysisResults(null);
        setIsAiComplete(false);
        setIsFormSubmitted(false);
        setLeadData(null);
        setWebhookStatus('idle');

        setView('contact_gate');

        try {
            // Integration with Go Backend running on port 8080 or Railway production URL
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
            const response = await fetch(`${apiUrl}/analyze`, {
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

            setAnalysisResults(mappedData);
            setIsAiComplete(true);

        } catch (error) {
            console.error("Backend fetch failed:", error);
            playSynthTick(150, 'sawtooth', 0.2, 0.08);
            setInputError(`Backend connection failed. Please check if your API URL is correctly configured. Error: ${error.message}`);
            setView('landing');
        }
    };

    const handleContactSubmit = (formData) => {
        setLeadData(formData);
        setIsFormSubmitted(true);
    };

    useEffect(() => {
        if (isFormSubmitted && webhookStatus === 'idle') {
            if (isAiComplete) {
                const sendWebhook = async () => {
                    setWebhookStatus('sending');
                    setView('loading');

                    try {
                        const platform = profileUrl.includes('instagram.com') ? 'Instagram' : (profileUrl.includes('facebook.com') ? 'Facebook' : 'Unknown');

                        // Construct the GHL Webhook Payload as per MASTER BRIEF (Funnel 2 - Social Score Standalone)
                        const ghlPayload = {
                            firstName: leadData.firstName,
                            lastName: leadData.lastName,
                            companyName: leadData.businessName, // Maps to GHL companyName
                            email: leadData.email,
                            phone: leadData.phone,
                            funnel_entry_point: "Social Score Tool",
                            lead_source_tool: "Social Score Tool",
                            date_of_audit: new Date().toISOString(),
                            social_profile_url: profileUrl,
                            platform_audited: platform,
                            social_score_overall: analysisResults.score,
                            social_score_status: analysisResults.label,
                            social_profile_readiness: analysisResults.categories?.businessReadiness || 0,
                            social_growth_potential: analysisResults.growthPotential,
                            social_profile_identity: analysisResults.profileIdentity,
                            social_key_strengths: Array.isArray(analysisResults.strengths) ? analysisResults.strengths.join(", ") : "",
                            social_opportunities: Array.isArray(analysisResults.opportunities) ? analysisResults.opportunities.join(", ") : "",
                            social_recommended_package: analysisResults.recommended_package
                        };

                        console.log("Sending payload to GHL (Simulated):", ghlPayload);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    } catch (error) {
                        console.error("GHL webhook integration failed:", error);
                    } finally {
                        setWebhookStatus('complete');
                        setView('results');
                    }
                };
                sendWebhook();
            } else {
                setView('loading');
            }
        }
    }, [isFormSubmitted, isAiComplete, webhookStatus, leadData, analysisResults, profileUrl]);

    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#06021c] text-white relative">
            <main className="flex-grow flex flex-col relative z-10">
                {view === 'login' && (
                    <AuthLogin setView={setView} />
                )}

                {view === 'landing' && (
                    <LandingSection
                        profileUrl={profileUrl}
                        setProfileUrl={setProfileUrl}
                        handleAnalyze={handleAnalyze}
                        inputError={inputError}
                        setInputError={setInputError}
                        setView={setView}
                    />
                )}

                {view === 'seo_audit' && (
                    <SeoAuditSection setView={setView} />
                )}

                {view === 'contact_gate' && (
                    <ContactGateSection onSubmit={handleContactSubmit} />
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
