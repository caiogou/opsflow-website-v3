'use client'

import { localizeDemo, readCcy } from '@/lib/currency'
import { useState, type ComponentType } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, Legend
} from 'recharts'
import {
  CheckCircle, AlertTriangle, TrendingDown, TrendingUp,
  AlertCircle, ArrowRight, ChevronRight, BarChart3,
  ArrowUpRight, Activity, Info
} from 'lucide-react'
import { LogoIcon } from '@/components/LogoIcon'
import { RealUploader } from '@/components/platform/RealUploader'
import { analyzeKpis, kpiSummary, KPI_TEMPLATES, type KpiDataset } from '@/lib/engine/kpis'

/* ══════════════════════════════════════════════════════════════
   DEMO DATA (fictional company) — shown with "preview a sample diagnostic".
   Real uploads are computed by lib/engine/kpis.ts (same shape).
   ══════════════════════════════════════════════════════════════ */

const COMPANY = { name: 'Simulated Client', currency: 'CHF' }

// KPI Data (targets = industry reference values)
const KPI_METRICS = {
  otif: 91.2,
  otifTarget: 95,
  otd: 88.5,
  otdTarget: 93,
  fillRate: null as number | null,
  fillRateTarget: 97,
  scCost: 8.2,
  scCostBench: 6.5,
  freightCost: 14,
  inventoryTurns: 5.2,
  inventoryTurnsTarget: 8.5,
  dos: 38,
  dosTarget: 25,
  forecastAccuracy: 68,
  forecastAccuracyTarget: 82,
  planAdherence: 74,
  planAdherenceTarget: 90,
}

// 8 KPIs for Radar Chart
const RADAR_DATA = [
  { kpi: 'OTIF', actual: 91.2, benchmark: 95, fullMark: 100 },
  { kpi: 'OTD', actual: 88.5, benchmark: 93, fullMark: 100 },
  { kpi: 'Forecast Acc.', actual: 68, benchmark: 82, fullMark: 100 },
  { kpi: 'Plan Adhere.', actual: 74, benchmark: 90, fullMark: 100 },
  { kpi: 'Inv. Turns', actual: 52, benchmark: 85, fullMark: 100 },
  { kpi: 'SC Cost %', actual: 68, benchmark: 65, fullMark: 100 },
  { kpi: 'Demand Plan', actual: 72, benchmark: 85, fullMark: 100 },
  { kpi: 'Supply Exe.', actual: 79, benchmark: 90, fullMark: 100 },
]

// 12-month trend
const MONTHLY_TREND = [
  { month: 'Jul', otif: 90.2, turns: 5.8, forecastAcc: 65, planAdhere: 71 },
  { month: 'Aug', otif: 89.8, turns: 5.5, forecastAcc: 66, planAdhere: 70 },
  { month: 'Sep', otif: 90.5, turns: 5.6, forecastAcc: 67, planAdhere: 72 },
  { month: 'Oct', otif: 89.2, turns: 5.3, forecastAcc: 67, planAdhere: 73 },
  { month: 'Nov', otif: 90.1, turns: 5.1, forecastAcc: 68, planAdhere: 73 },
  { month: 'Dec', otif: 88.9, turns: 4.8, forecastAcc: 68, planAdhere: 74 },
  { month: 'Jan', otif: 91.0, turns: 5.0, forecastAcc: 68, planAdhere: 74 },
  { month: 'Feb', otif: 91.8, turns: 5.2, forecastAcc: 68, planAdhere: 74 },
  { month: 'Mar', otif: 91.2, turns: 5.2, forecastAcc: 68, planAdhere: 74 },
  { month: 'Apr', otif: 91.5, turns: 5.3, forecastAcc: 69, planAdhere: 75 },
  { month: 'May', otif: 91.0, turns: 5.2, forecastAcc: 69, planAdhere: 74 },
  { month: 'Jun', otif: 91.2, turns: 5.2, forecastAcc: 68, planAdhere: 74 },
]

// Root Cause Pareto (Service failures)
const ROOT_CAUSES = [
  { cause: 'Demand spikes unpredicted', impact: 34 },
  { cause: 'Supplier delays', impact: 22 },
  { cause: 'Inventory inaccuracy', impact: 15 },
  { cause: 'Forecast bias (BIAS)', impact: 12 },
  { cause: 'Network constraints', impact: 10 },
  { cause: 'Data latency', impact: 4 },
  { cause: 'Execution gaps', impact: 2 },
  { cause: 'Other', impact: 1 },
]

