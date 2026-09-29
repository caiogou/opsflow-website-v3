'use client'

import { useState, useMemo } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  PieChart, Pie, ScatterChart, Scatter, ZAxis, LineChart, Line, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import {
  Upload, CheckCircle, AlertTriangle, TrendingDown, TrendingUp, Package,
  DollarSign, Target, ArrowRight, ChevronRight, BarChart3, Shield,
  AlertCircle, Clock, Layers, FileSpreadsheet, ArrowUpRight, XCircle,
  Activity
} from 'lucide-react'
import { LogoIcon } from '@/components/LogoIcon'

/* ══════════════════════════════════════════════════════════════
   SIMULATED DATA — Replace with real upload/parse in production
   ══════════════════════════════════════════════════════════════ */

const COMPANY = { name: 'Simulated Client', currency: 'CHF', skuCount: 842, warehouseCount: 3 }

// ABC/XYZ Classification
const ABC_XYZ_MATRIX = [
  { abc: 'A', xyz: 'X', skus: 84, pctRevenue: 52, pctInventory: 28, avgDOS: 22, label: 'High-value, predictable' },
  { abc: 'A', xyz: 'Y', skus: 67, pctRevenue: 18, pctInventory: 15, avgDOS: 31, label: 'High-value, variable' },
  { abc: 'A', xyz: 'Z', skus: 34, pctRevenue: 8, pctInventory: 12, avgDOS: 45, label: 'High-value, erratic' },
  { abc: 'B', xyz: 'X', skus: 96, pctRevenue: 10, pctInventory: 11, avgDOS: 28, label: 'Medium-value, predictable' },
  { abc: 'B', xyz: 'Y', skus: 118, pctRevenue: 7, pctInventory: 13, avgDOS: 38, label: 'Medium-value, variable' },
  { abc: 'B', xyz: 'Z', skus: 72, pctRevenue: 3, pctInventory: 9, avgDOS: 52, label: 'Medium-value, erratic' },
  { abc: 'C', xyz: 'X', skus: 89, pctRevenue: 1.2, pctInventory: 4, avgDOS: 35, label: 'Low-value, predictable' },
  { abc: 'C', xyz: 'Y', skus: 156, pctRevenue: 0.6, pctInventory: 5, avgDOS: 48, label: 'Low-value, variable' },
  { abc: 'C', xyz: 'Z', skus: 126, pctRevenue: 0.2, pctInventory: 3, avgDOS: 72, label: 'Low-value, erratic' },
]

// Inventory health metrics
const HEALTH_METRICS = {
  totalInventoryValue: 4_820_000,
  excessInventoryValue: 1_340_000,
  obsoleteRisk: 620_000,
  stockoutCostMonthly: 185_000,
  avgDaysOfSupply: 38,
  targetDaysOfSupply: 25,
  inventoryTurns: 5.2,
  benchmarkTurns: 8.5,
  serviceLevel: 91.2,
  targetServiceLevel: 95,
  workingCapitalTiedUp: 4_820_000,
  potentialRelease: 1_680_000,
  safetyStockAccuracy: 42,
  forecastAccuracy: 68,
  skusWithNoMovement90d: 186,
  skusOverstocked: 234,
  skusUnderstocked: 127,
}

// Monthly trend
const MONTHLY_TREND = [
  { month: 'Jul', inventory: 4100, turns: 5.8, serviceLevel: 92.1, excess: 980 },
  { month: 'Aug', inventory: 4350, turns: 5.5, serviceLevel: 90.8, excess: 1050 },
  { month: 'Sep', inventory: 4200, turns: 5.6, serviceLevel: 91.5, excess: 1020 },
  { month: 'Oct', inventory: 4500, turns: 5.3, serviceLevel: 89.7, excess: 1150 },
  { month: 'Nov', inventory: 4680, turns: 5.1, serviceLevel: 90.2, excess: 1280 },
  { month: 'Dec', inventory: 4950, turns: 4.8, serviceLevel: 88.9, excess: 1420 },
  { month: 'Jan', inventory: 4700, turns: 5.0, serviceLevel: 91.0, excess: 1350 },
  { month: 'Feb', inventory: 4600, turns: 5.2, serviceLevel: 91.8, excess: 1300 },
  { month: 'Mar', inventory: 4820, turns: 5.2, serviceLevel: 91.2, excess: 1340 },
]

