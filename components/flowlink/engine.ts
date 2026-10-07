// Flow Link home: client-side choreography ported from the approved prototype (paginas_v1/home.html, v19).
// Everything here only animates markup that HomeFlowLink already renders on the server.
import LANE_PTS from './lanePts.json'

type Pt = number[]
type Lane = {
  p: SVGPathElement; len: number; kind: string; key: string; both: boolean
  w: number; wc: number; hiOn: number; next: number; hi: SVGPathElement | null
  a?: string; b?: string
}
type Dot = { c: SVGCircleElement; h: SVGCircleElement; ln: Lane; dir: number; v: number; s: number }
type Sys = {
  lanes: Lane[]; dots: Dot[]; both: boolean; speed: number; rate: number; active: boolean
  add: (d: string, kind: string, key?: string, dashed?: boolean, both?: boolean) => Lane
  seed: () => void
  step: (now: number, dt: number) => void
}
type HeroLane = { a: string; b: string; both: boolean; pts: Pt[] }
const LP = LANE_PTS as unknown as {
  LG: Pt[][]; LGA: Pt[][]; LCH: Record<'CH_EU2' | 'CH_EU' | 'CH_ME_A', Pt[]>; LH2: HeroLane[]; LHA2: HeroLane[]
}

const NS = 'http://www.w3.org/2000/svg'
const poly = (pts: Pt[]) => pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ')
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1)
const pad = (n: number) => String(n).padStart(2, '0')

/* illustrative, deterministic per node */
const NODE_DATA: Record<string, [string, number[], number[], number[], number, number]> = {
  'CU.B': ['Customer A', [112, 104, 96, 100, 106, 110], [108, 100, 98, 102, 104, 108], [52, 49, 45, 47, 50, 53], 95.1, 1.2],
  'CU.C': ['Customer B', [80, 88, 94, 90, 98, 104], [82, 86, 90, 92, 96, 100], [44, 41, 39, 43, 46, 48], 93.4, 0.8],
  'CU.D': ['Customer C', [60, 66, 70, 78, 84, 90], [62, 64, 70, 74, 80, 86], [38, 40, 42, 41, 44, 47], 96.0, 2.1],
  'F.1': ['Factory 1', [90, 96, 104, 110, 112, 118], [92, 94, 100, 106, 110, 114], [48, 52, 55, 53, 56, 58], 94.2, 1.5],
  'F.2': ['Factory 2', [84, 88, 86, 94, 100, 108], [86, 86, 88, 92, 98, 102], [46, 44, 47, 50, 49, 52], 91.8, -0.6],
  'DC.N': ['DC North', [100, 104, 110, 112, 116, 120], [98, 100, 106, 110, 114, 118], [50, 53, 56, 58, 57, 60], 95.6, 2.4],
  'DC.C': ['DC Central', [96, 100, 108, 114, 118, 122], [94, 96, 98, 100, 104, 108], [46, 42, 40, 38, 36, 34], 86.9, -4.1],
  'DC.S': ['DC South', [88, 92, 98, 100, 106, 110], [90, 92, 96, 100, 104, 108], [49, 51, 50, 53, 55, 56], 93.9, 1.1],
  'S.A': ['Supplier A', [70, 76, 84, 90, 96, 100], [72, 74, 80, 86, 92, 98], [42, 45, 48, 50, 52, 55], 92.3, 0.9],
  'S.B': ['Supplier B', [66, 70, 74, 80, 86, 92], [68, 70, 74, 78, 84, 90], [40, 43, 46, 47, 49, 52], 94.7, 1.7],
  'S.C': ['Supplier C', [74, 78, 80, 86, 92, 96], [70, 74, 78, 82, 88, 94], [44, 42, 45, 48, 50, 51], 90.5, -1.3],
  'S.D': ['Supplier D', [60, 64, 70, 74, 82, 88], [62, 62, 66, 70, 76, 84], [36, 38, 37, 40, 43, 46], 89.2, -2.2],
}
const BASE: [string, number[], number[], number[], number, number] = ['', [66, 74, 86, 96, 104, 112], [60, 66, 74, 82, 90, 98], [52, 49, 55, 57, 53, 58], 92.6, 3.7]
const EV = [
  ['Factory 1 · Gdansk', 'shipment released to Customer A'], ['DC Central · Lyon', 'delay risk flagged, rerouting'],
  ['Supplier B · Singapore', 'ASN sent, 2 containers'], ['Customer B · Paris', 'order confirmed for requested date'],
  ['DC South · Barcelona', 'picking wave started'], ['Supplier D · Istanbul', 'lead time updated, +2 days'],
  ['Factory 2 · Milan', 'capacity check passed'], ['Customer C · Zurich', 'delivery completed'],
  ['DC North · Rotterdam', 'cross-dock slot booked'], ['Supplier A · Shanghai', 'PO acknowledged'],
]