// Gap Analysis Table Data
const GAP_ANALYSIS = [
  { kpi: 'On-Time In-Full (OTIF)', current: '91.2%', target: '95%', benchmark: '93-96%', gap: '-3.8%', trend: 'flat', priority: 'CRITICAL' },
  { kpi: 'On-Time Delivery (OTD)', current: '88.5%', target: '93%', benchmark: '91-95%', gap: '-4.5%', trend: 'flat', priority: 'CRITICAL' },
  { kpi: 'Supply Chain Cost %', current: '8.2%', target: '6.5%', benchmark: '6-7%', gap: '+1.7%', trend: 'up', priority: 'CRITICAL' },
  { kpi: 'Freight Cost Inflation', current: '+14%', target: '+8%', benchmark: '+6-9%', gap: '+6%', trend: 'up', priority: 'HIGH' },
  { kpi: 'Inventory Turns', current: '5.2x', target: '8.5x', benchmark: '7-9x', gap: '-3.3x', trend: 'flat', priority: 'HIGH' },
  { kpi: 'Days of Supply', current: '38d', target: '25d', benchmark: '20-28d', gap: '+13d', trend: 'up', priority: 'HIGH' },
  { kpi: 'Forecast Accuracy', current: '68%', target: '82%', benchmark: '80-85%', gap: '-14%', trend: 'flat', priority: 'HIGH' },
  { kpi: 'Plan Adherence', current: '74%', target: '90%', benchmark: '88-92%', gap: '-16%', trend: 'down', priority: 'MEDIUM' },
]

// Operational Rhythm Assessment
const OPERATIONAL_RHYTHM = [
  { meeting: 'Demand Planning', current: 'Monthly', recommended: 'Weekly', gap: 'Insufficient frequency', impact: 'Forecast latency' },
  { meeting: 'Inventory Review', current: 'Quarterly', recommended: 'Monthly', gap: 'Reactive vs proactive', impact: 'Excess/obsolete risk' },
  { meeting: 'Supply Chain Exception', current: 'Ad-hoc', recommended: 'Weekly', gap: 'No regular cadence', impact: 'Delayed response' },
  { meeting: 'S&OP', current: 'Monthly', recommended: 'Weekly (tactical)', gap: 'One meeting fits all', impact: 'Decisions lag reality' },
]

// Recommendations
const RECOMMENDATIONS = [
  {
    id: 1,
    priority: 'CRITICAL',
    title: 'Implement weekly demand planning review cycle',
    impact: '380K',
    description: 'Current monthly cadence misses 3-4 weeks of demand updates. Weekly touchpoints on demand signals (backlog, pipeline, deviations) would reduce forecast error from 32% to ~22%, improving OTIF by 3-4 points.',
    timeline: '2 weeks',
    practice: 'Demand Planning Optimization',
    effort: 'Low',
  },
  {
    id: 2,
    priority: 'CRITICAL',
    title: 'Establish ABC-based safety stock policy',
    impact: '280K',
    description: 'Safety stock currently uniform across all SKUs. Segmenting A/B/C items and adjusting based on demand pattern (variable vs predictable) reduces excess inventory while maintaining 95%+ service target. Reduces DOS from 38d to 28d.',
    timeline: '3-4 weeks',
    practice: 'Inventory & Demand Optimization',
    effort: 'Medium',
  },
  {
    id: 3,
    priority: 'HIGH',
    title: 'Fix forecast bias through bias tracking dashboard',
    impact: '210K',
    description: 'Demand planners lack visibility into forecast bias by product/customer. Implementing bias tracking (over/under by segment) with monthly reviews helps identify patterns and removes systematic errors. Improves forecast accuracy 10+ points.',
    timeline: '3 weeks',
    practice: 'Demand Planning Optimization',
    effort: 'Low',
  },
  {
    id: 4,
    priority: 'HIGH',
    title: 'Redesign S&OP to separate tactical and strategic',
    impact: '95K',
    description: 'Current monthly S&OP lacks tactical content (weekly demand updates, exception resolution). Add weekly tactical S&OP (30 min, demand/supply reconciliation) + monthly strategic S&OP (full business review). Improves plan adherence from 74% to 85%.',
    timeline: '4 weeks',
    practice: 'Planning Process Design',
    effort: 'Medium',
  },
  {
    id: 5,
    priority: 'MEDIUM',
    title: 'Launch supplier collaboration program',
    impact: '100K',
    description: 'Supplier delays (22% of service failures) driven by communication gaps and lack of visibility. Implement weekly supplier touchpoints + shared demand forecast visibility to improve supply reliability and reduce OTIF buffer stock needs.',
    timeline: '6 weeks',
    practice: 'Supplier & Network Collaboration',
    effort: 'Medium',
  },
]

