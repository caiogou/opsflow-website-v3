'use client'
import { useState } from 'react'

const dashboards = [
  {
    id: 'demand',
    label: 'Demand Intelligence',
    desc: 'AI-powered forecast accuracy analysis, volatility detection, bias correction and seasonality modeling.',
    chart: (
      <svg viewBox="0 0 320 180" className="w-full h-full">
        {/* Grid */}
        {[0,1,2,3,4].map(i => (
          <line key={`g${i}`} x1="40" y1={20+i*35} x2="310" y2={20+i*35} stroke="#1a3a5c" strokeWidth="0.5" />
        ))}
        {/* Actual line */}
        <polyline points="40,130 80,110 120,90 160,100 200,70 240,85 280,50 310,60" fill="none" stroke="#1a9e8f" strokeWidth="2.5" />
        {/* Forecast line */}
        <polyline points="40,125 80,115 120,95 160,95 200,75 240,80 280,55 310,55" fill="none" stroke="#4ab8ae" strokeWidth="2" strokeDasharray="6,3" />
        {/* Area under actual */}
        <polygon points="40,130 80,110 120,90 160,100 200,70 240,85 280,50 310,60 310,160 40,160" fill="#1a9e8f" opacity="0.1" />
        {/* Labels */}
        <text x="40" y="175" fill="#9fd8d0" fontSize="9">Jan</text>
        <text x="100" y="175" fill="#9fd8d0" fontSize="9">Mar</text>
        <text x="160" y="175" fill="#9fd8d0" fontSize="9">May</text>
        <text x="220" y="175" fill="#9fd8d0" fontSize="9">Jul</text>
        <text x="280" y="175" fill="#9fd8d0" fontSize="9">Sep</text>
        {/* Legend */}
        <line x1="40" y1="10" x2="55" y2="10" stroke="#1a9e8f" strokeWidth="2.5" />
        <text x="58" y="13" fill="#9fd8d0" fontSize="8">Actual</text>
        <line x1="100" y1="10" x2="115" y2="10" stroke="#4ab8ae" strokeWidth="2" strokeDasharray="4,2" />
        <text x="118" y="13" fill="#9fd8d0" fontSize="8">AI Forecast</text>
        {/* Y axis labels */}
        <text x="10" y="25" fill="#9fd8d0" fontSize="8">100%</text>
        <text x="15" y="95" fill="#9fd8d0" fontSize="8">50%</text>
        <text x="15" y="160" fill="#9fd8d0" fontSize="8">0%</text>
      </svg>
    ),
  },
  {
    id: 'inventory',
    label: 'Inventory Matrix',
    desc: 'Automated ABC/XYZ segmentation, safety stock optimization, stockout risk scoring and working capital targets.',
    chart: (
      <svg viewBox="0 0 320 180" className="w-full h-full">
        {/* Headers */}
        <text x="120" y="15" fill="#9fd8d0" fontSize="9" textAnchor="middle">X — Stable</text>
        <text x="200" y="15" fill="#9fd8d0" fontSize="9" textAnchor="middle">Y — Variable</text>
        <text x="280" y="15" fill="#9fd8d0" fontSize="9" textAnchor="middle">Z — Erratic</text>
        <text x="45" y="55" fill="#9fd8d0" fontSize="9" textAnchor="middle">A</text>
        <text x="45" y="100" fill="#9fd8d0" fontSize="9" textAnchor="middle">B</text>
        <text x="45" y="145" fill="#9fd8d0" fontSize="9" textAnchor="middle">C</text>
        {/* Grid cells */}
        <rect x="70" y="25" width="80" height="45" rx="4" fill="#1a9e8f" opacity="0.8" />
        <rect x="155" y="25" width="80" height="45" rx="4" fill="#1a9e8f" opacity="0.6" />
        <rect x="240" y="25" width="80" height="45" rx="4" fill="#d97706" opacity="0.6" />
        <rect x="70" y="75" width="80" height="45" rx="4" fill="#1a9e8f" opacity="0.5" />
        <rect x="155" y="75" width="80" height="45" rx="4" fill="#d97706" opacity="0.5" />
        <rect x="240" y="75" width="80" height="45" rx="4" fill="#d97706" opacity="0.7" />
        <rect x="70" y="125" width="80" height="45" rx="4" fill="#4ab8ae" opacity="0.3" />
        <rect x="155" y="125" width="80" height="45" rx="4" fill="#d97706" opacity="0.4" />
        <rect x="240" y="125" width="80" height="45" rx="4" fill="#ef4444" opacity="0.5" />
        {/* Cell labels */}
        <text x="110" y="52" fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">AX · 23%</text>
        <text x="195" y="52" fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">AY · 18%</text>
        <text x="280" y="52" fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">AZ · 12%</text>
        <text x="110" y="102" fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">BX · 15%</text>
        <text x="195" y="102" fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">BY · 11%</text>
        <text x="280" y="102" fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">BZ · 8%</text>
        <text x="110" y="152" fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">CX · 6%</text>
        <text x="195" y="152" fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">CY · 4%</text>
        <text x="280" y="152" fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">CZ · 3%</text>
      </svg>
    ),
  },
  {
    id: 'risk',
    label: 'Supply Risk',
    desc: 'Real-time supplier concentration scoring, automated risk heat maps, tier 1+2 visibility and mitigation paths.',
    chart: (
      <svg viewBox="0 0 320 180" className="w-full h-full">
        {/* Axis labels */}
        <text x="160" y="175" fill="#9fd8d0" fontSize="9" textAnchor="middle">Probability →</text>
        <text x="10" y="95" fill="#9fd8d0" fontSize="9" textAnchor="middle" transform="rotate(-90,10,95)">Impact →</text>
        {/* Grid */}
        {[0,1,2,3,4].map(i => (
          <line key={`h${i}`} x1="35" y1={15+i*35} x2="310" y2={15+i*35} stroke="#1a3a5c" strokeWidth="0.5" />
        ))}
        {[0,1,2,3,4,5].map(i => (
          <line key={`v${i}`} x1={35+i*55} y1="15" x2={35+i*55} y2="155" stroke="#1a3a5c" strokeWidth="0.5" />
        ))}
        {/* Risk bubbles */}
        <circle cx="80" cy="130" r="14" fill="#1a9e8f" opacity="0.7" />
        <text x="80" y="133" fill="#fff" fontSize="7" textAnchor="middle">Low</text>
        <circle cx="150" cy="90" r="18" fill="#d97706" opacity="0.7" />
        <text x="150" y="93" fill="#fff" fontSize="7" textAnchor="middle">Medium</text>
        <circle cx="250" cy="45" r="22" fill="#ef4444" opacity="0.7" />
        <text x="250" y="43" fill="#fff" fontSize="7" textAnchor="middle">Single</text>
        <text x="250" y="52" fill="#fff" fontSize="7" textAnchor="middle">Source</text>
        <circle cx="200" cy="70" r="12" fill="#d97706" opacity="0.6" />
        <text x="200" y="73" fill="#fff" fontSize="6" textAnchor="middle">Geo</text>
        <circle cx="120" cy="50" r="10" fill="#1a9e8f" opacity="0.5" />
        <text x="120" y="53" fill="#fff" fontSize="6" textAnchor="middle">Dual</text>
        <circle cx="280" cy="110" r="15" fill="#ef4444" opacity="0.5" />
        <text x="280" y="113" fill="#fff" fontSize="7" textAnchor="middle">Lead</text>
      </svg>
    ),
  },
  {
    id: 'planning',
    label: 'S&OP Maturity',
    desc: 'AI-driven 8-dimension maturity assessment with radar profiling, gap identification and automated recommendations.',
    chart: (
      <svg viewBox="0 0 320 180" className="w-full h-full">
        {/* Radar circles */}
        <circle cx="160" cy="90" r="70" fill="none" stroke="#1a3a5c" strokeWidth="0.5" />
        <circle cx="160" cy="90" r="52" fill="none" stroke="#1a3a5c" strokeWidth="0.5" />
        <circle cx="160" cy="90" r="35" fill="none" stroke="#1a3a5c" strokeWidth="0.5" />
        <circle cx="160" cy="90" r="17" fill="none" stroke="#1a3a5c" strokeWidth="0.5" />
        {/* Axis lines */}
        {[0,1,2,3,4,5,6,7].map(i => {
          const angle = (i * 45 - 90) * Math.PI / 180;
          return <line key={`a${i}`} x1="160" y1="90" x2={160 + 70 * Math.cos(angle)} y2={90 + 70 * Math.sin(angle)} stroke="#1a3a5c" strokeWidth="0.5" />
        })}
        {/* Data polygon */}
        <polygon points="160,30 210,50 225,90 205,130 160,140 115,125 100,85 120,45" fill="#1a9e8f" opacity="0.3" stroke="#1a9e8f" strokeWidth="2" />
        {/* Target polygon */}
        <polygon points="160,25 218,48 230,90 215,135 160,148 108,130 95,85 112,40" fill="none" stroke="#4ab8ae" strokeWidth="1" strokeDasharray="4,3" />
        {/* Labels */}
        <text x="160" y="15" fill="#9fd8d0" fontSize="8" textAnchor="middle">Governance</text>
        <text x="240" y="45" fill="#9fd8d0" fontSize="8" textAnchor="start">Demand</text>
        <text x="248" y="93" fill="#9fd8d0" fontSize="8" textAnchor="start">Supply</text>
        <text x="225" y="142" fill="#9fd8d0" fontSize="8" textAnchor="start">Inventory</text>
        <text x="160" y="165" fill="#9fd8d0" fontSize="8" textAnchor="middle">Analytics</text>
        <text x="75" y="142" fill="#9fd8d0" fontSize="8" textAnchor="end">KPIs</text>
        <text x="72" y="93" fill="#9fd8d0" fontSize="8" textAnchor="end">Technology</text>
        <text x="85" y="45" fill="#9fd8d0" fontSize="8" textAnchor="end">Process</text>
      </svg>
    ),
  },
]

