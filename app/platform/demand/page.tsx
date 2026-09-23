'use client'

import { localizeDemo, readCcy } from '@/lib/currency'
import { useState, type ComponentType } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  LineChart, Line, Legend, ScatterChart, Scatter, ZAxis, PieChart, Pie
} from 'recharts'
import {
  Upload, CheckCircle, AlertTriangle, TrendingDown, TrendingUp, BarChart3,
  DollarSign, Target, ArrowRight, ChevronRight, AlertCircle, Clock, FileSpreadsheet,
  ArrowUpRight, Activity, Zap
} from 'lucide-react'
import { LogoIcon } from '@/components/LogoIcon'
import { RealUploader } from '@/components/platform/RealUploader'
import { analyzeDemand, DEMAND_TEMPLATES, type DemandDataset } from '@/lib/engine/demand'

/* ══════════════════════════════════════════════════════════════
   SIMULATED DATA — Replace with real upload/parse in production
   ══════════════════════════════════════════════════════════════ */

const COMPANY = { name: 'Simulated Client', currency: 'CHF', skuCount: 842, warehouseCount: 3 }

// Forecast accuracy by product family
const FORECAST_BY_FAMILY = [
  { family: 'Personal Care', mape: 45, skus: 156, demand: 245 },
  { family: 'Beverages', mape: 52, skus: 89, demand: 189 },
  { family: 'Packaged Foods', mape: 61, skus: 234, demand: 312 },
  { family: 'Home & Cleaning', mape: 68, skus: 145, demand: 178 },
  { family: 'Pet Care', mape: 74, skus: 78, demand: 95 },
  { family: 'Health & Wellness', mape: 82, skus: 93, demand: 112 },
  { family: 'Beauty & Cosmetics', mape: 89, skus: 32, demand: 42 },
  { family: 'Specialty Items', mape: 94, skus: 15, demand: 18 },
]

// 12-month forecast vs actual
const FORECAST_TREND = [
  { month: 'Mar Y1', actual: 245, forecast: 268, bias: 8.6 },
  { month: 'Apr Y1', actual: 312, forecast: 298, bias: -4.5 },
  { month: 'May Y1', actual: 289, forecast: 305, bias: 5.5 },
  { month: 'Jun Y1', actual: 356, forecast: 331, bias: -7.0 },
  { month: 'Jul Y1', actual: 298, forecast: 289, bias: -3.0 },
  { month: 'Aug Y1', actual: 402, forecast: 378, bias: -6.0 },
  { month: 'Sep Y1', actual: 367, forecast: 351, bias: -4.4 },
  { month: 'Oct Y1', actual: 445, forecast: 412, bias: -7.4 },
  { month: 'Nov Y1', actual: 521, forecast: 478, bias: -8.3 },
  { month: 'Dec Y1', actual: 612, forecast: 545, bias: -11.0 },
  { month: 'Jan Y2', actual: 534, forecast: 498, bias: -6.7 },
  { month: 'Feb Y2', actual: 489, forecast: 467, bias: -4.5 },
]

// ABC/XYZ Demand Segmentation with planning methods
const DEMAND_SEGMENTATION = [
  { abc: 'A', xyz: 'X', skus: 84, pctRevenue: 52, planning: 'MRP/Min-Max', cov: 0.15 },
  { abc: 'A', xyz: 'Y', skus: 67, pctRevenue: 18, planning: 'Forecasting + Safety Stock', cov: 0.35 },
  { abc: 'A', xyz: 'Z', skus: 34, pctRevenue: 8, planning: 'Judgmental/Causal', cov: 0.65 },
  { abc: 'B', xyz: 'X', skus: 96, pctRevenue: 10, planning: 'MRP/Min-Max', cov: 0.18 },
  { abc: 'B', xyz: 'Y', skus: 118, pctRevenue: 7, planning: 'Forecasting + Safety Stock', cov: 0.42 },
  { abc: 'B', xyz: 'Z', skus: 72, pctRevenue: 3, planning: 'Judgmental', cov: 0.78 },
  { abc: 'C', xyz: 'X', skus: 89, pctRevenue: 1.2, planning: 'MRP/Min-Max', cov: 0.22 },
  { abc: 'C', xyz: 'Y', skus: 156, pctRevenue: 0.6, planning: 'Simple Exponential', cov: 0.55 },
  { abc: 'C', xyz: 'Z', skus: 126, pctRevenue: 0.2, planning: 'Judgmental', cov: 0.88 },
]

