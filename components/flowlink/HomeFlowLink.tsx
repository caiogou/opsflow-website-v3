'use client'
// OpsFlow home, "Flow Link" (approved prototype v19, paginas_v1/home.html).
// All text and links are rendered here (server HTML); engine.ts only animates them on the client.
import { useEffect, useRef, useState } from 'react'
import { Inter } from 'next/font/google'
import { CALENDLY } from '@/lib/booking'
import { startFlowLink } from './engine'
import './flowlink.css'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--fl-font', display: 'swap' })

const EMAIL = 'caio@opsflow-advisory.ch'
const PLATE_EUROPE = '/img/home_plate_europe.webp'
const PLATE_GLOBE = '/img/home_plate_globe.webp'
const ALT_EUROPE = 'Supply network over Europe at night'
const ALT_GLOBE = 'Global supply network on the globe'

const MENU = [
  { label: 'Solutions', href: '/en/services' },
  { label: 'How we work', href: '/en/how-we-work' },
  { label: 'Case studies', href: '/en/case-studies' },
  { label: 'Who we help', href: '/en/who-we-help' },
  { label: 'About', href: '/en/about' },
  { label: 'Insights', href: '/en/insights' },
]
const STOPS = ['Overview', 'One network', 'Services', 'How it works', 'Why OpsFlow', 'Where we are', 'Book a session']

const CHIPS = [
  { t: 'S&OP meetings that never decide', a: 'S&OP consulting: a planning cycle that aligns sales, operations and finance, and leads to decisions that actually hold.', l: '/en/services/s-op-consulting' },
  { t: 'Too much stock, still stockouts', a: 'Inventory optimization: free up working capital without degrading service, by tuning safety stocks, forecasting and replenishment.', l: '/en/services/inventory-optimization' },
  { t: 'One supplier can stop the line', a: 'Supply chain risk management: identify critical dependencies, anticipate supplier failures and secure your sourcing.', l: '/en/services/supply-chain-risk-management' },
  { t: 'Logistics cost eats the margin', a: 'Distribution planning: move products to points of sale at the right service level and the right cost.', l: '/en/services/distribution-planning' },
  { t: 'We do not know where to start', a: 'Supply chain audit: a two-week Supply Chain Health Check with a prioritized action plan.', l: '/en/services/supply-chain-audit' },
]
const INSIGHTS = [
  { href: '/en/insights/what-is-sop', t: 'What is S&OP? definition and the monthly cycle' },
  { href: '/en/insights/safety-stock', t: 'Safety stock: how to calculate it' },
  { href: '/en/insights/otif', t: 'OTIF: definition and how to manage it' },
  { href: '/en/insights/demand-forecasting', t: 'Demand forecasting: methods and how to choose' },
  { href: '/en/insights/dual-sourcing', t: 'Dual sourcing: a strategy to secure supply' },
  { href: '/en/insights/cost-to-serve', t: 'Cost-to-serve: understanding it' },
]

function Logo() {
  return (
    <a className="logo" href="/en" aria-label="OpsFlow Advisory, home">
      <svg width="46" height="46" viewBox="0 0 46 46" fill="none" stroke="#2fd3bd" strokeWidth="2.4" aria-hidden="true"><circle cx="23" cy="10" r="6" /><circle cx="10" cy="36" r="6" /><circle cx="36" cy="36" r="6" /><path d="M19 15 12 30M27 15l7 15M16 36h14" /></svg>
      <span>OpsFlow <b>Advisory</b></span>
    </a>
  )
}

/* The H1 lives in the desktop tree only; the phone copy is a level-1 heading role (only one tree is displayed at a time). */
function Headline({ mobile }: { mobile?: boolean }) {
  const title = <>Smarter supply chains.<br /><em>Built by people, AI&#8209;assisted.</em></>
  return (
    <div className="h">
      <div className="kk">Supply chain advisory for growing companies · Nyon, Switzerland</div>
      {mobile ? <div className="h1" role="heading" aria-level={1}>{title}</div> : <h1>{title}</h1>}
      <p>Senior supply chain expertise for growing businesses: S&amp;OP/IBP, supply planning, order management and logistics. Practical solutions, better data and measurable results.</p>
      <a className="btn" href={CALENDLY} target="_blank" rel="noopener noreferrer">Book a free session <span aria-hidden="true">→</span></a>{' '}
      <a className="btn2" href="/diagnostic">Take the free S&amp;OP Self-Assessment ›</a>
    </div>
  )
}

