import React, { useState } from 'react';
import ScoreBadge from './core/ScoreBadge';
import KpiCard from './core/KpiCard';
import EvidenceTag from './core/EvidenceTag';
import { SAMPLE_AUDIT_DATA } from '../utils/sampleData';

const MASCOT_URL = "https://raw.githubusercontent.com/lengkongandreuw/voxsocial/main/assets/ryanvox.png";

/**
 * Workspace Dashboard Component
 * Implements "Dark Brand Shell, Light Analysis Canvas":
 * - Background: Off-white (#F8FAFC)
 * - Cards: Pure White (#FFFFFF) with 1px neutral gray borders (#E2E8F0)
 * - Zero neon glow, zero gradients inside cards/charts
 * - Populated State (Cedar & Co. Dental with Amman & Fairfax dual locations)
 * - Empty State (First-run welcome with Ryan Vox mascot and gradient CTA)
 */
export default function WorkspaceDashboard({
  diag,
  t,
  isRtl,
  onStartAudit,
  onOpenSeo,
  onOpenSocial,
  onOpenAi,
  onOpenJourney,
  onOpenReport
}) {
  const [dashboardMode, setDashboardMode] = useState('populated'); // 'populated' | 'empty'
  const [activeLocationFilter, setActiveLocationFilter] = useState('all'); // 'all' | 'amman' | 'fairfax'

  const auditData = SAMPLE_AUDIT_DATA;
  const isPopulated = dashboardMode === 'populated';

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-800 min-h-full pb-16 font-sans">
      
      {/* Dev / Reviewer State Switcher Bar */}
      <div className="bg-slate-200/80 border-b border-slate-300 px-6 py-2 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2 text-slate-700">
          <i className="fa-solid fa-sliders text-slate-500"></i>
          <span className="font-bold">Sprint 1 Review Switcher:</span>
          <span className="text-slate-500">Toggle between First-Run Empty State and Populated Multi-Location State</span>
        </div>

        <div className="inline-flex rounded-lg bg-white p-0.5 border border-slate-300 shadow-xs">
          <button
            onClick={() => setDashboardMode('populated')}
            className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
              isPopulated
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.dashboard.viewMode.populated}
          </button>
          <button
            onClick={() => setDashboardMode('empty')}
            className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
              !isPopulated
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.dashboard.viewMode.empty}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* ============================================================== */}
        {/* CASE 1: EMPTY STATE (FIRST RUN) */}
        {/* ============================================================== */}
        {!isPopulated && (
          <div className="p-8 sm:p-14 rounded-3xl bg-white border border-slate-200 shadow-xs text-center max-w-3xl mx-auto animate-fade-in space-y-6">
            <div className="relative w-40 h-40 mx-auto">
              <img
                src={MASCOT_URL}
                alt="Ryan Vox Mascot"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping"></span>
                <span>Sprint 1 First-Run Welcome</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 font-display">
                {t.dashboard.emptyHeadline}
              </h2>
              <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                {t.dashboard.emptySubtitle}
              </p>
            </div>

            {/* 4 Pillars Highlight Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-start max-w-lg mx-auto pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-sm">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <span className="text-xs font-semibold text-slate-700">{t.dashboard.emptyFeature1}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 text-sm">
                  <i className="fa-brands fa-instagram"></i>
                </div>
                <span className="text-xs font-semibold text-slate-700">{t.dashboard.emptyFeature2}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-fuchsia-100 text-[#cf41b2] flex items-center justify-center shrink-0 text-sm">
                  <i className="fa-solid fa-brain"></i>
                </div>
                <span className="text-xs font-semibold text-slate-700">{t.dashboard.emptyFeature3}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-sm">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                </div>
                <span className="text-xs font-semibold text-slate-700">{t.dashboard.emptyFeature4}</span>
              </div>
            </div>

            {/* Primary Gradient CTA */}
            <div className="pt-4">
              <button
                onClick={onStartAudit}
                className="px-8 py-3.5 rounded-2xl gradient-brand-cta text-slate-950 font-extrabold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all inline-flex items-center gap-3"
              >
                <span>{t.dashboard.emptyCta}</span>
                <i className="fa-solid fa-arrow-right rtl:rotate-180"></i>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 2: POPULATED STATE (CEDAR & CO. DENTAL) */}
        {/* ============================================================== */}
        {isPopulated && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Workspace Header & Dual-Location Pills */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                    {diag.client.industry || "Healthcare & Cosmetic Dentistry"}
                  </span>
                  <EvidenceTag type="measured" source="Multi-Node Scanner" date={diag.client.lastAudit} />
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                    {diag.client.name}
                  </h1>
                  <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {diag.domain}
                  </span>
                  {!diag.client.isReal && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      SAMPLE DATA
                    </span>
                  )}
                </div>
              </div>

              {/* Dual Location Filter Pills */}
              <div className="flex items-center gap-2 self-start md:self-auto bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-400 ps-2 pe-1">
                  <i className="fa-solid fa-location-dot me-1"></i> Locations:
                </span>
                <button
                  onClick={() => setActiveLocationFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeLocationFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All (Dual-Practice)
                </button>
                <button
                  onClick={() => setActiveLocationFilter('amman')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeLocationFilter === 'amman'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.dashboard.locationAmman}
                </button>
                <button
                  onClick={() => setActiveLocationFilter('fairfax')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeLocationFilter === 'fairfax'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.dashboard.locationFairfax}
                </button>
              </div>
            </div>

            {/* Overall Score Badge Banner (White Card on Light Canvas) */}
            <ScoreBadge
              score={diag.overallScore}
              band={diag.overallScore >= 85 ? "Strong" : diag.overallScore >= 70 ? "Solid" : "Needs Work"}
              coverage={diag.evidenceCoverage}
              isReal={diag.isRealScore}
              size="lg"
            />

            {/* Four-Pillars KPI Matrix (Pure White Cards with 1px border) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Four-Pillar Diagnostic Matrix</h3>
                  <p className="text-xs text-slate-500">Every metric is accompanied by its source, observation period, and verified evidence type.</p>
                </div>
                <button
                  onClick={onOpenReport}
                  className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1.5"
                >
                  <span>View Full Executive Report</span>
                  <i className="fa-solid fa-arrow-right text-[10px] rtl:rotate-180"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Pillar 1: VoxSEO */}
                <KpiCard
                  title={t.dashboard.kpis.seoTitle}
                  value={diag.seoScore}
                  max={100}
                  band="Solid"
                  evidenceType="measured"
                  isReal={diag.hasRealSeo}
                  source={auditData.pillars.seo.source}
                  period={auditData.pillars.seo.period}
                  definition={t.dashboard.kpis.seoDesc}
                  actionLabel="Inspect VoxSEO"
                  onAction={onOpenSeo}
                />

                {/* Pillar 2: VoxSocial */}
                <KpiCard
                  title={t.dashboard.kpis.socialTitle}
                  value={diag.socialScore}
                  max={100}
                  band="Solid"
                  evidenceType="measured"
                  isReal={diag.hasRealSocial}
                  source={auditData.pillars.social.source}
                  period={auditData.pillars.social.period}
                  definition={t.dashboard.kpis.socialDesc}
                  actionLabel="Inspect VoxSocial"
                  onAction={onOpenSocial}
                />

                {/* Pillar 3: VoxAI Visibility */}
                <KpiCard
                  title={t.dashboard.kpis.aiTitle}
                  value={diag.aiScore}
                  max={100}
                  band="Needs Work"
                  evidenceType="estimated"
                  isReal={false}
                  source={auditData.pillars.ai.source}
                  period={auditData.pillars.ai.period}
                  definition={t.dashboard.kpis.aiDesc}
                  actionLabel="Inspect AI Citations"
                  onAction={onOpenAi}
                />

                {/* Pillar 4: Customer Journey & CRO */}
                <KpiCard
                  title={t.dashboard.kpis.croTitle}
                  value={diag.croScore}
                  max={100}
                  band="Needs Work"
                  evidenceType="ai"
                  isReal={false}
                  source={auditData.pillars.cro.source}
                  period={auditData.pillars.cro.period}
                  definition={t.dashboard.kpis.croDesc}
                  actionLabel="Inspect CRO Funnel"
                  onAction={onOpenJourney}
                />
              </div>

              {/* Source Unavailable Example Card (Never drawn as zero, rendered as a neutral dash) */}
              <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-chart-line text-sm"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">Google Analytics 4 Live Funnel Sync</span>
                      <EvidenceTag type="unavailable" reason={auditData.pillars.analyticsSync.reason} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {auditData.pillars.analyticsSync.reason}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => alert("Integration consent drawer will open in Sprint 2.")}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors shrink-0"
                >
                  Connect Analytics API →
                </button>
              </div>
            </div>

            {/* Regional Competitor Comparison (Clean Bars, Zero Glow) */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{t.dashboard.competitorsHeadline}</h3>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300">
                      SAMPLE BENCHMARK
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{t.dashboard.competitorsSub}</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-brand-blue"></span>
                    <span className="text-slate-600 font-medium">Cedar & Co. (You)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-slate-300"></span>
                    <span className="text-slate-600 font-medium">Competitors</span>
                  </div>
                </div>
              </div>

              {/* Competitor Bars */}
              <div className="space-y-3 pt-2">
                {auditData.competitors.map((comp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span>{comp.isSelf ? diag.client.name : comp.name}</span>
                        {comp.isSelf && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-brand-blue uppercase">
                            Target
                          </span>
                        )}
                        <span className="text-slate-400 font-normal">· {comp.isSelf ? diag.domain : comp.note}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <EvidenceTag type={comp.evidenceType} />
                        <span className="font-bold tabular-nums font-mono text-sm text-slate-900">
                          {comp.isSelf ? diag.overallScore : comp.score}/100
                        </span>
                      </div>
                    </div>

                    {/* Clean Progress Bar (Client is Brand Blue, Competitors Neutral Slate) */}
                    <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          comp.isSelf ? 'bg-brand-blue' : 'bg-slate-400'
                        }`}
                        style={{ width: `${comp.isSelf ? diag.overallScore : comp.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Priority Growth Findings (Human-Reviewed Opportunities) */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{t.dashboard.findingsHeadline}</h3>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300">
                      SAMPLE FINDINGS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{t.dashboard.findingsSub}</p>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  4 High Impact Actions
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {(diag.customFindings || auditData.highPriorityFindings).map((finding) => (
                  <div key={finding.id} className="py-4 first:pt-2 last:pb-0 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Severity Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          finding.severity === 'critical'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : finding.severity === 'needsWork'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : finding.severity === 'watch'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {finding.severity}
                        </span>

                        <span className="text-xs font-mono font-semibold text-slate-500">
                          {finding.category}
                        </span>

                        <EvidenceTag type={finding.evidenceType} source={finding.source} date={finding.date} />
                      </div>

                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 self-start sm:self-auto">
                        {finding.impact}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{finding.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{finding.description}</p>

                    {/* Actionable Recommendation */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700 mt-2">
                      <i className="fa-solid fa-lightbulb text-amber-500 mt-0.5 text-xs shrink-0"></i>
                      <div>
                        <strong className="text-slate-900 font-bold me-1">Prescribed Action:</strong>
                        <span>{finding.recommendation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
