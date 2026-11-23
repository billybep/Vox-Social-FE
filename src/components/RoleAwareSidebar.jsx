import React from 'react';
import { playSynthTick } from '../utils/audio';
import { translations } from '../utils/translations';

const LOGO_URL = "/New_Logo_Voxlumedia.webp";

export default function RoleAwareSidebar({
  currentRole, // 'agency' | 'consultant' | 'business'
  activeNav,
  setActiveNav,
  language = 'en',
  isCollapsed = false,
  setIsCollapsed,
  onStartNewAudit,
  activeClient,
  onSelectClient
}) {
  const t = translations[language] || translations.en;
  const isRtl = language === 'ar';

  const handleNavClick = (navKey) => {
    playSynthTick(750, 'sine', 0.04, 0.05);
    setActiveNav(navKey);
  };

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'agency':
        return { label: t.roles.agency, color: 'bg-[#0094ea]/15 text-[#00e5ff] border-[#0094ea]/30' };
      case 'consultant':
        return { label: t.roles.consultant, color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'business':
      default:
        return { label: t.roles.business, color: 'bg-[#ff7b1a]/15 text-[#ff7b1a] border-[#ff7b1a]/30' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <aside
      className={`relative z-40 flex flex-col shrink-0 bg-[#07041d] border-r border-white/10 transition-all duration-300 select-none ${
        isRtl ? 'border-l border-r-0' : 'border-r'
      } ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Brand & Workspace Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
          title={t.brandName}
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0 bg-white/5 border border-white/10 shadow-md">
            <img src={LOGO_URL} className="w-full h-full object-contain" alt="Voxlumedia Logo" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="block text-xs font-black tracking-wider text-white uppercase truncate">
                {t.brandName}
              </span>
              <span className="block text-[10px] font-mono text-white/40 truncate">
                Sprint 1 Foundations
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => {
            playSynthTick(600, 'sine', 0.03, 0.04);
            setIsCollapsed(!isCollapsed);
          }}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all text-xs shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <i className={`fa-solid ${isCollapsed ? (isRtl ? 'fa-angles-left' : 'fa-angles-right') : (isRtl ? 'fa-angles-right' : 'fa-angles-left')}`}></i>
        </button>
      </div>

      {/* Role Indicator Banner */}
      {!isCollapsed && (
        <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
          <span className="text-[9px] uppercase font-bold text-white/40 font-mono">
            {t.roleBadge}
          </span>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border font-mono ${roleBadge.color}`}>
            {roleBadge.label}
          </span>
        </div>
      )}

      {/* Create Audit CTA Button */}
      <div className="p-3">
        <button
          onClick={onStartNewAudit}
          className={`w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0094ea] to-[#cf41b2] hover:brightness-110 text-white font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 ${
            isCollapsed ? 'px-0' : ''
          }`}
          title={t.topbar.createAuditBtn}
        >
          <i className="fa-solid fa-bolt text-white text-xs"></i>
          {!isCollapsed && <span>{t.topbar.createAuditBtn}</span>}
        </button>
      </div>

      {/* Navigation Groups List */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6 custom-scrollbar text-xs">

        {/* 1. WORKSPACE GROUP */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-black tracking-widest text-white/40 uppercase font-mono">
              {t.navGroups.workspace}
            </div>
          )}
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
              activeNav === 'dashboard'
                ? 'bg-[#0094ea] text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title={t.navItems.dashboard}
          >
            <i className="fa-solid fa-table-columns w-4 text-center shrink-0"></i>
            {!isCollapsed && <span className="truncate">{t.navItems.dashboard}</span>}
          </button>

          {/* Agency role: Client Manager shortcut */}
          {currentRole === 'agency' && (
            <button
              onClick={() => handleNavClick('agency_clients')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
                activeNav === 'agency_clients'
                  ? 'bg-[#0094ea] text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              title={t.navItems.clients}
            >
              <i className="fa-solid fa-users-viewfinder w-4 text-center shrink-0"></i>
              {!isCollapsed && <span className="truncate">{t.navItems.clients}</span>}
            </button>
          )}

          <button
            onClick={() => handleNavClick('audits_runs')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
              activeNav === 'audits_runs'
                ? 'bg-[#0094ea] text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title={t.navItems.auditRuns}
          >
            <i className="fa-solid fa-clock-rotate-left w-4 text-center shrink-0"></i>
            {!isCollapsed && <span className="truncate">{t.navItems.auditRuns}</span>}
          </button>
        </div>

        {/* 2. INTELLIGENCE GROUP (All 3 roles see Intelligence) */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-black tracking-widest text-[#00e5ff] uppercase font-mono flex items-center justify-between">
              <span>{t.navGroups.intelligence}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse"></span>
            </div>
          )}

          <button
            onClick={() => handleNavClick('intelligence_overview')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
              activeNav === 'intelligence_overview'
                ? 'bg-[#0094ea] text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title={t.navItems.overview}
          >
            <i className="fa-solid fa-chart-pie w-4 text-center shrink-0"></i>
            {!isCollapsed && <span className="truncate">{t.navItems.overview}</span>}
          </button>

          <button
            onClick={() => handleNavClick('intelligence_seo')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
              activeNav === 'intelligence_seo'
                ? 'bg-[#0094ea] text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title={t.navItems.voxSeo}
          >
            <i className="fa-solid fa-magnifying-glass-chart w-4 text-center text-green-400 shrink-0"></i>
            {!isCollapsed && <span className="truncate">{t.navItems.voxSeo}</span>}
          </button>

          <button
            onClick={() => handleNavClick('intelligence_social')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
              activeNav === 'intelligence_social'
                ? 'bg-[#0094ea] text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title={t.navItems.voxSocial}
          >
            <i className="fa-brands fa-instagram w-4 text-center text-pink-400 shrink-0"></i>
            {!isCollapsed && <span className="truncate">{t.navItems.voxSocial}</span>}
          </button>

          <button
            onClick={() => handleNavClick('intelligence_ai')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
              activeNav === 'intelligence_ai'
                ? 'bg-[#0094ea] text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title={t.navItems.voxAi}
          >
            <i className="fa-solid fa-brain w-4 text-center text-[#cf41b2] shrink-0"></i>
            {!isCollapsed && <span className="truncate">{t.navItems.voxAi}</span>}
          </button>

          <button
            onClick={() => handleNavClick('intelligence_competitors')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
              activeNav === 'intelligence_competitors'
                ? 'bg-[#0094ea] text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title={t.navItems.competitive}
          >
            <i className="fa-solid fa-crosshairs w-4 text-center text-amber-400 shrink-0"></i>
            {!isCollapsed && <span className="truncate">{t.navItems.competitive}</span>}
          </button>
        </div>

        {/* 3. GROWTH GROUP */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-black tracking-widest text-[#cf41b2] uppercase font-mono">
              {t.navGroups.growth}
            </div>
          )}

          <button
            onClick={() => handleNavClick('growth_strategy')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
              activeNav === 'growth_strategy'
                ? 'bg-[#0094ea] text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title={t.navItems.strategy}
          >
            <i className="fa-solid fa-compass-drafting w-4 text-center shrink-0"></i>
            {!isCollapsed && <span className="truncate">{t.navItems.strategy}</span>}
          </button>

          <button
            onClick={() => handleNavClick('growth_roadmap')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
              activeNav === 'growth_roadmap'
                ? 'bg-[#0094ea] text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title={t.navItems.roadmap}
          >
            <i className="fa-solid fa-timeline w-4 text-center shrink-0"></i>
            {!isCollapsed && <span className="truncate">{t.navItems.roadmap}</span>}
          </button>

          {/* Proposal Builder: Only Agency & Consultant */}
          {currentRole !== 'business' && (
            <button
              onClick={() => handleNavClick('growth_proposals')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
                activeNav === 'growth_proposals'
                  ? 'bg-[#0094ea] text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              title={t.navItems.proposals}
            >
              <i className="fa-solid fa-file-invoice-dollar w-4 text-center text-emerald-400 shrink-0"></i>
              {!isCollapsed && <span className="truncate">{t.navItems.proposals}</span>}
            </button>
          )}
        </div>

        {/* 4. AGENCY GROUP (HIDDEN FOR BUSINESS ROLE) */}
        {currentRole !== 'business' && (
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-black tracking-widest text-[#0094ea] uppercase font-mono">
                {t.navGroups.agency}
              </div>
            )}

            {currentRole === 'agency' && (
              <button
                onClick={() => handleNavClick('agency_clients')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
                  activeNav === 'agency_clients'
                    ? 'bg-[#0094ea] text-white shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                title={t.navItems.clients}
              >
                <i className="fa-solid fa-briefcase w-4 text-center shrink-0"></i>
                {!isCollapsed && <span className="truncate">{t.navItems.clients}</span>}
              </button>
            )}

            <button
              onClick={() => handleNavClick('agency_whitelabel')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
                activeNav === 'agency_whitelabel'
                  ? 'bg-[#0094ea] text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              title={t.navItems.whiteLabel}
            >
              <i className="fa-solid fa-palette w-4 text-center shrink-0"></i>
              {!isCollapsed && <span className="truncate">{t.navItems.whiteLabel}</span>}
            </button>

            {currentRole === 'agency' && (
              <button
                onClick={() => handleNavClick('agency_portal')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
                  activeNav === 'agency_portal'
                    ? 'bg-[#0094ea] text-white shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                title={t.navItems.clientPortal}
              >
                <i className="fa-solid fa-share-nodes w-4 text-center shrink-0"></i>
                {!isCollapsed && <span className="truncate">{t.navItems.clientPortal}</span>}
              </button>
            )}
          </div>
        )}

        {/* 5. ADMINISTRATION GROUP */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-black tracking-widest text-white/40 uppercase font-mono">
              {t.navGroups.administration}
            </div>
          )}

          <button
            onClick={() => handleNavClick('admin_settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
              activeNav === 'admin_settings'
                ? 'bg-[#0094ea] text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title={t.navItems.settings}
          >
            <i className="fa-solid fa-gear w-4 text-center shrink-0"></i>
            {!isCollapsed && <span className="truncate">{t.navItems.settings}</span>}
          </button>

          {currentRole === 'agency' && (
            <button
              onClick={() => handleNavClick('admin_team')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
                activeNav === 'admin_team'
                  ? 'bg-[#0094ea] text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              title={t.navItems.team}
            >
              <i className="fa-solid fa-user-shield w-4 text-center shrink-0"></i>
              {!isCollapsed && <span className="truncate">{t.navItems.team}</span>}
            </button>
          )}

          <button
            onClick={() => handleNavClick('admin_integrations')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
              activeNav === 'admin_integrations'
                ? 'bg-[#0094ea] text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            title={t.navItems.integrations}
          >
            <i className="fa-solid fa-plug-circle-check w-4 text-center shrink-0"></i>
            {!isCollapsed && <span className="truncate">{t.navItems.integrations}</span>}
          </button>

          {currentRole !== 'business' && (
            <button
              onClick={() => handleNavClick('admin_billing')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all ${
                activeNav === 'admin_billing'
                  ? 'bg-[#0094ea] text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              title={t.navItems.billing}
            >
              <i className="fa-solid fa-credit-card w-4 text-center shrink-0"></i>
              {!isCollapsed && <span className="truncate">{t.navItems.billing}</span>}
            </button>
          )}
        </div>

      </nav>

      {/* Bottom User & Role Quick Info */}
      <div className="p-3 border-t border-white/10 bg-white/[0.01]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0094ea] to-[#cf41b2] flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md">
            {currentRole === 'agency' ? 'AG' : currentRole === 'consultant' ? 'CO' : 'BU'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate capitalize">
                {currentRole} Mode
              </p>
              <p className="text-[10px] text-white/40 font-mono truncate">
                {currentRole === 'agency' ? 'Multi-Client' : currentRole === 'consultant' ? 'Solo Advisory' : 'Self Audit'}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