// Worst forecast accuracy SKUs
const WORST_FORECAST_SKUS = [
  { sku: 'BEAUTY-LIPSTK-045', desc: 'Premium Lipstick Collection 45', family: 'Beauty & Cosmetics', mape: 127, demand: 'Lumpy', seasonality: 'Strong' },
  { sku: 'SPECIALTY-ARTISAN-12', desc: 'Artisan Gift Set Limited Ed', family: 'Specialty Items', mape: 118, demand: 'Erratic', seasonality: 'Very High' },
  { sku: 'HEALTH-PROBIOTIC-60', desc: 'Probiotic Supplement 60CT', family: 'Health & Wellness', mape: 115, demand: 'Lumpy', seasonality: 'Seasonal' },
  { sku: 'COSMETIC-MASCARA-BK', desc: 'Professional Mascara Black', family: 'Beauty & Cosmetics', mape: 112, demand: 'Lumpy', seasonality: 'High' },
  { sku: 'SPECIALTY-HAMPER-DX', desc: 'Deluxe Holiday Hamper', family: 'Specialty Items', mape: 109, demand: 'Seasonal', seasonality: 'Very High' },
  { sku: 'HEALTH-VITAMIN-D-50', desc: 'Vitamin D 5000IU 50cap', family: 'Health & Wellness', mape: 106, demand: 'Trending', seasonality: 'Moderate' },
  { sku: 'BEAUTY-SERUM-GOLD', desc: 'Premium Gold Serum 30ml', family: 'Beauty & Cosmetics', mape: 104, demand: 'Lumpy', seasonality: 'High' },
  { sku: 'PET-DENTAL-CHEW-L', desc: 'Dental Chew Large Size', family: 'Pet Care', mape: 101, demand: 'Trending', seasonality: 'Moderate' },
  { sku: 'HEALTH-IMMUNE-SPRAY', desc: 'Immune Boost Spray 120ml', family: 'Health & Wellness', mape: 98, demand: 'Seasonal', seasonality: 'Moderate' },
  { sku: 'BEAUTY-FACEMASK-AV', desc: 'Avocado Face Mask 200g', family: 'Beauty & Cosmetics', mape: 96, demand: 'Lumpy', seasonality: 'Seasonal' },
]

// Demand pattern distribution
const DEMAND_PATTERNS = [
  { pattern: 'Stable', count: 287, color: '#1a9e8f', description: 'Regular, predictable demand' },
  { pattern: 'Trending', count: 156, color: '#4ab8ae', description: 'Growing or declining trend' },
  { pattern: 'Seasonal', count: 198, color: '#EAB308', description: 'Regular seasonal spikes' },
  { pattern: 'Erratic', count: 134, color: '#F97316', description: 'Unpredictable volatility' },
  { pattern: 'Lumpy', count: 67, color: '#EF4444', description: 'Sparse demand events' },
]

// Forecast health metrics
const HEALTH_METRICS = {
  mapeActual: 68,
  mapeBenchmark: 82,
  forecastBias: 12,
  demandVolatility: 0.42,
  skusNoForecast: 134,
  totalSkus: 842,
  avgForecastHorizon: 12,
  dataCompleteness: 78,
  forecastingMethod: 'Multiple methods by segment',
}

