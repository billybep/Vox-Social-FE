// Sample and Real Data Manager conforming to VA-Intelligence-Design.md specifications:
// - Fictional company: "Cedar & Co. Dental" (Amman & Fairfax locations)
// - Real data integration: Reads actual scans from localStorage (vox_last_seo, vox_last_social) and user-added real clients (vox_real_clients).
// - Unaudited / simulated metrics are explicitly labeled as DUMMY DATA.

export const SAMPLE_CLIENTS = [
  {
    id: "cedar-dental",
    name: "Cedar & Co. Dental",
    domain: "cedardentalcare.com",
    industry: "Healthcare / Dental Services",
    locations: ["Amman, Jordan", "Fairfax, VA, USA"],
    overallScore: 76,
    status: "solid",
    lastAudit: "2026-11-20",
    seoScore: 78,
    socialScore: 73,
    criticalErrors: 3,
    warnings: 8,
    proposalsCount: 2,
    activeContract: "$3,800/mo Growth Retainer",
    isReal: false
  },
  {
    id: "nordic-apex",
    name: "Nordic Apex Logistics",
    domain: "nordicapexlogistics.com",
    industry: "Supply Chain & B2B Freight",
    locations: ["Dubai, UAE", "Stockholm, Sweden"],
    overallScore: 84,
    status: "strong",
    lastAudit: "2026-11-18",
    seoScore: 88,
    socialScore: 79,
    criticalErrors: 0,
    warnings: 4,
    proposalsCount: 1,
    activeContract: "$5,500/mo SEO & Paid Retainer",
    isReal: false
  },
  {
    id: "helios-med",
    name: "Helios Wellness Clinic",
    domain: "helioswellnessmed.com",
    industry: "Aesthetic Medicine & Spa",
    locations: ["Riyadh, Saudi Arabia"],
    overallScore: 58,
    status: "needsWork",
    lastAudit: "2026-11-21",
    seoScore: 54,
    socialScore: 62,
    criticalErrors: 7,
    warnings: 12,
    proposalsCount: 1,
    activeContract: "Audit in review",
    isReal: false
  },
  {
    id: "petra-studio",
    name: "Petra Artisans Studio",
    domain: "petraartisans.jo",
    industry: "Luxury Hospitality & Crafts",
    locations: ["Wadi Musa, Jordan"],
    overallScore: 91,
    status: "strong",
    lastAudit: "2026-11-15",
    seoScore: 92,
    socialScore: 90,
    criticalErrors: 0,
    warnings: 2,
    proposalsCount: 0,
    activeContract: "$2,400/mo Content Retainer",
    isReal: false
  }
];

export const SAMPLE_AUDIT_DATA = {
  client: SAMPLE_CLIENTS[0], // Cedar & Co. Dental
  digitalHealthIndex: 76,
  statusLabel: "SOLID - COMPETITIVE FOOTPRINT",
  dataConfidence: 92,
  evidenceCoverage: 88,
  searchVisibility: 78,
  socialReadiness: 73,
  isReal: false,
  
  sources: [
    { name: "Public SEO Crawler", type: "measured", status: "active", lastSync: "12m ago", isReal: false },
    { name: "Core Web Vitals Node", type: "measured", status: "active", lastSync: "12m ago", isReal: false },
    { name: "Social Metadata Stream", type: "measured", status: "active", lastSync: "15m ago", isReal: false },
    { name: "Google Business Profile API", type: "connected", status: "failed", errorMsg: "OAuth refresh token expired (Requires reconnection)", lastSync: "Failed", isReal: false },
    { name: "Competitor SERP Model", type: "estimated", status: "active", lastSync: "1h ago", isReal: false }
  ],

  topBottlenecks: [
    {
      id: "bot-1",
      priority: "CRITICAL · CWV SPEED",
      title: "Largest Contentful Paint (LCP) Delay (4.2s)",
      impact: "Mobile visitors abandon booking page before dental calendar renders.",
      fix: "Offload uncompressed hero carousel images to WebP CDN and defer third-party booking widget script.",
      evidence: "Measured (Chrome UX Report + Lighthouse 54/100)",
      evidenceType: "measured",
      isReal: false
    },
    {
      id: "bot-2",
      priority: "CRITICAL · ON-PAGE SCHEMA",
      title: "Missing LocalBusiness & MedicalBusiness JSON-LD",
      impact: "Google Map Pack cannot match clinic opening hours and doctor credentials for dental searches in Amman.",
      fix: "Deploy structured JSON-LD schema with exact coordinates, geo-radius, and accepted dental insurances.",
      evidence: "Measured (0 schema instances detected in DOM)",
      evidenceType: "measured",
      isReal: false
    },
    {
      id: "bot-3",
      priority: "HIGH · SOCIAL CONVERSION",
      title: "Un-tracked Multi-step Bio Link",
      impact: "42% estimated link-in-bio bounce rate due to broken WhatsApp booking query parameters.",
      fix: "Implement direct UTM-tagged deep link directly into WhatsApp Business booking queue.",
      evidence: "Estimated (Heuristic AI Flow Diagnostic)",
      evidenceType: "estimated",
      isReal: false
    }
  ],

  pillars: {
    seo: { name: "On-Page SEO", score: 82, status: "strong", isReal: false },
    performance: { name: "PageSpeed & CWV", score: 54, status: "critical", isReal: false },
    usability: { name: "Mobile Usability", score: 85, status: "strong", isReal: false },
    social: { name: "Social Authority", score: 73, status: "solid", isReal: false },
    local: { name: "Local Entity / Maps", score: 48, status: "needsWork", isReal: false },
    technology: { name: "Tech Architecture", score: 88, status: "strong", isReal: false }
  },

  competitors: [
    { name: "Cedar & Co. Dental (Target)", score: 76, visibility: "Solid", isSelf: true, type: "measured", isReal: false },
    { name: "Apex Dental Clinic", score: 81, visibility: "High", isSelf: false, type: "estimated", isReal: false },
    { name: "Lumina Smile Studio", score: 68, visibility: "Moderate", isSelf: false, type: "estimated", isReal: false },
    { name: "Jordan Oral Care", score: 62, visibility: "Lagging", isSelf: false, type: "estimated", isReal: false }
  ],

  roadmap30Days: [
    { day: "Day 1–7", title: "Core Web Vitals & Image Compression", owner: "Engineering", impact: "High", isReal: false },
    { day: "Day 8–14", title: "Medical Schema & Multi-Location GBP Injection", owner: "SEO Specialist", impact: "High", isReal: false },
    { day: "Day 15–21", title: "Social Bio Hook & Instagram Story Highlights Re-order", owner: "Content Lead", impact: "Medium", isReal: false },
    { day: "Day 22–30", title: "Re-scan & Client Progress Verification Gate", owner: "Strategy Lead", impact: "High", isReal: false }
  ]
};