function PanelSop() {
  return (
    <div className="pn sop"><h4>Monthly S&amp;OP cycle</h4>
      <svg width="150" height="150" viewBox="0 0 150 150" style={{ position: 'absolute', left: '24px', top: '46px' }}>
        <g fill="none" strokeWidth="20" strokeLinecap="butt">
          <circle cx="75" cy="75" r="56" stroke="#163a46" />
          <circle cx="75" cy="75" r="56" stroke="#2fd3bd" strokeDasharray="86 7" transform="rotate(-90 75 75)" opacity=".95" className="ringspin" />
        </g>
        <text x="75" y="72" textAnchor="middle" fontSize="19" fontWeight="700" fill="#eaf4f8">S&amp;OP</text>
        <text x="75" y="90" textAnchor="middle" fontSize="10" fill="#8fa6b6">MAY 2026</text>
      </svg>
      <div className="steps">
        <div><b>1</b><div>Demand review<small>May 1 to 5</small></div><i>✓</i></div>
        <div><b>2</b><div>Supply review<small>May 6 to 10</small></div><i>✓</i></div>
        <div><b>3</b><div>Pre-S&amp;OP<small>May 11 to 15</small></div><i className="o"></i></div>
        <div><b>4</b><div>Executive decision<small>May 16 to 20</small></div><i className="o g"></i></div>
      </div>
    </div>
  )
}

function PanelDvs() {
  return (
    <div className="pn dvs"><h4>Demand vs Supply balance<span className="who" data-id="whoD"></span></h4>
      <div className="lg"><span>Demand</span><span>Supply</span><span>Gap</span></div>
      <svg width="258" height="150" viewBox="0 0 258 150" style={{ marginTop: '4px' }} fontSize="10" fill="#6b8597">
        <g stroke="#17313f" strokeWidth="1"><line x1="28" y1="10" x2="258" y2="10" /><line x1="28" y1="40" x2="258" y2="40" /><line x1="28" y1="70" x2="258" y2="70" /><line x1="28" y1="100" x2="258" y2="100" /><line x1="28" y1="130" x2="258" y2="130" /></g>
        <text x="0" y="14">120</text><text x="0" y="44">100</text><text x="6" y="74">80</text><text x="6" y="104">60</text><text x="6" y="134">0</text>
        <path className="draw" data-id="pDem" d="M30 118 C70 100,100 60,140 56 S210 50,250 26" stroke="#2fd3bd" strokeWidth="2.4" fill="none" />
        <path className="draw d2" data-id="pSup" d="M30 128 C70 112,110 90,150 86 S215 80,250 66" stroke="#1f8f80" strokeWidth="2" fill="none" />
        <path d="M140 56 S210 50,250 26 L250 66 S215 80,150 86 Z" fill="#2fd3bd" opacity=".12" />
        <line x1="200" y1="8" x2="200" y2="132" stroke="#5a6f80" strokeDasharray="3 3" /><circle cx="250" cy="26" r="3" fill="#7ff5df"><animate attributeName="r" values="3;5;3" dur="1.8s" repeatCount="indefinite" /></circle>
        <g textAnchor="middle"><text x="40" y="148">JAN</text><text x="82" y="148">FEB</text><text x="124" y="148">MAR</text><text x="166" y="148">APR</text><text x="208" y="148">MAY</text><text x="250" y="148">JUN</text></g>
      </svg>
    </div>
  )
}

function PanelSsc() {
  return (
    <div className="pn ssc"><h4>Inventory cover (days)<span className="who" data-id="whoS"></span></h4>
      <svg width="300" height="160" viewBox="0 0 300 160" fontSize="10" fill="#6b8597" style={{ marginTop: '6px' }}>
        <text x="0" y="14">70</text><text x="0" y="44">60</text><text x="0" y="74">50</text><text x="0" y="104">40</text><text x="0" y="134">30</text>
        <line x1="26" y1="92" x2="296" y2="92" stroke="#5a6f80" strokeDasharray="4 3" /><text x="212" y="86" fill="#9fb5c2">Target: 40 days</text>
        <path className="draw" data-id="pSsc" d="M30 66 L82 92 L134 58 L186 52 L238 70 L290 46" stroke="#2fd3bd" strokeWidth="2.2" fill="none" />
        <g fill="#2fd3bd" data-id="sscDots"><circle cx="30" cy="66" r="3" /><circle cx="82" cy="92" r="3" /><circle cx="134" cy="58" r="3" /><circle cx="186" cy="52" r="3" /><circle cx="238" cy="70" r="3" /><circle cx="290" cy="46" r="3" /></g>
        <line x1="238" y1="8" x2="238" y2="135" stroke="#5a6f80" strokeDasharray="3 3" />
        <g textAnchor="middle"><text x="30" y="152">JAN</text><text x="82" y="152">FEB</text><text x="134" y="152">MAR</text><text x="186" y="152">APR</text><text x="238" y="152">MAY</text><text x="290" y="152">JUN</text></g>
      </svg>
    </div>
  )
}

