'use client'

import { useState, useMemo } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  PieChart, Pie, Legend, LineChart, Line, ComposedChart, ScatterChart, Scatter, ZAxis
} from 'recharts'
import {
  Upload, CheckCircle, AlertTriangle, TrendingDown, TrendingUp, Package,
  DollarSign, Target, ArrowRight, ChevronRight, BarChart3, Shield,
  AlertCircle, Clock, Layers, FileSpreadsheet, ArrowUpRight, MapPin,
  Activity, AlertOctagon, Zap
} from 'lucide-react'
import { LogoIcon } from '@/components/LogoIcon'

/* ══════════════════════════════════════════════════════════════
   SIMULATED DATA — Replace with real upload/parse in production
   ══════════════════════════════════════════════════════════════ */

const COMPANY = { name: 'Simulated Client', currency: 'CHF', supplierCount: 127, activeSuppliers: 89 }

// Executive Summary Metrics
const EXECUTIVE_SUMMARY = {
  totalSuppliers: 127,
  activeSuppliers: 89,
  singleSourceMaterials: 34,
  singleSourceSpend: 42,
  top5Spend: 61,
  annualDisruptionCost: 840_000,
}

// Supplier Concentration Data
const SUPPLIER_CONCENTRATION = [
  { name: 'Supplier A', spend: 18.5, spending: 18.5 },
  { name: 'Supplier B', spend: 14.2, spending: 14.2 },
  { name: 'Supplier C', spend: 12.8, spending: 12.8 },
  { name: 'Supplier D', spend: 10.3, spending: 10.3 },
  { name: 'Supplier E', spend: 9.2, spending: 9.2 },
  { name: 'Supplier F', spend: 7.5, spending: 7.5 },
  { name: 'Supplier G', spend: 6.2, spending: 6.2 },
  { name: 'Supplier H', spend: 5.1, spending: 5.1 },
  { name: 'Supplier I', spend: 3.8, spending: 3.8 },
  { name: 'Supplier J', spend: 2.4, spending: 2.4 },
  { name: 'Others', spend: 10.0, spending: 10.0 },
]

const PIE_DATA = SUPPLIER_CONCENTRATION.slice(0, 5).concat(
  { name: 'Others', spend: SUPPLIER_CONCENTRATION.slice(5).reduce((sum, s) => sum + s.spend, 0), spending: 0 }
)

const COLORS = ['#1a9e8f', '#4ab8ae', '#9fd8d0', '#7dc9c2', '#b0e0d8', '#d4eee9']

// Risk Heat Map Data (2x2 matrix)
const RISK_HEAT_MAP = [
  { category: 'High Probability,\nHigh Impact', count: 8, probability: 75, impact: 85, bgColor: '#EF4444' },
  { category: 'High Probability,\nLow Impact', count: 23, probability: 75, impact: 25, bgColor: '#F97316' },
  { category: 'Low Probability,\nHigh Impact', count: 12, probability: 25, impact: 85, bgColor: '#EAB308' },
  { category: 'Low Probability,\nLow Impact', count: 84, probability: 25, impact: 25, bgColor: '#22C55E' },
]

// Single-Source Exposure Table (Top 10)
const SINGLE_SOURCE_MATERIALS = [
  { material: 'High-Performance Resin X42', supplier: 'ChemCorp AG', spend: 245_000, leadTime: '8 weeks', alternative: 'No', riskLevel: 'Critical' },
  { material: 'Precision Bearing Assembly', supplier: 'BallTech GmbH', spend: 189_000, leadTime: '6 weeks', alternative: 'No', riskLevel: 'Critical' },
  { material: 'Specialty Adhesive TK-7', supplier: 'ChemCorp AG', spend: 156_000, leadTime: '12 weeks', alternative: 'No', riskLevel: 'Critical' },
  { material: 'Customized Packaging Film', supplier: 'FlexPak Ltd', spend: 134_000, leadTime: '4 weeks', alternative: 'Yes', riskLevel: 'High' },
  { material: 'Electronic Control Module', supplier: 'SiemensEM AG', spend: 128_000, leadTime: '10 weeks', alternative: 'No', riskLevel: 'Critical' },
  { material: 'Impact-Resistant Polymer', supplier: 'DuPont Material', spend: 112_000, leadTime: '7 weeks', alternative: 'Yes', riskLevel: 'High' },
  { material: 'Titanium Grade 5 Sheet', supplier: 'TIMET Switzerland', spend: 98_000, leadTime: '9 weeks', alternative: 'No', riskLevel: 'Critical' },
  { material: 'Rare Earth Element Mix', supplier: 'RareMat Inc', spend: 87_000, leadTime: '16 weeks', alternative: 'No', riskLevel: 'Critical' },
  { material: 'Medical-Grade Silicone', supplier: 'Dow Corning Ltd', spend: 76_000, leadTime: '5 weeks', alternative: 'Yes', riskLevel: 'Medium' },
  { material: 'Precision Optics Lens', supplier: 'Zeiss Precision', spend: 65_000, leadTime: '11 weeks', alternative: 'No', riskLevel: 'Critical' },
]