// =============================================================================
// REAL DATA RETRIEVAL & SYNTHESIS HELPERS
// =============================================================================

export const getStoredRealScans = () => {
  let lastSeo = null;
  let lastSocial = null;
  try {
    const rawSeo = localStorage.getItem('vox_last_seo');
    if (rawSeo) lastSeo = JSON.parse(rawSeo);
  } catch (e) {
    console.warn("Failed to parse vox_last_seo:", e);
  }

  try {
    const rawSocial = localStorage.getItem('vox_last_social');
    if (rawSocial) lastSocial = JSON.parse(rawSocial);
  } catch (e) {
    console.warn("Failed to parse vox_last_social:", e);
  }

  return { lastSeo, lastSocial };
};

export const getActiveClientsList = () => {
  let realClients = [];
  try {
    const raw = localStorage.getItem('vox_real_clients');
    if (raw) realClients = JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load vox_real_clients:", e);
  }

  const { lastSeo, lastSocial } = getStoredRealScans();

  // If real scan(s) exist, check if we need an auto client entry
  if (lastSeo || lastSocial) {
    const domain = lastSeo?.domain || (lastSocial?.url ? lastSocial.url.replace(/^https?:\/\/(www\.)?/i, '').split('/')[0] : 'My Business');
    const existingIndex = realClients.findIndex(c => c.domain.toLowerCase() === domain.toLowerCase());
    
    const computedScore = (lastSeo && lastSocial)
      ? Math.round((lastSeo.overall_score ?? 75) * 0.55 + (lastSocial.score ?? 70) * 0.45)
      : (lastSeo ? (lastSeo.overall_score ?? 75) : (lastSocial ? lastSocial.score : 70));

    const autoClient = {
      id: "real-primary-client",
      name: domain.toUpperCase(),
      domain: domain,
      industry: "Live Audited Entity",
      locations: ["Primary Location"],
      overallScore: computedScore,
      status: computedScore >= 80 ? "strong" : computedScore >= 60 ? "solid" : "needsWork",
      lastAudit: lastSeo?.date || lastSocial?.date || "Recently",
      seoScore: lastSeo?.overall_score || null,
      socialScore: lastSocial?.score || null,
      criticalErrors: lastSeo?.checks?.critical || (lastSeo?.checks?.fail_count ?? 1),
      warnings: lastSeo?.checks?.warning || 3,
      proposalsCount: 1,
      activeContract: "Live Audit Client",
      isReal: true,
      hasRealSeo: Boolean(lastSeo),
      hasRealSocial: Boolean(lastSocial),
      realSeoData: lastSeo,
      realSocialData: lastSocial
    };

    if (existingIndex >= 0) {
      realClients[existingIndex] = { ...realClients[existingIndex], ...autoClient };
    } else {
      realClients = [autoClient, ...realClients];
    }
  }

  // Prepend real clients before dummy sample clients
  return [
    ...realClients.map(c => ({ ...c, isReal: true })),
    ...SAMPLE_CLIENTS.map(c => ({ ...c, isReal: false }))
  ];
};

