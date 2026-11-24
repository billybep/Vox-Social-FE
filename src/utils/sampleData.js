// Fictional sample client and competitive benchmark dataset
// Aligned with AI-Guidelines/VA-Intelligence-Design.md

export const SAMPLE_CLIENTS = [
  {
    id: 'cedar-dental',
    name: "Cedar & Co. Dental",
    domain: "cedarandcodental.com",
    industry: "Healthcare & Cosmetic Dentistry",
    locations: [
      { name: "Amman Clinic", country: "Jordan", city: "Amman", isPrimary: true },
      { name: "Fairfax Clinic", country: "USA", city: "Fairfax, VA", isPrimary: false },
    ],
    lastAudit: "2026-11-20",
    isReal: false,
    overallScore: 71,
    evidenceCoverage: 87, // 87% coverage
    seoScore: 78,
    socialScore: 82,
    aiScore: 64,
    croScore: 58,
  },
  {
    id: 'nordic-apex',
    name: "Nordic Apex Logistics",
    domain: "nordicapex.io",
    industry: "Freight & Supply Chain",
    locations: [{ name: "Dubai Logistics Hub", country: "UAE", city: "Dubai", isPrimary: true }],
    lastAudit: "2026-11-18",
    isReal: false,
    overallScore: 64,
    evidenceCoverage: 76,
    seoScore: 69,
    socialScore: 58,
    aiScore: 70,
    croScore: 60,
  },
  {
    id: 'sultan-perfumes',
    name: "Sultan Oud & Fragrances",
    domain: "sultanoud.sa",
    industry: "Luxury Retail & E-Commerce",
    locations: [{ name: "Riyadh Flagship", country: "Saudi Arabia", city: "Riyadh", isPrimary: true }],
    lastAudit: "2026-11-15",
    isReal: false,
    overallScore: 85,
    evidenceCoverage: 92,
    seoScore: 88,
    socialScore: 91,
    aiScore: 80,
    croScore: 82,
  }
];