export function DashboardShowcase() {
  const [active, setActive] = useState('demand')
  const current = dashboards.find(d => d.id === active)!

  return (
    <section id="dashboards" className="py-16 px-6 md:py-24 md:px-8 bg-navy">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal-light uppercase mb-4">AI Decision Engines</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-4 leading-tight">
          See our AI engines<br />in action.
        </h2>
        <p className="text-base text-teal-muted leading-relaxed max-w-xl mb-10 md:mb-14">
          Live dashboards that deliver decisions — not reports. Each engine is AI-powered and built for execution.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {dashboards.map(d => (
            <button
              key={d.id}
              onClick={() => setActive(d.id)}
              className={`px-5 py-2.5 rounded text-sm font-semibold transition-all ${
                active === d.id
                  ? 'bg-teal text-white'
                  : 'bg-navy-mid text-teal-muted border border-navy-mid hover:border-teal hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Dashboard Preview */}
        <div className="bg-navy-mid rounded-lg border border-navy-mid overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-6 py-3 border-b border-navy">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <span className="text-teal-muted text-xs">OpsFlow · {current.label} Engine</span>
          </div>
          {/* Content */}
          <div className="p-6 md:p-10">
            <div className="bg-navy rounded-lg p-6 md:p-8 mb-6" style={{ minHeight: '220px' }}>
              {current.chart}
            </div>
            <p className="text-teal-muted text-sm leading-relaxed">{current.desc}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a href="/diagnostic" className="bg-teal text-white px-8 py-4 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline inline-block">
            Try the S&OP Maturity Engine live →
          </a>
        </div>
      </div>
    </section>
  )
}
