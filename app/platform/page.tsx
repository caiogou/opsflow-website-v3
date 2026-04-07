'use client'

import { LogoIcon } from '@/components/LogoIcon'
import { Package, TrendingUp, Shield, BarChart3, ArrowRight, Target } from 'lucide-react'

const MODULES = [
  {
    id: 'inventory',
    name: 'Inventory & Working Capital',
    icon: Package,
    practice: 'Practice 1 — Planning Excellence',
    price: 'CHF 22–32K',
    description: 'ABC/XYZ segmentation, excess & obsolete identification, safety stock optimization, working capital release quantification.',
    metrics: ['Days of Supply', 'Inventory Turns', 'Excess Value', 'Stockout Cost'],
    href: '/platform/inventory',
    recoverable: '1.83M',
  },
  {
    id: 'demand',
    name: 'Demand & Forecast',
    icon: TrendingUp,
    practice: 'Practice 1 — Planning Excellence',
    price: 'CHF 22–32K',
    description: 'Forecast accuracy analysis, bias detection, demand segmentation, methodology recommendations per SKU cluster.',
    metrics: ['MAPE', 'Forecast Bias', 'Demand Volatility', 'Accuracy by Family'],
    href: '/platform/demand',
    recoverable: '1.52M',
  },
  {
    id: 'supply-risk',
    name: 'Supply Risk & Resilience',
    icon: Shield,
    practice: 'Practice 2 — Supply Resilience',
    price: 'CHF 22–30K',
    description: 'Single-source exposure, supplier concentration, geographic risk, disruption cost quantification, dual-source roadmap.',
    metrics: ['Single-Source %', 'Concentration Risk', 'Disruption Cost', 'Geographic Spread'],
    href: '/platform/supply-risk',
    recoverable: '1.22M',
  },
  {
    id: 'kpis',
    name: 'Planning KPIs & Performance',
    icon: BarChart3,
    practice: 'Practice 1 — Planning Excellence',
    price: 'CHF 14–18K',
    description: 'Balanced scorecard benchmarking, operational rhythm assessment, root cause analysis, KPI gap quantification.',
    metrics: ['OTIF', 'Forecast Accuracy', 'Plan Adherence', 'SC Cost %'],
    href: '/platform/kpis',
    recoverable: '1.06M',
  },
]

export default function PlatformIndex() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <div className="border-b border-navy-mid px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon size={32} />
            <div>
              <div className="text-base font-bold text-white">OpsFlow Diagnostic Platform</div>
              <div className="text-[11px] text-teal-muted/50">Data-driven supply chain diagnostics</div>
            </div>
          </div>
          <a
            href="/"
            className="text-teal-muted text-xs hover:text-white transition-colors no-underline"
          >
            Back to website
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-semibold mb-4">
            <Target size={14} /> 4 Diagnostic Modules
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-4">
            Quantify your supply chain gaps.<br />
            <em className="text-teal not-italic">See the cost of inaction.</em>
          </h1>
          <p className="text-teal-muted text-sm leading-relaxed max-w-xl mx-auto">
            Upload your data, get an automated health check, and receive a full diagnostic dashboard with prioritised recommendations and ROI quantification. Each module maps to a specific OpsFlow engagement.
          </p>
        </div>

        {/* Total recoverable */}
        <div className="rounded-2xl border-2 border-teal/20 bg-gradient-to-r from-teal/5 to-navy-deep/60 p-6 mb-8 text-center">
          <div className="text-xs text-teal uppercase tracking-widest font-semibold mb-1">Combined Recoverable Value (Typical Client)</div>
          <div className="text-4xl font-extrabold text-white">CHF 5.63M</div>
          <div className="text-sm text-teal-muted mt-1">across all 4 modules — average industrial manufacturer CHF 50-200M revenue</div>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {MODULES.map((mod) => (
            <a
              key={mod.id}
              href={mod.href}
              className="group rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 hover:border-teal/30 transition-all no-underline block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                  <mod.icon size={22} className="text-teal" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-navy-mid/40 text-teal-muted/50 text-[10px] border border-navy-mid/60">
                  {mod.price}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-teal transition-colors">{mod.name}</h3>
              <div className="text-[11px] text-teal/70 mb-3">{mod.practice}</div>
              <p className="text-xs text-teal-muted/50 leading-relaxed mb-4">{mod.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {mod.metrics.map((m) => (
                  <span key={m} className="px-2 py-0.5 rounded bg-navy-mid/30 text-teal-muted/40 text-[10px]">
                    {m}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-navy-mid/40">
                <div>
                  <div className="text-[10px] text-teal-muted/30 uppercase tracking-wider">Typical recoverable value</div>
                  <div className="text-lg font-extrabold text-teal">CHF {mod.recoverable}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                  <ArrowRight size={14} className="text-teal" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-navy-mid bg-navy-deep/40 p-6 mb-8">
          <div className="text-sm font-semibold text-white mb-5 text-center">How it works</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            {[
              { step: '1', title: 'Upload Data', desc: 'Use our templates or your own exports' },
              { step: '2', title: 'Health Check', desc: 'Automated data quality assessment' },
              { step: '3', title: 'Analysis', desc: 'Segmentation, benchmarks, patterns' },
              { step: '4', title: 'Dashboard', desc: 'Visual findings with ROI quantification' },
              { step: '5', title: 'Recommendations', desc: 'Prioritised actions + 90-day roadmap' },
            ].map((s) => (
              <div key={s.step} className="p-3">
                <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-2 text-teal text-sm font-bold">
                  {s.step}
                </div>
                <div className="text-xs font-semibold text-white mb-1">{s.title}</div>
                <div className="text-[10px] text-teal-muted/40">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://calendly.com/caio-opsflow-advisory/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-light transition-colors no-underline"
          >
            Book Free 90-min Problem Session
          </a>
          <div className="text-xs text-teal-muted/30 mt-3">
            Not sure which module fits? Start with a conversation.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-navy-mid/40">
        <div className="text-xs text-teal-muted/40">OpsFlow Advisory — Smarter supply chains. Built by people. Powered by AI.</div>
        <div className="text-[10px] text-teal-muted/20 mt-1">opsflow-advisory.ch &middot; Nyon, Canton Vaud, Switzerland</div>
      </div>
    </div>
  )
}