// Geographic Concentration Data
const GEOGRAPHIC_DATA = [
  { region: 'DACH', suppliers: 34, spend: 28.5, label: 'Germany, Austria, Switzerland' },
  { region: 'W.Europe', suppliers: 28, spend: 22.3, label: 'France, Benelux, UK' },
  { region: 'E.Europe', suppliers: 18, spend: 14.2, label: 'Poland, Czech, Hungary' },
  { region: 'Asia', suppliers: 32, spend: 24.8, label: 'China, Vietnam, India' },
  { region: 'Americas', suppliers: 15, spend: 10.2, label: 'US, Canada, Mexico' },
]

// Disruption History (6 incidents)
const DISRUPTION_HISTORY = [
  { date: 'Feb 2024', supplier: 'ChemCorp AG', cause: 'Production fire in Ludwigshafen facility', duration: '18 days', impact: 'CHF 285K revenue loss, production halt' },
  { date: 'Dec 2023', supplier: 'BallTech GmbH', cause: 'Quality issue — bearing tolerance drift', duration: '8 days', impact: 'CHF 142K rework, customer complaints' },
  { date: 'Oct 2023', supplier: 'FlexPak Ltd', cause: 'Port congestion in Rotterdam', duration: '14 days', impact: 'CHF 98K expedited freight' },
  { date: 'Aug 2023', supplier: 'SiemensEM AG', cause: 'Component shortage — geopolitical supply chain', duration: '21 days', impact: 'CHF 156K lost sales, customer delays' },
  { date: 'May 2023', supplier: 'TIMET Switzerland', cause: 'Plant maintenance — unplanned shutdown', duration: '12 days', impact: 'CHF 87K production delays' },
  { date: 'Jan 2023', supplier: 'RareMat Inc', cause: 'Export restrictions — regulatory changes', duration: '45 days', impact: 'CHF 312K production halt, contract penalties' },
]