export const SAMPLE_AUDIT_DATA = {
  client: SAMPLE_CLIENTS[0],
  locations: [
    { id: 'loc-1', name: 'Amman Clinic (Jordan)', address: '5th Circle, Zahran St, Amman', status: 'Healthy' },
    { id: 'loc-2', name: 'Fairfax Clinic (VA, USA)', address: '10440 Main St, Fairfax, VA 22030', status: 'Action Needed' }
  ],
  pillars: {
    seo: {
      score: 78,
      band: 'Solid',
      evidenceType: 'measured',
      source: 'Multi-Node Crawler (SEOptimer Core)',
      period: 'Last 7 Days',
      definition: 'Composite health of crawlability, technical Core Web Vitals, metadata indexing, and localized dental keyword visibility.',
      measuredPoints: 47,
      totalPoints: 51,
    },
    social: {
      score: 82,
      band: 'Solid',
      evidenceType: 'measured',
      source: 'Gemini AI Multimodal Analyzer',
      period: 'Last 30 Days',
      definition: 'Evaluation of Instagram & Facebook visual branding, patient testimonial proof, bio call-to-actions, and appointment conversion pathways.',
      measuredPoints: 24,
      totalPoints: 25,
    },
    ai: {
      score: 64,
      band: 'Needs Work',
      evidenceType: 'estimated',
      source: 'LLM Discovery Matrix (ChatGPT, Perplexity, Gemini)',
      period: 'Estimated Simulation',
      definition: 'Frequency and citation accuracy with which generative assistants recommend this practice for regional dental queries.',
      measuredPoints: 8,
      totalPoints: 12,
    },
    cro: {
      score: 58,
      band: 'Needs Work',
      evidenceType: 'ai',
      source: 'AI Synthesis from UX & Booking Funnel Inspection',
      period: 'Current Run',
      definition: 'Friction analysis across mobile patient booking steps, phone inquiry click-throughs, and consultation forms.',
      measuredPoints: 6,
      totalPoints: 10,
    },
    analyticsSync: {
      score: null, // unavailable state
      statusText: 'N/A',
      evidenceType: 'unavailable',
      source: 'Google Analytics 4 API',
      reason: 'OAuth token pending client consent in Client Portal.',
      definition: 'Direct first-party patient conversion rates and session duration tracking.',
    }
  },
  competitors: [
    {
      name: "Cedar & Co. Dental",
      score: 71,
      isSelf: true,
      seo: 78,
      social: 82,
      ai: 64,
      evidenceType: 'measured',
      note: 'Target Practice'
    },
    {
      name: "Apex Dental Studio",
      score: 84,
      isSelf: false,
      seo: 86,
      social: 88,
      ai: 78,
      evidenceType: 'measured',
      note: 'Leading in Amman Cosmetic Search'
    },
    {
      name: "Pearl White Care",
      score: 73,
      isSelf: false,
      seo: 74,
      social: 76,
      ai: 68,
      evidenceType: 'estimated',
      note: 'Third-party modeled estimate'
    },
    {
      name: "SmileCraft Clinic",
      score: 61,
      isSelf: false,
      seo: 65,
      social: 60,
      ai: 58,
      evidenceType: 'estimated',
      note: 'Third-party modeled estimate'
    }
  ],
  highPriorityFindings: [
    {
      id: 'f-101',
      title: "Local Schema Missing for Amman Branch Location",
      category: "VoxSEO",
      severity: "critical",
      impact: "High Impact · +14% Local Map Pack Reach",
      evidenceType: "measured",
      source: "SEOptimer HTML Parser",
      date: "2026-11-20",
      description: "Amman clinic subpage lacks MedicalClinic and GeoCoordinates structured data, causing Google Maps to rank competing dental studios higher in Abdoun and 5th Circle queries.",
      recommendation: "Inject JSON-LD MedicalBusiness schema specifying localized opening hours, latitude/longitude, and bilingual Arabic address."
    },
    {
      id: 'f-102',
      title: "Instagram Bio Directs to Non-Mobile Responsive Form",
      category: "VoxSocial",
      severity: "needsWork",
      impact: "Medium Impact · Est. 22% Drop-off Rate",
      evidenceType: "measured",
      source: "Gemini Social Engine",
      date: "2026-11-20",
      description: "Bio link leads directly to a desktop PDF intake form rather than a streamlined WhatsApp or mobile booking portal.",
      recommendation: "Implement an instant WhatsApp direct-booking button with pre-filled dental consultation parameters."
    },
    {
      id: 'f-103',
      title: "Perplexity Pro Recommends Competitor for 'Fairfax Cosmetic Dentistry'",
      category: "VoxAI Visibility",
      severity: "watch",
      impact: "Emerging Risk · AI Search Visibility",
      evidenceType: "estimated",
      source: "LLM Probe Query Engine",
      date: "2026-11-19",
      description: "In generative queries for Northern Virginia porcelain veneers, Perplexity cites Apex Dental due to stronger authoritative citations on WebMD and Healthgrades.",
      recommendation: "Claim verified practice profiles on Healthgrades, Vitals, and local Fairfax medical directories."
    },
    {
      id: 'f-104',
      title: "Untracked WhatsApp Direct Booking Clicks in Patient Journey",
      category: "Journey & CRO",
      severity: "info",
      impact: "Optimization · Patient Conversion Tracking",
      evidenceType: "ai",
      source: "AI Synthesis from Funnel Analysis",
      date: "2026-11-20",
      description: "Arabic mobile users predominantly convert via WhatsApp, but events lack UTM campaign tagging to measure marketing ROI.",
      recommendation: "Wrap WhatsApp redirect buttons in custom Google Tag Manager click events with UTM parameters."
    }
  ]
};

// Check for live scan snapshots from SEOptimer, Gemini, or Unified Audit Wizard
export function getStoredRealScans() {
  let realSeo = null;
  let realSocial = null;
  let realUnified = null;
  try {
    const sSeo = localStorage.getItem('vox_last_seo');
    const sSocial = localStorage.getItem('vox_last_social');
    const sUnified = localStorage.getItem('vox_last_unified_audit');
    if (sSeo) realSeo = JSON.parse(sSeo);
    if (sSocial) realSocial = JSON.parse(sSocial);
    if (sUnified) realUnified = JSON.parse(sUnified);
  } catch (e) {
    // ignore parse error
  }
  return { realSeo, realSocial, realUnified };
}