// Data health
const DATA_HEALTH = {
  overall: 68,
  dimensions: [
    { name: 'Demand History', score: 82, detail: '18 months of clean demand data available' },
    { name: 'Completeness', score: 78, detail: '134 SKUs (16%) have insufficient demand history' },
    { name: 'Accuracy', score: 65, detail: 'External data sources inconsistent with internal records' },
    { name: 'Timeliness', score: 62, detail: 'Demand data updated weekly (daily recommended)' },
    { name: 'Granularity', score: 58, detail: 'Demand at sales channel level only, not by customer segment' },
  ],
}

// Recommendations
const RECOMMENDATIONS = [
  {
    id: 1,
    priority: 'CRITICAL',
    title: 'Implement segment-specific forecasting methods',
    impact: '580K',
    description: 'A-X items currently use same method as C-Z items. Implementing MRP for A/B-X, exponential smoothing for A/B-Y, and causal models for Z items would improve MAPE from 68% to target <45%, preventing excess forecast error costs and stockouts.',
    timeline: '6-8 weeks',
    practice: 'Demand & Forecast Optimization',
    effort: 'High',
  },
  {
    id: 2,
    priority: 'CRITICAL',
    title: 'Fix forecast bias and improve demand sensing',
    impact: '320K',
    description: 'Current +12% bias indicates systematic over-forecasting. Root causes: missing external signals (promotions, competitor actions), weak demand sensing from field, and poor forecast governance. Implementing demand sensing dashboard and weekly bias monitoring would save CHF 320K in excess inventory and forced discounts.',
    timeline: '4-6 weeks',
    practice: 'Demand Planning Center of Excellence',
    effort: 'Medium',
  },
  {
    id: 3,
    priority: 'HIGH',
    title: 'Build causal forecasting models for seasonal/lumpy SKUs',
    impact: '280K',
    description: '201 SKUs (Beauty, Specialty, Health) follow seasonal/lumpy patterns unsuitable for time-series methods. Building regression/causal models driven by promotional calendar, holidays, and weather would reduce MAPE for this segment from 95% to <60%.',
    timeline: '8-10 weeks',
    practice: 'Advanced Analytics & AI',
    effort: 'High',
  },
  {
    id: 4,
    priority: 'HIGH',
    title: 'Clean and enrich demand master data',
    impact: '210K',
    description: '134 SKUs lack forecasts due to incomplete demand history (<6 months). Building synthetic demand for new items using analogs and market data, plus enriching historical records with promotional flags, would enable forecasting for all SKUs.',
    timeline: '3-4 weeks',
    practice: 'Data & Governance',
    effort: 'Medium',
  },
  {
    id: 5,
    priority: 'MEDIUM',
    title: 'Establish forecast governance and review cadence',
    impact: '162K',
    description: 'No formal forecast review process exists. Implementing monthly accuracy tracking by family, bias correction, and model validation would prevent forecast drift and reduce error accumulation. Estimated savings from faster bias correction: CHF 162K annually.',
    timeline: '2-3 weeks',
    practice: 'Planning KPI Dashboard',
    effort: 'Low',
  },
]

const DEMO_META: DemandDataset['META'] = {
  isDemo: true,
  hasForecast: true,
  hasValue: true,
  periodLabel: 'Forecast period: 12 months',
  accuracyLabel: 'Forecast Accuracy (MAPE)',
  benchmarkLabel: `Benchmark: ${HEALTH_METRICS.mapeBenchmark}%`,
  biasLabel: 'Over-forecast by avg',
  noForecastLabel: 'Insufficient history',
  volumeLabel: 'Volume (K units)',
  trendTitle: '12-Month Forecast Bias Trend',
  trendSubtitle: 'Actual demand vs forecast — positive = over-forecast',
  worstTitle: 'Top 10 Worst Forecast Accuracy SKUs',
  roadmap: [
    ['Conduct detailed demand pattern analysis by family', 'Fix demand history gaps (134 SKUs)', 'Implement weekly forecast bias monitoring'],
    ['Deploy segment-specific forecasting methods (CHF 580K)', 'Build causal models for seasonal SKUs (CHF 280K)', 'Integrate promotional calendar and external signals'],
    ['Establish demand sensing dashboard', 'Implement forecast governance process', 'Train planning team and go-live with new methods'],
  ],
  notes: [],
}