// Recommendations
const RECOMMENDATIONS = [
  {
    id: 1,
    priority: 'CRITICAL',
    title: 'Establish alternative sourcing for 8 critical single-source materials',
    impact: '420K',
    description: 'Identify and qualify 2-3 alternative suppliers for highest-risk materials (ChemCorp resin, BallTech bearings, Rare earth elements, Titanium). Estimated cost of qualification: CHF 85K, but reduces disruption risk exposure by CHF 420K annually.',
    timeline: '8-12 weeks',
    practice: 'Supply Chain Resilience',
    effort: 'High',
  },
  {
    id: 2,
    priority: 'CRITICAL',
    title: 'Reduce geographic concentration in Asia (currently 24.8% spend)',
    impact: '380K',
    description: 'Diversify 15% of Asian supplier spend (CHF 94K value) to European sources, reducing geopolitical and logistics risk. Preliminary quotes from DACH suppliers show 3-5% cost premium but provide 2-3 day lead time reduction and lower disruption probability.',
    timeline: '6-8 weeks',
    practice: 'Supply Chain Resilience',
    effort: 'High',
  },
  {
    id: 3,
    priority: 'HIGH',
    title: 'Implement supplier resilience scoring and continuous monitoring',
    impact: '220K',
    description: 'Deploy real-time supplier health dashboard tracking: financial stability (credit checks quarterly), geopolitical risk (export/import monitoring), production capacity (capacity reports), and lead time performance. Identify early warning signals before disruptions occur.',
    timeline: '4-6 weeks',
    practice: 'Supply Chain Visibility',
    effort: 'Medium',
  },
  {
    id: 4,
    priority: 'HIGH',
    title: 'Develop contingency inventory strategy for top 12 high-risk materials',
    impact: '185K',
    description: 'Build strategic buffer stock (1.5x lead time) for materials with no alternatives and >6 week lead times. Working capital investment: CHF 340K, but prevents CHF 185K average annual disruption impact. ROI breakeven: 1.8 years.',
    timeline: '3-4 weeks',
    practice: 'Demand & Inventory Optimization',
    effort: 'Medium',
  },
  {
    id: 5,
    priority: 'MEDIUM',
    title: 'Negotiate long-term supply agreements with top 5 suppliers',
    impact: '95K',
    description: '61% of spend concentrated with 5 suppliers. Negotiate 2-3 year agreements with volume commitments in exchange for preferential pricing, priority allocation during supply constraints, and advance notice of changes. Estimated savings: CHF 95K annually through better terms.',
    timeline: '6-8 weeks',
    practice: 'Contract & Relationship Management',
    effort: 'Medium',
  },
  {
    id: 6,
    priority: 'MEDIUM',
    title: 'Launch supplier development program for Asia-based partners',
    impact: '105K',
    description: 'Invest in capability building for top 6 Asian suppliers (quality systems, capacity expansion, inventory policy alignment). Reduces variance in delivery performance, quality issues, and enables more reliable planning. Estimated benefit: CHF 105K through reduced expediting and rework.',
    timeline: '10-12 weeks',
    practice: 'Supplier Development & Collaboration',
    effort: 'Medium',
  },
  {
    id: 7,
    priority: 'LOW',
    title: 'Establish industry collaborative intelligence network',
    impact: '25K',
    description: 'Join industry peer groups or subscribe to supply chain intelligence services (e.g., Resilinc, Everstream) to share disruption signals and market intelligence. Early warning of supplier financial distress, geopolitical developments, and logistics bottlenecks.',
    timeline: '2-3 weeks',
    practice: 'Risk Management & Analytics',
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

export default function SupplyRiskDiagnostic() {
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
              <div className="text-[11px] text-teal-muted tracking-widest uppercase">Supply Risk & Resilience Diagnostic</div>
            </div>
          </div>

          <h1 className="text-2xl font-serif text-white mb-3">
            Upload your supplier & procurement data
          </h1>
          <p className="text-teal-muted text-sm leading-relaxed mb-8">
            We need three data files to run the diagnostic. Download our templates or upload your own exports — the system will map the fields automatically.
          </p>

          {/* Templates */}
          <div className="space-y-3 mb-8">
            {[
              { name: 'Supplier Master', desc: 'Supplier info, location, volume, performance metrics, lead times, quality scores', icon: Package },
              { name: 'Procurement History', desc: '12-24 months of purchase orders, materials sourced, spend by supplier and region', icon: TrendingUp },
              { name: 'Supply Chain Risk Data', desc: 'Disruption history, geopolitical exposure, single-source materials, capacity constraints', icon: FileSpreadsheet },
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
    const DATA_HEALTH = {
      overall: 78,
      dimensions: [
        { name: 'Completeness', score: 88, detail: '8% of suppliers missing financial stability data' },
        { name: 'Accuracy', score: 75, detail: 'Supplier locations and lead times inconsistent in 18% of records' },
        { name: 'Timeliness', score: 82, detail: 'Procurement data updated weekly (daily recommended for risk monitoring)' },
        { name: 'Consistency', score: 70, detail: 'Supplier codes differ across ERP and procurement systems' },
        { name: 'Granularity', score: 72, detail: 'Material sourcing tracked by supplier, not risk category' },
      ],
    }
    const healthColor = DATA_HEALTH.overall >= 80 ? '#1a9e8f' : DATA_HEALTH.overall >= 60 ? '#EAB308' : '#EF4444'

    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-5">
        <div className="max-w-2xl w-full bg-navy-deep/50 rounded-2xl border border-navy-mid p-10">
          <div className="flex items-center gap-3 mb-8">
            <LogoIcon size={32} />
            <span className="text-teal-muted text-xs">Supply Risk Diagnostic — Data Health Check</span>
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
                <div className="text-sm font-semibold text-white mb-1">Data quality impacts risk assessment</div>
                <div className="text-xs text-teal-muted/60 leading-relaxed">
                  The gaps identified above mean some risk assessments will be directional. Completing supplier financial data, standardizing supplier codes, and adding geopolitical risk data would significantly improve the precision of sourcing recommendations and early warning indicators.
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
              <div className="text-sm font-bold text-white">Supply Risk & Resilience Diagnostic</div>
              <div className="text-xs text-teal-muted/40">{COMPANY.name} &middot; {COMPANY.supplierCount} suppliers &middot; {COMPANY.activeSuppliers} active</div>
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
              { label: 'Total Suppliers', value: `${EXECUTIVE_SUMMARY.totalSuppliers}`, sub: `${EXECUTIVE_SUMMARY.activeSuppliers} active`, icon: Package, alert: false },
              { label: 'Single-Source Materials', value: `${EXECUTIVE_SUMMARY.singleSourceMaterials}`, sub: `${EXECUTIVE_SUMMARY.singleSourceSpend}% of spend at risk`, icon: AlertOctagon, alert: true },
              { label: 'Top 5 Concentration', value: `${EXECUTIVE_SUMMARY.top5Spend}%`, sub: 'of total supplier spend', icon: TrendingUp, alert: true },
              { label: 'Annual Disruption Cost', value: `CHF ${fmt(EXECUTIVE_SUMMARY.annualDisruptionCost)}`, sub: 'based on 6-year history', icon: AlertTriangle, alert: true },
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
                CHF {fmt(totalRecoverableValue)}
              </div>
              <div className="text-sm text-teal-muted mt-1">
                across {RECOMMENDATIONS.length} recommendations — {RECOMMENDATIONS.filter(r => r.effort === 'Low').length} quick wins available
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-xs text-teal-muted/40 mb-1">Resilience investment required</div>
              <div className="text-3xl font-bold text-teal">CHF {fmt(420_000 + 380_000)}</div>
              <div className="text-xs text-teal-muted/40 mt-1">
                for alternative sourcing & diversification (ROI: 1.5x first year)
              </div>
            </div>
          </div>
        </div>

        {/* ── SUPPLIER CONCENTRATION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Pie Chart */}
          <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6">
            <div className="text-sm font-semibold text-white mb-1">Supplier Concentration by Spend</div>
            <div className="text-xs text-teal-muted/40 mb-4">Top 5 suppliers = 61% of total spend</div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={1}
                  dataKey="spend"
                  label={({ name, value }: any) => `${name} ${value}%`}
                  labelLine={false}
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Top 10 */}
          <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6">
            <div className="text-sm font-semibold text-white mb-1">Top 10 Suppliers by Spend %</div>
            <div className="text-xs text-teal-muted/40 mb-4">Cumulative spend concentration</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={SUPPLIER_CONCENTRATION.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
                <XAxis dataKey="name" tick={{ fill: '#9fd8d0', fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: 'Spend %', angle: -90, position: 'insideLeft', fill: '#9fd8d0', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }} formatter={(v) => `${v}%`} />
                <Bar dataKey="spend" radius={[4, 4, 0, 0]} fill="#1a9e8f" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── RISK HEAT MAP (2x2) ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="text-sm font-semibold text-white mb-1">Supplier Risk Heat Map</div>
          <div className="text-xs text-teal-muted/40 mb-4">Probability vs Impact matrix — supplier count per quadrant</div>
          <div className="grid grid-cols-2 gap-4">
            {RISK_HEAT_MAP.map((quadrant, i) => (
              <div key={i} className="p-6 rounded-xl border border-navy-mid" style={{ backgroundColor: `${quadrant.bgColor}15` }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{quadrant.category}</div>
                    <div className="text-xs text-teal-muted/40">{quadrant.probability}% × {quadrant.impact}% severity</div>
                  </div>
                  <div className="text-3xl font-extrabold" style={{ color: quadrant.bgColor }}>{quadrant.count}</div>
                </div>
                <div className="w-full bg-navy-mid/30 rounded-full h-2">
                  <div className="h-full rounded-full" style={{ width: `${(quadrant.count / 127) * 100}%`, backgroundColor: quadrant.bgColor }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SINGLE-SOURCE EXPOSURE TABLE ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertOctagon size={16} className="text-orange-400" />
            <span className="text-sm font-semibold text-white">Single-Source Exposure — Top 10 Materials at Risk</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-mid">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-teal-muted/50 uppercase tracking-wider">#</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-teal-muted/50 uppercase tracking-wider">Material</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-teal-muted/50 uppercase tracking-wider">Supplier</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-teal-muted/50 uppercase tracking-wider">Annual Spend</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-teal-muted/50 uppercase tracking-wider">Lead Time</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-teal-muted/50 uppercase tracking-wider">Alternative</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-teal-muted/50 uppercase tracking-wider">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {SINGLE_SOURCE_MATERIALS.map((material, i) => (
                  <tr key={i} className="border-b border-navy-mid/40 hover:bg-navy/20 transition-colors">
                    <td className="py-3 px-4 text-teal font-semibold">#{i + 1}</td>
                    <td className="py-3 px-4 text-white font-medium">{material.material}</td>
                    <td className="py-3 px-4 text-teal-muted text-xs">{material.supplier}</td>
                    <td className="py-3 px-4 text-right font-semibold text-white">CHF {fmt(material.spend)}</td>
                    <td className="py-3 px-4 text-center text-teal-muted text-xs">{material.leadTime}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-semibold ${material.alternative === 'Yes' ? 'bg-teal/20 text-teal' : 'bg-red-500/20 text-red-400'}`}>
                        {material.alternative}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-semibold ${
                        material.riskLevel === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        material.riskLevel === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {material.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── GEOGRAPHIC CONCENTRATION ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-teal" />
            <span className="text-sm font-semibold text-white">Geographic Concentration by Region</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={GEOGRAPHIC_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
              <XAxis dataKey="region" tick={{ fill: '#9fd8d0', fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: 'Suppliers', angle: -90, position: 'insideLeft', fill: '#9fd8d0', fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 30]} tick={{ fill: '#9fd8d0', fontSize: 11 }} label={{ value: 'Spend %', angle: 90, position: 'insideRight', fill: '#9fd8d0', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0a1f38', border: '1px solid #1a3a5c', borderRadius: 8, color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9fd8d0' }} />
              <Bar yAxisId="left" dataKey="suppliers" name="Supplier Count" fill="#4ab8ae" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="spend" name="Spend %" fill="#1a9e8f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── DISRUPTION HISTORY ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-orange-400" />
            <span className="text-sm font-semibold text-white">Disruption History — Last 6 Incidents</span>
          </div>
          <div className="space-y-3">
            {DISRUPTION_HISTORY.map((incident, i) => (
              <div key={i} className="p-4 rounded-xl bg-navy/30 border border-navy-mid/40 hover:border-navy-mid transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-muted/50">{incident.date}</span>
                      <span className="text-xs font-semibold text-white">{incident.supplier}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{incident.cause}</p>
                  </div>
                  <div className="text-right min-w-fit">
                    <div className="text-xs font-bold text-orange-400">{incident.duration}</div>
                    <div className="text-[10px] text-teal-muted/40">downtime</div>
                  </div>
                </div>
                <div className="text-xs text-teal-muted/60 leading-relaxed p-2 rounded bg-navy/40 border border-navy-mid/20">
                  Impact: {incident.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RECOMMENDATIONS ── */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm font-semibold text-white">Prioritised Recommendations</div>
              <div className="text-xs text-teal-muted/40">Ranked by financial impact — total recoverable: CHF {fmt(totalRecoverableValue)}</div>
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
                    <div className="text-xl font-extrabold text-teal">CHF {rec.impact}</div>
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
                title: 'Risk Assessment & Quick Wins',
                color: '#22C55E',
                items: ['Complete single-source material audit', 'Launch supplier health scoring system', 'Establish industry risk intelligence subscription'],
              },
              {
                phase: 'Week 5-8',
                title: 'Sourcing Resilience',
                color: '#EAB308',
                items: ['Qualify alternative suppliers for 8 critical materials', 'Negotiate long-term agreements with top 5 suppliers', 'Begin geographic diversification for Asia spend'],
              },
              {
                phase: 'Week 9-12',
                title: 'Sustain & Monitor',
                color: '#0EA5E9',
                items: ['Build contingency inventory for high-risk materials', 'Deploy real-time supplier resilience dashboard', 'Establish quarterly supply chain risk review'],
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
            CHF {fmt(totalRecoverableValue)} in recoverable value identified
          </div>
          <p className="text-sm text-teal-muted leading-relaxed mb-2 max-w-xl mx-auto">
            This diagnostic identified {RECOMMENDATIONS.length} improvement opportunities with an estimated annual impact of CHF {fmt(totalRecoverableValue)}. The next step is a structured engagement to implement supply chain resilience improvements — starting with alternative sourcing qualification in weeks 1-4.
          </p>
          <p className="text-xs text-teal-muted/40 mb-6">
            Investment: CHF 22-30K &middot; Duration: 12 weeks &middot; Expected ROI: {Math.round(totalRecoverableValue / 26000)}x
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