function PanelOtif() {
  return (
    <div className="pn otif"><h4>OTIF performance<span className="who" data-id="whoO"></span></h4>
      <svg width="190" height="110" viewBox="0 0 190 110" style={{ position: 'absolute', left: '18px', top: '34px' }}>
        <path d="M20 100 A75 75 0 0 1 170 100" stroke="#163a46" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M20 100 A75 75 0 0 1 170 100" stroke="#2fd3bd" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray="218 236" className="gauge" data-id="gauge" />
        <text data-id="tOtif" x="95" y="80" textAnchor="middle" fontSize="30" fontWeight="700" fill="#2fd3bd">92.6%</text>
        <text x="95" y="100" textAnchor="middle" fontSize="11" fill="#8fa6b6">OTIF</text>
        <text x="14" y="110" fontSize="9" fill="#6b8597">0%</text><text x="164" y="110" fontSize="9" fill="#6b8597">100%</text>
      </svg>
      <div style={{ position: 'absolute', right: '22px', top: '66px', fontSize: '12px', color: 'var(--mute)' }}>vs Last Month<br /><b data-id="tDelta" style={{ color: 'var(--teal)', fontSize: '18px' }}>▲ 3.7pp</b><br />Target: 95%</div>
    </div>
  )
}

function Kpis() {
  return (
    <div className="kpis">
      <div><h5>WHO YOU TALK TO</h5><strong>Senior</strong><em>Every call led by a senior practitioner</em></div>
      <div><h5>HOW IT ENDS</h5><strong>On track</strong><em>We stay until results land</em></div>
      <div><h5>WHERE IT STARTS</h5><strong>Your data</strong><em>A free first look at your own numbers</em></div>
      <div><h5>TO START</h5><strong>Free</strong><em>First session, 45 minutes, no commitment</em></div>
    </div>
  )
}

function Feed() {
  return (
    <div className="pn rr"><h4>Sample network · simulated feed</h4>
      <div><div className="cnt" data-id="cntOrders">0<small>ORDERS IN FLOW</small></div><div className="exc1">△ 1 open exception</div></div>
      <div className="feed" data-id="feed" aria-live="off"></div>
    </div>
  )
}

