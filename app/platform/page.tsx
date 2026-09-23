'use client'

import { LogoIcon } from '@/components/LogoIcon'
import { Package, TrendingUp, Shield, BarChart3, ArrowRight, Target } from 'lucide-react'
import { Money, MoneyRange } from '@/components/ui/Money'

const MODULES = [
  {
    id: 'inventory',
    name: 'Inventory & working capital',
    icon: Package,
    practice: 'Planning Excellence',
    price: [22000, 32000],
    description: 'ABC/XYZ segmentation, excess and obsolete stock, safety stock and reorder points, and the working capital you can release.',
    metrics: ['Days of supply', 'Inventory turns', 'Excess value', 'Stockout risk'],
    href: '/platform/inventory',
    recoverable: 1830000,
  },
  {
    id: 'demand',
    name: 'Demand & forecast',
    icon: TrendingUp,
    practice: 'Planning Excellence',
    price: [22000, 32000],
    description: 'Forecast accuracy and bias, demand segmentation and patterns, and the right planning method for each SKU cluster.',
    metrics: ['WMAPE', 'Forecast bias', 'Demand volatility', 'Accuracy by family'],
    href: '/platform/demand',
    recoverable: 1520000,
  },
  {
    id: 'supply-risk',
    name: 'Supply risk & resilience',
    icon: Shield,
    practice: 'Risk & Resilience',
    price: [22000, 30000],
    description: 'Single-source exposure, supplier concentration, geographic risk, disruption cost and a dual-sourcing roadmap.',
    metrics: ['Single-source %', 'Concentration (HHI)', 'Disruption cost', 'Geographic split'],
    href: '/platform/supply-risk',
    recoverable: 1220000,
  },
  {
    id: 'kpis',
    name: 'Planning KPIs & performance',
    icon: BarChart3,
    practice: 'Planning Excellence',
    price: [14000, 18000],
    description: 'OTIF, OTD and fill rate from your order lines, plan adherence and forecast accuracy, root causes of failures.',
    metrics: ['OTIF', 'Forecast accuracy', 'Plan adherence', 'SC cost %'],
    href: '/platform/kpis',
    recoverable: 1060000,
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
              <div className="text-base font-bold text-white">OpsFlow diagnostic platform</div>
              <div className="text-[11px] text-teal-muted/50">Data-driven supply chain diagnostics</div>
            </div>
          </div>
          <a
            href="/en"
            className="text-teal-muted text-xs hover:text-white transition-colors no-underline"
          >
            Back to site
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-semibold mb-4">
            <Target size={14} /> Free data-driven diagnostics
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-4">
            Quantify the gaps in your supply chain.<br />
            <em className="text-teal not-italic">See the cost of doing nothing.</em>
          </h1>
          <p className="text-teal-muted text-sm leading-relaxed max-w-xl mx-auto">
            Upload your own Excel or CSV exports and get a full diagnostic dashboard with prioritised recommendations — computed in your browser, your data never leaves your computer. Or preview each module with a sample company first.
          </p>
        </div>

        {/* Total recoverable */}
        <div className="rounded-2xl border-2 border-teal/20 bg-gradient-to-r from-teal/5 to-navy-deep/60 p-6 mb-8 text-center">
          <div className="text-xs text-teal uppercase tracking-widest font-semibold mb-1">Combined recoverable value — sample company</div>
          <div className="text-4xl font-extrabold text-white"><Money chf={5630000} compact /></div>
          <div className="text-sm text-teal-muted mt-1">across the 4 modules — illustrative mid-size manufacturer (fictional)</div>
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
                  <MoneyRange from={mod.price[0]} to={mod.price[1]} /> engagement
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
                  <div className="text-[10px] text-teal-muted/30 uppercase tracking-wider">Sample recoverable value</div>
                  <div className="text-lg font-extrabold text-teal"><Money chf={mod.recoverable} compact /></div>
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
              { step: '1', title: 'Upload data', desc: 'Our templates or your own ERP exports' },
              { step: '2', title: 'Data health', desc: 'Automated data-quality check' },
              { step: '3', title: 'Analysis', desc: 'Segmentation, benchmarks, trends' },
              { step: '4', title: 'Dashboard', desc: 'Visual results with quantified impact' },
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
            Book a free session
          </a>
          <div className="text-xs text-teal-muted/30 mt-3">
            Not sure which module fits? Let’s start with a conversation.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-navy-mid/40">
        <div className="text-xs text-teal-muted/40">OpsFlow Advisory — Supply chain strategy, with senior follow-through.</div>
        <div className="text-[10px] text-teal-muted/20 mt-1">opsflow-advisory.ch &middot; Nyon, Switzerland</div>
      </div>
    </div>
  )
}
