import React, { useState } from 'react';
import EvidenceTag from '../core/EvidenceTag';

/**
 * Business Profile & Client Workspace Entity Component
 * Integrity Rule: Clearly label and distinguish:
 * - Brand Level (Brand Name, Primary Domain, Mission, Categories)
 * - Location(s) Level (Branch Name, Address, City, Country, Multi-location setup)
 * - Organization Level (CR Number, Legal Entity, Tax/Billing Details)
 */
export default function BusinessProfileSection({
  user,
  client,
  t,
  isRtl,
  onSaveClient
}) {
  const [activeTab, setActiveTab] = useState('brand'); // 'brand' | 'locations' | 'organization' | 'social_competitors'
  const [locationMode, setLocationMode] = useState('multi'); // 'single' | 'multi'
  const [saveNotice, setSaveNotice] = useState(false);

  const userDisplayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'My Business');
  const userEmail = user?.email || '';

  const buildDefaultProfile = (cli) => {
    // 1. Try reading saved profile from localStorage
    try {
      const saved = localStorage.getItem('vox_business_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.brandName) return parsed;
      }
    } catch (e) {}

    // 2. If client is real (live scan or explicit saved entity)
    if (cli?.isReal && !cli.isDraft) {
      return {
        isDraft: false,
        brandName: cli.name?.replace(' (Live Scan)', '') || userDisplayName,
        domain: cli.domain || '',
        industry: cli.industry || 'Digital & E-Commerce',
        tagline: `Official digital presence for ${cli.name?.replace(' (Live Scan)', '') || userDisplayName}`,
        primaryLanguage: 'Bilingual (Arabic & English)',
        locations: cli.locations || [
          { id: 'loc-1', name: 'Primary Headquarters', address: 'Headquarters Facility', city: 'Online', country: 'Global', phone: '', isPrimary: true }
        ],
        legalName: `${cli.name?.replace(' (Live Scan)', '') || userDisplayName} Entity LLC`,
        taxId: 'CR-VERIFIED',
        headquartersCity: 'Global',
        billingContact: userEmail || (cli.domain ? `billing@${cli.domain}` : 'contact@mybrand.com'),
        socials: {
          instagram: cli.domain ? `https://instagram.com/${cli.domain.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_]/g, '')}` : '',
          facebook: '',
          tiktok: '',
          linkedin: ''
        },
        competitors: []
      };
    }

    // 3. If explicit demo client selected (Nordic Apex, Sultan Oud, or Cedar & Co. clicked in dropdown)
    if (cli?.id === 'nordic-apex' || cli?.id === 'sultan-perfumes') {
      return {
        isDraft: false,
        isSampleDemo: true,
        brandName: cli.name,
        domain: cli.domain,
        industry: cli.industry,
        tagline: `Demo enterprise entity for ${cli.name}`,
        primaryLanguage: 'Bilingual (Arabic & English)',
        locations: cli.locations || [{ id: 'loc-1', name: 'Primary Hub', address: 'Commercial Centre', city: 'Dubai', country: 'UAE', phone: '', isPrimary: true }],
        legalName: `${cli.name} Group Ltd`,
        taxId: 'CR-DEMO-9912',
        headquartersCity: cli.locations?.[0]?.city || 'Dubai',
        billingContact: `contact@${cli.domain}`,
        socials: { instagram: `https://instagram.com/${cli.domain.split('.')[0]}`, facebook: '', tiktok: '', linkedin: '' },
        competitors: []
      };
    }

    if (cli?.id === 'cedar-dental') {
      return {
        isDraft: false,
        isSampleDemo: true,
        brandName: 'Cedar & Co. Dental',
        domain: 'cedarandcodental.com',
        industry: 'Healthcare & Cosmetic Dentistry',
        tagline: 'Modern cosmetic and restorative dentistry with personalized care.',
        primaryLanguage: 'Bilingual (Arabic & English)',
        locations: [
          { id: 'loc-1', name: 'Amman Clinic (Jordan)', address: 'Zahran St, 5th Circle, Building 14', city: 'Amman', country: 'Jordan', phone: '+962 6 550 1234', isPrimary: true },
          { id: 'loc-2', name: 'Fairfax Clinic (VA, USA)', address: '10440 Main St, Suite 200', city: 'Fairfax, VA', country: 'USA', phone: '+1 703 555 0199', isPrimary: false }
        ],
        legalName: 'Cedar Dental Healthcare Group LLC',
        taxId: 'CR-904812-JO / EIN-54-1238910',
        headquartersCity: 'Amman, Jordan',
        billingContact: 'billing@cedarandcodental.com',
        socials: {
          instagram: 'https://instagram.com/cedarandcodental',
          facebook: 'https://facebook.com/cedarandcodental',
          tiktok: 'https://tiktok.com/@cedardental',
          linkedin: 'https://linkedin.com/company/cedar-dental'
        },
        competitors: [
          { id: 'c-1', name: 'Apex Dental Studio', domain: 'apexdental.jo' },
          { id: 'c-2', name: 'Pearl White Care', domain: 'pearlwhitecare.com' },
          { id: 'c-3', name: 'SmileCraft Clinic', domain: 'smilecraft.com' }
        ]
      };
    }

    // 4. Default for New Logged-in User (Clean Workspace Draft)
    return {
      isDraft: true,
      brandName: `${userDisplayName} Workspace`,
      domain: '',
      industry: 'Digital Marketing & Growth',
      tagline: 'Growth Intelligence and multi-channel audit workspace.',
      primaryLanguage: 'Bilingual (Arabic & English)',
      locations: [
        { id: 'loc-1', name: 'Primary Headquarters', address: 'Suite 100, Innovation Blvd', city: 'Headquarters', country: 'Global', phone: '', isPrimary: true }
      ],
      legalName: `${userDisplayName} LLC`,
      taxId: 'CR-PENDING',
      headquartersCity: 'Headquarters',
      billingContact: userEmail || 'contact@mybrand.com',
      socials: {
        instagram: '',
        facebook: '',
        tiktok: '',
        linkedin: ''
      },
      competitors: []
    };
  };

  const [profile, setProfile] = useState(() => buildDefaultProfile(client));

  // Sync profile when client prop changes from the top navbar switcher
  React.useEffect(() => {
    if (client?.id && client.id !== 'user-primary-workspace' && client.id !== 'saved-workspace-client') {
      if (client.id === 'cedar-dental') {
        loadSampleDemo();
      } else if (client.id === 'nordic-apex' || client.id === 'sultan-perfumes') {
        setProfile(buildDefaultProfile(client));
      }
    }
  }, [client?.id]);

  const loadSampleDemo = () => {
    setProfile({
      isDraft: false,
      isSampleDemo: true,
      brandName: 'Cedar & Co. Dental',
      domain: 'cedarandcodental.com',
      industry: 'Healthcare & Cosmetic Dentistry',
      tagline: 'Modern cosmetic and restorative dentistry with personalized care.',
      primaryLanguage: 'Bilingual (Arabic & English)',
      locations: [
        { id: 'loc-1', name: 'Amman Clinic (Jordan)', address: 'Zahran St, 5th Circle, Building 14', city: 'Amman', country: 'Jordan', phone: '+962 6 550 1234', isPrimary: true },
        { id: 'loc-2', name: 'Fairfax Clinic (VA, USA)', address: '10440 Main St, Suite 200', city: 'Fairfax, VA', country: 'USA', phone: '+1 703 555 0199', isPrimary: false }
      ],
      legalName: 'Cedar Dental Healthcare Group LLC',
      taxId: 'CR-904812-JO / EIN-54-1238910',
      headquartersCity: 'Amman, Jordan',
      billingContact: 'billing@cedarandcodental.com',
      socials: {
        instagram: 'https://instagram.com/cedarandcodental',
        facebook: 'https://facebook.com/cedarandcodental',
        tiktok: 'https://tiktok.com/@cedardental',
        linkedin: 'https://linkedin.com/company/cedar-dental'
      },
      competitors: [
        { id: 'c-1', name: 'Apex Dental Studio', domain: 'apexdental.jo' },
        { id: 'c-2', name: 'Pearl White Care', domain: 'pearlwhitecare.com' },
        { id: 'c-3', name: 'SmileCraft Clinic', domain: 'smilecraft.com' }
      ]
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...profile, isDraft: false, isSampleDemo: false };
    setProfile(updated);
    localStorage.setItem('vox_business_profile', JSON.stringify(updated));
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
    if (onSaveClient) {
      onSaveClient(updated);
    }
  };

  const addBranch = () => {
    const newBranch = {
      id: `loc-${Date.now()}`,
      name: 'Riyadh Clinic Branch',
      address: 'King Fahd Rd, Olaya',
      city: 'Riyadh',
      country: 'Saudi Arabia',
      phone: '+966 11 400 9988',
      isPrimary: false
    };
    setProfile(prev => ({ ...prev, locations: [...prev.locations, newBranch] }));
  };

  const removeBranch = (id) => {
    if (profile.locations.length <= 1) return;
    setProfile(prev => ({
      ...prev,
      locations: prev.locations.filter(l => l.id !== id)
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in text-slate-800 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold uppercase text-slate-500">ENTITY GOVERNANCE</span>
            <EvidenceTag type="measured" source="Verified Workspace Profile" />
            {profile.isDraft ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-50 text-brand-blue border border-blue-200">
                WORKSPACE DRAFT
              </span>
            ) : profile.isSampleDemo || client?.id === 'cedar-dental' ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300">
                SAMPLE PROFILE (DEMO)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-300">
                ACTIVE PROFILE
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mt-1">
            {t.profile.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">{t.profile.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {saveNotice && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5 animate-fade-in">
              <i className="fa-solid fa-check"></i> Changes Saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
          >
            <i className="fa-regular fa-floppy-disk"></i>
            <span>{t.profile.saveBtn}</span>
          </button>
        </div>
      </div>

      {/* Onboarding Banner for Draft Profile */}
      {profile.isDraft && (
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50/80 border border-cyan-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-cyan-950 animate-fade-in shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-700 flex items-center justify-center shrink-0 text-base mt-0.5 sm:mt-0">
              <i className="fa-solid fa-sparkles"></i>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Welcome to your Workspace Business Profile</p>
              <p className="text-slate-600 text-xs">
                Enter your company website and social handles below to personalize audit intelligence, or load sample demo data to explore.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadSampleDemo}
            className="px-4 py-2 rounded-xl bg-white hover:bg-cyan-100/60 border border-cyan-300 text-cyan-800 font-bold transition-colors shrink-0 shadow-xs flex items-center gap-2 self-start sm:self-auto"
          >
            <i className="fa-solid fa-flask text-xs"></i>
            <span>Load Demo Client (Cedar & Co.)</span>
          </button>
        </div>
      )}

      {/* Tabs Navigation (Brand vs Locations vs Org vs Socials) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto">
        {[
          { id: 'brand', label: t.profile.brandLevel, icon: 'fa-solid fa-tag' },
          { id: 'locations', label: t.profile.locationLevel, icon: 'fa-solid fa-location-dot', badge: `${profile.locations.length}` },
          { id: 'organization', label: t.profile.orgLevel, icon: 'fa-solid fa-building-columns' },
          { id: 'social_competitors', label: 'Social & Competitors', icon: 'fa-solid fa-share-nodes' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-brand-blue text-brand-blue bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <i className={`${tab.icon} text-xs`}></i>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-mono">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: BRAND LEVEL DATA */}
      {/* ============================================================== */}
      {activeTab === 'brand' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 text-xs animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Brand Identity & Digital Properties</h3>
              <p className="text-slate-500 text-xs">Used for audit report branding, header metadata, and customer-facing documents.</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-brand-blue font-mono font-bold text-[10px] uppercase">
              Brand Level
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Public Name</label>
              <input
                type="text"
                value={profile.brandName}
                onChange={(e) => setProfile({ ...profile, brandName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Website Domain</label>
              <input
                type="text"
                dir="ltr"
                value={profile.domain}
                placeholder="e.g. yourcompany.com"
                onChange={(e) => setProfile({ ...profile, domain: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-semibold focus:border-brand-blue focus:outline-none text-start"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Industry Classification</label>
              <input
                type="text"
                value={profile.industry}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Report Language Target</label>
              <input
                type="text"
                value={profile.primaryLanguage}
                onChange={(e) => setProfile({ ...profile, primaryLanguage: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Brand Tagline / Mission</label>
              <input
                type="text"
                value={profile.tagline}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: LOCATION LEVEL DATA (SINGLE VS MULTI-LOCATION) */}
      {/* ============================================================== */}
      {activeTab === 'locations' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 text-xs animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Physical Branches & Local Search Targets</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] uppercase border border-emerald-200">
                  {t.profile.dualPracticeBadge}
                </span>
              </div>
              <p className="text-slate-500 text-xs">Each branch is independently crawled for local schema, Google Maps indexing, and geographic citations.</p>
            </div>

            <button
              onClick={addBranch}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0"
            >
              {t.profile.addLocationBtn}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.locations.map((loc, idx) => (
              <div key={loc.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <strong className="text-slate-900 font-bold text-sm">{loc.name}</strong>
                  </div>
                  {loc.isPrimary ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-brand-blue uppercase">
                      Primary Branch
                    </span>
                  ) : (
                    <button
                      onClick={() => removeBranch(loc.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Branch"
                    >
                      <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Physical Address</label>
                    <input
                      type="text"
                      value={loc.address}
                      onChange={(e) => {
                        const updated = [...profile.locations];
                        updated[idx].address = e.target.value;
                        setProfile({ ...profile, locations: updated });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">City & Country</label>
                      <input
                        type="text"
                        value={`${loc.city}, ${loc.country}`}
                        onChange={(e) => {
                          const updated = [...profile.locations];
                          updated[idx].city = e.target.value;
                          setProfile({ ...profile, locations: updated });
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Local Contact Phone</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={loc.phone}
                        onChange={(e) => {
                          const updated = [...profile.locations];
                          updated[idx].phone = e.target.value;
                          setProfile({ ...profile, locations: updated });
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-mono font-semibold focus:border-brand-blue focus:outline-none text-start"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: ORGANIZATION LEVEL DATA (LEGAL & BILLING) */}
      {/* ============================================================== */}
      {activeTab === 'organization' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 text-xs animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Legal Entity & Corporate Governance</h3>
              <p className="text-slate-500 text-xs">Commercial registration numbers, agency billing entity, and audit compliance logs.</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-mono font-bold text-[10px] uppercase">
              Organization Level
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Registered Legal Entity</label>
              <input
                type="text"
                value={profile.legalName}
                onChange={(e) => setProfile({ ...profile, legalName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Commercial Registration / Tax ID</label>
              <input
                type="text"
                dir="ltr"
                value={profile.taxId}
                onChange={(e) => setProfile({ ...profile, taxId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-semibold focus:border-brand-blue focus:outline-none text-start"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Corporate Headquarters</label>
              <input
                type="text"
                value={profile.headquartersCity}
                onChange={(e) => setProfile({ ...profile, headquartersCity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Billing & Client Portal Notice Email</label>
              <input
                type="email"
                dir="ltr"
                value={profile.billingContact}
                onChange={(e) => setProfile({ ...profile, billingContact: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none text-start"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: SOCIAL HANDLES & COMPETITORS */}
      {/* ============================================================== */}
      {activeTab === 'social_competitors' && (
        <div className="space-y-6 text-xs animate-fade-in">
          
          {/* Social Media Handles */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.profile.socialSectionTitle}</h3>
                <p className="text-slate-500 text-xs">Feeds directly into the VoxSocial multimodal AI audit engine.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <i className="fa-brands fa-instagram text-pink-500"></i> Instagram Profile URL
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={profile.socials.instagram}
                  placeholder="https://instagram.com/yourhandle or @yourhandle"
                  onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, instagram: e.target.value } })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono font-medium focus:border-brand-blue focus:outline-none text-start"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <i className="fa-brands fa-tiktok text-slate-900"></i> TikTok Profile URL
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={profile.socials.tiktok}
                  placeholder="https://tiktok.com/@yourhandle"
                  onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, tiktok: e.target.value } })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono font-medium focus:border-brand-blue focus:outline-none text-start"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <i className="fa-brands fa-facebook text-blue-600"></i> Facebook Page URL
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={profile.socials.facebook}
                  onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, facebook: e.target.value } })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono font-medium focus:border-brand-blue focus:outline-none text-start"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <i className="fa-brands fa-linkedin text-blue-700"></i> LinkedIn Company URL
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={profile.socials.linkedin}
                  onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, linkedin: e.target.value } })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono font-medium focus:border-brand-blue focus:outline-none text-start"
                />
              </div>
            </div>
          </div>

          {/* Competitor Watchlist */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.profile.competitorSectionTitle}</h3>
                <p className="text-slate-500 text-xs">Used for benchmark matrix comparisons and AI query share of voice.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {profile.competitors.map((comp, idx) => (
                <div key={comp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Competitor #{idx + 1}</span>
                    <span className="text-[10px] font-mono text-slate-400">Slot {idx + 1} of 3</span>
                  </div>
                  <input
                    type="text"
                    value={comp.name}
                    onChange={(e) => {
                      const updated = [...profile.competitors];
                      updated[idx].name = e.target.value;
                      setProfile({ ...profile, competitors: updated });
                    }}
                    placeholder="Competitor Name"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-semibold focus:border-brand-blue focus:outline-none"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    value={comp.domain}
                    onChange={(e) => {
                      const updated = [...profile.competitors];
                      updated[idx].domain = e.target.value;
                      setProfile({ ...profile, competitors: updated });
                    }}
                    placeholder="domain.com"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-mono font-semibold focus:border-brand-blue focus:outline-none text-start"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