/* Text stops over the globe (same order on desktop and phone). */
function Slides() {
  return (
    <>
      <div className="sl" data-id="sl0"><h2>Growth creates <em>complexity.</em></h2><p>As your business grows, planning, inventory, suppliers and operations become harder to manage: demand is harder to predict, inventory keeps rising, planning turns reactive, data sits in too many places and the supplier base gets more complex.</p></div>

      <div className="sl" data-id="sl1" style={{ top: '500px', width: '640px' }}><div className="k">That&rsquo;s where OpsFlow comes in</div><h2>Five ways in. <em>One cycle that holds.</em></h2>
        <div className="svcs" data-id="svcs">
          <a href="/en/services/s-op-consulting" data-v="0" className="on">S&amp;OP consulting<small>Align sales, operations and finance</small></a>
          <a href="/en/services/inventory-optimization" data-v="1">Inventory optimization<small>Less stock, more service</small></a>
          <a href="/en/services/supply-chain-risk-management" data-v="2">Supply chain risk<small>Secure your sourcing</small></a>
          <a href="/en/services/distribution-planning" data-v="3">Distribution planning<small>Serve at the right cost</small></a>
          <a href="/en/services/supply-chain-audit" data-v="4">Supply chain audit<small>Supply Chain Health Check in two weeks</small></a>
        </div>
      </div>
      <div className="sp" data-id="sp1"><div className="pn viz">
        <div className="vz" data-v="0"><h4>S&amp;OP cycle · one agreed plan a month</h4><svg viewBox="0 0 380 150"><g transform="translate(70 75)"><circle r="50" fill="none" stroke="#163a46" strokeWidth="16" /><circle data-id="ringArc" r="50" fill="none" stroke="#2fd3bd" strokeWidth="16" strokeDasharray="0 314" transform="rotate(-90)" /><text y="5" textAnchor="middle" fontSize="15" fontWeight="700" fill="#eaf4f8">S&amp;OP</text></g><g fontSize="12" fill="#c6d5de" data-id="ringSteps"><text x="150" y="38">1 Demand review</text><text x="150" y="66">2 Supply review</text><text x="150" y="94">3 Pre-S&amp;OP</text><text x="150" y="122">4 Executive decision</text></g></svg></div>
        <div className="vz" data-v="1" hidden><h4>Inventory · cover vs safety stock</h4><svg viewBox="0 0 380 150"><g stroke="#17313f"><line x1="30" y1="30" x2="370" y2="30" /><line x1="30" y1="70" x2="370" y2="70" /><line x1="30" y1="110" x2="370" y2="110" /></g><line x1="30" y1="96" x2="370" y2="96" stroke="#ffb547" strokeDasharray="4 3" /><text x="300" y="90" fontSize="10" fill="#ffb547">safety stock</text><path d="M30 40 L80 64 L130 50 L180 84 L230 60 L280 90 L330 72 L370 100 V130 H30 Z" fill="#2fd3bd" opacity=".1" /><path data-id="invPath" d="M30 40 L80 64 L130 50 L180 84 L230 60 L280 90 L330 72 L370 100" fill="none" stroke="#2fd3bd" strokeWidth="2.4" /><text x="30" y="145" fontSize="10" fill="#6b8597">working capital freed as the curve settles toward the line</text></svg></div>
        <div className="vz" data-v="2" hidden><h4>Risk · critical dependencies</h4><svg viewBox="0 0 380 150"><g fill="none" stroke="#2fd3bd" strokeOpacity=".5" strokeDasharray="4 3"><path d="M60 110 L190 50" /><path d="M60 110 L190 110" /><path d="M60 110 L320 80" /><path d="M190 50 L320 80" /></g><circle cx="60" cy="110" r="9" fill="#2fd3bd" /><circle cx="190" cy="50" r="7" fill="#2fd3bd" /><circle cx="190" cy="110" r="7" fill="#2fd3bd" /><circle data-id="riskNode" cx="320" cy="80" r="9" fill="#ffb547" /><text x="60" y="135" textAnchor="middle" fontSize="10" fill="#c6d5de">Your plant</text><text x="190" y="36" textAnchor="middle" fontSize="10" fill="#c6d5de">Supplier A</text><text x="190" y="132" textAnchor="middle" fontSize="10" fill="#c6d5de">Supplier B</text><text x="320" y="106" textAnchor="middle" fontSize="10" fill="#ffb547">Single source</text><text x="30" y="20" fontSize="11" fill="#9fb5c2">Dual sourcing where one failure stops the line</text></svg></div>
        <div className="vz" data-v="3" hidden><h4>Distribution · cost to serve by channel</h4><svg viewBox="0 0 380 150" fontSize="10" fill="#c6d5de"><g data-id="ctsBars"><rect x="40" y="30" width="0" height="18" fill="#2fd3bd" data-w="250" /><rect x="40" y="58" width="0" height="18" fill="#2fd3bd" data-w="180" /><rect x="40" y="86" width="0" height="18" fill="#2fd3bd" data-w="120" /><rect x="40" y="114" width="0" height="18" fill="#ffb547" data-w="300" /></g><text x="36" y="43" textAnchor="end">Retail</text><text x="36" y="71" textAnchor="end">B2B</text><text x="36" y="99" textAnchor="end">Export</text><text x="36" y="127" textAnchor="end" fill="#ffb547">Direct</text><text x="30" y="18" fontSize="11" fill="#9fb5c2">The channel that costs more than it earns is the one to fix first</text></svg></div>
        <div className="vz" data-v="4" hidden><h4>Audit · two weeks, one plan</h4><svg viewBox="0 0 380 150" fontSize="10" fill="#c6d5de"><line x1="30" y1="60" x2="350" y2="60" stroke="#163a46" strokeWidth="6" strokeLinecap="round" /><line data-id="auditBar" x1="30" y1="60" x2="30" y2="60" stroke="#2fd3bd" strokeWidth="6" strokeLinecap="round" /><g textAnchor="middle"><text x="30" y="85">Day 1</text><text x="190" y="85">Day 7</text><text x="350" y="85">Day 14</text></g><text x="30" y="40" fontSize="11" fill="#9fb5c2">Data in</text><text x="190" y="40" fontSize="11" fill="#9fb5c2" textAnchor="middle">Interviews and analysis</text><text x="350" y="40" fontSize="11" fill="#2fd3bd" textAnchor="end">Top 3 priorities by P&amp;L</text><text x="30" y="125" fontSize="11" fill="#c6d5de">90-day action plan and executive summary delivered</text></svg></div>
      </div></div>

      <div className="sl" data-id="sl2"><div className="k">How we work</div><h2>From first conversation <em>to measurable results.</em></h2><p>Three steps. Clear scope at each one. No open-ended engagements.</p></div>
      <div className="sp" data-id="sp2"><div className="pn steps3">
        <div><b>1</b><div><strong>Free 45-minute session</strong><span>A structured conversation about your supply chain reality. You leave with your top priorities clear, whether we work together or not.</span><em>Free, no commitment</em></div></div>
        <div><b>2</b><div><strong>Supply Chain Health Check</strong><span>Two-week structured assessment. Top 3 priorities ranked by P&amp;L impact, a 90-day plan, an executive summary.</span><em>Two weeks, fixed price</em></div></div>
        <div><b>3</b><div><strong>Strategy and senior follow-through</strong><span>We build the plan with you. A senior practitioner then oversees execution with your team, month by month.</span><em>Scoped to your needs</em></div></div>
      </div></div>

      <div className="sl" data-id="sl3" style={{ top: '470px', width: '640px' }}><div className="k">Real results</div><h2>What better supply chain systems <em>can deliver.</em></h2>
        <ul className="cred"><li><strong>About USD 2M a year.</strong> Annual savings from one connected planning and inventory report: fewer expedited shipments, less waste.</li><li><strong>6 months to 1 month.</strong> Supplier lead time after redesigning the supplier process, with supplier cost down about 10%.</li><li><strong>20% less slow-moving stock.</strong> After segmenting a large EMEA inventory base and adjusting planning to each segment.</li></ul>
        <p style={{ fontSize: '13px', color: 'var(--mute)', marginTop: '14px' }}>Delivered by our partners as senior supply chain professionals, before OpsFlow. <a href="/en/case-studies" style={{ color: 'var(--teal)' }}>See the case studies ›</a></p>
      </div>
      <div className="sp" data-id="sp3"><div className="pn"><h4>Supplier lead time, before and after</h4><svg viewBox="0 0 380 110" fontSize="11" fill="#c6d5de"><text x="0" y="28">Before</text><rect x="90" y="18" width="280" height="14" rx="7" fill="#163a46" /><text x="0" y="68">After</text><rect data-id="wkBar" x="90" y="58" width="0" height="14" rx="7" fill="#2fd3bd" /><text x="370" y="30" textAnchor="end" fontSize="10" fill="#c6d5de">about 6 months</text><text x="146" y="70" fontSize="10" fill="#7ff5df" fontWeight="700">about 1 month</text><text x="0" y="100" fontSize="10" fill="#6b8597">From a partner project before OpsFlow, not to scale</text></svg></div></div>

      <div className="sl" data-id="sl4"><div className="k">Who we work with</div><h2>Growing companies. <em>Nyon, Switzerland.</em></h2><p>Manufacturing and distribution companies across Europe where supply chain complexity is catching up with growth. We work in English, French and German. <a href="/en/who-we-help" style={{ color: 'var(--teal)' }}>Who we help ›</a></p></div>
      <div className="sp" data-id="sp4"><div className="pn"><h4>Right now, across the network</h4><div className="clocks" data-id="clocks"><div data-tz="Europe/Zurich"><b>--:--</b><span>Nyon · HQ</span></div><div data-tz="Europe/Amsterdam"><b>--:--</b><span>Rotterdam</span></div><div data-tz="Asia/Shanghai"><b>--:--</b><span>Shanghai</span></div><div data-tz="America/Sao_Paulo"><b>--:--</b><span>São Paulo</span></div></div></div></div>
    </>
  )
}

