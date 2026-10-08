'use client'

// Animated header cards of the service pages (ported from paginas_v1/service_*.html, 07/10/2026).
// All data is illustrative and labeled as such. With prefers-reduced-motion the final frame is drawn once.

import { useEffect, useRef } from 'react'

const NS = 'http://www.w3.org/2000/svg'
const mk = (n: string, a: Record<string, string | number>) => {
  const e = document.createElementNS(NS, n)
  for (const k in a) e.setAttribute(k, String(a[k]))
  return e
}
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Runs `frame(now)` every animation frame (or once, reduced motion); stops when unmounted or off screen. */
function useLoop(setup: () => ((now: number) => void) | undefined, root: React.RefObject<Element>) {
  useEffect(() => {
    const frame = setup()
    if (!frame) return
    const RM = reduced()
    let raf = 0
    let visible = true
    let alive = true
    const tick = (now: number) => {
      if (!alive) return
      frame(now)
      if (!RM && visible) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    let io: IntersectionObserver | undefined
    if (!RM && root.current && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => {
        const was = visible
        visible = e.isIntersecting
        if (visible && !was) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick) }
      })
      io.observe(root.current)
    }
    return () => { alive = false; cancelAnimationFrame(raf); io?.disconnect() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/* ───────── S&OP: the monthly cycle ───────── */
function SopCycle() {
  const root = useRef<HTMLDivElement>(null)
  const arc = useRef<SVGCircleElement>(null)
  const dot = useRef<SVGCircleElement>(null)
  const wk = useRef<SVGTextElement>(null)
  const list = useRef<HTMLOListElement>(null)
  useLoop(() => {
    const RM = reduced()
    const li = Array.from(list.current!.querySelectorAll('li'))
    const C = 2 * Math.PI * 64
    const t0 = performance.now()
    return (now) => {
      const P = 8000, k = RM ? 0.999 : ((now - t0) % P) / P
      arc.current!.setAttribute('stroke-dasharray', `${C * k} ${C}`)
      const a = -Math.PI / 2 + 2 * Math.PI * k
      dot.current!.setAttribute('cx', String(85 + 64 * Math.cos(a)))
      dot.current!.setAttribute('cy', String(85 + 64 * Math.sin(a)))
      const w = Math.min(3, Math.floor(k * 4))
      wk.current!.textContent = 'WEEK ' + (w + 1)
      li.forEach((l, i) => { l.classList.toggle('on', i < w); l.classList.toggle('now', i === w) })
    }
  }, root)
  return (
    <div ref={root}>
      <h4>The monthly cycle we set up</h4>
      <div className="cyc">
        <svg viewBox="0 0 170 170" aria-hidden="true">
          <circle cx="85" cy="85" r="64" fill="none" stroke="#163a46" strokeWidth="18" />
          <circle ref={arc} cx="85" cy="85" r="64" fill="none" stroke="#2fd3bd" strokeWidth="18" strokeDasharray="0 402" transform="rotate(-90 85 85)" />
          <circle ref={dot} r="6" fill="#ffb547" cx="85" cy="21" />
          <text x="85" y="82" textAnchor="middle" fontSize="20" fontWeight="700" fill="#eaf4f8">S&amp;OP</text>
          <text ref={wk} x="85" y="102" textAnchor="middle" fontSize="11" fill="#8fa6b6">MONTHLY CYCLE</text>
        </svg>
        <ol ref={list}>
          <li><b>1</b><div>Demand review<small>Sales and marketing agree on one demand plan</small></div></li>
          <li><b>2</b><div>Supply review<small>Capacity and constraints against it</small></div></li>
          <li><b>3</b><div>Pre-S&amp;OP<small>Gaps, scenarios, a recommendation</small></div></li>
          <li><b>4</b><div>Executive decision<small>Leadership decides; the plan holds</small></div></li>
        </ol>
      </div>
      <div className="note">ILLUSTRATIVE · THE CYCLE IS SIZED TO YOUR SCALE</div>
    </div>
  )
}

/* ───────── Inventory: stock cover settling on target ───────── */
function InventoryCover() {
  const root = useRef<HTMLDivElement>(null)
  const rows = useRef<SVGGElement>(null)
  useLoop(() => {
    const RM = reduced()
    const g = rows.current!
    g.replaceChildren()
    const R = [{ k: 'A', d: 'high value', ss: 30, st: 16 }, { k: 'B', d: 'medium value', ss: 24, st: -8 }, { k: 'C', d: 'long tail', ss: 22, st: -30 }]
    const X0 = 56, X1 = 350, H = 56, T0 = 18
    const P = R.map((r, i) => {
      const y = T0 + i * (H + 6)
      g.append(mk('rect', { x: X0, y, width: X1 - X0, height: H, rx: 6, fill: '#06162a', stroke: 'rgba(127,245,223,.12)' }))
      const tgt = y + r.ss - 9
      g.append(mk('rect', { x: X0, y: tgt - 5, width: X1 - X0, height: 9, fill: 'rgba(47,211,189,.16)' }))
      g.append(mk('line', { x1: X0, x2: X1, y1: y + r.ss, y2: y + r.ss, stroke: '#ffb547', 'stroke-width': 1.4, 'stroke-dasharray': '4 4' }))
      const lab = mk('text', { x: 0, y: y + 24, 'font-size': 20, 'font-weight': 700, fill: '#eaf4f8' }); lab.textContent = r.k; g.append(lab)
      const sub = mk('text', { x: 0, y: y + 40, 'font-size': 10, fill: '#8fa6b6' }); sub.textContent = r.d; g.append(sub)
      const p = mk('path', { fill: 'none', stroke: '#2fd3bd', 'stroke-width': 2.2, 'stroke-linecap': 'round' }); g.append(p)
      const d = mk('circle', { r: 3.6, fill: '#7ff5df' }); g.append(d)
      const s = mk('text', { x: 0, y: y + 53, 'font-size': 9.5, 'font-weight': 600, fill: '#8fa6b6' }); g.append(s)
      return { r, y, tgt, p, d, s }
    })
    const L = 9000, t0 = performance.now()
    return (now) => {
      const k = RM ? 1 : Math.min(1, ((now - t0) % L) / (L * 0.75))
      P.forEach((o, i) => {
        const pts: string[] = []
        const n = Math.max(2, Math.round(k * 60))
        let yy = 0
        for (let j = 0; j <= n; j++) {
          const u = j / 60
          yy = o.tgt + o.r.st * Math.exp(-4.2 * u) + 3 * Math.sin(u * 22 + i) * Math.exp(-2.5 * u)
          pts.push((X0 + (X1 - X0) * u).toFixed(1) + ',' + yy.toFixed(1))
        }
        o.p.setAttribute('d', 'M' + pts.join('L'))
        const last = pts[pts.length - 1].split(',')
        o.d.setAttribute('cx', last[0]); o.d.setAttribute('cy', last[1])
        const dev = yy - o.tgt, below = yy > o.y + o.r.ss
        o.s.textContent = below ? 'below safety' : dev < -6 ? 'overstock' : 'on target'
        o.s.setAttribute('fill', below ? '#ffb547' : dev < -6 ? '#8fa6b6' : '#2fd3bd')
        o.p.setAttribute('stroke', below ? '#ffb547' : '#2fd3bd')
      })
    }
  }, root)
  return (
    <div ref={root}>
      <h4>Stock cover settling on target, by segment</h4>
      <div className="viz">
        <svg viewBox="0 0 360 206" role="img" aria-label="Illustrative chart: stock cover in days settling toward the safety stock line for segments A, B and C">
          <text x="350" y="10" textAnchor="end" fontSize="10" fill="#6b8597" letterSpacing=".06em">DAYS OF COVER</text>
          <g ref={rows} />
          <text x="56" y="204" fontSize="10" fill="#6b8597">Week 1</text>
          <text x="350" y="204" textAnchor="end" fontSize="10" fill="#6b8597">Week 12</text>
        </svg>
      </div>
      <div className="lg"><span><i />Stock cover (days)</span><span><i className="d" />Safety stock</span><span><i className="s" style={{ background: 'rgba(47,211,189,.18)' }} />Target band</span></div>
      <div className="note">ILLUSTRATIVE · SAFETY STOCK CALCULATED PER SKU, NOT A FLAT BUFFER</div>
    </div>
  )
}

/* ───────── Risk: a single dependency made visible ───────── */
function RiskMap() {
  const root = useRef<HTMLDivElement>(null)
  const r = {
    lk1: useRef<SVGPathElement>(null), lk2: useRef<SVGPathElement>(null), lk3: useRef<SVGPathElement>(null),
    s4: useRef<SVGRectElement>(null), s5: useRef<SVGGElement>(null), mc: useRef<SVGRectElement>(null),
    halo: useRef<SVGCircleElement>(null), lab: useRef<HTMLElement>(null),
  }
  useLoop(() => {
    const RM = reduced()
    const A = '#ffb547', T = '#2fd3bd', L = 9000, t0 = performance.now()
    return (now) => {
      const k = RM ? 1 : ((now - t0) % L) / L
      const dual = k > 0.55
      const grow = Math.max(0, Math.min(1, (k - 0.35) / 0.2))
      r.s5.current!.setAttribute('opacity', grow.toFixed(2))
      r.lk2.current!.setAttribute('stroke-dashoffset', (120 * (1 - grow)).toFixed(1))
      const c = dual ? T : A
      r.lk1.current!.setAttribute('stroke', c); r.lk3.current!.setAttribute('stroke', c); r.mc.current!.setAttribute('stroke', c)
      r.s4.current!.setAttribute('stroke', dual ? '#2c5566' : A)
      const pr = dual ? 0 : (Math.sin(now / 260) + 1) / 2
      r.halo.current!.setAttribute('r', (26 + 8 * pr).toFixed(1))
      r.halo.current!.setAttribute('opacity', dual ? '0' : (0.6 - 0.5 * pr).toFixed(2))
      const lb = r.lab.current!
      lb.textContent = dual ? 'dual-sourced, a second supplier is qualified' : 'single-source, operations stop if Supplier 4 fails'
      lb.classList.toggle('ok', dual)
    }
  }, root)
  const box = (x: number, y: number, label: string, ref?: React.Ref<SVGRectElement>, stroke = '#2c5566') => (
    <g><rect ref={ref} x={x} y={y} width="68" height="22" rx="6" fill="#06162a" stroke={stroke} /><text x={x + 34} y={y + 15} textAnchor="middle">{label}</text></g>
  )
  return (
    <div ref={root}>
      <h4>One silent single dependency, made visible</h4>
      <div className="viz">
        <svg viewBox="0 0 360 214" role="img" aria-label="Illustrative dependency map: a single-sourced material shown in amber becomes dual-sourced">
          <g fontSize="10" fill="#6b8597" letterSpacing=".06em"><text x="8" y="12">SUPPLIERS</text><text x="195" y="12" textAnchor="middle">INPUTS</text><text x="352" y="12" textAnchor="end">OPERATIONS</text></g>
          <g fill="none" strokeWidth="1.6">
            <path d="M74 40 C110 40,120 56,150 56" stroke="#2c5566" /><path d="M74 82 C110 82,120 56,150 56" stroke="#2c5566" />
            <path d="M74 82 C110 82,120 108,150 108" stroke="#2c5566" /><path d="M74 124 C110 124,120 108,150 108" stroke="#2c5566" />
            <path ref={r.lk1} d="M74 166 C110 166,120 160,150 160" stroke="#ffb547" strokeWidth="2.2" />
            <path ref={r.lk2} d="M74 202 C110 202,120 160,150 160" stroke="#2fd3bd" strokeWidth="2.2" strokeDasharray="120" strokeDashoffset="120" />
            <path d="M240 56 C270 56,276 108,300 108" stroke="#2c5566" /><path d="M240 108 L300 108" stroke="#2c5566" />
            <path ref={r.lk3} d="M240 160 C270 160,276 108,300 108" stroke="#ffb547" strokeWidth="2.2" />
          </g>
          <g fontSize="11" fill="#c6d5de">
            {box(6, 29, 'Supplier 1')}{box(6, 71, 'Supplier 2')}{box(6, 113, 'Supplier 3')}{box(6, 155, 'Supplier 4', r.s4, '#ffb547')}
            <g ref={r.s5} opacity="0"><rect x="6" y="191" width="68" height="22" rx="6" fill="#06162a" stroke="#2fd3bd" /><text x="40" y="206" textAnchor="middle" fill="#7ff5df">Supplier 5</text></g>
            <g><rect x="150" y="44" width="90" height="24" rx="6" fill="#0b2233" stroke="#2c5566" /><text x="195" y="60" textAnchor="middle">Component A</text></g>
            <g><rect x="150" y="96" width="90" height="24" rx="6" fill="#0b2233" stroke="#2c5566" /><text x="195" y="112" textAnchor="middle">Component B</text></g>
            <g><rect ref={r.mc} x="150" y="148" width="90" height="24" rx="6" fill="#0b2233" stroke="#ffb547" strokeWidth="1.8" /><text x="195" y="164" textAnchor="middle" fill="#eaf4f8">Material C</text></g>
            <circle ref={r.halo} cx="195" cy="160" r="30" fill="none" stroke="#ffb547" strokeWidth="1.5" opacity=".5" />
            <g><rect x="300" y="92" width="54" height="32" rx="8" fill="#0d2a33" stroke="#2fd3bd" /><text x="327" y="105" textAnchor="middle" fontSize="10">Your</text><text x="327" y="118" textAnchor="middle" fontSize="10">plant</text></g>
          </g>
        </svg>
      </div>
      <div className="vstatus">Material C: <b ref={r.lab}>single-source, operations stop if Supplier 4 fails</b></div>
      <div className="note">ILLUSTRATIVE · DUAL SOURCING IS ONE COUNTERMEASURE AMONG SEVERAL</div>
    </div>
  )
}

/* ───────── Distribution: cost-to-serve by channel ───────── */
function DistributionBars() {
  const root = useRef<HTMLDivElement>(null)
  const bars = useRef<SVGGElement>(null)
  const avg = useRef<SVGLineElement>(null)
  const avgt = useRef<SVGTextElement>(null)
  useLoop(() => {
    const RM = reduced()
    const g = bars.current!
    g.replaceChildren()
    const C = [{ n: 'Store network', v: [0.22, 0.16, 0.12] }, { n: 'Regional depots', v: [0.18, 0.14, 0.08] }, { n: 'Key accounts', v: [0.14, 0.1, 0.1] }, { n: 'Small customers', v: [0.42, 0.2, 0.24], hot: 1 }]
    const X0 = 118, W = 232, COL = ['#2fd3bd', '#1f8f86', '#3b6b80'], HOT = ['#ffb547', '#d9902a', '#a8742d']
    const tot = C.map((c) => c.v.reduce((a, b) => a + b, 0)), mean = tot.reduce((a, b) => a + b, 0) / tot.length, mx = Math.max(...tot)
    const B = C.map((c, i) => {
      const y = 26 + i * 38
      const t = mk('text', { x: 0, y: y + 17, 'font-size': 11.5, fill: c.hot ? '#eaf4f8' : '#c6d5de' }); t.textContent = c.n; g.append(t)
      g.append(mk('rect', { x: X0, y, width: W, height: 24, rx: 5, fill: '#06162a' }))
      const r = c.v.map((_v, j) => { const e = mk('rect', { x: X0, y, width: 0, height: 24, fill: (c.hot ? HOT : COL)[j] }); g.append(e); return e })
      return { c, r }
    })
    const ax = X0 + (W * mean) / mx
    avg.current!.setAttribute('x1', String(ax)); avg.current!.setAttribute('x2', String(ax)); avgt.current!.setAttribute('x', String(ax))
    const L = 8000, t0 = performance.now(), ease = (u: number) => 1 - Math.pow(1 - u, 3)
    return (now) => {
      const k = RM ? 1 : ((now - t0) % L) / L
      B.forEach((b, i) => {
        const u = ease(Math.max(0, Math.min(1, (k - i * 0.08) / 0.35)))
        let x = X0
        b.c.v.forEach((v, j) => { const w = ((W * v) / mx) * u; b.r[j].setAttribute('x', x.toFixed(1)); b.r[j].setAttribute('width', Math.max(0, w - 1).toFixed(1)); x += w })
        if (b.c.hot && !RM) { const pulse = k > 0.5 ? 0.75 + 0.25 * Math.sin(now / 240) : 1; b.r.forEach((e) => e.setAttribute('opacity', pulse.toFixed(2))) }
      })
    }
  }, root)
  return (
    <div ref={root}>
      <h4>Cost-to-serve by channel</h4>
      <div className="viz">
        <svg viewBox="0 0 360 196" role="img" aria-label="Illustrative chart: cost-to-serve by channel, one channel in amber above the average">
          <text x="352" y="12" textAnchor="end" fontSize="10" fill="#6b8597" letterSpacing=".06em">COST-TO-SERVE PER ORDER</text>
          <g ref={bars} />
          <line ref={avg} x1="0" x2="0" y1="22" y2="178" stroke="#8fa6b6" strokeWidth="1" strokeDasharray="3 4" />
          <text ref={avgt} x="0" y="192" textAnchor="middle" fontSize="10" fill="#8fa6b6">Average</text>
        </svg>
      </div>
      <div className="lg"><span><i className="s" style={{ background: '#2fd3bd' }} />Transport</span><span><i className="s" style={{ background: '#1f8f86' }} />Stock</span><span><i className="s" style={{ background: '#3b6b80' }} />Handling</span></div>
      <div className="vstatus">Small customers: <b>cost-to-serve above average</b></div>
      <div className="note">ILLUSTRATIVE · THE COST AND SERVICE COMPROMISE, MADE VISIBLE</div>
    </div>
  )
}

/* ───────── Audit: the two-week Health Check ───────── */
function AuditTimeline() {
  const root = useRef<HTMLDivElement>(null)
  const ms = useRef<SVGGElement>(null)
  const prog = useRef<SVGLineElement>(null)
  const adot = useRef<SVGCircleElement>(null)
  const dayt = useRef<SVGTextElement>(null)
  const outs = useRef<SVGGElement>(null)
  useLoop(() => {
    const RM = reduced()
    const g = ms.current!
    g.replaceChildren()
    const X0 = 24, X1 = 336, xd = (d: number) => X0 + ((X1 - X0) * (d - 1)) / 13
    const M = [{ d: 1, a: 'Day 1', b: 'Data and', c: 'interviews', an: 'start' }, { d: 7, a: 'Day 7', b: 'Figures meet', c: 'the shop floor', an: 'middle' }, { d: 14, a: 'Day 14', b: 'Debrief to', c: 'leadership', an: 'end' }]
    const N = M.map((m) => {
      const x = xd(m.d)
      const c = mk('circle', { cx: x, cy: 52, r: 9, fill: '#04101c', stroke: '#3b5466', 'stroke-width': 2 }); g.append(c)
      const tx = m.an === 'start' ? X0 - 14 : m.an === 'end' ? X1 + 14 : x
      ;([[m.a, 80, 12, '#eaf4f8', 700], [m.b, 97, 11, '#8fa6b6', 400], [m.c, 111, 11, '#8fa6b6', 400]] as [string, number, number, string, number][]).forEach(([s, y, fs, fl, fw]) => {
        const e = mk('text', { x: tx, y, 'text-anchor': m.an, 'font-size': fs, fill: fl, 'font-weight': fw }); e.textContent = s; g.append(e)
      })
      return { m, c }
    })
    const O = Array.from(outs.current!.querySelectorAll('rect'))
    const L = 9000, t0 = performance.now()
    return (now) => {
      const k = RM ? 1 : Math.min(1, ((now - t0) % L) / (L * 0.7))
      const day = 1 + 13 * k, x = xd(day)
      prog.current!.setAttribute('x2', x.toFixed(1)); adot.current!.setAttribute('cx', x.toFixed(1))
      dayt.current!.textContent = 'DAY ' + Math.floor(day + 0.001)
      N.forEach((n) => { const on = day >= n.m.d - 0.01; n.c.setAttribute('fill', on ? '#2fd3bd' : '#04101c'); n.c.setAttribute('stroke', on ? '#2fd3bd' : '#3b5466') })
      const done = day >= 13.99
      O.forEach((r) => { r.setAttribute('stroke', done ? '#2fd3bd' : '#2c5566'); r.setAttribute('fill', done ? '#0d2a33' : '#06162a') })
    }
  }, root)
  return (
    <div ref={root}>
      <h4>The Supply Chain Health Check, in two weeks</h4>
      <div className="viz">
        <svg viewBox="0 0 360 200" role="img" aria-label="Illustrative two-week timeline: day 1, day 7 and day 14, ending with the top 3 priorities by P&L and a 90-day plan">
          <text x="8" y="14" fontSize="10" fill="#6b8597" letterSpacing=".06em">TWO WEEKS, FIXED PRICE</text>
          <text ref={dayt} x="352" y="14" textAnchor="end" fontSize="11" fontWeight="700" fill="#ffb547" letterSpacing=".06em">DAY 1</text>
          <line x1="24" x2="336" y1="52" y2="52" stroke="#163a46" strokeWidth="6" strokeLinecap="round" />
          <line ref={prog} x1="24" x2="24" y1="52" y2="52" stroke="#2fd3bd" strokeWidth="6" strokeLinecap="round" />
          <g ref={ms} />
          <circle ref={adot} cx="24" cy="52" r="7" fill="#ffb547" stroke="#04101c" strokeWidth="2" />
          <g ref={outs}>
            <g><rect x="8" y="132" width="168" height="56" rx="10" fill="#06162a" stroke="#2c5566" /><text x="22" y="156" fontSize="12.5" fontWeight="700" fill="#eaf4f8">Top 3 priorities</text><text x="22" y="174" fontSize="11" fill="#8fa6b6">ranked by P&amp;L impact</text></g>
            <g><rect x="184" y="132" width="168" height="56" rx="10" fill="#06162a" stroke="#2c5566" /><text x="198" y="156" fontSize="12.5" fontWeight="700" fill="#eaf4f8">90-day plan</text><text x="198" y="174" fontSize="11" fill="#8fa6b6">plus an executive summary</text></g>
          </g>
        </svg>
      </div>
      <div className="note">ILLUSTRATIVE · TWO WEEKS, FIXED PRICE</div>
    </div>
  )
}

const VIZ: Record<string, { label: string; C: () => JSX.Element }> = {
  's-op-consulting': { label: 'Illustration of the monthly S&OP cycle', C: SopCycle },
  'inventory-optimization': { label: 'Illustration: Stock cover settling on target, by segment', C: InventoryCover },
  'supply-chain-risk-management': { label: 'Illustration: One silent single dependency, made visible', C: RiskMap },
  'distribution-planning': { label: 'Illustration: Cost-to-serve by channel', C: DistributionBars },
  'supply-chain-audit': { label: 'Illustration: The Supply Chain Health Check, in two weeks', C: AuditTimeline },
}

export function ServiceViz({ slug }: { slug: string }) {
  const v = VIZ[slug]
  if (!v) return null
  const C = v.C
  return (
    <div className="pn" aria-label={v.label}>
      <C />
    </div>
  )
}
