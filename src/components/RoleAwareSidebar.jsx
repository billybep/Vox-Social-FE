import React from 'react';

/**
 * Role-Aware Sidebar Component
 * 5 Navigation Groups dynamically filtered by 5 User Roles:
 * - agency_owner
 * - agency_member
 * - consultant
 * - business_owner
 * - client_portal
 * 
 * Features:
 * - Dark Brand Shell styling (#0A0B10, #12141F)
 * - 248px desktop width collapsing to 72px icon-only
 * - Gradient "V" logo mark
 * - Brand Cyan (#00e5ff) active indicators
 * - CSS logical properties for seamless RTL support
 */
export default function RoleAwareSidebar({
  activeNav,
  setActiveNav,
  currentRole = 'agency_owner',
  isCollapsed,
  setIsCollapsed,
  isMobileOpen = false,
  setIsMobileOpen = () => {},
  t,
  isRtl,
  onNewAudit
}) {

  // Define navigation groups and items with role permissions
  const NAV_SCHEMA = [
    {
      id: 'workspace',
      label: t.navGroups.workspace,
      items: [
        {
          id: 'dashboard',
          label: t.navItems.dashboard,
          icon: 'fa-solid fa-chart-pie',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner', 'client_portal'],
        },
        {
          id: 'business_profile',
          label: t.navItems.business_profile,
          icon: 'fa-solid fa-building',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner', 'client_portal'],
        },
        {
          id: 'create_audit',
          label: t.navItems.create_audit,
          icon: 'fa-solid fa-plus-circle',
          badge: 'NEW',
          badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner'],
          isCta: true,
        },
        {
          id: 'audit_progress',
          label: t.navItems.audit_progress,
          icon: 'fa-solid fa-spinner',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner'],
        },
      ]
    },
    {
      id: 'intelligence',
      label: t.navGroups.intelligence,
      items: [
        {
          id: 'intelligence_overview',
          label: t.navItems.intelligence_overview,
          icon: 'fa-solid fa-compass',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner', 'client_portal'],
        },
        {
          id: 'intelligence_seo',
          label: t.navItems.intelligence_seo,
          icon: 'fa-solid fa-magnifying-glass',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner', 'client_portal'],
        },
        {
          id: 'intelligence_social',
          label: t.navItems.intelligence_social,
          icon: 'fa-brands fa-instagram',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner', 'client_portal'],
        },
        {
          id: 'intelligence_ai',
          label: t.navItems.intelligence_ai,
          icon: 'fa-solid fa-brain',
          badge: 'AI',
          badgeColor: 'bg-fuchsia-500/20 text-[#cf41b2] border border-[#cf41b2]/30',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner', 'client_portal'],
        },
        {
          id: 'intelligence_competitors',
          label: t.navItems.intelligence_competitors,
          icon: 'fa-solid fa-users-viewfinder',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner'],
        },
        {
          id: 'intelligence_journey',
          label: t.navItems.intelligence_journey,
          icon: 'fa-solid fa-arrow-trend-up',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner'],
        },
        {
          id: 'intelligence_report',
          label: t.navItems.intelligence_report,
          icon: 'fa-regular fa-file-lines',
          badge: 'PDF',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner', 'client_portal'],
        },
      ]
    },
    {
      id: 'growth',
      label: t.navGroups.growth,
      items: [
        {
          id: 'growth_strategy',
          label: t.navItems.growth_strategy,
          icon: 'fa-solid fa-chess-knight',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner'],
        },
        {
          id: 'growth_roadmap',
          label: t.navItems.growth_roadmap,
          icon: 'fa-solid fa-timeline',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner', 'client_portal'],
        },
        {
          id: 'growth_proposals',
          label: t.navItems.growth_proposals,
          icon: 'fa-solid fa-file-invoice-dollar',
          badge: 'PRO',
          badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
          roles: ['agency_owner', 'agency_member', 'consultant'],
        },
      ]
    },
    {
      id: 'agency',
      label: t.navGroups.agency,
      items: [
        {
          id: 'agency_workspace',
          label: t.navItems.agency_workspace,
          icon: 'fa-solid fa-briefcase',
          roles: ['agency_owner', 'agency_member'],
        },
        {
          id: 'agency_branding',
          label: t.navItems.agency_branding,
          icon: 'fa-solid fa-palette',
          roles: ['agency_owner', 'consultant'],
        },
        {
          id: 'agency_portal',
          label: t.navItems.agency_portal,
          icon: 'fa-solid fa-share-nodes',
          roles: ['agency_owner', 'agency_member', 'consultant'],
        },
        {
          id: 'agency_team',
          label: t.navItems.agency_team,
          icon: 'fa-solid fa-user-group',
          roles: ['agency_owner'],
        },
      ]
    },
    {
      id: 'administration',
      label: t.navGroups.administration,
      items: [
        {
          id: 'admin_integrations',
          label: t.navItems.admin_integrations,
          icon: 'fa-solid fa-plug',
          roles: ['agency_owner', 'consultant', 'business_owner'],
        },
        {
          id: 'admin_billing',
          label: t.navItems.admin_billing,
          icon: 'fa-solid fa-credit-card',
          roles: ['agency_owner', 'consultant'],
        },
        {
          id: 'admin_settings',
          label: t.navItems.admin_settings,
          icon: 'fa-solid fa-gear',
          roles: ['agency_owner', 'agency_member', 'consultant', 'business_owner'],
        },
      ]
    }
  ];

  // Filter groups strictly based on role permissions
  const filteredGroups = NAV_SCHEMA.map(group => {
    const visibleItems = group.items.filter(item => item.roles.includes(currentRole));
    return {
      ...group,
      items: visibleItems
    };
  }).filter(group => group.items.length > 0);

  const mobileTranslate = isMobileOpen 
    ? 'translate-x-0' 
    : (isRtl ? 'translate-x-full' : '-translate-x-full');

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 z-50 md:z-40 bg-[#0A0B10] border-e border-[#1E2235] text-slate-300 flex flex-col transition-all duration-300 select-none shadow-2xl md:shadow-none ${
          isRtl ? 'right-0' : 'left-0'
        } ${mobileTranslate} md:translate-x-0 ${
          isCollapsed ? 'w-[72px]' : 'w-[260px] md:w-[248px]'
        }`}
      >
        {/* Top Header: Logo & Collapse / Close Button */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#1E2235] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Gradient "V" Logo Mark */}
            <div className="w-9 h-9 rounded-xl gradient-brand-v flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,229,255,0.3)]">
              <span className="text-white font-black text-lg tracking-tighter">V</span>
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col truncate">
                <span className="text-white font-extrabold text-sm tracking-tight leading-none font-display">
                  VOXAUDIT
                </span>
                <span className="text-[10px] text-[#00e5ff] font-mono tracking-wider uppercase mt-1">
                  INTELLIGENCE
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Toggle Collapse (Desktop only) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white items-center justify-center text-xs transition-colors shrink-0"
              title={isCollapsed ? "Expand Sidebar (248px)" : "Collapse Sidebar (72px)"}
            >
              <i className={`fa-solid ${isCollapsed ? (isRtl ? 'fa-chevron-left' : 'fa-chevron-right') : (isRtl ? 'fa-chevron-right' : 'fa-chevron-left')}`}></i>
            </button>

            {/* Close Drawer Button (Mobile only) */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="flex md:hidden w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white items-center justify-center text-sm transition-colors shrink-0"
              title="Close Menu"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Primary "Create New Audit" Gradient CTA */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-3 border-b border-[#1E2235]/60">
            <button
              onClick={() => {
                if (setIsMobileOpen) setIsMobileOpen(false);
                if (onNewAudit) onNewAudit();
                else setActiveNav('create_audit');
              }}
              className="w-full py-2.5 px-3 rounded-xl gradient-brand-cta text-slate-950 font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
            >
              <i className="fa-solid fa-plus text-xs group-hover:rotate-90 transition-transform"></i>
              <span>{t.topbar.newAuditBtn}</span>
            </button>
          </div>
        )}

        {/* Nav Groups Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6 custom-scrollbar">
          {filteredGroups.map((group) => (
            <div key={group.id} className="space-y-1">
              {/* Group Label */}
              {(!isCollapsed || isMobileOpen) ? (
                <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {group.label}
                </div>
              ) : (
                <div className="w-full h-px bg-[#1E2235] my-2" />
              )}

              {/* Nav Items */}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveNav(item.id);
                        if (setIsMobileOpen) setIsMobileOpen(false);
                      }}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                        isActive
                          ? 'bg-[#141829] text-white shadow-xs'
                          : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                      } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
                    >
                      {/* Active Brand Cyan Indicator */}
                      {isActive && (
                        <span className="absolute start-0 top-1.5 bottom-1.5 w-1 rounded-e-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
                      )}

                      <i className={`${item.icon} text-sm shrink-0 ${isActive ? 'text-[#00e5ff]' : 'text-slate-500'}`}></i>

                      {(!isCollapsed || isMobileOpen) && (
                        <span className="truncate flex-1 text-start">
                          {item.label}
                        </span>
                      )}

                      {(!isCollapsed || isMobileOpen) && item.badge && (
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${item.badgeColor || 'bg-white/10 text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom User / Role Card in Sidebar */}
        <div className="p-3 border-t border-[#1E2235] bg-[#0A0B10]">
          {(!isCollapsed || isMobileOpen) ? (
            <div className="p-2.5 rounded-xl bg-[#121422] border border-[#1E2235] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0094ea]/20 border border-[#0094ea]/40 flex items-center justify-center text-[#0094ea] font-black text-xs shrink-0">
                {currentRole === 'business_owner' ? 'BO' : currentRole === 'consultant' ? 'SC' : 'AO'}
              </div>
              <div className="truncate flex-1">
                <span className="block text-xs font-bold text-white truncate">
                  Cedar & Co.
                </span>
                <span className="block text-[10px] font-mono text-cyan-400 capitalize">
                  {t.roles[currentRole] || currentRole}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-lg bg-[#0094ea]/20 border border-[#0094ea]/40 flex items-center justify-center text-[#0094ea] font-bold text-xs" title={currentRole}>
              {currentRole === 'business_owner' ? 'B' : 'A'}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