function MobileMenu() {
  const [open, setOpen] = useState(false)
  return (
    <div className="mright">
      <a className="cta" href="/en/contact">Talk to us</a>
      <button type="button" className="mburger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="fl-mmenu" onClick={() => setOpen(!open)}>
        <i /><i /><i />
      </button>
      <nav id="fl-mmenu" className={open ? 'mmenu open' : 'mmenu'} aria-label="Main">
        {MENU.map((m) => <a key={m.href} href={m.href} onClick={() => setOpen(false)}>{m.label}</a>)}
        <a href="/en/contact" onClick={() => setOpen(false)}>Contact</a>
      </nav>
    </div>
  )
}

function Chips() {
  const [i, setI] = useState(0)
  const c = CHIPS[i]
  return (
    <>
      <div className="chips">
        {CHIPS.map((x, k) => (
          <button type="button" key={x.l} className={k === i ? 'chip on' : 'chip'} aria-pressed={k === i} onClick={() => setI(k)}>{x.t}</button>
        ))}
      </div>
      <div className="ans" aria-live="polite">{c.a} <a href={c.l} style={{ color: 'var(--teal)' }}>Read the service ›</a></div>
    </>
  )
}

export default function HomeFlowLink() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mq = matchMedia('(max-width: 899px)')
    const rmq = matchMedia('(prefers-reduced-motion: reduce)')
    let stop = startFlowLink(root, mq.matches, rmq.matches)
    const restart = () => { stop(); stop = startFlowLink(root, mq.matches, rmq.matches) }
    mq.addEventListener('change', restart)
    rmq.addEventListener('change', restart)
    return () => {
      mq.removeEventListener('change', restart)
      rmq.removeEventListener('change', restart)
      stop()
    }
  }, [])

  return (
    <div className={`fl ${inter.variable}`} ref={rootRef}>
      {/* ================= PHONE (< 900px): the same pieces stacked ================= */}
      <div className="mob">
        <header className="mhead"><Logo /><MobileMenu /></header>
        <Headline mobile />
        <div className="mmap">
          <div className="mmap-in">
            <img alt={ALT_EUROPE} src={PLATE_EUROPE} width={1680} height={944} fetchPriority="high" decoding="async" />
            <svg viewBox="0 0 1680 944" preserveAspectRatio="none" aria-hidden="true"><g data-id="mpaths" fill="none"></g><g data-id="mdots"></g></svg>
          </div>
        </div>
        <div className="mcap">SWIPE · DASHBOARD DATA IS ILLUSTRATIVE</div>
        <div className="mrow"><PanelSop /><PanelDvs /><PanelSsc /><PanelOtif /></div>
        <Kpis />
        <Feed />
        <div className="mglobe">
          <div className="mglobe-in">
            <img alt={ALT_GLOBE} src={PLATE_GLOBE} width={1680} height={944} loading="lazy" decoding="async" />
            <svg viewBox="0 0 1680 944" preserveAspectRatio="none" aria-hidden="true"><g data-id="mgpaths" fill="none"></g><g data-id="mgdots"></g></svg>
          </div>
        </div>
        <div className="mslides"><Slides /></div>
      </div>

      {/* ================= DESKTOP: sticky scene ================= */}
      <div className="scene">
        <div className="stick">
          <div className="stage" data-id="stage">
            <div className="mapG" data-id="mapG">
              <img className="plate plateGlobe" data-id="plateGlobe" src={PLATE_GLOBE} width={1680} height={944} alt={ALT_GLOBE} loading="lazy" decoding="async" />
              <svg className="ov" data-id="gflows" viewBox="0 0 1680 944" preserveAspectRatio="none" style={{ opacity: 0 }} aria-hidden="true">
                <g data-id="ghi"></g><g data-id="gpaths" fill="none" stroke="none"></g><g data-id="gdots"></g>
                <g data-id="hqMark" style={{ opacity: 0, transition: 'opacity .7s' }}><circle data-id="hqRing" cx="860" cy="322" r="18" fill="none" stroke="#FFB547" strokeWidth="2" /><circle cx="860" cy="322" r="5" fill="#FFB547" /><text x="878" y="300" fontSize="15" fontWeight="700" letterSpacing="1.5" fill="#FFD28A">NYON · HQ</text></g>
              </svg>
            </div>
            <div className="mapC" data-id="mapC">
              <img className="plate plateClean" data-id="plateClean" src={PLATE_EUROPE} width={1680} height={944} alt={ALT_EUROPE} fetchPriority="high" decoding="async" />
              <svg className="ov" data-id="flows" viewBox="0 0 1680 944" preserveAspectRatio="none" style={{ zIndex: 1 }} aria-hidden="true">
                <defs>
                  <filter id="fl-g2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
                </defs>
                <g data-id="paths" fill="none" stroke="#7FF5DF" strokeWidth="2.4" strokeOpacity="0" strokeLinecap="round"></g>
                <circle data-id="pulse" cx="832" cy="700" r="40" fill="#FFB547" opacity=".25" filter="url(#fl-g2)" />
                <g data-id="dots"></g>
              </svg>
              <div className="mid">
                <div className="grp" style={{ left: '206px', top: '440px' }}>CUSTOMERS</div>
                <div className="grp" style={{ left: '502px', top: '372px' }}>MANUFACTURING</div>
                <div className="grp" style={{ left: '862px', top: '360px' }}>DISTRIBUTION CENTERS</div>
                <div className="grp" style={{ left: '1464px', top: '488px' }}>SUPPLIERS</div>
                <div className="lab" data-n="CU.B" style={{ left: '300px', top: '470px' }}>Customer A<small>Frankfurt</small></div>
                <div className="lab" data-n="CU.C" style={{ left: '124px', top: '574px' }}>Customer B<small>Paris</small></div>
                <div className="lab" data-n="CU.D" style={{ left: '190px', top: '694px' }}>Customer C<small>Zurich</small></div>
                <div className="lab" data-n="F.1" style={{ left: '620px', top: '418px' }}>Factory 1<small>Gdansk</small></div>
                <div className="lab" data-n="F.2" style={{ left: '632px', top: '558px' }}>Factory 2<small>Milan</small></div>
                <div className="lab" data-n="DC.N" style={{ left: '986px', top: '404px' }}>DC North<small>Rotterdam</small></div>
                <div className="lab" data-n="DC.C" style={{ left: '1008px', top: '512px' }}>DC Central<small>Lyon</small></div>
                <div className="lab" data-n="DC.S" style={{ left: '1040px', top: '606px' }}>DC South<small>Barcelona</small></div>
                <div className="lab" data-n="S.A" style={{ left: '1554px', top: '524px' }}>Supplier A<small>Shanghai</small></div>
                <div className="lab" data-n="S.B" style={{ left: '1556px', top: '594px' }}>Supplier B<small>Singapore</small></div>
                <div className="lab" data-n="S.C" style={{ left: '1560px', top: '660px' }}>Supplier C<small>Mumbai</small></div>
                <div className="lab" data-n="S.D" style={{ left: '1562px', top: '724px' }}>Supplier D<small>Istanbul</small></div>
                <div className="lab exc" style={{ left: '800px', top: '728px' }}>DC Central<small>Lyon</small><b>△ Exception<br /><small>High delay risk</small></b></div>
              </div>
            </div>

            <div className="top">
              <nav className="nav" aria-label="Main">
                <Logo />
                <div className="menu">{MENU.map((m) => <a key={m.href} href={m.href}>{m.label}</a>)}</div>
                <a className="cta" href="/en/contact">Talk to us</a>
                <div className="burger" aria-hidden="true"><i></i><i></i><i></i></div>
              </nav>
              <Headline />
              <PanelSop /><PanelDvs /><PanelSsc /><PanelOtif />
            </div>

            <div className="bot">
              <Kpis />
              <Feed />
              <div className="pn leg"><h4>Flow legend</h4><div><i></i>Order Flow</div><div><i className="a"></i>Re-routed Flow</div><div><i className="s"></i>Data &amp; Visibility</div><div><i className="w">△</i>Exception</div></div>
              <div className="pn mini"><svg width="212" height="98" viewBox="0 0 212 98" aria-hidden="true"><g fill="#2fd3bd" opacity=".55"><circle cx="40" cy="30" r="1.6" /><circle cx="48" cy="38" r="1.6" /><circle cx="36" cy="46" r="1.6" /><circle cx="58" cy="54" r="1.6" /><circle cx="66" cy="64" r="1.6" /><circle cx="100" cy="28" r="1.6" /><circle cx="108" cy="36" r="1.6" /><circle cx="104" cy="48" r="1.6" /><circle cx="112" cy="58" r="1.6" /><circle cx="130" cy="30" r="1.6" /><circle cx="146" cy="36" r="1.6" /><circle cx="160" cy="44" r="1.6" /><circle cx="150" cy="54" r="1.6" /><circle cx="172" cy="66" r="1.6" /><circle cx="92" cy="40" r="1.6" /><circle cx="84" cy="52" r="1.6" /><circle cx="118" cy="46" r="1.6" /><circle cx="138" cy="48" r="1.6" /></g><g stroke="#2fd3bd" strokeWidth=".8" opacity=".5" fill="none"><path d="M48 38Q80 10 108 36" /><path d="M108 36Q130 20 160 44" /><path d="M66 64Q90 70 112 58" /></g><circle cx="108" cy="36" r="3" fill="#ffb547"><animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite" /></circle><circle cx="160" cy="44" r="2" fill="#7ff5df"><animate attributeName="opacity" values=".2;1;.2" dur="3s" repeatCount="indefinite" /></circle><circle cx="48" cy="38" r="2" fill="#7ff5df"><animate attributeName="opacity" values="1;.2;1" dur="2.6s" repeatCount="indefinite" /></circle></svg></div>
              <div className="illu">DASHBOARD DATA IS ILLUSTRATIVE</div>
            </div>

            <div className="ov944">
              <div className="globeTxt" aria-hidden="true">
                <div className="gl" style={{ left: '300px', top: '330px' }}>AMERICAS<small>4 nodes · 2 lanes</small></div>
                <div className="gl" style={{ left: '720px', top: '196px' }}>NORTH SEA<small>DC North · Rotterdam</small></div>
                <div className="gl" style={{ left: '1120px', top: '216px' }}>EUROPE<small>2 factories · 3 DCs · 3 customers</small></div>
                <div className="gl" style={{ left: '1210px', top: '456px' }}>MIDDLE EAST<small>Supplier · Istanbul</small></div>
                <div className="gl" style={{ left: '1430px', top: '312px' }}>ASIA<small>3 suppliers</small></div>
                <div className="gstats"><div><strong>13</strong><span>nodes</span></div><div><strong>23</strong><span>lanes</span></div><div><strong>1</strong><span>exception</span></div></div>
              </div>
              <Slides />
            </div>
          </div>
          <div className="hint" data-id="hint">SCROLL ONCE · OR PRESS ↓</div>
          <nav className="stops" data-id="stops" aria-label="Sections">
            {STOPS.map((s) => <button type="button" key={s} aria-label={s}>{s}<i /></button>)}
          </nav>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <section className="s" id="start" data-id="diagnostic" style={{ paddingTop: '90px' }}>
        <div className="two">
          <div>
            <div className="kick">Start here</div>
            <h2>Pick your bottleneck. We answer in writing.</h2>
            <p className="lead">Tell us where flow breaks first. You get a free 45-minute session and, if you want to go further, a fixed-price Supply Chain Health Check in two weeks.</p>
            <Chips />
            <div className="kick" style={{ marginTop: '40px' }}>Insights</div>
            <div className="ins">
              {INSIGHTS.map((x) => <a key={x.href} href={x.href}>{x.t}</a>)}
            </div>
          </div>
          <div className="form book">
            <div className="kick">Book a free session</div>
            <h3>45 minutes with a senior practitioner.</h3>
            <p>Free, no commitment. Bring your bottleneck: you leave with your top priorities clear, whether we work together or not.</p>
            <a className="bk" href={CALENDLY} target="_blank" rel="noopener noreferrer">Book a free session <span aria-hidden="true">→</span></a>
            <div className="alt">
              <a href={`mailto:${EMAIL}`}><span>Prefer email?</span>{EMAIL}</a>
              <a href="/diagnostic"><span>Not ready to talk?</span>Take the free S&amp;OP Self-Assessment ›</a>
            </div>
            <small>OpsFlow Advisory · Nyon, Switzerland · EN · FR · DE</small>
          </div>
        </div>
      </section>
      <footer>
        <span>© 2026 OpsFlow Advisory · Nyon, Switzerland</span>
        <span className="flinks"><a href="/en/services">Solutions</a> · <a href="/en/insights">Insights</a> · <a href="/en/about">About</a> · <a href="/en/contact">Contact</a></span>
        <span>Built by people. AI-assisted.</span>
      </footer>
    </div>
  )
}
