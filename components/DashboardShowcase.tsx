'use client'
import { useState } from 'react'

const dashboards = [
  {
    id: 'demand',
    label: 'Demand Intelligence',
    desc: 'AI-powered forecast accuracy analysis, volatility detection, bias correction and seasonality modeling.',
    chart: (
      <div className="space-y-4">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'FORECAST ACCURACY (MAPE)', value: '68%', sub: 'Benchmark: 82%', color: 'text-yellow-400' },
            { label: 'FORECAST BIAS', value: '+12%', sub: 'Over-forecast by avg', color: 'text-red-400' },
            { label: 'DEMAND VOLATILITY', value: '0.42', sub: 'Coefficient of Variation', color: 'text-teal' },
            { label: 'SKUs WITH NO FORECAST', value: '134/842', sub: 'Insufficient history', color: 'text-red-400' },
          ].map(k => (
            <div key={k.label} className="bg-navy-deep rounded-lg p-3 border border-navy-mid">
              <div className="text-[8px] text-teal-muted uppercase tracking-wide mb-1">{k.label}</div>
              <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
              <div className="text-[8px] text-teal-muted mt-0.5">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Value Banner */}
        <div className="bg-gradient-to-r from-teal/20 to-navy-deep rounded-lg p-4 border border-teal/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="text-[9px] text-teal-light uppercase tracking-widest">Total Recoverable Value Identified</div>
            <div className="text-2xl font-bold text-white">CHF 1.6M</div>
            <div className="text-[9px] text-teal-muted">across 5 recommendations — 1 quick win available</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-teal-muted">Forecast error cost impact</div>
            <div className="text-xl font-bold text-teal">CHF 1.6M</div>
            <div className="text-[9px] text-teal-muted">from reduced bullwhip &amp; stockouts</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Bar Chart */}
          <div className="bg-navy-deep rounded-lg p-4 border border-navy-mid">
            <div className="text-xs font-bold text-white mb-1">Forecast Accuracy by Product Family</div>
            <div className="text-[8px] text-teal-muted mb-3">8 families — higher MAPE = worse accuracy</div>
            <div className="space-y-1.5">
              {[
                { name: 'Personal Care', val: 42, color: '#1a9e8f' },
                { name: 'Beverages', val: 55, color: '#1a9e8f' },
                { name: 'Packaged Foods', val: 62, color: '#d97706' },
                { name: 'Home & Cleaning', val: 58, color: '#d97706' },
                { name: 'Pet Care', val: 65, color: '#d97706' },
                { name: 'Health & Wellness', val: 72, color: '#ef4444' },
                { name: 'Beauty & Cosmetics', val: 78, color: '#ef4444' },
                { name: 'Specialty Items', val: 88, color: '#ef4444' },
              ].map(b => (
                <div key={b.name} className="flex items-center gap-2">
                  <div className="text-[7px] text-teal-muted w-20 text-right truncate">{b.name}</div>
                  <div className="flex-1 h-3 bg-navy rounded-sm overflow-hidden">
                    <div className="h-full rounded-sm" style={{ width: `${b.val}%`, backgroundColor: b.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-navy-deep rounded-lg p-4 border border-navy-mid">
            <div className="text-xs font-bold text-white mb-1">12-Month Forecast Bias Trend</div>
            <div className="text-[8px] text-teal-muted mb-3">Actual demand vs forecast — positive = over-forecast</div>
            <svg viewBox="0 0 280 120" className="w-full">
              {[0,1,2,3,4].map(i => (
                <line key={`g${i}`} x1="30" y1={10+i*25} x2="275" y2={10+i*25} stroke="#1a3a5c" strokeWidth="0.5" />
              ))}
              <text x="5" y="14" fill="#9fd8d0" fontSize="6">800</text>
              <text x="5" y="39" fill="#9fd8d0" fontSize="6">600</text>
              <text x="5" y="64" fill="#9fd8d0" fontSize="6">400</text>
              <text x="5" y="89" fill="#9fd8d0" fontSize="6">200</text>
              <text x="12" y="114" fill="#9fd8d0" fontSize="6">0</text>
              <polyline points="35,85 55,75 75,60 95,52 115,40 135,35 155,30 175,28 195,32 215,25 235,20 255,18 275,22" fill="none" stroke="#1a9e8f" strokeWidth="2" />
              <polyline points="35,82 55,72 75,65 95,55 115,45 135,40 155,35 175,33 195,38 215,30 235,26 255,22 275,20" fill="none" stroke="#4ab8ae" strokeWidth="1.5" strokeDasharray="4,2" />
              <polyline points="35,70 55,65 75,55 95,60 115,50 135,52 155,48 175,55 195,45 215,50 235,42 255,48 275,45" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" />
              <polygon points="35,85 55,75 75,60 95,52 115,40 135,35 155,30 175,28 195,32 215,25 235,20 255,18 275,22 275,110 35,110" fill="#1a9e8f" opacity="0.08" />
              {['Mar','May','Jul','Sep','Nov','Jan'].map((m,i) => (
                <text key={m} x={35+i*48} y="118" fill="#9fd8d0" fontSize="5.5">{m}</text>
              ))}
              {[85,75,60,52,40,35,30,28,32,25,20,18,22].map((y,i) => (
                <circle key={`d${i}`} cx={35+i*20} cy={y} r="2" fill="#1a9e8f" />
              ))}
              <line x1="60" y1="5" x2="72" y2="5" stroke="#1a9e8f" strokeWidth="2" />
              <text x="74" y="7" fill="#9fd8d0" fontSize="5">Actual</text>
              <line x1="110" y1="5" x2="122" y2="5" stroke="#4ab8ae" strokeWidth="1.5" strokeDasharray="3,1" />
              <text x="124" y="7" fill="#9fd8d0" fontSize="5">Forecast</text>
              <line x1="160" y1="5" x2="172" y2="5" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,1" />
              <text x="174" y="7" fill="#9fd8d0" fontSize="5">Bias %</text>
            </svg>
          </div>
        </div>

        {/* ABC/XYZ Matrix */}
        <div className="bg-navy-deep rounded-lg p-4 border border-navy-mid">
          <div className="text-xs font-bold text-white mb-1">ABC/XYZ Demand Segmentation Matrix</div>
          <div className="text-[8px] text-teal-muted mb-3">Recommended planning method per segment — CoV = demand variability</div>
          <div className="grid grid-cols-4 gap-1 md:gap-1.5 text-center overflow-x-auto">
            <div />
            <div className="text-[8px] text-teal-muted font-semibold py-1">X — Stable</div>
            <div className="text-[8px] text-teal-muted font-semibold py-1">Y — Variable</div>
            <div className="text-[8px] text-teal-muted font-semibold py-1">Z — Erratic</div>
            {[
              { row: 'A (High)', cells: [
                { n: 84, method: 'MRP/Min-Max', cov: '0.15' },
                { n: 67, method: 'Forecast + Safety', cov: '0.35' },
                { n: 34, method: 'Judgmental/Causal', cov: '0.65' },
              ]},
              { row: 'B (Med)', cells: [
                { n: 96, method: 'MRP/Min-Max', cov: '0.18' },
                { n: 118, method: 'Forecast + Safety', cov: '0.42' },
                { n: 72, method: 'Judgmental', cov: '0.78' },
              ]},
              { row: 'C (Low)', cells: [
                { n: 89, method: 'MRP/Min-Max', cov: '0.22' },
                { n: 156, method: 'Simple Exponential', cov: '0.55' },
                { n: 126, method: 'Judgmental', cov: '0.88' },
              ]},
            ].map(r => (
              <div key={r.row} className="contents">
                <div className="text-[8px] text-teal-muted font-semibold flex items-center justify-center">{r.row}</div>
                {r.cells.map((c, i) => (
                  <div key={`${r.row}-${i}`} className="bg-navy rounded-md p-2 border border-navy-mid">
                    <div className="text-lg font-bold text-white">{c.n}</div>
                    <div className="text-[7px] text-teal-muted">SKUs</div>
                    <div className="text-[7px] text-teal-light mt-1">{c.method}</div>
                    <div className="text-[6px] text-teal-muted">CoV: {c.cov}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'inventory',
    label: 'Inventory Matrix',
    desc: 'Automated ABC/XYZ segmentation, safety stock optimization, stockout risk scoring and working capital targets.',
    chart: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'INVENTORY VALUE', value: 'CHF 12.4M', sub: 'Target: CHF 9.8M', color: 'text-yellow-400' },
            { label: 'WEEKS OF COVER', value: '8.2', sub: 'Target: 6.0 weeks', color: 'text-red-400' },
            { label: 'STOCKOUT RATE', value: '4.7%', sub: 'Target: <2%', color: 'text-red-400' },
            { label: 'EXCESS & OBSOLETE', value: 'CHF 1.8M', sub: '14.5% of total inventory', color: 'text-yellow-400' },
          ].map(k => (
            <div key={k.label} className="bg-navy-deep rounded-lg p-3 border border-navy-mid">
              <div className="text-[8px] text-teal-muted uppercase tracking-wide mb-1">{k.label}</div>
              <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
              <div className="text-[8px] text-teal-muted mt-0.5">{k.sub}</div>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-teal/20 to-navy-deep rounded-lg p-4 border border-teal/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="text-[9px] text-teal-light uppercase tracking-widest">Working Capital Release Potential</div>
            <div className="text-2xl font-bold text-white">CHF 2.6M</div>
            <div className="text-[9px] text-teal-muted">through safety stock and reorder optimization</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-teal-muted">Service level improvement</div>
            <div className="text-xl font-bold text-teal">+3.2 pp</div>
            <div className="text-[9px] text-teal-muted">with lower inventory</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-navy-deep rounded-lg p-4 border border-navy-mid">
            <div className="text-xs font-bold text-white mb-1">Inventory Value by Category</div>
            <div className="text-[8px] text-teal-muted mb-3">CHF millions — current vs target</div>
            <div className="space-y-2">
              {[
                { name: 'Raw Materials', cur: 3.8, tgt: 2.9 },
                { name: 'WIP', cur: 2.1, tgt: 1.8 },
                { name: 'Finished Goods', cur: 4.2, tgt: 3.4 },
                { name: 'Spare Parts', cur: 1.2, tgt: 0.9 },
                { name: 'Excess/Obsolete', cur: 1.1, tgt: 0.4 },
              ].map(b => (
                <div key={b.name}>
                  <div className="flex justify-between text-[7px] text-teal-muted mb-0.5">
                    <span>{b.name}</span>
                    <span>{b.cur}M / {b.tgt}M</span>
                  </div>
                  <div className="flex gap-0.5 h-3">
                    <div className="h-full rounded-sm bg-teal/70" style={{ width: `${(b.cur/5)*100}%` }} />
                    <div className="h-full rounded-sm border border-dashed border-teal/40" style={{ width: `${(b.tgt/5)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-navy-deep rounded-lg p-4 border border-navy-mid">
            <div className="text-xs font-bold text-white mb-1">Weeks of Cover Distribution</div>
            <div className="text-[8px] text-teal-muted mb-3">SKU count by weeks of stock</div>
            <svg viewBox="0 0 260 110" className="w-full">
              {[0,1,2].map(i => (
                <line key={`g${i}`} x1="25" y1={10+i*35} x2="255" y2={10+i*35} stroke="#1a3a5c" strokeWidth="0.5" />
              ))}
              {['0-2','2-4','4-6','6-8','8-10','10-12','12-16','16+'].map((l,i) => {
                const heights = [25, 45, 65, 55, 35, 30, 20, 15]
                const colors = ['#ef4444','#d97706','#1a9e8f','#1a9e8f','#d97706','#d97706','#ef4444','#ef4444']
                return (
                  <g key={l}>
                    <rect x={30+i*28} y={85-heights[i]} width="22" height={heights[i]} rx="2" fill={colors[i]} opacity="0.7" />
                    <text x={41+i*28} y="96" fill="#9fd8d0" fontSize="5" textAnchor="middle">{l}</text>
                  </g>
                )
              })}
              <text x="140" y="106" fill="#9fd8d0" fontSize="5" textAnchor="middle">Weeks of Cover</text>
            </svg>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'risk',
    label: 'Supply Risk',
    desc: 'Real-time supplier concentration scoring, automated risk heat maps, tier 1+2 visibility and mitigation paths.',
    chart: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'SINGLE-SOURCE SKUs', value: '23%', sub: '194 of 842 SKUs', color: 'text-red-400' },
            { label: 'AVG LEAD TIME', value: '47 days', sub: 'Target: <30 days', color: 'text-yellow-400' },
            { label: 'SUPPLIER RISK SCORE', value: '6.8/10', sub: 'High concentration', color: 'text-red-400' },
            { label: 'ON-TIME DELIVERY', value: '78%', sub: 'Target: 95%', color: 'text-yellow-400' },
          ].map(k => (
            <div key={k.label} className="bg-navy-deep rounded-lg p-3 border border-navy-mid">
              <div className="text-[8px] text-teal-muted uppercase tracking-wide mb-1">{k.label}</div>
              <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
              <div className="text-[8px] text-teal-muted mt-0.5">{k.sub}</div>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-red-500/20 to-navy-deep rounded-lg p-4 border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="text-[9px] text-red-300 uppercase tracking-widest">Revenue at Risk from Supply Disruption</div>
            <div className="text-2xl font-bold text-white">CHF 4.2M</div>
            <div className="text-[9px] text-teal-muted">based on current supplier concentration</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-teal-muted">Mitigation cost to dual-source</div>
            <div className="text-xl font-bold text-teal">CHF 180K</div>
            <div className="text-[9px] text-teal-muted">23:1 risk-to-cost ratio</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-navy-deep rounded-lg p-4 border border-navy-mid">
            <div className="text-xs font-bold text-white mb-1">Risk Heat Map</div>
            <div className="text-[8px] text-teal-muted mb-3">Impact vs Probability — bubble size = revenue exposure</div>
            <svg viewBox="0 0 220 140" className="w-full">
              {[0,1,2,3].map(i => (
                <line key={`h${i}`} x1="25" y1={10+i*35} x2="215" y2={10+i*35} stroke="#1a3a5c" strokeWidth="0.5" />
              ))}
              {[0,1,2,3].map(i => (
                <line key={`v${i}`} x1={25+i*63} y1="10" x2={25+i*63} y2="115" stroke="#1a3a5c" strokeWidth="0.5" />
              ))}
              <circle cx="60" cy="95" r="10" fill="#1a9e8f" opacity="0.7" />
              <text x="60" y="98" fill="#fff" fontSize="5" textAnchor="middle">Low</text>
              <circle cx="110" cy="65" r="14" fill="#d97706" opacity="0.7" />
              <text x="110" y="68" fill="#fff" fontSize="5" textAnchor="middle">Medium</text>
              <circle cx="180" cy="30" r="18" fill="#ef4444" opacity="0.7" />
              <text x="180" y="28" fill="#fff" fontSize="5" textAnchor="middle">Single</text>
              <text x="180" y="35" fill="#fff" fontSize="5" textAnchor="middle">Source</text>
              <circle cx="150" cy="50" r="9" fill="#d97706" opacity="0.6" />
              <text x="150" y="53" fill="#fff" fontSize="4.5" textAnchor="middle">Geo</text>
              <circle cx="85" cy="35" r="7" fill="#1a9e8f" opacity="0.5" />
              <text x="85" y="38" fill="#fff" fontSize="4.5" textAnchor="middle">Dual</text>
              <circle cx="195" cy="80" r="12" fill="#ef4444" opacity="0.5" />
              <text x="195" y="83" fill="#fff" fontSize="5" textAnchor="middle">Lead</text>
              <text x="120" y="130" fill="#9fd8d0" fontSize="6" textAnchor="middle">Probability →</text>
              <text x="8" y="65" fill="#9fd8d0" fontSize="6" textAnchor="middle" transform="rotate(-90,8,65)">Impact →</text>
            </svg>
          </div>
          <div className="bg-navy-deep rounded-lg p-4 border border-navy-mid">
            <div className="text-xs font-bold text-white mb-1">Top Risk Suppliers</div>
            <div className="text-[8px] text-teal-muted mb-3">By revenue exposure</div>
            <div className="space-y-2">
              {[
                { name: 'ChemCorp Asia', risk: 'Critical', rev: '2.1M', score: 9.2, color: '#ef4444' },
                { name: 'PackSolutions DE', risk: 'High', rev: '1.4M', score: 7.8, color: '#ef4444' },
                { name: 'RawMat Turkey', risk: 'High', rev: '0.9M', score: 7.1, color: '#d97706' },
                { name: 'LogiParts PL', risk: 'Medium', rev: '0.6M', score: 5.4, color: '#d97706' },
                { name: 'BioBase CH', risk: 'Low', rev: '0.3M', score: 2.8, color: '#1a9e8f' },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-2 text-[8px]">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <div className="flex-1 text-white">{s.name}</div>
                  <div className="text-teal-muted">{s.rev}</div>
                  <div className="font-bold" style={{ color: s.color }}>{s.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'planning',
    label: 'S&OP Maturity',
    desc: 'AI-driven 8-dimension maturity assessment with radar profiling, gap identification and automated recommendations.',
    chart: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'OVERALL MATURITY', value: '2.4/5', sub: 'Industry avg: 3.1', color: 'text-yellow-400' },
            { label: 'WEAKEST DIMENSION', value: 'Analytics', sub: 'Score: 1.5/5', color: 'text-red-400' },
            { label: 'STRONGEST', value: 'Process', sub: 'Score: 3.8/5', color: 'text-teal' },
            { label: 'QUICK WINS', value: '6', sub: 'Implementable in <4 weeks', color: 'text-teal' },
          ].map(k => (
            <div key={k.label} className="bg-navy-deep rounded-lg p-3 border border-navy-mid">
              <div className="text-[8px] text-teal-muted uppercase tracking-wide mb-1">{k.label}</div>
              <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
              <div className="text-[8px] text-teal-muted mt-0.5">{k.sub}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-navy-deep rounded-lg p-4 border border-navy-mid">
            <div className="text-xs font-bold text-white mb-1">Maturity Radar Profile</div>
            <div className="text-[8px] text-teal-muted mb-2">Current vs Target across 8 dimensions</div>
            <svg viewBox="0 0 240 200" className="w-full">
              <circle cx="120" cy="100" r="80" fill="none" stroke="#1a3a5c" strokeWidth="0.5" />
              <circle cx="120" cy="100" r="60" fill="none" stroke="#1a3a5c" strokeWidth="0.5" />
              <circle cx="120" cy="100" r="40" fill="none" stroke="#1a3a5c" strokeWidth="0.5" />
              <circle cx="120" cy="100" r="20" fill="none" stroke="#1a3a5c" strokeWidth="0.5" />
              {[0,1,2,3,4,5,6,7].map(i => {
                const angle = (i * 45 - 90) * Math.PI / 180
                return <line key={`a${i}`} x1="120" y1="100" x2={120 + 80 * Math.cos(angle)} y2={100 + 80 * Math.sin(angle)} stroke="#1a3a5c" strokeWidth="0.5" />
              })}
              <polygon points="120,35 165,55 180,100 160,140 120,150 80,135 60,95 80,50" fill="#1a9e8f" opacity="0.25" stroke="#1a9e8f" strokeWidth="2" />
              <polygon points="120,25 178,48 190,100 175,148 120,160 68,142 55,95 72,40" fill="none" stroke="#4ab8ae" strokeWidth="1" strokeDasharray="4,3" />
              <text x="120" y="12" fill="#9fd8d0" fontSize="7" textAnchor="middle">Governance</text>
              <text x="198" y="50" fill="#9fd8d0" fontSize="7" textAnchor="start">Demand</text>
              <text x="200" y="103" fill="#9fd8d0" fontSize="7" textAnchor="start">Supply</text>
              <text x="180" y="158" fill="#9fd8d0" fontSize="7" textAnchor="start">Inventory</text>
              <text x="120" y="178" fill="#9fd8d0" fontSize="7" textAnchor="middle">Analytics</text>
              <text x="42" y="158" fill="#9fd8d0" fontSize="7" textAnchor="end">KPIs</text>
              <text x="40" y="103" fill="#9fd8d0" fontSize="7" textAnchor="end">Technology</text>
              <text x="50" y="50" fill="#9fd8d0" fontSize="7" textAnchor="end">Process</text>
              <line x1="50" y1="192" x2="62" y2="192" stroke="#1a9e8f" strokeWidth="2" />
              <text x="65" y="194" fill="#9fd8d0" fontSize="6">Current</text>
              <line x1="110" y1="192" x2="122" y2="192" stroke="#4ab8ae" strokeWidth="1" strokeDasharray="3,2" />
              <text x="125" y="194" fill="#9fd8d0" fontSize="6">Target</text>
            </svg>
          </div>
          <div className="bg-navy-deep rounded-lg p-4 border border-navy-mid">
            <div className="text-xs font-bold text-white mb-1">Dimension Scores</div>
            <div className="text-[8px] text-teal-muted mb-3">Current score / 5.0 with gap to target</div>
            <div className="space-y-2">
              {[
                { dim: 'Governance', score: 2.8, target: 4.0 },
                { dim: 'Demand Planning', score: 2.2, target: 3.8 },
                { dim: 'Supply Planning', score: 2.5, target: 4.0 },
                { dim: 'Inventory Mgmt', score: 2.0, target: 3.5 },
                { dim: 'Analytics & Data', score: 1.5, target: 4.2 },
                { dim: 'KPI Framework', score: 2.1, target: 3.8 },
                { dim: 'Technology', score: 2.8, target: 4.0 },
                { dim: 'Process Maturity', score: 3.8, target: 4.5 },
              ].map(d => (
                <div key={d.dim}>
                  <div className="flex justify-between text-[7px] mb-0.5">
                    <span className="text-teal-muted">{d.dim}</span>
                    <span className="text-white font-bold">{d.score} <span className="text-teal-muted font-normal">/ {d.target}</span></span>
                  </div>
                  <div className="h-2 bg-navy rounded-full overflow-hidden relative">
                    <div className="h-full rounded-full bg-teal" style={{ width: `${(d.score/5)*100}%` }} />
                    <div className="absolute top-0 h-full w-0.5 bg-teal-light/50" style={{ left: `${(d.target/5)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export function DashboardShowcase() {
  const [active, setActive] = useState('demand')
  const current = dashboards.find(d => d.id === active)!

  return (
    <section id="dashboards" className="py-16 px-6 md:py-24 md:px-8 bg-navy-deep">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal-light uppercase mb-4">AI Decision Engines</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-4 leading-tight">
          See our AI engines<br />in action.
        </h2>
        <p className="text-base text-teal-muted leading-relaxed max-w-xl mb-10 md:mb-14">
          Live dashboards that deliver decisions — not reports. Each engine is AI-powered and built for execution.
        </p>

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

        <div className="bg-navy rounded-lg border border-navy-mid overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-3 border-b border-navy-mid bg-navy-deep">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <span className="text-teal-muted text-xs">OpsFlow · {current.label} Engine</span>
          </div>
          <div className="p-5 md:p-8">
            {current.chart}
          </div>
        </div>

        <p className="text-teal-muted text-sm mt-4 leading-relaxed">{current.desc}</p>

        <div className="mt-8 text-center">
          <a href="/diagnostic" className="bg-teal text-white px-8 py-4 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline inline-block">
            Try the S&OP Maturity Engine live →
          </a>
        </div>
      </div>
    </section>
  )
}