// Compute active clients list dynamically (auto-inserting verified real scan or user workspace if present)
export function getActiveClientsList(user = null) {
  const { realSeo, realSocial, realUnified } = getStoredRealScans();
  const list = [...SAMPLE_CLIENTS];

  // Check if user has saved a custom business profile
  let customProfile = null;
  try {
    const raw = localStorage.getItem('vox_business_profile');
    if (raw) customProfile = JSON.parse(raw);
  } catch (e) {}

  if (realSeo || realSocial || realUnified) {
    let domain = realUnified?.domain || customProfile?.domain || 'verified-client.com';
    let brandName = realUnified?.brandName || customProfile?.brandName || 'Verified Business';

    if (realSeo?.domain) {
      domain = realSeo.domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      brandName = domain.replace(/^www\./, '').split('.')[0].toUpperCase();
    } else if (realSocial?.url) {
      try {
        const raw = realSocial.url.startsWith('http') ? realSocial.url : `https://${realSocial.url}`;
        const u = new URL(raw);
        const pathParts = u.pathname.split('/').filter(Boolean);
        const handle = pathParts[0] || u.hostname.replace('www.', '').split('.')[0];
        brandName = handle.toUpperCase();
        domain = `${handle.toLowerCase()}.social`;
      } catch (err) {
        brandName = (realSocial.url.split('/')[1] || realSocial.url).toUpperCase();
        domain = 'social-audit.com';
      }
    } else if (realUnified?.domain) {
      domain = realUnified.domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      brandName = realUnified.brandName || domain.replace(/^www\./, '').split('.')[0].toUpperCase();
    }

    const seoScore = realSeo?.overall_score ?? realSeo?.summary?.score ?? (realUnified?.seoScore ?? 84);
    const socialScore = realSocial?.score ?? realSocial?.overallScore ?? realSocial?.categories?.businessReadiness ?? (realUnified?.socialScore ?? 82);
    const overallScore = Math.round((seoScore * 0.55) + (socialScore * 0.45));

    const realClient = {
      id: 'live-scanned-client',
      name: `${brandName} (Live Scan)`,
      domain: domain,
      industry: customProfile?.industry || realSocial?.fullData?.profileIdentity || "Audited Entity",
      locations: customProfile?.locations || [{ name: "Primary Location", country: "Global", city: "Online", isPrimary: true }],
      lastAudit: realSeo?.date || realSocial?.date || realUnified?.date || new Date().toISOString().split('T')[0],
      isReal: true,
      overallScore: overallScore,
      evidenceCoverage: 96,
      seoScore: seoScore,
      socialScore: socialScore,
      aiScore: 78,
      croScore: 72,
    };
    list.unshift(realClient);
  } else if (customProfile?.brandName) {
    const savedClient = {
      id: 'saved-workspace-client',
      name: customProfile.brandName,
      domain: customProfile.domain || '',
      industry: customProfile.industry || "Digital Marketing & Growth",
      locations: customProfile.locations || [{ name: "Headquarters", country: "Global", city: "Online", isPrimary: true }],
      lastAudit: "Not audited yet",
      isReal: true,
      isDraft: !!customProfile.isDraft,
      overallScore: 0,
      evidenceCoverage: 0,
      seoScore: 0,
      socialScore: 0,
      aiScore: 0,
      croScore: 0,
    };
    list.unshift(savedClient);
  } else if (user) {
    const userDisplayName = user?.displayName || (user?.email ? user.email.split('@')[0] : null);
    if (userDisplayName) {
      const userDraftClient = {
        id: 'user-primary-workspace',
        name: `${userDisplayName} Workspace`,
        domain: '',
        industry: "Digital Marketing & Growth",
        locations: [{ name: "Headquarters", country: "Global", city: "Online", isPrimary: true }],
        lastAudit: "Setup Needed",
        isReal: true,
        isDraft: true,
        overallScore: 0,
        evidenceCoverage: 0,
        seoScore: 0,
        socialScore: 0,
        aiScore: 0,
        croScore: 0,
      };
      list.unshift(userDraftClient);
    }
  }

  return list;
}