const DATA_HEALTH = {
  overall: 78,
  dimensions: [
    { name: 'Completeness', score: 85, detail: '95% of KPI data available; some gaps in supplier metrics' },
    { name: 'Accuracy', score: 72, detail: 'Definition inconsistency for OTIF (in vs. full variation)' },
    { name: 'Timeliness', score: 82, detail: 'KPI data updated daily; demand signals updated weekly' },
    { name: 'Consistency', score: 78, detail: 'Definitions aligned across regions but not all customer segments' },
    { name: 'Granularity', score: 68, detail: 'Metrics at company level; limited visibility by SKU/customer/region' },
  ],
}

const ROADMAP = [
  {
    phase: 'Week 1-4',
    title: 'Diagnose & Quick Wins',
    color: '#22C55E',
    items: [`Implement weekly demand planning cycle (${COMPANY.currency} 380K)`, 'Launch forecast bias tracking', 'Establish KPI dashboard with alerts'],
  },
  {
    phase: 'Week 5-8',
    title: 'Build Foundation',
    color: '#EAB308',
    items: [`Implement ABC-based safety stock (${COMPANY.currency} 280K)`, 'Redesign S&OP (tactical + strategic)', 'Fix KPI definitions & granularity'],
  },
  {
    phase: 'Week 9-12',
    title: 'Sustain & Scale',
    color: '#0EA5E9',
    items: [`Launch supplier collaboration (${COMPANY.currency} 100K)`, 'Automate exception management', 'Establish continuous improvement rhythms'],
  },
]

const DEMO: KpiDataset = {
  COMPANY,
  KPI_METRICS,
  RADAR_DATA,
  MONTHLY_TREND,
  ROOT_CAUSES,
  GAP_ANALYSIS,
  OPERATIONAL_RHYTHM,
  RECOMMENDATIONS,
  DATA_HEALTH,
  ROADMAP,
  META: {
    isDemo: true,
    subtitle: '12-month KPI history · 8 core metrics',
    trendNote: 'OTIF flat, forecast accuracy stable, plan adherence drifting',
    rootCauseNote: 'Top 8 causes contributing to OTIF/OTD shortfalls (% of incidents)',
    impactDrivers: 'OTIF +3.8% / Forecast Acc +14%',
    impactDrivers2: 'Plan adherence +16% / Turns +3.3x',
    valueLabel: 'Total Recoverable Value Identified',
    showInvestment: true,
    notes: [],
  },
}

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: '#EF4444',
  HIGH: '#F97316',
  MEDIUM: '#EAB308',
  LOW: '#22C55E',
  'N/A': '#64748B',
}

const fmt = (n: number) => {
  if (!isFinite(n)) return '0'
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return Math.round(n).toString()
}
/** '380K' | '1.2M' | '950' -> number (0 when empty / unparsable). */
const parseImpact = (s: string) => {
  const m = String(s || '').trim().match(/^([\d.]+)\s*([KM]?)$/i)
  if (!m) return 0
  const v = parseFloat(m[1]) * (m[2].toUpperCase() === 'M' ? 1_000_000 : m[2].toUpperCase() === 'K' ? 1_000 : 1)
  return isFinite(v) ? v : 0
}

/* One scorecard metric. value === null -> "n/a · Not provided". */
function KpiBar({ label, value, target, unit, lowerIsBetter = false, max, digits = 1, prefix = '' }: {
  label: string; value: number | null; target: number; unit: string; lowerIsBetter?: boolean; max?: number; digits?: number; prefix?: string
}) {
  if (value === null || !isFinite(value)) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-teal-muted/50">{label}</span>
          <span className="text-sm font-bold text-teal-muted/40">n/a</span>
        </div>
        <div className="h-2 rounded-full bg-navy-mid/40" />
        <div className="text-xs text-teal-muted/30 mt-1">Not provided in your files · ref. {prefix}{target}{unit}</div>
      </div>
    )
  }
  const gap = value - target
  const bad = lowerIsBetter ? gap > 0 : gap < 0
  const width = Math.max(0, Math.min(100, max ? (value / max) * 100 : lowerIsBetter ? (value > 0 ? (target / value) * 100 : 100) : (value / target) * 100))
  const color = bad ? (lowerIsBetter ? 'bg-red-400' : 'bg-orange-400') : 'bg-teal'
  const txt = bad ? (lowerIsBetter ? 'text-red-400' : 'text-orange-400') : 'text-teal'
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-teal-muted/50">{label}</span>
        <span className="text-sm font-bold text-white">{prefix}{value}{unit} / {prefix}{target}{unit} <span className="text-[10px] font-normal text-teal-muted/40">reference</span></span>
      </div>
      <div className="h-2 rounded-full bg-navy-mid/40">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
      <div className={`text-xs ${txt} mt-1 font-semibold`}>
        {bad ? 'Gap' : lowerIsBetter ? 'Within reference' : 'Above reference'}: {gap >= 0 ? '+' : '-'}{Math.abs(gap).toFixed(digits)}{unit}
      </div>
    </div>
  )
}