const DEMO: DemandDataset = {
  COMPANY, FORECAST_BY_FAMILY, FORECAST_TREND, DEMAND_SEGMENTATION, WORST_FORECAST_SKUS,
  DEMAND_PATTERNS, HEALTH_METRICS, DATA_HEALTH, RECOMMENDATIONS, META: DEMO_META,
}

/* ══════════════════════════════════════════════════════════════ */

/** '580K' | '1.2M' | '0' → number (never NaN). */
const parseImpact = (s: string) => {
  const n = parseFloat(String(s).replace(/[^\d.\-]/g, ''))
  if (!isFinite(n)) return 0
  return n * (/M\s*$/i.test(s) ? 1_000_000 : /K\s*$/i.test(s) ? 1_000 : 1)
}

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

export default function DemandForecastDiagnostic() {
  const [screen, setScreen] = useState<'upload' | 'health' | 'dashboard'>('upload')
  const [ds, setDs] = useState<DemandDataset>(DEMO)
  const {
    COMPANY, FORECAST_BY_FAMILY, FORECAST_TREND, DEMAND_SEGMENTATION, WORST_FORECAST_SKUS,
    DEMAND_PATTERNS, HEALTH_METRICS, DATA_HEALTH, RECOMMENDATIONS, META,
  } = ds

  const handleProceed = () => setScreen('dashboard')

  const totalRecoverableValue = RECOMMENDATIONS.reduce((sum, r) => sum + parseImpact(r.impact), 0)
  const hasMoney = totalRecoverableValue > 0
  const money = (n: number) => (n > 0 ? `${COMPANY.currency ? COMPANY.currency + ' ' : ''}${fmt(n)}` : '—')
  const familyMax = Math.max(100, ...FORECAST_BY_FAMILY.map((f) => f.mape))
  const biasVals = FORECAST_TREND.map((t) => t.bias)
  const biasDomain: [number, number] = META.isDemo ? [-15, 10] : [Math.floor(Math.min(-5, ...biasVals) / 5) * 5, Math.ceil(Math.max(5, ...biasVals) / 5) * 5]
  const skuDen = Math.max(1, COMPANY.skuCount)

  /* ─── UPLOAD SCREEN ─── */
  if (screen === 'upload') {
    return (
      <RealUploader
        engine="platform/demand"
        eyebrow="Demand & Forecast Diagnostic"
        title="Upload your demand data"
        intro="Upload your monthly demand history (and, if you have it, the forecast you used each month). An SKU master is optional. Files are processed in your browser — headers are mapped automatically (English, French, German, Portuguese)."
        templates={DEMAND_TEMPLATES.map((t, i) => ({ ...t, icon: (i === 0 ? TrendingUp : FileSpreadsheet) as ComponentType<any> }))}
        onDemo={() => { setDs(localizeDemo(DEMO, readCcy())); setScreen('health') }}
        onAnalyze={(tables) => {
          const d = analyzeDemand(tables)
          setDs(d)
          setScreen('health')
          return {
            summary: {
              skus: d.COMPANY.skuCount,
              wmape: d.HEALTH_METRICS.mapeActual,
              bias: d.HEALTH_METRICS.forecastBias,
              forecast_provided: d.META.hasForecast,
              data_health: d.DATA_HEALTH.overall,
            },
          }
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
            <span className="text-teal-muted text-xs">Demand & Forecast Diagnostic — Data Health Check</span>
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
                <div className="text-sm font-semibold text-white mb-1">Data quality impacts forecast accuracy</div>
                <div className="text-xs text-teal-muted/60 leading-relaxed">
                  The gaps identified above mean some recommendations will be directional rather than precise. Enriching external signals (promotional calendar, pricing data) and fixing missing demand records would significantly improve forecast model accuracy. This is flagged as a key recommendation in the diagnostic.
                </div>
              </div>
            </div>
          </div>

          {META.notes.length > 0 && (
            <ul className="mb-6 space-y-1 text-[11px] text-teal-muted/50 leading-relaxed list-disc pl-5">
              {META.notes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          )}

          <div className="flex gap-3 no-print">
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
              <div className="text-sm font-bold text-white">Demand & Forecast Diagnostic</div>
              <div className="text-xs text-teal-muted/40">{COMPANY.name} &middot; {COMPANY.skuCount} SKUs &middot; {META.periodLabel}</div>
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

        {/* ── EXECUTIVE SUMMARY ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-xs text-teal uppercase tracking-widest font-semibold mb-4">Executive Summary</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {[
              { label: META.accuracyLabel, value: `${HEALTH_METRICS.mapeActual}%`, sub: META.benchmarkLabel, icon: BarChart3, alert: META.hasForecast ? HEALTH_METRICS.mapeActual > HEALTH_METRICS.mapeBenchmark : HEALTH_METRICS.mapeActual > 50 },
              { label: META.hasForecast ? 'Forecast Bias' : 'Naive-Forecast Bias', value: `${HEALTH_METRICS.forecastBias > 0 ? '+' : ''}${HEALTH_METRICS.forecastBias}%`, sub: META.biasLabel, icon: HEALTH_METRICS.forecastBias >= 0 ? TrendingUp : TrendingDown, alert: Math.abs(HEALTH_METRICS.forecastBias) >= 5 },
              { label: 'Demand Volatility', value: `${HEALTH_METRICS.demandVolatility}`, sub: 'Coefficient of Variation', icon: Activity, alert: HEALTH_METRICS.demandVolatility > 0.35 },
              { label: 'SKUs with No Forecast', value: `${HEALTH_METRICS.skusNoForecast}/${HEALTH_METRICS.totalSkus}`, sub: META.noForecastLabel, icon: AlertTriangle, alert: HEALTH_METRICS.skusNoForecast > 0 },
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
        </div>

        {/* ── FINANCIAL IMPACT BOX ── */}
        <div className="rounded-2xl border-2 border-teal/30 bg-gradient-to-r from-teal/10 to-navy-deep/60 p-6 mb-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-teal uppercase tracking-widest font-semibold mb-1">Total Recoverable Value Identified</div>
              <div className="text-4xl md:text-5xl font-extrabold text-white">
                {money(totalRecoverableValue)}
              </div>
              <div className="text-sm text-teal-muted mt-1">
                {hasMoney
                  ? <>across {RECOMMENDATIONS.length} recommendations — {RECOMMENDATIONS.filter(r => r.effort === 'Low').length} quick win available</>
                  : <>{RECOMMENDATIONS.length} recommendations — {META.hasValue ? 'impacts not quantifiable from this data' : 'add unit cost/price data to quantify impact'}</>}
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-xs text-teal-muted/40 mb-1">Forecast error cost impact</div>
              <div className="text-3xl font-bold text-teal">{money(totalRecoverableValue)}</div>
              <div className="text-xs text-teal-muted/40 mt-1">
                from reduced bullwhip & stockouts
              </div>
            </div>
          </div>
        </div>

        {/* ── CHARTS ROW 1: Forecast Accuracy by Family + Bias Trend ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Forecast Accuracy by Product Family */}
          <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6">
            <div className="text-sm font-semibold text-white mb-1">Forecast Accuracy by Product Family</div>
            <div className="text-xs text-teal-muted/40 mb-4">{FORECAST_BY_FAMILY.length} {FORECAST_BY_FAMILY.length === 1 ? 'family' : 'families'} — higher {META.isDemo ? 'MAPE' : 'WMAPE'} = worse accuracy</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={FORECAST_BY_FAMILY} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
                <XAxis type="number" domain={[0, familyMax]} tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: 'MAPE (%)', position: 'bottom', fill: '#9fd8d0', fontSize: 10, offset: -5 }} />
                <YAxis dataKey="family" type="category" tick={{ fill: '#9fd8d0', fontSize: 10 }} width={100} />
                <Tooltip contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }} formatter={(value) => `${value}%`} />
                <Bar dataKey="mape" radius={[0, 4, 4, 0]}>
                  {FORECAST_BY_FAMILY.map((item, i) => {
                    const color = item.mape < 60 ? '#1a9e8f' : item.mape < 80 ? '#EAB308' : '#EF4444'
                    return <Cell key={i} fill={color} fillOpacity={0.8} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3 justify-center text-[10px]">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-teal/20 border border-teal/30" /> Good (&lt;60%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/30" /> Acceptable (60-80%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" /> Poor (&gt;80%)</span>
            </div>
          </div>

          {/* Forecast Bias Trend */}
          <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6">
            <div className="text-sm font-semibold text-white mb-1">{META.trendTitle}</div>
            <div className="text-xs text-teal-muted/40 mb-4">{META.trendSubtitle}</div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={FORECAST_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
                <XAxis dataKey="month" tick={{ fill: '#9fd8d0', fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: META.volumeLabel, angle: -90, position: 'insideLeft', fill: '#9fd8d0', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" domain={biasDomain} tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: 'Bias (%)', angle: 90, position: 'insideRight', fill: '#9fd8d0', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#9fd8d0' }} />
                <Line yAxisId="left" type="monotone" dataKey="actual" name="Actual Demand" stroke="#1a9e8f" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="left" type="monotone" dataKey="forecast" name={META.hasForecast ? 'Forecast' : 'Naive forecast (3-mo MA)'} stroke="#4ab8ae" strokeWidth={2.5} dot={{ r: 2 }} strokeDasharray="5 5" />
                <Line yAxisId="right" type="monotone" dataKey="bias" name="Bias %" stroke="#EF4444" strokeWidth={2} dot={{ r: 2.5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── ABC/XYZ DEMAND SEGMENTATION WITH PLANNING METHODS ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-1">ABC/XYZ Demand Segmentation Matrix with Planning Methods</div>
          <div className="text-xs text-teal-muted/40 mb-4">Recommended planning method per segment — CoV = demand variability</div>
          <div className="grid grid-cols-4 gap-1 text-center text-xs">
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
                  const cell = DEMAND_SEGMENTATION.find(c => c.abc === abc && c.xyz === xyz)!
                  return (
                    <div key={`${abc}${xyz}`} className="p-3 rounded-lg border border-navy-mid/40 bg-navy/20">
                      <div className="text-lg font-bold text-white">{cell.skus}</div>
                      <div className="text-[9px] text-teal-muted/40">SKUs</div>
                      <div className="mt-1.5 text-[9px] leading-tight">
                        <div className="text-teal font-semibold">{cell.planning}</div>
                        <div className="text-teal-muted/50 mt-0.5">CoV: {cell.cov.toFixed(2)}</div>
                      </div>
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        </div>

        {/* ── WORST FORECAST ACCURACY SKUS TABLE ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-orange-400" />
            <span className="text-sm font-semibold text-white">{META.worstTitle}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-navy-mid/50">
                  <th className="text-left py-3 px-3 text-teal-muted/50 font-semibold">SKU</th>
                  <th className="text-left py-3 px-3 text-teal-muted/50 font-semibold">Description</th>
                  <th className="text-left py-3 px-3 text-teal-muted/50 font-semibold">Family</th>
                  <th className="text-center py-3 px-3 text-teal-muted/50 font-semibold">{META.isDemo ? 'MAPE' : 'WMAPE'}</th>
                  <th className="text-center py-3 px-3 text-teal-muted/50 font-semibold">Pattern</th>
                  <th className="text-center py-3 px-3 text-teal-muted/50 font-semibold">Seasonality</th>
                </tr>
              </thead>
              <tbody>
                {WORST_FORECAST_SKUS.map((item, i) => (
                  <tr key={item.sku} className="border-b border-navy-mid/20 hover:bg-navy/20 transition-colors">
                    <td className="py-3 px-3 text-white font-mono">{item.sku}</td>
                    <td className="py-3 px-3 text-teal-muted/70 truncate">{item.desc}</td>
                    <td className="py-3 px-3 text-teal-muted/60">{item.family}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-red-400 font-bold">{item.mape}%</span>
                    </td>
                    <td className="py-3 px-3 text-center text-teal-muted/60">{item.demand}</td>
                    <td className="py-3 px-3 text-center text-orange-400 font-semibold">{item.seasonality}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── DEMAND PATTERN DISTRIBUTION ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-4">Demand Pattern Distribution</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {DEMAND_PATTERNS.map((pattern) => (
              <div key={pattern.pattern} className="p-4 rounded-xl border border-navy-mid/40 bg-navy/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-white">{pattern.pattern}</div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${pattern.color}20` }}>
                    <span className="text-lg font-bold" style={{ color: pattern.color }}>{pattern.count}</span>
                  </div>
                </div>
                <div className="text-[10px] text-teal-muted/40 mb-2">{Math.round(pattern.count / skuDen * 100)}% of SKUs</div>
                <div className="h-1.5 rounded-full bg-navy-mid/40">
                  <div className="h-full rounded-full" style={{ width: `${Math.round(pattern.count / skuDen * 100)}%`, backgroundColor: pattern.color, opacity: 0.8 }} />
                </div>
                <div className="text-[9px] text-teal-muted/50 mt-2">{pattern.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RECOMMENDATIONS ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm font-semibold text-white">Prioritised Recommendations</div>
              <div className="text-xs text-teal-muted/40">{hasMoney ? <>Ranked by priority and financial impact — total recoverable: {money(totalRecoverableValue)}</> : <>Ranked by priority — financial impact not quantified</>}</div>
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
                    <div className="text-xl font-extrabold text-teal">{parseImpact(rec.impact) > 0 ? `${COMPANY.currency ? COMPANY.currency + ' ' : ''}${rec.impact}` : '—'}</div>
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
                title: 'Assessment & Quick Wins',
                color: '#22C55E',
                items: META.roadmap[0],
              },
              {
                phase: 'Week 4-8',
                title: 'Model Development',
                color: '#EAB308',
                items: META.roadmap[1],
              },
              {
                phase: 'Week 9-12',
                title: 'Operationalization',
                color: '#0EA5E9',
                items: META.roadmap[2],
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
            {hasMoney ? <>{money(totalRecoverableValue)} in recoverable value identified</> : <>{RECOMMENDATIONS.length} improvement opportunities identified</>}
          </div>
          <p className="text-sm text-teal-muted leading-relaxed mb-2 max-w-xl mx-auto">
            This diagnostic identified {RECOMMENDATIONS.length} improvement opportunities in demand forecasting and planning, {hasMoney ? <>with an estimated impact of {money(totalRecoverableValue)}</> : <>(financial impact requires cost data)</>}. The next step is a structured engagement to implement these recommendations — starting with quick wins in weeks 1-3.
          </p>
          {META.isDemo ? (
            <p className="text-xs text-teal-muted/40 mb-6">
              Investment: {COMPANY.currency} 22-32K &middot; Duration: 12-16 weeks &middot; Expected ROI: {Math.round(totalRecoverableValue / 27000)}x
            </p>
          ) : <div className="mb-6" />}
          <div className="flex flex-col sm:flex-row gap-3 justify-center no-print">
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