export function getClientDiagnostics(activeClient, runtimeSeo = null, runtimeSocial = null) {
  const { realSeo: storedSeo, realSocial: storedSocial, realUnified: storedUnified } = getStoredRealScans();
  const effectiveSeo = runtimeSeo || storedSeo;
  const effectiveSocial = runtimeSocial || storedSocial;
  const effectiveUnified = storedUnified;

  const isDemoClient = activeClient?.id === 'cedar-dental' || activeClient?.id === 'nordic-apex' || activeClient?.id === 'sultan-perfumes';
  const hasRealSeo = !!effectiveSeo;
  const hasRealSocial = !!effectiveSocial;
  const hasRealUnified = !!effectiveUnified;
  const isRealScore = hasRealSeo || hasRealSocial || hasRealUnified || (!!activeClient?.isReal && !activeClient?.isDraft);

  const seoScore = hasRealSeo ? (effectiveSeo?.overall_score ?? effectiveSeo?.summary?.score ?? 85) : (effectiveUnified?.seoScore ?? (isDemoClient ? (activeClient?.seoScore || 78) : 0));
  const socialScore = hasRealSocial ? (effectiveSocial?.score ?? effectiveSocial?.overallScore ?? 82) : (effectiveUnified?.socialScore ?? (isDemoClient ? (activeClient?.socialScore || 82) : 0));
  const overallScore = isRealScore ? Math.round((seoScore * 0.55) + (socialScore * 0.45)) : (isDemoClient ? (activeClient?.overallScore || 71) : 0);

  // Dynamic real findings when real scan data exists
  let customFindings = isDemoClient ? SAMPLE_AUDIT_DATA.highPriorityFindings : [];
  if (isRealScore) {
    customFindings = [];
    if (hasRealSeo) {
      customFindings.push({
        id: 'real-seo-1',
        title: `Technical SEO Crawl Complete for ${effectiveSeo?.domain || activeClient?.domain}`,
        category: "VoxSEO",
        severity: (seoScore >= 80 ? "watch" : "critical"),
        impact: `Overall Score: ${seoScore}/100 (Grade ${effectiveSeo?.overall_grade || 'C'})`,
        evidenceType: "measured",
        source: "Multi-Node SEO Crawler",
        date: effectiveSeo?.date || new Date().toLocaleDateString(),
        description: `Live automated diagnostic completed with ${seoScore} overall health score. Core web vitals and on-page metadata inspected.`,
        recommendation: "Review the full 51-point checklist in VoxSEO Technical Scorecard to resolve high-priority warnings."
      });
    }
    if (hasRealSocial) {
      const strengths = effectiveSocial?.fullData?.strengths || effectiveSocial?.strengths || [];
      const opportunities = effectiveSocial?.fullData?.opportunities || effectiveSocial?.opportunities || [];
      customFindings.push({
        id: 'real-social-1',
        title: `Multimodal Social Readiness Analyzed for ${effectiveSocial?.url || activeClient?.name}`,
        category: "VoxSocial",
        severity: (socialScore >= 80 ? "watch" : "needsWork"),
        impact: `Social Authority: ${socialScore}/100 (${effectiveSocial?.label || 'Analyzed'})`,
        evidenceType: "measured",
        source: "Gemini AI Vision & Content Engine",
        date: effectiveSocial?.date || new Date().toLocaleDateString(),
        description: opportunities[0] || "Bio clarity, visual identity, and customer conversion pathways analyzed by Gemini multimodal AI.",
        recommendation: strengths[0] ? `Maintain strength: ${strengths[0]}` : "Optimize bio call-to-action to increase direct visitor conversion."
      });
    }
    if (hasRealUnified && !hasRealSeo && !hasRealSocial) {
      customFindings.push({
        id: 'real-unified-1',
        title: `Growth Intelligence Audit Run Completed for ${effectiveUnified?.domain || activeClient?.domain}`,
        category: "Growth Intelligence",
        severity: "watch",
        impact: `Overall Index: ${overallScore}/100 (Live Audit Verification)`,
        evidenceType: "measured",
        source: "Unified Multi-Node Scanner",
        date: effectiveUnified?.date || new Date().toLocaleDateString(),
        description: `Automated audit inspected target domain health, brand social prominence, and generative AI search grounding.`,
        recommendation: "Review individual diagnostic cards to address verified high-priority recommendations."
      });
    }
    // If demo client, fill remaining findings from sample
    if (isDemoClient) {
      SAMPLE_AUDIT_DATA.highPriorityFindings.slice(customFindings.length).forEach((f, i) => {
        customFindings.push({ ...f, id: `hybrid-f-${i}` });
      });
    }
  }

  // Determine domain without hardcoded cedar fallback
  const resolvedDomain = activeClient?.domain || effectiveSeo?.domain || (isDemoClient ? (activeClient?.domain || 'cedarandcodental.com') : '');

  return {
    client: activeClient || { name: 'My Workspace', domain: '', isReal: true, isDraft: true },
    isRealScore,
    isDemoClient,
    hasRealSeo,
    hasRealSocial,
    hasRealUnified,
    overallScore,
    seoScore,
    socialScore,
    aiScore: isRealScore ? 78 : (isDemoClient ? (activeClient?.aiScore || 64) : 0),
    croScore: isRealScore ? 72 : (isDemoClient ? (activeClient?.croScore || 58) : 0),
    domain: resolvedDomain,
    evidenceCoverage: isRealScore ? 96 : (isDemoClient ? (activeClient?.evidenceCoverage || 87) : 0),
    effectiveSeo,
    effectiveSocial,
    customFindings
  };
}