export function startFlowLink(root: HTMLElement, MOB: boolean, RM: boolean): () => void {
  let alive = true
  const cleanups: (() => void)[] = []
  const on = (t: EventTarget, ev: string, fn: EventListener, opts?: AddEventListenerOptions | boolean) => {
    t.addEventListener(ev, fn, opts)
    cleanups.push(() => t.removeEventListener(ev, fn, opts))
  }
  const created: Element[] = []
  const T = root.querySelector(MOB ? '.mob' : '.scene') as HTMLElement
  const $ = <E extends Element = HTMLElement>(id: string) => T.querySelector(`[data-id="${id}"]`) as unknown as E
  const el = <K extends keyof SVGElementTagNameMap>(t: K, a: Record<string, string | number>) => {
    const e = document.createElementNS(NS, t)
    for (const k in a) e.setAttribute(k, String(a[k]))
    created.push(e)
    return e
  }

  /* ---- convoy engine: dots run only on the traced tracks, sent in irregular groups of 1 to 6 ---- */
  const SYS: Sys[] = []
  function makeSystem(pg: Element, dg: Element, hg: Element | null, opts: { both?: boolean }): Sys {
    const sys = { lanes: [] as Lane[], dots: [] as Dot[], both: !!opts.both, speed: 1, rate: 1, active: true } as Sys
    sys.add = (d, kind, key, dashed, both) => {
      const p = el('path', { d })
      pg.appendChild(p)
      let hi: SVGPathElement | null = null
      if (hg) {
        hi = el('path', { d, fill: 'none', stroke: kind === 'a' ? '#FFB547' : '#7FF5DF', 'stroke-width': dashed ? 1.6 : 2.2, 'stroke-linecap': 'round', opacity: 0 })
        if (dashed) hi.setAttribute('stroke-dasharray', '5 7')
        hi.style.transition = 'opacity .7s'
        hg.appendChild(hi)
      }
      const lane: Lane = { p, len: p.getTotalLength(), kind, key: key || '', both: !!both, w: 1, wc: 1, hiOn: -1, next: performance.now() + Math.random() * 1800, hi }
      sys.lanes.push(lane)
      return lane
    }
    function spawn(ln: Lane, dir: number, v: number, s0: number) {
      const a = ln.kind === 'a'
      const h = el('circle', { r: a ? 7 : 6, fill: a ? '#FFB547' : '#7FF5DF', opacity: 0 })
      const c = el('circle', { r: a ? 2.8 : 2.5, fill: a ? '#FFD28A' : '#DFFFF8', opacity: 0 })
      dg.appendChild(h); dg.appendChild(c)
      sys.dots.push({ c, h, ln, dir, v, s: s0 })
    }
    function convoy(ln: Lane, s0: number) {
      const n = 1 + Math.floor(Math.pow(Math.random(), 1.5) * 6)
      const dir = (sys.both || ln.both) && Math.random() < 0.4 ? -1 : 1
      const v = (55 + Math.random() * 55) * sys.speed * (ln.kind === 'a' ? 1.15 : 1)
      for (let i = 0; i < n; i++) spawn(ln, dir, v, s0 - i * 15)
    }
    sys.seed = () => { if (RM) return; sys.lanes.forEach((ln) => { if (Math.random() < 0.8) convoy(ln, Math.random() * ln.len) }) }
    sys.step = (now, dt) => {
      for (const ln of sys.lanes) {
        ln.wc += (ln.w - ln.wc) * Math.min(1, dt * 3)
        if (!RM && sys.active && ln.w > 0.2 && now > ln.next) { convoy(ln, 0); ln.next = now + (650 + Math.random() * 3600) / (sys.rate * Math.max(0.3, ln.w)) }
      }
      for (let i = sys.dots.length - 1; i >= 0; i--) {
        const d = sys.dots[i]
        d.s += d.v * dt
        if (d.s > d.ln.len) { d.c.remove(); d.h.remove(); sys.dots.splice(i, 1); continue }
        if (d.s < 0 || !sys.active) continue
        const pt = d.ln.p.getPointAtLength(d.dir > 0 ? d.s : d.ln.len - d.s)
        const o = Math.min(1, d.ln.wc * 1.1)
        d.c.setAttribute('cx', String(pt.x)); d.c.setAttribute('cy', String(pt.y))
        d.h.setAttribute('cx', String(pt.x)); d.h.setAttribute('cy', String(pt.y))
        d.c.setAttribute('opacity', (0.98 * o).toFixed(2)); d.h.setAttribute('opacity', (0.22 * o).toFixed(2))
      }
    }
    SYS.push(sys)
    return sys
  }

  let prog = 0
  let frameFns: ((now: number, dt: number) => void)[] = []

  if (!MOB) {
    /* ---- fit the 1680x1080 stage to the viewport ---- */
    const stage = $('stage')
    let COVER = 1
    const fit = () => {
      const s = Math.min(innerWidth / 1680, innerHeight / 1080)
      stage.style.setProperty('--s', String(s))
      COVER = Math.min(1.22, Math.max(1, innerHeight / s / 944, innerWidth / s / 1680))
    }
    fit()

    /* hero map */
    const HS = makeSystem($('paths'), $('dots'), null, {})
    LP.LH2.forEach((o) => { const ln = HS.add(poly(o.pts), 't', '', false, o.both); ln.a = o.a; ln.b = o.b })
    LP.LHA2.forEach((o) => { const ln = HS.add(poly(o.pts), 'a'); ln.a = o.a; ln.b = o.b })
    HS.seed()

    /* hover a node: its lanes light up and the dashboards show that node */
    const yD = (v: number) => 130 - (v / 120) * 120, yS = (v: number) => 140 - ((v - 30) / 40) * 120
    const lineD = (vals: number[], xs: number[], yf: (v: number) => number) => vals.map((v, i) => (i ? 'L' : 'M') + xs[i] + ' ' + yf(v).toFixed(1)).join(' ')
    const XD = [30, 74, 118, 162, 206, 250], XS = [30, 82, 134, 186, 238, 290]
    const showNode = (k: string | null) => {
      const d = k ? NODE_DATA[k] : BASE
      const name = d[0]
      ;['whoD', 'whoS', 'whoO'].forEach((id) => { $(id).textContent = name ? '· ' + name : '' })
      const pd = $<SVGPathElement>('pDem'), ps = $<SVGPathElement>('pSup'), pc2 = $<SVGPathElement>('pSsc')
      ;[pd, ps, pc2].forEach((p) => { p.classList.remove('draw'); p.style.transition = 'd .6s ease' })
      pd.setAttribute('d', lineD(d[1], XD, yD)); ps.setAttribute('d', lineD(d[2], XD, yD)); pc2.setAttribute('d', lineD(d[3], XS, yS))
      $('sscDots').querySelectorAll('circle').forEach((c, i) => { c.setAttribute('cx', String(XS[i])); c.setAttribute('cy', String(yS(d[3][i]))) })
      const tO = $('tOtif')
      tO.textContent = d[4].toFixed(1) + '%'
      const g = $<SVGPathElement>('gauge')
      g.style.animation = 'none'
      g.setAttribute('stroke-dasharray', (236 * d[4]) / 100 + ' 472')
      const dl = $('tDelta')
      dl.textContent = (d[5] >= 0 ? '▲ ' : '▼ ') + Math.abs(d[5]).toFixed(1) + 'pp'
      dl.style.color = d[5] >= 0 ? 'var(--teal)' : 'var(--amber)'
      tO.setAttribute('fill', d[4] < 90 ? '#ffb547' : '#2fd3bd')
    }
    T.querySelectorAll<HTMLElement>('.lab[data-n]').forEach((l) => {
      const n = l.dataset.n as string
      on(l, 'mouseenter', () => {
        HS.lanes.forEach((ln) => { const o = ln.a === n || ln.b === n; ln.p.setAttribute('stroke-opacity', o ? '.85' : '0'); ln.w = o ? 1.6 : 0.35 })
        showNode(n)
      })
      on(l, 'mouseleave', () => {
        HS.lanes.forEach((ln) => { ln.p.setAttribute('stroke-opacity', '0'); ln.w = 1 })
        showNode(null)
      })
    })

    /* globe: lanes traced on the globe plate + the Swiss hub (Nyon) */
    const G: Record<string, number[]> = { NA: [326, 378], GL: [726, 262], IB: [671, 402], BR: [358, 618], BR2: [422, 724], WA: [816, 618], EU: [971, 256], EU2: [1107, 270], AS: [1407, 366], ME: [1153, 506], IN: [1488, 618], CH: [860, 322] }
    const GS = makeSystem($('gpaths'), $('gdots'), $('ghi'), { both: true })
    LP.LG.forEach((pts, i) => GS.add(poly(pts), 't', 'g' + i))
    LP.LGA.forEach((pts, i) => GS.add(poly(pts), 'a', 'ga' + i))
    GS.add(poly(LP.LCH.CH_EU2), 't', 'ch1'); GS.add(poly(LP.LCH.CH_EU), 't', 'ch2'); GS.add(poly(LP.LCH.CH_ME_A), 'a', 'ch3')
    const arcD = (a: number[], b: number[]) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, k = 0.16 * Math.hypot(b[0] - a[0], b[1] - a[1]); return `M${a[0]} ${a[1]} Q${mx} ${my - k} ${b[0]} ${b[1]}` }
    ;['NA', 'GL', 'IB', 'BR2', 'WA', 'AS', 'IN', 'EU', 'EU2', 'ME'].forEach((n) => GS.add(arcD(G.CH, G[n]), 't', 'hq' + n, true))
    GS.seed()

    /* what the globe shows at each text stop */
    const GROUPS: { svc: ((number | string)[] | null)[]; how: (number[] | null)[] } = {
      svc: [[8, 9, 12, 13, 16, 'ch1', 'ch2'], [1, 3, 6, 12, 8, 9], [7, 10, 11, 13, 14, 15, 'ga0', 'ga1', 'ch3'], [0, 1, 2, 4, 5, 6, 17], null],
      how: [[1], [1, 3, 6, 12, 0], null],
    }
    const inG = (ln: Lane, list: (number | string)[]) => list.some((x) => (typeof x === 'number' ? ln.key === 'g' + x : ln.key === x))
    let GSTATE = 'all'
    const hqMark = $<SVGGElement>('hqMark'), hqRing = $<SVGCircleElement>('hqRing'), pulse = $<SVGCircleElement>('pulse')
    const applyGlobe = (now: number) => {
      const st = GSTATE, hq = st === 'where'
      GS.speed = st === 'why' ? 2.1 : 1; GS.rate = st === 'why' ? 2 : 1
      let list: (number | string)[] | null = null, sweep = -1
      if (st === 'svc') { list = GROUPS.svc[vIdx]; if (vIdx === 4) sweep = Math.floor(now / 380) % 19 }
      if (st === 'how') { const ph = Math.floor((now % 7500) / 2500); list = GROUPS.how[ph] }
      GS.lanes.forEach((ln) => {
        const isHQ = ln.key.startsWith('hq')
        let w: number
        if (isHQ) w = hq ? 1 : 0
        else if (hq) w = ln.key.startsWith('ch') ? 1 : 0.06
        else if (sweep >= 0) w = ln.key === 'g' + sweep ? 1 : 0.15
        else if (list) w = inG(ln, list) ? 1 : 0.12
        else w = 1
        ln.w = w
        const o = (isHQ || (st !== 'all' && st !== 'why')) && w >= 1 ? 1 : 0
        if (ln.hi && o !== ln.hiOn) { ln.hi.setAttribute('opacity', String(o ? (isHQ ? 0.7 : 0.45) : 0)); ln.hiOn = o }
      })
      hqMark.style.opacity = hq ? '1' : '0'
    }
    let tick = 0
    frameFns.push((now) => {
      tick++
      HS.active = prog < 0.36; GS.active = prog > 0.08
      applyGlobe(now)
      pulse.setAttribute('opacity', (0.18 + 0.18 * Math.sin(tick / 18)).toFixed(3)); pulse.setAttribute('r', (36 + 8 * Math.sin(tick / 18)).toFixed(1))
      hqRing.setAttribute('r', (16 + 14 * ((now % 1600) / 1600)).toFixed(1)); hqRing.setAttribute('opacity', (1 - (now % 1600) / 1600).toFixed(2))
    })

    /* ---- scroll choreography ---- */
    const scene = T
    const topL = T.querySelector('.top') as HTMLElement, mid = T.querySelector('.mid') as HTMLElement, bot = T.querySelector('.bot') as HTMLElement, gtx = T.querySelector('.globeTxt') as HTMLElement
    const pc = $('plateClean'), pgb = $('plateGlobe'), flows = $<SVGSVGElement>('flows'), gflows = $<SVGSVGElement>('gflows'), hint = $('hint')
    const MAPS = 0.88, mapC = $('mapC'), mapG = $('mapG')
    const slots = [[0.3, 0.42], [0.42, 0.54], [0.54, 0.66], [0.66, 0.78], [0.78, 0.9]]
    const update = () => {
      const r = scene.getBoundingClientRect()
      const total = r.height - innerHeight
      prog = clamp(-r.top / total, 0, 1)
      const p = prog
      const a = ease(seg(p, 0, 0.14))
      topL.style.transform = `translateY(${-520 * a}px)`; topL.style.opacity = String(1 - a)
      bot.style.transform = `translateY(${320 * a}px)`; bot.style.opacity = String(1 - a)
      mid.style.opacity = String(1 - ease(seg(p, 0.04, 0.16)))
      const gz = ease(seg(p, 0, 0.24))
      mapC.style.transform = `scale(${MAPS * (1 + 0.42 * gz)}) translateY(${-40 * gz}px)`
      const b = ease(seg(p, 0.12, 0.3))
      pgb.style.opacity = String(b); pc.style.opacity = String(1 - b); flows.style.opacity = String(1 - b); gflows.style.opacity = String(b)
      const drift = seg(p, 0.3, 0.92)
      pgb.style.transform = `scale(${1.18 - 0.18 * b + 0.06 * drift}) translateY(${-20 * drift}px)`
      gflows.style.transform = pgb.style.transform
      mapG.style.transform = `translateX(${(-70 * (COVER - 1)) / 0.22}px) scale(${COVER})`
      const c = ease(seg(p, 0.26, 0.36))
      gtx.style.opacity = String(c * (1 - ease(seg(p, 0.4, 0.46))))
      gtx.style.transform = `translateX(${(-70 * (COVER - 1)) / 0.22}px) scale(${COVER}) translateY(${30 * (1 - c)}px)`
      GSTATE = p < 0.42 ? 'all' : p < 0.54 ? 'svc' : p < 0.66 ? 'how' : p < 0.78 ? 'why' : 'where'
      slots.forEach(([s0, s1], i) => {
        const sl = $('sl' + i), sp = T.querySelector(`[data-id="sp${i}"]`) as HTMLElement | null
        const u = seg(p, s0, s1)
        const inn = ease(seg(u, 0, 0.25)), out = ease(seg(u, 0.75, 1))
        const o = inn * (1 - out), y = 80 * (1 - inn) - 80 * out
        sl.style.opacity = String(o); sl.style.transform = `translateY(${y}px)`
        if (sp) { sp.style.opacity = String(o); sp.style.transform = `translateY(${y * 1.2}px)` }
      })
      const f = ease(seg(p, 0.92, 1))
      pgb.style.filter = `brightness(${1 - 0.7 * f})`
      gflows.style.opacity = String(b * (1 - f))
      hint.style.opacity = p < 0.03 ? '1' : '0'
    }
    on(window, 'resize', () => { fit(); update() })
    on(window, 'scroll', update, { passive: true })
    update()

    /* ---- step scrolling: one gesture = one stop, then it waits ---- */
    const STOPS = [0, 0.36, 0.48, 0.6, 0.72, 0.84]
    const summary = root.querySelector('[data-id="diagnostic"]') as HTMLElement
    const nav = $('stops')
    const buttons = Array.from(nav.querySelectorAll('button'))
    const yOf = (p: number) => scene.offsetTop + p * (scene.offsetHeight - innerHeight)
    const maxY = () => document.documentElement.scrollHeight - innerHeight
    const sumY = () => Math.min(summary.offsetTop, maxY())
    const targets = () => [...STOPS.map(yOf), sumY()]
    let anim = false, needGap = false, lastWheel = 0, endAt = 0, animRaf = 0
    const current = () => { const y = scrollY, t = targets(); let best = 0; t.forEach((v, i) => { if (Math.abs(v - y) < Math.abs(t[best] - y)) best = i }); return best }
    const mark = () => {
      const c = current()
      buttons.forEach((b, i) => b.classList.toggle('on', i === c))
      nav.style.opacity = scrollY > summary.offsetTop - innerHeight * 0.5 ? '0' : '1'
    }
    on(window, 'scroll', mark, { passive: true })
    mark()
    const jump = (y: number) => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
    const go = (i: number) => {
      const t = targets()
      i = Math.max(0, Math.min(t.length - 1, i))
      const from = scrollY, to = t[i], d = to - from
      if (Math.abs(d) < 2) return
      if (RM) { jump(to); return }
      anim = true
      const dur = Math.min(1400, 650 + Math.abs(d) * 0.25), t0 = performance.now()
      const e = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
      const step = (now: number) => {
        if (!alive) return
        const k = Math.min(1, (now - t0) / dur)
        jump(from + d * e(k))
        if (k < 1) animRaf = requestAnimationFrame(step)
        else { anim = false; needGap = true; endAt = performance.now() }
      }
      animRaf = requestAnimationFrame(step)
    }
    cleanups.push(() => cancelAnimationFrame(animRaf))
    buttons.forEach((b, i) => on(b, 'click', () => go(i)))
    if (!RM) {
      const inScene = () => scrollY < sumY() + 2
      on(window, 'wheel', ((ev: WheelEvent) => {
        const now = performance.now(), gap = now - lastWheel
        lastWheel = now
        if (!inScene()) return // summary scrolls normally
        if (scrollY >= sumY() - 2 && ev.deltaY > 0) return // already on the summary: free scroll down
        ev.preventDefault()
        if (anim) return
        if (now - endAt < 380) return // short pause after each stop
        if (needGap && gap < 220) return // swallow trackpad inertia from the last move
        needGap = false
        if (Math.abs(ev.deltaY) < 4) return
        go(current() + (ev.deltaY > 0 ? 1 : -1))
      }) as EventListener, { passive: false })
      on(window, 'keydown', ((ev: KeyboardEvent) => {
        const ae = document.activeElement
        if (!inScene() || (ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName))) return
        const dn = ['ArrowDown', 'PageDown', ' '].includes(ev.key), up = ['ArrowUp', 'PageUp'].includes(ev.key)
        if (!dn && !up) return
        if (scrollY >= sumY() - 2 && dn) return
        ev.preventDefault()
        if (!anim) go(current() + (dn ? 1 : -1))
      }) as EventListener)
    }
  } else {
    /* ---- phone: the same pieces stacked, particles on both plates ---- */
    const mh = makeSystem($('mpaths'), $('mdots'), null, {})
    LP.LH2.forEach((o) => mh.add(poly(o.pts), 't', '', false, o.both))
    LP.LHA2.forEach((o) => mh.add(poly(o.pts), 'a'))
    mh.seed()
    const mgS = makeSystem($('mgpaths'), $('mgdots'), null, { both: true })
    LP.LG.forEach((p) => mgS.add(poly(p), 't'))
    LP.LGA.forEach((p) => mgS.add(poly(p), 'a'))
    ;(['CH_EU2', 'CH_EU'] as const).forEach((k) => mgS.add(poly(LP.LCH[k]), 't'))
    mgS.add(poly(LP.LCH.CH_ME_A), 'a')
    mgS.seed()
  }

  /* ---- services: pick one, the side viz changes and animates ---- */
  const svcs = $('svcs')
  let vIdx = 0, vT = 0, autoT = 0
  const vzs = Array.from(T.querySelectorAll<HTMLElement>('.vz'))
  const showViz = (i: number) => {
    vIdx = i
    svcs.querySelectorAll<HTMLElement>('a').forEach((a) => a.classList.toggle('on', +(a.dataset.v as string) === i))
    vzs.forEach((v) => { v.hidden = +(v.dataset.v as string) !== i })
    vT = 0; autoT = 0
  }
  on(svcs, 'mouseover', (e) => { const a = (e.target as Element).closest('a') as HTMLElement | null; if (a && +(a.dataset.v as string) !== vIdx) showViz(+(a.dataset.v as string)) })
  const ringArc = $('ringArc'), ringSteps = Array.from(T.querySelectorAll('[data-id="ringSteps"] text')), invPath = $<SVGPathElement>('invPath'), riskNode = $('riskNode'),
    ctsBars = Array.from(T.querySelectorAll<SVGRectElement>('[data-id="ctsBars"] rect')), auditBar = $('auditBar'), wkBar = $('wkBar')
  const invLen = invPath.getTotalLength()
  invPath.style.strokeDasharray = String(invLen)
  const slsp = MOB ? [] : Array.from(T.querySelectorAll<HTMLElement>('.sl,.sp'))
  frameFns.push(() => {
    vT++; autoT++
    if ((MOB || (prog > 0.42 && prog < 0.54)) && !RM && autoT > 240) showViz((vIdx + 1) % 5)
    const k = RM ? 1 : Math.min(1, vT / 90)
    if (vIdx === 0) { ringArc.setAttribute('stroke-dasharray', `${314 * k} 314`); ringSteps.forEach((t, i) => t.setAttribute('fill', k >= (i + 1) / 4 - 0.01 ? '#7ff5df' : '#c6d5de')) }
    if (vIdx === 1) invPath.style.strokeDashoffset = String(invLen * (1 - k))
    if (vIdx === 2) riskNode.setAttribute('r', String(9 + 3 * Math.sin(vT / 8)))
    if (vIdx === 3) ctsBars.forEach((r) => r.setAttribute('width', String(+(r.dataset.w as string) * k)))
    if (vIdx === 4) auditBar.setAttribute('x2', String(30 + 320 * k))
    const w = MOB ? 1 : Math.min(1, Math.max(0, (prog - 0.66) / 0.05))
    wkBar.setAttribute('width', String(47 * w))
    slsp.forEach((e) => e.classList.toggle('live', parseFloat(e.style.opacity || '0') > 0.5))
  })

  /* ---- sample network: counter and event feed (simulated) ---- */
  const cntO = $('cntOrders'), feed = $('feed')
  let orders = 18597, ordersShown = RM ? 18597 : 0, evi = 0
  const cntText = cntO.firstChild as Text
  const pushEvent = () => {
    const now = new Date()
    const [who, what] = EV[evi++ % EV.length]
    const d = document.createElement('div')
    const b = document.createElement('b')
    if (/delay|risk/.test(what)) b.className = 'a'
    b.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    d.appendChild(b)
    d.appendChild(document.createTextNode(`${who}: ${what}`))
    feed.prepend(d)
    while (feed.children.length > 3) feed.lastChild?.remove()
  }
  pushEvent(); pushEvent(); pushEvent()
  cleanups.push(() => { feed.textContent = ''; cntText.nodeValue = '0' })
  const feedT = setInterval(() => { if (RM) return; orders += Math.floor(Math.random() * 7); pushEvent() }, 2800)
  cleanups.push(() => clearInterval(feedT))
  frameFns.push(() => {
    ordersShown += Math.ceil((orders - ordersShown) / 18)
    if (ordersShown > orders) ordersShown = orders
    cntText.nodeValue = ordersShown.toLocaleString('en-US')
  })

  /* ---- live clocks ---- */
  const clocks = () => T.querySelectorAll<HTMLElement>('[data-id="clocks"] [data-tz]').forEach((d) => {
    try { (d.querySelector('b') as HTMLElement).textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: d.dataset.tz }).format(new Date()) } catch (e) { /* ignore */ }
  })
  clocks()
  const clockT = setInterval(clocks, 15000)
  cleanups.push(() => clearInterval(clockT))

  /* ---- one rAF loop for particles, viz and counter ---- */
  let lastT = performance.now(), raf = 0
  const loop = (now: number) => {
    if (!alive) return
    const dt = Math.min(0.05, (now - lastT) / 1000)
    lastT = now
    SYS.forEach((s) => s.step(now, dt))
    frameFns.forEach((f) => f(now, dt))
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  return () => {
    alive = false
    cancelAnimationFrame(raf)
    cleanups.forEach((f) => f())
    SYS.forEach((s) => s.dots.forEach((d) => { d.c.remove(); d.h.remove() }))
    created.forEach((e) => e.remove())
    frameFns = []
  }
}