export default function KPIsDiagnostic() {
  const [screen, setScreen] = useState<'upload' | 'health' | 'dashboard'>('upload')
  const [ds, setDs] = useState<KpiDataset>(DEMO)
  const {
    COMPANY, KPI_METRICS, RADAR_DATA, MONTHLY_TREND, ROOT_CAUSES, GAP_ANALYSIS,
    OPERATIONAL_RHYTHM, RECOMMENDATIONS, DATA_HEALTH, ROADMAP, META,
  } = ds

  const handleProceed = () => setScreen('dashboard')
  const money = (n: number) => `${COMPANY.currency ? COMPANY.currency + ' ' : ''}${fmt(n)}`

  const totalRecoverableValue = RECOMMENDATIONS.reduce((sum, r) => sum + parseImpact(r.impact), 0)
  const hasSeries = (k: 'otif' | 'otd' | 'turns' | 'forecastAcc' | 'planAdhere') =>
    MONTHLY_TREND.some((p) => typeof (p as any)[k] === 'number' && isFinite((p as any)[k]))

  /* ─── UPLOAD SCREEN ─── */
  if (screen === 'upload') {
    return (
      <RealUploader
        engine="platform/kpis"
        eyebrow="Supply Chain KPI Diagnostic"
        title="Upload your order lines and planning data"
        intro="We compute OTIF, OTD and fill rate from your order lines (ideally 12 months), and forecast accuracy, plan adherence, inventory turns and SC cost % from an optional monthly plan-vs-actual file. KPIs we cannot compute are shown as n/a — nothing is estimated."
        templates={KPI_TEMPLATES.map((t, i) => ({ ...t, icon: (i === 0 ? Activity : BarChart3) as ComponentType<any> }))}
        onDemo={() => { setDs(localizeDemo(DEMO, readCcy())); setScreen('health') }}
        onAnalyze={(tables) => {
          const d = analyzeKpis(tables)
          setDs(d)
          setScreen('health')
          return { summary: kpiSummary(d) }
        }}
      />
    )
  }

  /* ─── DATA HEALTH CHECK ─── */
  if (screen === 'health') {
    const healthColor = DATA_HEALTH.overall >= 80 ? '#1a9e8f' : DATA_HEALTH.overall >= 60 ? '#EAB308' : '#EF4444'

    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-5">
        <div className="max-w-2xl w-full bg-navy-deep/50 rounded-2xl border border-navy-mid p-10">
          <div className="flex items-center gap-3 mb-8">
            <LogoIcon size={32} />
            <span className="text-teal-muted text-xs">Supply Chain KPI Diagnostic — Data Health Check{META.isDemo ? ' (sample data)' : ''}</span>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl font-extrabold mb-2" style={{ color: healthColor }}>
              {DATA_HEALTH.overall}%
            </div>
            <div className="text-teal-muted/40 text-xs uppercase tracking-wider">Data Health Score</div>
            <div className="mt-2 inline-block px-4 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: `${healthColor}15`, color: healthColor }}>
              {DATA_HEALTH.overall >= 80 ? 'Good — ready for analysis' : DATA_HEALTH.overall >= 60 ? 'Acceptable — some gaps to note' : 'Poor — results may be limited'}
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {DATA_HEALTH.dimensions.map((d) => {
              const color = d.score >= 80 ? '#1a9e8f' : d.score >= 60 ? '#EAB308' : '#EF4444'
              return (
                <div key={d.name} className="p-4 rounded-xl border border-navy-mid bg-navy/30">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {d.score >= 80 ? <CheckCircle size={14} style={{ color }} /> : <AlertTriangle size={14} style={{ color }} />}
                      <span className="text-sm font-semibold text-white">{d.name}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color }}>{d.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-navy-mid/40 mb-2">
                    <div className="h-full rounded-full transition-all" style={{ width: `${d.score}%`, backgroundColor: color }} />
                  </div>
                  <div className="text-xs text-teal-muted/40">{d.detail}</div>
                </div>
              )
            })}
          </div>

          <div className="p-4 rounded-xl bg-teal/5 border border-teal/15 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={16} className="text-teal mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-white mb-1">{META.isDemo ? 'Data quality impacts accuracy' : 'How your KPIs were computed'}</div>
                {META.isDemo ? (
                  <div className="text-xs text-teal-muted/60 leading-relaxed">
                    The gaps identified above mean some recommendations will be directional rather than precise. Improving KPI definitions and implementing SKU/customer-level granularity would significantly improve recommendation accuracy. This is flagged as a recommendation in the diagnostic.
                  </div>
                ) : (
                  <ul className="text-xs text-teal-muted/60 leading-relaxed list-disc pl-4 space-y-1">
                    {META.notes.map((n, i) => <li key={i}>{n}</li>)}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setScreen('upload')} className="flex-1 py-3 rounded-lg border border-navy-mid text-teal-muted text-sm hover:border-teal transition-colors">
              Upload different data
            </button>
            <button onClick={handleProceed} className="flex-1 py-3 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-light transition-colors flex items-center justify-center gap-2">
              Proceed to Diagnostic <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ─── MAIN DASHBOARD ─── */
  return (
    <div className="min-h-screen bg-navy pb-16">
      {/* Header */}
      <div className="border-b border-navy-mid px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon size={28} />
            <div>
              <div className="text-sm font-bold text-white">Supply Chain KPI Diagnostic</div>
              <div className="text-xs text-teal-muted/40">{COMPANY.name} &middot; {META.subtitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 no-print">
            <button onClick={() => setScreen('health')} className="px-3 py-1.5 rounded border border-navy-mid text-teal-muted text-xs hover:border-teal transition-colors">
              Data Health
            </button>
            <button onClick={() => window.print()} className="px-3 py-1.5 rounded bg-teal text-white text-xs font-semibold hover:bg-teal-light transition-colors">
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6">

        {/* ── BALANCED SCORECARD (4 QUADRANTS) ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-xs text-teal uppercase tracking-widest font-semibold mb-4">Balanced Scorecard — Current Performance vs Reference</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Quadrant */}
            <div className="p-5 rounded-xl bg-navy/40 border border-navy-mid/60">
              <div className="text-sm font-semibold text-white mb-4">Service</div>
              <div className="space-y-4">
                <KpiBar label="OTIF" value={KPI_METRICS.otif} target={KPI_METRICS.otifTarget} unit="%" />
                <KpiBar label="OTD" value={KPI_METRICS.otd} target={KPI_METRICS.otdTarget} unit="%" />
                {KPI_METRICS.fillRate !== null && (
                  <KpiBar label="Fill Rate (units)" value={KPI_METRICS.fillRate} target={KPI_METRICS.fillRateTarget} unit="%" />
                )}
              </div>
            </div>

            {/* Cost Quadrant */}
            <div className="p-5 rounded-xl bg-navy/40 border border-navy-mid/60">
              <div className="text-sm font-semibold text-white mb-4">Cost</div>
              <div className="space-y-4">
                <KpiBar label="SC Cost % of revenue" value={KPI_METRICS.scCost} target={KPI_METRICS.scCostBench} unit="%" lowerIsBetter max={12} />
                <KpiBar label="Freight Cost Inflation" value={KPI_METRICS.freightCost} target={8} unit="%" prefix="+" lowerIsBetter max={20} digits={0} />
              </div>
            </div>

            {/* Inventory Quadrant */}
            <div className="p-5 rounded-xl bg-navy/40 border border-navy-mid/60">
              <div className="text-sm font-semibold text-white mb-4">Inventory</div>
              <div className="space-y-4">
                <KpiBar label="Turns" value={KPI_METRICS.inventoryTurns} target={KPI_METRICS.inventoryTurnsTarget} unit="x" />
                <KpiBar label="DOS" value={KPI_METRICS.dos} target={KPI_METRICS.dosTarget} unit="d" lowerIsBetter digits={0} />
              </div>
            </div>

            {/* Planning Quadrant */}
            <div className="p-5 rounded-xl bg-navy/40 border border-navy-mid/60">
              <div className="text-sm font-semibold text-white mb-4">Planning</div>
              <div className="space-y-4">
                <KpiBar label="Forecast Accuracy" value={KPI_METRICS.forecastAccuracy} target={KPI_METRICS.forecastAccuracyTarget} unit="%" digits={META.isDemo ? 0 : 1} />
                <KpiBar label="Plan Adherence" value={KPI_METRICS.planAdherence} target={KPI_METRICS.planAdherenceTarget} unit="%" digits={META.isDemo ? 0 : 1} />
              </div>
            </div>
          </div>
          <div className="text-[10px] text-teal-muted/30 mt-3">Reference values are industry reference levels, not targets set for your business.</div>
        </div>

        {/* ── FINANCIAL IMPACT BOX ── */}
        <div className="rounded-2xl border-2 border-teal/30 bg-gradient-to-r from-teal/10 to-navy-deep/60 p-6 mb-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-teal uppercase tracking-widest font-semibold mb-1">{META.valueLabel}</div>
              {totalRecoverableValue > 0 ? (
                <>
                  <div className="text-4xl md:text-5xl font-extrabold text-white">
                    {money(totalRecoverableValue)}
                  </div>
                  <div className="text-sm text-teal-muted mt-1">
                    across {RECOMMENDATIONS.filter((r) => parseImpact(r.impact) > 0).length} quantified recommendations{META.isDemo ? ' — improved KPI performance in 90 days' : ' (see each recommendation for the basis)'}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl md:text-3xl font-extrabold text-white">Not quantified</div>
                  <div className="text-sm text-teal-muted mt-1 max-w-md">
                    Add a line value column, or inventory value + COGS / SC cost + revenue in the monthly file, to quantify value. {RECOMMENDATIONS.length} recommendations below.
                  </div>
                </>
              )}
            </div>
            <div className="text-center md:text-right">
              <div className="text-xs text-teal-muted/40 mb-1">{META.isDemo ? 'Primary impact drivers' : 'Largest gaps vs reference'}</div>
              <div className="text-lg font-bold text-teal">{META.impactDrivers}</div>
              <div className="text-xs text-teal-muted/40 mt-1">
                {META.impactDrivers2}
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI PERFORMANCE RADAR CHART ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-1">KPI Performance Radar — Actual vs Reference</div>
          <div className="text-xs text-teal-muted/40 mb-4">{RADAR_DATA.length} {META.isDemo ? 'core' : 'measured'} metrics: current performance (teal) vs industry reference (orange)</div>
          {RADAR_DATA.length >= 3 ? (
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#1a3a5c" />
                <PolarAngleAxis dataKey="kpi" tick={{ fill: '#9fd8d0', fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9fd8d0', fontSize: 10 }} />
                <Radar name="Actual" dataKey="actual" stroke="#1a9e8f" fill="#1a9e8f" fillOpacity={0.25} />
                <Radar name="Reference" dataKey="benchmark" stroke="#F97316" fill="#F97316" fillOpacity={0.1} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#9fd8d0' }} />
                <Tooltip contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-teal-muted/50 py-8 text-center">Not enough KPIs measured to draw a radar.</div>
          )}
        </div>

        {/* ── KPI TREND (MULTI-LINE) ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-1">{MONTHLY_TREND.length}-Month KPI Trend Analysis</div>
          <div className="text-xs text-teal-muted/40 mb-4">{META.trendNote}</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={MONTHLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
              <XAxis dataKey="month" tick={{ fill: '#9fd8d0', fontSize: 11 }} />
              <YAxis yAxisId="left" domain={['auto', 'auto']} tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: 'Service / Forecast / Plan (%)', angle: -90, position: 'insideLeft', fill: '#9fd8d0', fontSize: 10, offset: 10 }} />
              {hasSeries('turns') && (
                <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: 'Turns (x)', angle: 90, position: 'insideRight', fill: '#9fd8d0', fontSize: 10, offset: 10 }} />
              )}
              <Tooltip contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9fd8d0' }} />
              {hasSeries('otif') && <Line yAxisId="left" type="monotone" dataKey="otif" name="OTIF (%)" stroke="#1a9e8f" strokeWidth={2} dot={{ r: 3 }} connectNulls />}
              {hasSeries('otd') && <Line yAxisId="left" type="monotone" dataKey="otd" name="OTD (%)" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 3 }} connectNulls />}
              {hasSeries('forecastAcc') && <Line yAxisId="left" type="monotone" dataKey="forecastAcc" name="Forecast Acc (%)" stroke="#4ab8ae" strokeWidth={2} dot={{ r: 3 }} connectNulls />}
              {hasSeries('planAdhere') && <Line yAxisId="left" type="monotone" dataKey="planAdhere" name="Plan Adherence (%)" stroke="#EAB308" strokeWidth={2} dot={{ r: 3 }} connectNulls />}
              {hasSeries('turns') && <Line yAxisId="right" type="monotone" dataKey="turns" name="Turns (x)" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" connectNulls />}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ── GAP ANALYSIS TABLE ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-4">Gap Analysis — All KPIs vs Reference</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-mid/40">
                  <th className="text-left text-xs text-teal-muted/50 font-semibold pb-3 px-3">KPI</th>
                  <th className="text-center text-xs text-teal-muted/50 font-semibold pb-3 px-3">Current</th>
                  <th className="text-center text-xs text-teal-muted/50 font-semibold pb-3 px-3">Reference</th>
                  <th className="text-center text-xs text-teal-muted/50 font-semibold pb-3 px-3">Benchmark range</th>
                  <th className="text-center text-xs text-teal-muted/50 font-semibold pb-3 px-3">Gap</th>
                  <th className="text-center text-xs text-teal-muted/50 font-semibold pb-3 px-3">Trend</th>
                  <th className="text-center text-xs text-teal-muted/50 font-semibold pb-3 px-3">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-mid/40">
                {GAP_ANALYSIS.map((item) => {
                  const na = item.priority === 'N/A'
                  const trendIcon = na ? <span className="text-teal-muted/30 text-xs">—</span> : item.trend === 'up' ? <TrendingUp size={12} className="text-red-400" /> : item.trend === 'down' ? <TrendingDown size={12} className="text-red-400" /> : <Activity size={12} className="text-teal-muted/50" />
                  const pc = PRIORITY_COLORS[item.priority] || '#64748B'
                  return (
                    <tr key={item.kpi} className="hover:bg-navy/30 transition-colors">
                      <td className="text-left text-white font-semibold py-3 px-3">{item.kpi}</td>
                      <td className={`text-center py-3 px-3 ${na ? 'text-teal-muted/40' : 'text-teal'}`}>{item.current}</td>
                      <td className="text-center text-white py-3 px-3">{item.target}</td>
                      <td className="text-center text-teal-muted/60 py-3 px-3 text-xs">{item.benchmark}</td>
                      <td className="text-center py-3 px-3">
                        <span className={`font-semibold ${na ? 'text-teal-muted/40 text-xs' : item.priority === 'LOW' ? 'text-teal' : 'text-red-400'}`}>{item.gap}</span>
                      </td>
                      <td className="text-center py-3 px-3">
                        <div className="flex items-center justify-center">
                          {trendIcon}
                        </div>
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase" style={{ backgroundColor: `${pc}20`, color: pc }}>
                          {na ? 'n/a' : item.priority}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── OPERATIONAL RHYTHM ASSESSMENT ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-4">Operational Rhythm Assessment</div>
          <div className="text-xs text-teal-muted/40 mb-4">{META.isDemo ? 'Current vs recommended meeting cadence' : 'Recommended meeting cadence, based on what your data shows (current cadence is not in the files)'}</div>
          <div className="space-y-3">
            {OPERATIONAL_RHYTHM.map((item) => (
              <div key={item.meeting} className="p-4 rounded-lg bg-navy/30 border border-navy-mid/40">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{item.meeting}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-teal-muted/60">{item.current} <span className="text-teal-muted/40">→</span> {item.recommended}</div>
                  </div>
                </div>
                <div className="text-xs text-teal-muted/50 space-y-1">
                  <div>{META.isDemo ? 'Gap' : 'Evidence'}: {item.gap}</div>
                  <div>Impact: {item.impact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROOT CAUSE PARETO ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-1">Root Cause Pareto — Top Service Failure Drivers</div>
          <div className="text-xs text-teal-muted/40 mb-4">{META.rootCauseNote}</div>
          {ROOT_CAUSES.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ROOT_CAUSES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
                <XAxis dataKey="cause" tick={{ fill: '#9fd8d0', fontSize: 10 }} angle={-15} textAnchor="end" height={80} />
                <YAxis tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: META.isDemo ? '% of Incidents' : '% of failed lines', angle: -90, position: 'insideLeft', fill: '#9fd8d0', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }} />
                <Bar dataKey="impact" radius={[4, 4, 0, 0]} fill="#F97316" fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-teal-muted/50 py-8 text-center">No OTIF failures in the period — nothing to break down.</div>
          )}
        </div>

        {/* ── RECOMMENDATIONS ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm font-semibold text-white">Prioritised Recommendations</div>
              <div className="text-xs text-teal-muted/40">
                {totalRecoverableValue > 0 ? `Ranked by priority — total ${META.isDemo ? 'recoverable' : 'quantified'}: ${money(totalRecoverableValue)}` : 'Ranked by priority — rules applied to your measured KPIs'}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {RECOMMENDATIONS.map((rec, i) => (
              <div key={rec.id} className="p-5 rounded-xl bg-navy/30 border border-navy-mid/50">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-extrabold text-white">#{i + 1}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ backgroundColor: `${PRIORITY_COLORS[rec.priority] || '#64748B'}20`, color: PRIORITY_COLORS[rec.priority] || '#64748B' }}>
                          {rec.priority}
                        </span>
                        <span className="text-[10px] text-teal-muted/30">{rec.effort} effort &middot; {rec.timeline}</span>
                      </div>
                      <div className="text-sm font-semibold text-white">{rec.title}</div>
                    </div>
                  </div>
                  {parseImpact(rec.impact) > 0 && (
                    <div className="text-right min-w-[100px]">
                      <div className="text-xl font-extrabold text-teal">{COMPANY.currency ? `${COMPANY.currency} ` : ''}{rec.impact}</div>
                      <div className="text-[10px] text-teal-muted/30">estimated impact</div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-teal-muted/60 leading-relaxed mb-3">{rec.description}</p>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-teal/5 border border-teal/10">
                  <div className="text-[10px] text-teal-muted/40">
                    OpsFlow Practice: <span className="text-teal font-semibold">{rec.practice}</span>
                  </div>
                  <ArrowUpRight size={12} className="text-teal" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 90-DAY ROADMAP ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-4">Recommended 90-Day Roadmap</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROADMAP.map((p) => (
              <div key={p.phase} className="p-4 rounded-xl border border-navy-mid/50 bg-navy/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: p.color }}>{p.phase}</span>
                </div>
                <div className="text-sm font-semibold text-white mb-3">{p.title}</div>
                <ul className="space-y-2">
                  {p.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-teal-muted/60 leading-relaxed">
                      <ChevronRight size={12} className="mt-0.5 text-teal-muted/30 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {!META.isDemo && META.notes.length > 0 && (
          <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3"><Info size={14} className="text-teal" /> Method &amp; limitations</div>
            <ul className="text-xs text-teal-muted/50 leading-relaxed list-disc pl-4 space-y-1">
              {META.notes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="rounded-2xl border border-teal/20 bg-gradient-to-br from-teal/10 to-navy-mid/20 p-8 text-center mb-5">
          <div className="text-2xl font-bold text-white mb-2">
            {totalRecoverableValue > 0
              ? `${money(totalRecoverableValue)} in KPI improvement value identified`
              : `${RECOMMENDATIONS.length} KPI improvement opportunities identified`}
          </div>
          <p className="text-sm text-teal-muted leading-relaxed mb-2 max-w-xl mx-auto">
            This diagnostic identified {RECOMMENDATIONS.length} improvement opportunities across planning, demand, inventory, and supply execution. A structured 90-day engagement would implement these recommendations and establish sustainable performance management cadences.
          </p>
          {META.showInvestment && totalRecoverableValue > 0 && (
            <p className="text-xs text-teal-muted/40 mb-6">
              Investment: {COMPANY.currency} 14-18K &middot; Duration: 12 weeks &middot; Expected ROI: {Math.round(totalRecoverableValue / 16000)}x
            </p>
          )}
          <div className={`flex flex-col sm:flex-row gap-3 justify-center ${META.showInvestment ? '' : 'mt-6'}`}>
            <a
              href="https://calendly.com/caio-opsflow-advisory/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-light transition-colors no-underline"
            >
              Discuss Implementation Plan
            </a>
            <button onClick={() => window.print()} className="px-8 py-3.5 rounded-lg border border-teal/30 text-teal text-sm font-semibold hover:bg-teal/10 transition-colors">
              Download Executive Report
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-5 border-t border-navy-mid/40">
          <div className="text-xs text-teal-muted/40">OpsFlow Advisory — Smarter supply chains. Built by people. Powered by AI.</div>
          <div className="text-[10px] text-teal-muted/20 mt-1">opsflow-advisory.ch &middot; Nyon, Canton Vaud, Switzerland</div>
        </div>
      </div>
    </div>
  )
}