// Top offenders
const TOP_EXCESS = [
  { sku: 'PP-GRAN-4521', desc: 'PP Granulate Natural 25kg', value: 142_000, dos: 98, segment: 'B-Z' },
  { sku: 'HDPE-PIPE-220', desc: 'HDPE Pipe Grade Black', value: 118_000, dos: 82, segment: 'B-Y' },
  { sku: 'ABS-SHEET-W10', desc: 'ABS Sheet White 10mm', value: 96_000, dos: 71, segment: 'C-Z' },
  { sku: 'PET-BTL-500C', desc: 'PET Bottle Clear 500ml', value: 89_000, dos: 64, segment: 'A-Z' },
  { sku: 'PA6-ROD-BK30', desc: 'PA6 Rod Black 30mm', value: 78_000, dos: 112, segment: 'C-Z' },
]

const TOP_STOCKOUT = [
  { sku: 'PP-FILM-T200', desc: 'PP Film Transparent 200mu', missedRevenue: 62_000, daysOut: 14, segment: 'A-X' },
  { sku: 'LDPE-SHRK-25', desc: 'LDPE Shrink Film 25mu', missedRevenue: 48_000, daysOut: 8, segment: 'A-X' },
  { sku: 'HDPE-CAP-W28', desc: 'HDPE Cap White 28mm', missedRevenue: 35_000, daysOut: 11, segment: 'A-Y' },
  { sku: 'PS-FOAM-T50', desc: 'PS Foam Tray 50mm', missedRevenue: 28_000, daysOut: 6, segment: 'B-X' },
  { sku: 'PVC-PIPE-110', desc: 'PVC Pipe Grey 110mm', missedRevenue: 22_000, daysOut: 9, segment: 'B-Y' },
]

// Data health
const DATA_HEALTH = {
  overall: 72,
  dimensions: [
    { name: 'Completeness', score: 85, detail: '12% of SKUs missing lead time data' },
    { name: 'Accuracy', score: 62, detail: 'BOM data inconsistent for 23% of items' },
    { name: 'Timeliness', score: 78, detail: 'Demand data updated weekly (daily recommended)' },
    { name: 'Consistency', score: 65, detail: 'UoM mismatches across 3 warehouses' },
    { name: 'Granularity', score: 70, detail: 'Inventory at warehouse level only, not location' },
  ],
}

// Recommendations
const RECOMMENDATIONS = [
  {
    id: 1,
    priority: 'CRITICAL',
    title: 'Implement ABC/XYZ-based safety stock policy',
    impact: '680K',
    description: 'Current safety stock is not differentiated by demand pattern. A-X items are understocked while C-Z items carry 3-4 months of supply. Implementing segment-specific policies would reduce excess by ~CHF 680K while improving service level from 91% to 95%+.',
    timeline: '4-6 weeks',
    practice: 'Inventory & Demand Optimization',
    effort: 'Medium',
  },
  {
    id: 2,
    priority: 'HIGH',
    title: 'Launch slow-mover disposition program',
    impact: '450K',
    description: '186 SKUs with zero movement in 90+ days, representing CHF 620K at risk. Immediate disposition of top 50 items through markdown, return-to-vendor, or scrap could recover CHF 450K in working capital before obsolescence write-off.',
    timeline: '2-3 weeks',
    practice: 'Inventory & Demand Optimization',
    effort: 'Low',
  },
  {
    id: 3,
    priority: 'HIGH',
    title: 'Fix data quality gaps in master data',
    impact: '220K',
    description: 'Missing lead times (12% of SKUs) and BOM inconsistencies (23%) cause MRP to generate incorrect replenishment signals. Cleaning master data reduces both excess orders and emergency purchases, estimated CHF 220K annual saving.',
    timeline: '3-4 weeks',
    practice: 'APS Health Check & Rescue',
    effort: 'Medium',
  },
  {
    id: 4,
    priority: 'MEDIUM',
    title: 'Redesign replenishment parameters by segment',
    impact: '330K',
    description: 'Reorder points and lot sizes have not been reviewed in 18+ months. Recalibrating based on current demand patterns and supplier lead times, differentiated by ABC/XYZ segment, would reduce average DOS from 38 to 25 days.',
    timeline: '4-6 weeks',
    practice: 'Inventory & Demand Optimization',
    effort: 'Medium',
  },
  {
    id: 5,
    priority: 'MEDIUM',
    title: 'Establish monthly inventory review cadence',
    impact: '150K',
    description: 'No structured process exists to review inventory performance. Implementing a monthly review with excess/obsolete triggers, service level tracking, and working capital targets would prevent recurrence of current issues.',
    timeline: '2 weeks',
    practice: 'Planning KPI Dashboard',
    effort: 'Low',
  },
]

