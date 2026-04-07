'use client'

import { useState, useMemo } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, Legend
} from 'recharts'
import {
  Upload, CheckCircle, AlertTriangle, TrendingDown, TrendingUp, Target,
  AlertCircle, ArrowRight, ChevronRight, BarChart3, FileSpreadsheet,
  ArrowUpRight, Activity, Clock
} from 'lucide-react'
import { LogoIcon } from '@/components/LogoIcon'

/* ══════════════════════════════════════════════════════════════
   SIMULATED DATA — Replace with real upload/parse in production
   ══════════════════════════════════════════════════════════════ */

const COMPANY = { name: 'Simulated Client', currency: 'CHF' }

// KPI Data
const KPI_METRICS = {
  otif: 91.2,
  otifTarget: 95,
  otd: 88.5,
  otdTarget: 93,
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

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: '#EF4444',
  HIGH: '#F97316',
  MEDIUM: '#EAB308',
  LOW: '#22C55E',
}

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

export default function KPIsDiagnostic() {
  const [screen, setScreen] = useState<'upload' | 'health' | 'dashboard'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpload = () => {
    setIsProcessing(true)
    setTimeout(() => { setIsProcessing(false); setScreen('health') }, 2000)
  }

  const handleProceed = () => setScreen('dashboard')

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

  const totalRecoverableValue = RECOMMENDATIONS.reduce(
    (sum, r) => sum + parseInt(r.impact.replace('K', '000').replace('M', '000000')), 0
  )

  /* ─── UPLOAD SCREEN ─── */
  if (screen === 'upload') {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-5">
        <div className="max-w-xl w-full bg-navy-deep/50 rounded-2xl border border-navy-mid p-10">
          <div className="flex items-center gap-3 mb-8">
            <LogoIcon size={38} />
            <div>
              <div className="text-lg font-bold text-white tracking-tight">OpsFlow Advisory</div>
              <div className="text-[11px] text-teal-muted tracking-widest uppercase">Planning KPIs Diagnostic</div>
            </div>
          </div>

          <h1 className="text-2xl font-serif text-white mb-3">
            Upload your planning KPI data
          </h1>
          <p className="text-teal-muted text-sm leading-relaxed mb-8">
            We need your historical KPI data (12+ months) and operational metrics to diagnose planning performance. Download our templates or upload your own exports.
          </p>

          {/* Templates */}
          <div className="space-y-3 mb-8">
            {[
              { name: 'KPI History', desc: 'Monthly OTIF, OTD, turns, forecast accuracy, plan adherence (12-24m)', icon: Activity },
              { name: 'Operational Data', desc: 'Service failures, demand signals, supply chain disruptions, lead times', icon: AlertTriangle },
              { name: 'Meeting Log', desc: 'S&OP, demand planning, inventory reviews (frequency, duration, outcomes)', icon: Clock },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-4 p-4 rounded-xl border border-navy-mid bg-navy/40">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                  <t.icon size={18} className="text-teal" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-teal-muted/50">{t.desc}</div>
                </div>
                <button className="px-3 py-1.5 rounded border border-navy-mid text-teal-muted text-xs hover:border-teal transition-colors">
                  Template
                </button>
              </div>
            ))}
          </div>

          {/* Upload area */}
          <div
            className="border-2 border-dashed border-navy-mid rounded-xl p-8 text-center mb-6 hover:border-teal/40 transition-colors cursor-pointer"
            onClick={handleUpload}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-teal border-t-transparent rounded-full animate-spin" />
                <span className="text-teal text-sm">Processing data...</span>
              </div>
            ) : (
              <>
                <Upload size={32} className="text-teal-muted/30 mx-auto mb-3" />
                <div className="text-sm text-teal-muted mb-1">Drop files here or click to upload</div>
                <div className="text-xs text-teal-muted/30">.xlsx, .csv — max 50MB per file</div>
              </>
            )}
          </div>

          <button
            onClick={handleUpload}
            className="w-full py-3.5 rounded-lg bg-teal/20 text-teal text-sm font-semibold hover:bg-teal/30 transition-colors border border-teal/30"
          >
            Use demo data to preview the diagnostic
          </button>
        </div>
      </div>
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
            <span className="text-teal-muted text-xs">Planning KPIs Diagnostic — Data Health Check</span>
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
                <div className="text-sm font-semibold text-white mb-1">Data quality impacts accuracy</div>
                <div className="text-xs text-teal-muted/60 leading-relaxed">
                  The gaps identified above mean some recommendations will be directional rather than precise. Improving KPI definitions and implementing SKU/customer-level granularity would significantly improve recommendation accuracy. This is flagged as a recommendation in the diagnostic.
                </div>
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
              <div className="text-sm font-bold text-white">Planning KPIs Diagnostic</div>
              <div className="text-xs text-teal-muted/40">{COMPANY.name} &middot; 12-month KPI history &middot; 8 core metrics</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setScreen('health')} className="px-3 py-1.5 rounded border border-navy-mid text-teal-muted text-xs hover:border-teal transition-colors">
              Data Health
            </button>
            <button className="px-3 py-1.5 rounded bg-teal text-white text-xs font-semibold hover:bg-teal-light transition-colors">
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6">

        {/* ── BALANCED SCORECARD (4 QUADRANTS) ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-xs text-teal uppercase tracking-widest font-semibold mb-4">Balanced Scorecard — Current Performance vs Targets</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Quadrant */}
            <div className="p-5 rounded-xl bg-navy/40 border border-navy-mid/60">
              <div className="text-sm font-semibold text-white mb-4">Service</div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-teal-muted/50">OTIF</span>
                    <span className="text-sm font-bold text-white">{KPI_METRICS.otif}% / {KPI_METRICS.otifTarget}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-mid/40">
                    <div className="h-full rounded-full bg-orange-400" style={{ width: `${(KPI_METRICS.otif / KPI_METRICS.otifTarget) * 100}%` }} />
                  </div>
                  <div className="text-xs text-orange-400 mt-1 font-semibold">Gap: -{(KPI_METRICS.otifTarget - KPI_METRICS.otif).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-teal-muted/50">OTD</span>
                    <span className="text-sm font-bold text-white">{KPI_METRICS.otd}% / {KPI_METRICS.otdTarget}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-mid/40">
                    <div className="h-full rounded-full bg-orange-400" style={{ width: `${(KPI_METRICS.otd / KPI_METRICS.otdTarget) * 100}%` }} />
                  </div>
                  <div className="text-xs text-orange-400 mt-1 font-semibold">Gap: -{(KPI_METRICS.otdTarget - KPI_METRICS.otd).toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* Cost Quadrant */}
            <div className="p-5 rounded-xl bg-navy/40 border border-navy-mid/60">
              <div className="text-sm font-semibold text-white mb-4">Cost</div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-teal-muted/50">SC Cost %</span>
                    <span className="text-sm font-bold text-white">{KPI_METRICS.scCost}% / {KPI_METRICS.scCostBench}% benchmark</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-mid/40">
                    <div className="h-full rounded-full bg-red-400" style={{ width: `${Math.min((KPI_METRICS.scCost / 12) * 100, 100)}%` }} />
                  </div>
                  <div className="text-xs text-red-400 mt-1 font-semibold">Gap: +{(KPI_METRICS.scCost - KPI_METRICS.scCostBench).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-teal-muted/50">Freight Cost Inflation</span>
                    <span className="text-sm font-bold text-white">+{KPI_METRICS.freightCost}% / target +8%</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-mid/40">
                    <div className="h-full rounded-full bg-red-400" style={{ width: `${Math.min((KPI_METRICS.freightCost / 20) * 100, 100)}%` }} />
                  </div>
                  <div className="text-xs text-red-400 mt-1 font-semibold">Gap: +{(KPI_METRICS.freightCost - 8).toFixed(0)}%</div>
                </div>
              </div>
            </div>

            {/* Inventory Quadrant */}
            <div className="p-5 rounded-xl bg-navy/40 border border-navy-mid/60">
              <div className="text-sm font-semibold text-white mb-4">Inventory</div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-teal-muted/50">Turns</span>
                    <span className="text-sm font-bold text-white">{KPI_METRICS.inventoryTurns}x / {KPI_METRICS.inventoryTurnsTarget}x</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-mid/40">
                    <div className="h-full rounded-full bg-orange-400" style={{ width: `${(KPI_METRICS.inventoryTurns / KPI_METRICS.inventoryTurnsTarget) * 100}%` }} />
                  </div>
                  <div className="text-xs text-orange-400 mt-1 font-semibold">Gap: -{(KPI_METRICS.inventoryTurnsTarget - KPI_METRICS.inventoryTurns).toFixed(1)}x</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-teal-muted/50">DOS</span>
                    <span className="text-sm font-bold text-white">{KPI_METRICS.dos}d / {KPI_METRICS.dosTarget}d</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-mid/40">
                    <div className="h-full rounded-full bg-orange-400" style={{ width: `${(KPI_METRICS.dosTarget / KPI_METRICS.dos) * 100}%` }} />
                  </div>
                  <div className="text-xs text-orange-400 mt-1 font-semibold">Gap: +{(KPI_METRICS.dos - KPI_METRICS.dosTarget).toFixed(0)}d</div>
                </div>
              </div>
            </div>

            {/* Planning Quadrant */}
            <div className="p-5 rounded-xl bg-navy/40 border border-navy-mid/60">
              <div className="text-sm font-semibold text-white mb-4">Planning</div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-teal-muted/50">Forecast Accuracy</span>
                    <span className="text-sm font-bold text-white">{KPI_METRICS.forecastAccuracy}% / {KPI_METRICS.forecastAccuracyTarget}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-mid/40">
                    <div className="h-full rounded-full bg-orange-400" style={{ width: `${(KPI_METRICS.forecastAccuracy / KPI_METRICS.forecastAccuracyTarget) * 100}%` }} />
                  </div>
                  <div className="text-xs text-orange-400 mt-1 font-semibold">Gap: -{(KPI_METRICS.forecastAccuracyTarget - KPI_METRICS.forecastAccuracy).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-teal-muted/50">Plan Adherence</span>
                    <span className="text-sm font-bold text-white">{KPI_METRICS.planAdherence}% / {KPI_METRICS.planAdherenceTarget}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-mid/40">
                    <div className="h-full rounded-full bg-orange-400" style={{ width: `${(KPI_METRICS.planAdherence / KPI_METRICS.planAdherenceTarget) * 100}%` }} />
                  </div>
                  <div className="text-xs text-orange-400 mt-1 font-semibold">Gap: -{(KPI_METRICS.planAdherenceTarget - KPI_METRICS.planAdherence).toFixed(0)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FINANCIAL IMPACT BOX ── */}
        <div className="rounded-2xl border-2 border-teal/30 bg-gradient-to-r from-teal/10 to-navy-deep/60 p-6 mb-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-teal uppercase tracking-widest font-semibold mb-1">Total Recoverable Value Identified</div>
              <div className="text-4xl md:text-5xl font-extrabold text-white">
                {COMPANY.currency} {fmt(totalRecoverableValue)}
              </div>
              <div className="text-sm text-teal-muted mt-1">
                across {RECOMMENDATIONS.length} recommendations — improved KPI performance in 90 days
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-xs text-teal-muted/40 mb-1">Primary impact drivers</div>
              <div className="text-lg font-bold text-teal">OTIF +3.8% / Forecast Acc +14%</div>
              <div className="text-xs text-teal-muted/40 mt-1">
                Plan adherence +16% / Turns +3.3x
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI PERFORMANCE RADAR CHART ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-1">KPI Performance Radar — Actual vs Benchmark</div>
          <div className="text-xs text-teal-muted/40 mb-4">8 core metrics: current performance (blue) vs benchmark targets (orange)</div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="#1a3a5c" />
              <PolarAngleAxis dataKey="kpi" tick={{ fill: '#9fd8d0', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9fd8d0', fontSize: 10 }} />
              <Radar name="Actual" dataKey="actual" stroke="#1a9e8f" fill="#1a9e8f" fillOpacity={0.25} />
              <Radar name="Benchmark" dataKey="benchmark" stroke="#F97316" fill="#F97316" fillOpacity={0.1} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9fd8d0' }} />
              <Tooltip contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* ── KPI TREND (12M MULTI-LINE) ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-1">12-Month KPI Trend Analysis</div>
          <div className="text-xs text-teal-muted/40 mb-4">OTIF flat, forecast accuracy stable, plan adherence drifting</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={MONTHLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
              <XAxis dataKey="month" tick={{ fill: '#9fd8d0', fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: 'OTIF / Forecast / Plan (%)', angle: -90, position: 'insideLeft', fill: '#9fd8d0', fontSize: 10, offset: 10 }} />
              <YAxis yAxisId="right" orientation="right" domain={[4, 6]} tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: 'Turns (x)', angle: 90, position: 'insideRight', fill: '#9fd8d0', fontSize: 10, offset: 10 }} />
              <Tooltip contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9fd8d0' }} />
              <Line yAxisId="left" type="monotone" dataKey="otif" name="OTIF (%)" stroke="#1a9e8f" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="left" type="monotone" dataKey="forecastAcc" name="Forecast Acc (%)" stroke="#4ab8ae" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="left" type="monotone" dataKey="planAdhere" name="Plan Adherence (%)" stroke="#EAB308" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="turns" name="Turns (x)" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ── GAP ANALYSIS TABLE ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-4">Gap Analysis — All KPIs</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-mid/40">
                  <th className="text-left text-xs text-teal-muted/50 font-semibold pb-3 px-3">KPI</th>
                  <th className="text-center text-xs text-teal-muted/50 font-semibold pb-3 px-3">Current</th>
                  <th className="text-center text-xs text-teal-muted/50 font-semibold pb-3 px-3">Target</th>
                  <th className="text-center text-xs text-teal-muted/50 font-semibold pb-3 px-3">Benchmark</th>
                  <th className="text-center text-xs text-teal-muted/50 font-semibold pb-3 px-3">Gap</th>
                  <th className="text-center text-xs text-teal-muted/50 font-semibold pb-3 px-3">Trend</th>
                  <th className="text-center text-xs text-teal-muted/50 font-semibold pb-3 px-3">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-mid/40">
                {GAP_ANALYSIS.map((item) => {
                  const trendIcon = item.trend === 'up' ? <TrendingUp size={12} className="text-red-400" /> : item.trend === 'down' ? <TrendingDown size={12} className="text-red-400" /> : <Activity size={12} className="text-teal-muted/50" />
                  return (
                    <tr key={item.kpi} className="hover:bg-navy/30 transition-colors">
                      <td className="text-left text-white font-semibold py-3 px-3">{item.kpi}</td>
                      <td className="text-center text-teal py-3 px-3">{item.current}</td>
                      <td className="text-center text-white py-3 px-3">{item.target}</td>
                      <td className="text-center text-teal-muted/60 py-3 px-3 text-xs">{item.benchmark}</td>
                      <td className="text-center py-3 px-3">
                        <span className="text-red-400 font-semibold">{item.gap}</span>
                      </td>
                      <td className="text-center py-3 px-3">
                        <div className="flex items-center justify-center">
                          {trendIcon}
                        </div>
                      </td>
                      <td className="text-center py-3 px-3">
                        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase" style={{ backgroundColor: `${PRIORITY_COLORS[item.priority]}20`, color: PRIORITY_COLORS[item.priority] }}>
                          {item.priority}
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
          <div className="text-xs text-teal-muted/40 mb-4">Current vs recommended meeting cadence</div>
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
                  <div>Gap: {item.gap}</div>
                  <div>Impact: {item.impact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROOT CAUSE PARETO ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-1">Root Cause Pareto — Top Service Failure Drivers</div>
          <div className="text-xs text-teal-muted/40 mb-4">Top 8 causes contributing to OTIF/OTD shortfalls (% of incidents)</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ROOT_CAUSES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
              <XAxis dataKey="cause" tick={{ fill: '#9fd8d0', fontSize: 10 }} angle={-15} textAnchor="end" height={80} />
              <YAxis tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: '% of Incidents', angle: -90, position: 'insideLeft', fill: '#9fd8d0', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="impact" radius={[4, 4, 0, 0]} fill="#F97316" fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── RECOMMENDATIONS ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm font-semibold text-white">Prioritised Recommendations</div>
              <div className="text-xs text-teal-muted/40">Ranked by impact — total recoverable: {COMPANY.currency} {fmt(totalRecoverableValue)}</div>
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
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ backgroundColor: `${PRIORITY_COLORS[rec.priority]}20`, color: PRIORITY_COLORS[rec.priority] }}>
                          {rec.priority}
                        </span>
                        <span className="text-[10px] text-teal-muted/30">{rec.effort} effort &middot; {rec.timeline}</span>
                      </div>
                      <div className="text-sm font-semibold text-white">{rec.title}</div>
                    </div>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <div className="text-xl font-extrabold text-teal">{COMPANY.currency} {rec.impact}</div>
                    <div className="text-[10px] text-teal-muted/30">estimated impact</div>
                  </div>
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
            {[
              {
                phase: 'Week 1-4',
                title: 'Diagnose & Quick Wins',
                color: '#22C55E',
                items: ['Implement weekly demand planning cycle (CHF 380K)', 'Launch forecast bias tracking', 'Establish KPI dashboard with alerts'],
              },
              {
                phase: 'Week 5-8',
                title: 'Build Foundation',
                color: '#EAB308',
                items: ['Implement ABC-based safety stock (CHF 280K)', 'Redesign S&OP (tactical + strategic)', 'Fix KPI definitions & granularity'],
              },
              {
                phase: 'Week 9-12',
                title: 'Sustain & Scale',
                color: '#0EA5E9',
                items: ['Launch supplier collaboration (CHF 100K)', 'Automate exception management', 'Establish continuous improvement rhythms'],
              },
            ].map((p) => (
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

        {/* ── CTA ── */}
        <div className="rounded-2xl border border-teal/20 bg-gradient-to-br from-teal/10 to-navy-mid/20 p-8 text-center mb-5">
          <div className="text-2xl font-bold text-white mb-2">
            {COMPANY.currency} {fmt(totalRecoverableValue)} in KPI improvement value identified
          </div>
          <p className="text-sm text-teal-muted leading-relaxed mb-2 max-w-xl mx-auto">
            This diagnostic identified {RECOMMENDATIONS.length} improvement opportunities across planning, demand, inventory, and supply execution. A structured 90-day engagement would implement these recommendations and establish sustainable performance management cadences.
          </p>
          <p className="text-xs text-teal-muted/40 mb-6">
            Investment: CHF 14-18K &middot; Duration: 12 weeks &middot; Expected ROI: {Math.round(totalRecoverableValue / 16000)}x
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://calendly.com/caio-opsflow-advisory/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-light transition-colors no-underline"
            >
              Discuss Implementation Plan
            </a>
            <button className="px-8 py-3.5 rounded-lg border border-teal/30 text-teal text-sm font-semibold hover:bg-teal/10 transition-colors">
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