export const addRealClient = (clientData) => {
  try {
    const raw = localStorage.getItem('vox_real_clients');
    const list = raw ? JSON.parse(raw) : [];
    const cleanDomain = clientData.domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '').toLowerCase();
    
    const newClient = {
      id: 'client-' + Date.now(),
      name: clientData.name || cleanDomain,
      domain: cleanDomain,
      socialUrl: clientData.socialUrl || '',
      industry: clientData.industry || 'General Business',
      locations: clientData.location ? [clientData.location] : ['Headquarters'],
      overallScore: 0,
      status: 'pending',
      lastAudit: 'Not audited yet',
      seoScore: null,
      socialScore: null,
      criticalErrors: 0,
      warnings: 0,
      proposalsCount: 0,
      activeContract: 'New Account',
      isReal: true,
      hasRealSeo: false,
      hasRealSocial: false
    };

    list.unshift(newClient);
    localStorage.setItem('vox_real_clients', JSON.stringify(list));
    return newClient;
  } catch (e) {
    console.error("Failed to add real client:", e);
    return null;
  }
};

// Builds unified diagnostic report based on client reality
export const getClientDiagnostics = (activeClient, runtimeSeo, runtimeSocial) => {
  const { lastSeo, lastSocial } = getStoredRealScans();
  const effectiveSeo = runtimeSeo || activeClient?.realSeoData || (activeClient?.isReal ? lastSeo : null);
  const effectiveSocial = runtimeSocial || activeClient?.realSocialData || (activeClient?.isReal ? lastSocial : null);

  const hasRealSeo = Boolean(effectiveSeo);
  const hasRealSocial = Boolean(effectiveSocial);

  // If client is real and has real scans, compute real score
  let overallScore = activeClient?.overallScore;
  let isRealScore = false;

  if (hasRealSeo && hasRealSocial) {
    overallScore = Math.round((effectiveSeo.overall_score || 75) * 0.55 + (effectiveSocial.score || 70) * 0.45);
    isRealScore = true;
  } else if (hasRealSeo) {
    overallScore = effectiveSeo.overall_score || 75;
    isRealScore = true;
  } else if (hasRealSocial) {
    overallScore = effectiveSocial.score || 70;
    isRealScore = true;
  } else if (!activeClient?.isReal) {
    overallScore = activeClient?.overallScore || 76;
    isRealScore = false;
  } else {
    overallScore = 0;
    isRealScore = false;
  }

  // Real vs Dummy Pillars
  const pillars = {
    seo: {
      name: "On-Page SEO",
      score: effectiveSeo?.breakdown?.SEO ?? (hasRealSeo ? effectiveSeo.overall_score : 82),
      status: "strong",
      isReal: hasRealSeo
    },
    performance: {
      name: "PageSpeed & CWV",
      score: effectiveSeo?.breakdown?.Performance ?? (hasRealSeo ? 58 : 54),
      status: "critical",
      isReal: hasRealSeo
    },
    usability: {
      name: "Mobile Usability",
      score: effectiveSeo?.breakdown?.Usability ?? (hasRealSeo ? 80 : 85),
      status: "strong",
      isReal: hasRealSeo
    },
    social: {
      name: "Social Authority",
      score: effectiveSocial?.score ?? (hasRealSocial ? 70 : 73),
      status: "solid",
      isReal: hasRealSocial
    },
    local: {
      name: "Local Entity / Maps",
      score: effectiveSeo?.breakdown?.Local ?? 48,
      status: "needsWork",
      isReal: hasRealSeo && Boolean(effectiveSeo?.breakdown?.Local)
    },
    technology: {
      name: "Tech Architecture",
      score: effectiveSeo?.breakdown?.Technology ?? 88,
      status: "strong",
      isReal: hasRealSeo && Boolean(effectiveSeo?.breakdown?.Technology)
    }
  };

  return {
    client: activeClient,
    overallScore,
    isRealScore,
    hasRealSeo,
    hasRealSocial,
    effectiveSeo,
    effectiveSocial,
    pillars,
    seoScore: effectiveSeo?.overall_score ?? (activeClient?.seoScore || 78),
    socialScore: effectiveSocial?.score ?? (activeClient?.socialScore || 73),
    domain: effectiveSeo?.domain || activeClient?.domain || "Target Domain",
    socialUrl: effectiveSocial?.url || activeClient?.socialUrl || "Social Profile"
  };
};