/* ══════════════════════════════════════════════════════════════ */

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: '#EF4444',
  HIGH: '#F97316',
  MEDIUM: '#EAB308',
  LOW: '#22C55E',
}

const SEGMENT_COLORS: Record<string, string> = {
  A: '#1a9e8f',
  B: '#4ab8ae',
  C: '#9fd8d0',
}

export default function InventoryDiagnostic() {
  const [screen, setScreen] = useState<'upload' | 'health' | 'dashboard'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpload = () => {
    setIsProcessing(true)
    setTimeout(() => { setIsProcessing(false); setScreen('health') }, 2000)
  }

  const handleProceed = () => setScreen('dashboard')

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
              <div className="text-[11px] text-teal-muted tracking-widest uppercase">Inventory & Working Capital Diagnostic</div>
            </div>
          </div>

          <h1 className="text-2xl font-serif text-white mb-3">
            Upload your inventory data
          </h1>
          <p className="text-teal-muted text-sm leading-relaxed mb-8">
            We need three data files to run the diagnostic. Download our templates or upload your own exports — the system will map the fields automatically.
          </p>

          {/* Templates */}
          <div className="space-y-3 mb-8">
            {[
              { name: 'Inventory Snapshot', desc: 'Current stock by SKU, warehouse, value, last movement date', icon: Package },
              { name: 'Demand History', desc: '12-24 months of shipments/consumption by SKU (monthly)', icon: TrendingUp },
              { name: 'SKU Master', desc: 'Lead times, safety stock, reorder points, UoM, ABC class', icon: FileSpreadsheet },
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
            <span className="text-teal-muted text-xs">Inventory Diagnostic — Data Health Check</span>
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
                  The gaps identified above mean some recommendations will be directional rather than precise. Fixing the master data issues (lead times, BOMs) would significantly improve the accuracy of safety stock and replenishment calculations. This is flagged as a recommendation in the diagnostic.
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
  const abcData = [
    { name: 'A items', skus: 185, revenue: 78, inventory: 55, color: '#1a9e8f' },
    { name: 'B items', skus: 286, revenue: 20, inventory: 33, color: '#4ab8ae' },
    { name: 'C items', skus: 371, revenue: 2, inventory: 12, color: '#9fd8d0' },
  ]

  const dosDistribution = [
    { range: '0-7', skus: 45, color: '#EF4444' },
    { range: '8-14', skus: 89, color: '#F97316' },
    { range: '15-25', skus: 198, color: '#1a9e8f' },
    { range: '26-45', skus: 245, color: '#EAB308' },
    { range: '46-90', skus: 167, color: '#F97316' },
    { range: '90+', skus: 98, color: '#EF4444' },
  ]

  return (
    <div className="min-h-screen bg-navy pb-16">
      {/* Header */}
      <div className="border-b border-navy-mid px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon size={28} />
            <div>
              <div className="text-sm font-bold text-white">Inventory & Working Capital Diagnostic</div>
              <div className="text-xs text-teal-muted/40">{COMPANY.name} &middot; {COMPANY.skuCount} SKUs &middot; {COMPANY.warehouseCount} warehouses</div>
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

        {/* ── EXECUTIVE SUMMARY ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-xs text-teal uppercase tracking-widest font-semibold mb-4">Executive Summary</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Total Inventory', value: `${COMPANY.currency} ${fmt(HEALTH_METRICS.totalInventoryValue)}`, sub: `${HEALTH_METRICS.avgDaysOfSupply} days of supply`, icon: Package, alert: HEALTH_METRICS.avgDaysOfSupply > 30 },
              { label: 'Excess Inventory', value: `${COMPANY.currency} ${fmt(HEALTH_METRICS.excessInventoryValue)}`, sub: `${Math.round(HEALTH_METRICS.excessInventoryValue / HEALTH_METRICS.totalInventoryValue * 100)}% of total`, icon: TrendingDown, alert: true },
              { label: 'Obsolescence Risk', value: `${COMPANY.currency} ${fmt(HEALTH_METRICS.obsoleteRisk)}`, sub: `${HEALTH_METRICS.skusWithNoMovement90d} SKUs no movement 90d`, icon: AlertTriangle, alert: true },
              { label: 'Monthly Stockout Cost', value: `${COMPANY.currency} ${fmt(HEALTH_METRICS.stockoutCostMonthly)}`, sub: `${HEALTH_METRICS.skusUnderstocked} SKUs understocked`, icon: XCircle, alert: true },
            ].map((m) => (
              <div key={m.label} className="p-4 rounded-xl bg-navy/40 border border-navy-mid/60">
                <div className="flex items-center gap-2 mb-2">
                  <m.icon size={14} className={m.alert ? 'text-orange-400' : 'text-teal'} />
                  <span className="text-[11px] text-teal-muted/50 uppercase tracking-wider">{m.label}</span>
                </div>
                <div className="text-2xl font-extrabold text-white">{m.value}</div>
                <div className="text-xs text-teal-muted/40 mt-1">{m.sub}</div>
              </div>
            ))}
          </div>
          {/* KPI benchmarks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Inventory Turns', actual: HEALTH_METRICS.inventoryTurns, benchmark: HEALTH_METRICS.benchmarkTurns, unit: 'x', higher: true },
              { label: 'Service Level', actual: HEALTH_METRICS.serviceLevel, benchmark: HEALTH_METRICS.targetServiceLevel, unit: '%', higher: true },
              { label: 'Days of Supply', actual: HEALTH_METRICS.avgDaysOfSupply, benchmark: HEALTH_METRICS.targetDaysOfSupply, unit: 'd', higher: false },
              { label: 'Safety Stock Accuracy', actual: HEALTH_METRICS.safetyStockAccuracy, benchmark: 85, unit: '%', higher: true },
            ].map((k) => {
              const gap = k.higher ? k.benchmark - k.actual : k.actual - k.benchmark
              const isGood = gap <= 0
              return (
                <div key={k.label} className="p-3 rounded-lg bg-navy/20 border border-navy-mid/40">
                  <div className="text-[10px] text-teal-muted/40 uppercase tracking-wider mb-1">{k.label}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white">{k.actual}{k.unit}</span>
                    <span className="text-xs text-teal-muted/30">vs {k.benchmark}{k.unit} benchmark</span>
                  </div>
                  <div className={`text-xs font-semibold mt-1 ${isGood ? 'text-teal' : 'text-orange-400'}`}>
                    {isGood ? 'On target' : `Gap: ${Math.abs(gap).toFixed(1)}${k.unit}`}
                  </div>
                </div>
              )
            })}
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
                across {RECOMMENDATIONS.length} recommendations — {RECOMMENDATIONS.filter(r => r.effort === 'Low').length} quick wins available
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-xs text-teal-muted/40 mb-1">Working capital release potential</div>
              <div className="text-3xl font-bold text-teal">{COMPANY.currency} {fmt(HEALTH_METRICS.potentialRelease)}</div>
              <div className="text-xs text-teal-muted/40 mt-1">
                {Math.round(HEALTH_METRICS.potentialRelease / HEALTH_METRICS.totalInventoryValue * 100)}% of current inventory value
              </div>
            </div>
          </div>
        </div>

        {/* ── CHARTS ROW 1: ABC/XYZ + DOS Distribution ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* ABC/XYZ Matrix */}
          <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6">
            <div className="text-sm font-semibold text-white mb-1">ABC/XYZ Segmentation Matrix</div>
            <div className="text-xs text-teal-muted/40 mb-4">Revenue contribution vs inventory allocation mismatch</div>
            <div className="grid grid-cols-4 gap-1 text-center">
              <div />
              {['X (Stable)', 'Y (Variable)', 'Z (Erratic)'].map(h => (
                <div key={h} className="text-[10px] text-teal-muted/50 font-semibold pb-2">{h}</div>
              ))}
              {['A', 'B', 'C'].map(abc => (
                <>
                  <div key={`label-${abc}`} className="text-[10px] text-teal-muted/50 font-semibold flex items-center justify-center">
                    {abc} ({abc === 'A' ? 'High' : abc === 'B' ? 'Med' : 'Low'})
                  </div>
                  {['X', 'Y', 'Z'].map(xyz => {
                    const cell = ABC_XYZ_MATRIX.find(c => c.abc === abc && c.xyz === xyz)!
                    const mismatch = cell.pctInventory - cell.pctRevenue
                    const bgOpacity = Math.min(Math.abs(mismatch) / 20, 1)
                    const bg = mismatch > 5 ? `rgba(239,68,68,${bgOpacity * 0.3})` : mismatch < -5 ? `rgba(26,158,143,${bgOpacity * 0.3})` : 'rgba(255,255,255,0.02)'
                    return (
                      <div key={`${abc}${xyz}`} className="p-2.5 rounded-lg border border-navy-mid/40" style={{ background: bg }}>
                        <div className="text-lg font-bold text-white">{cell.skus}</div>
                        <div className="text-[9px] text-teal-muted/40">SKUs</div>
                        <div className="mt-1 text-[10px]">
                          <span className="text-teal">{cell.pctRevenue}% rev</span>
                          <span className="text-teal-muted/30"> / </span>
                          <span className={mismatch > 5 ? 'text-red-400' : 'text-teal-muted/50'}>{cell.pctInventory}% inv</span>
                        </div>
                        <div className="text-[9px] text-teal-muted/30 mt-0.5">{cell.avgDOS}d avg</div>
                      </div>
                    )
                  })}
                </>
              ))}
            </div>
            <div className="flex gap-4 mt-3 justify-center text-[10px]">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" /> Overstocked</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-teal/20 border border-teal/30" /> Understocked</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-navy/40 border border-navy-mid" /> Balanced</span>
            </div>
          </div>

          {/* Days of Supply Distribution */}
          <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6">
            <div className="text-sm font-semibold text-white mb-1">Days of Supply Distribution</div>
            <div className="text-xs text-teal-muted/40 mb-4">Target range: 15-25 days (green zone)</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dosDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
                <XAxis dataKey="range" tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: 'Days of Supply', position: 'bottom', fill: '#9fd8d0', fontSize: 10, offset: -5 }} />
                <YAxis tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: 'SKUs', angle: -90, position: 'insideLeft', fill: '#9fd8d0', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }} />
                <Bar dataKey="skus" radius={[4, 4, 0, 0]}>
                  {dosDistribution.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-red-500/5 border border-red-500/10">
                <div className="text-sm font-bold text-red-400">{dosDistribution[0].skus + dosDistribution[1].skus}</div>
                <div className="text-[10px] text-teal-muted/40">Understocked</div>
              </div>
              <div className="p-2 rounded bg-teal/5 border border-teal/10">
                <div className="text-sm font-bold text-teal">{dosDistribution[2].skus}</div>
                <div className="text-[10px] text-teal-muted/40">Optimal</div>
              </div>
              <div className="p-2 rounded bg-orange-500/5 border border-orange-500/10">
                <div className="text-sm font-bold text-orange-400">{dosDistribution[3].skus + dosDistribution[4].skus + dosDistribution[5].skus}</div>
                <div className="text-[10px] text-teal-muted/40">Overstocked</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CHARTS ROW 2: Trends ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-1">9-Month Trend Analysis</div>
          <div className="text-xs text-teal-muted/40 mb-4">Inventory value growing while service level declining — classic over-investment without return</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={MONTHLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
              <XAxis dataKey="month" tick={{ fill: '#9fd8d0', fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: '#9fd8d0', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" domain={[85, 95]} tick={{ fill: '#9fd8d0', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9fd8d0' }} />
              <Line yAxisId="left" type="monotone" dataKey="inventory" name="Inventory (K CHF)" stroke="#4ab8ae" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="left" type="monotone" dataKey="excess" name="Excess (K CHF)" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
              <Line yAxisId="right" type="monotone" dataKey="serviceLevel" name="Service Level (%)" stroke="#EAB308" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ── TOP OFFENDERS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Top Excess */}
          <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={16} className="text-orange-400" />
              <span className="text-sm font-semibold text-white">Top 5 Excess Inventory Items</span>
            </div>
            <div className="space-y-2">
              {TOP_EXCESS.map((item, i) => (
                <div key={item.sku} className="flex items-center gap-3 p-3 rounded-lg bg-navy/30 border border-navy-mid/40">
                  <span className="text-xs font-bold text-orange-400 w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{item.desc}</div>
                    <div className="text-[10px] text-teal-muted/40">{item.sku} &middot; Segment {item.segment}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-orange-400">{COMPANY.currency} {fmt(item.value)}</div>
                    <div className="text-[10px] text-teal-muted/40">{item.dos} days</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Stockouts */}
          <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={16} className="text-red-400" />
              <span className="text-sm font-semibold text-white">Top 5 Stockout Impact Items</span>
            </div>
            <div className="space-y-2">
              {TOP_STOCKOUT.map((item, i) => (
                <div key={item.sku} className="flex items-center gap-3 p-3 rounded-lg bg-navy/30 border border-navy-mid/40">
                  <span className="text-xs font-bold text-red-400 w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{item.desc}</div>
                    <div className="text-[10px] text-teal-muted/40">{item.sku} &middot; Segment {item.segment}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-red-400">{COMPANY.currency} {fmt(item.missedRevenue)}</div>
                    <div className="text-[10px] text-teal-muted/40">{item.daysOut}d out of stock</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RECOMMENDATIONS ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm font-semibold text-white">Prioritised Recommendations</div>
              <div className="text-xs text-teal-muted/40">Ranked by financial impact — total recoverable: {COMPANY.currency} {fmt(totalRecoverableValue)}</div>
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
                phase: 'Week 1-3',
                title: 'Quick Wins',
                color: '#22C55E',
                items: ['Launch slow-mover disposition (CHF 450K)', 'Establish monthly inventory review', 'Define service level targets by segment'],
              },
              {
                phase: 'Week 4-8',
                title: 'Structural Fixes',
                color: '#EAB308',
                items: ['Implement ABC/XYZ safety stock policy (CHF 680K)', 'Clean master data gaps (lead times, BOMs)', 'Recalibrate reorder points and lot sizes'],
              },
              {
                phase: 'Week 9-12',
                title: 'Sustain & Scale',
                color: '#0EA5E9',
                items: ['Redesign replenishment parameters (CHF 330K)', 'Automate KPI tracking and alerts', 'Implement continuous improvement process'],
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
            {COMPANY.currency} {fmt(totalRecoverableValue)} in recoverable value identified
          </div>
          <p className="text-sm text-teal-muted leading-relaxed mb-2 max-w-xl mx-auto">
            This diagnostic identified {RECOMMENDATIONS.length} improvement opportunities with an estimated annual impact of {COMPANY.currency} {fmt(totalRecoverableValue)}. The next step is a structured engagement to implement these recommendations — starting with the quick wins in weeks 1-3.
          </p>
          <p className="text-xs text-teal-muted/40 mb-6">
            Investment: CHF 22-32K &middot; Duration: 4-6 weeks &middot; Expected ROI: {Math.round(totalRecoverableValue / 27000)}x
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
