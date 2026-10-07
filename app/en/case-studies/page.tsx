import type { Metadata } from 'next'
import { CTA, Footer } from '@/components/CTAFooter'
import { Band, Arrow } from '@/components/dark/Band'
import { CaseTabs } from '@/components/dark/CaseTabs'
import { CALENDLY } from '@/lib/booking'
import { CASES as T, PAGE_META, breadcrumbLd, pageMetadata } from '@/lib/pages_en'

const META = PAGE_META.caseStudies
export const metadata: Metadata = pageMetadata(META)

// Headline figure per own case (same numbers as the case copy, "about" kept).
const BIG = [
  { n: 'USD 2M', s: 'about, in annual savings' },
  { n: '6 → 1', s: 'months of supplier lead time (about)' },
  { n: '20% less', s: 'slow-moving inventory (about)' },
]
const RELATED = [
  [{ l: 'Inventory Optimization', h: '/en/services/inventory-optimization' }, { l: 'S&OP Consulting', h: '/en/services/s-op-consulting' }],
  [{ l: 'Supply Chain Risk Management', h: '/en/services/supply-chain-risk-management' }, { l: 'Inventory Optimization', h: '/en/services/inventory-optimization' }],
  [{ l: 'Inventory Optimization', h: '/en/services/inventory-optimization' }, { l: 'Distribution Planning', h: '/en/services/distribution-planning' }],
]
const BY = 'Delivered by our partners as senior supply chain professionals, before OpsFlow.'

export default function Page() {
  const own = (
    <>
      <div className="kick">Our experience</div>
      <h2>Results our partners delivered <em>before OpsFlow.</em></h2>
      <p className="intro">Anonymized, with approximate figures. These results come from our partners&apos; previous roles, not from OpsFlow client engagements.</p>
      <div className="cgrid g3">
        {T.own.map((c, i) => (
          <article key={c.title} className="card case">
            <span className="tag">Case {i + 1}</span>
            <h3>{c.title}</h3>
            <div className="big">{BIG[i].n}<small>{BIG[i].s}</small></div>
            <div className="flow">
              <div><b>PROBLEM</b><p>{c.problem}</p></div>
              <div><b>INTERVENTION</b><p>{c.intervention}</p></div>
              <div className="res"><b>RESULT</b><p>{c.result}</p></div>
            </div>
            <p className="by">{BY}</p>
          </article>
        ))}
      </div>
    </>
  )
  const market = (
    <>
      <div className="kick">Market proof</div>
      <h2>Published results from <em>large companies.</em></h2>
      <p className="notice"><b>Note.</b> {T.marketNote}</p>
      <p className="intro">{T.marketIntro}</p>
      <div className="cgrid g3">
        {T.market.map((c) => {
          const [company, ...rest] = c.title.split(': ')
          const sub = rest.join(': ')
          const results = c.results.split(/\.\s+/).map((r) => r.replace(/\.$/, '')).filter(Boolean)
          return (
            <article key={c.title} className="card">
              <span className="tag">{company}</span>
              <h3>{sub ? sub.charAt(0).toUpperCase() + sub.slice(1) : company}</h3>
              <div><b className="tag" style={{ color: 'var(--mute)' }}>WHAT CHANGED</b><p style={{ marginTop: 4 }}>{c.changed}</p></div>
              <div><b className="tag">RESULTS</b><ul className="ticks" style={{ marginTop: 8 }}>{results.map((r) => <li key={r}>{r}</li>)}</ul></div>
              <p className="lesson"><b>Key lesson.</b> {c.lesson}</p>
              <p className="src">Source: <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer nofollow">{c.sourceLabel} <span aria-hidden="true">↗</span></a></p>
            </article>
          )
        })}
      </div>
    </>
  )
  const approach = (
    <>
      <div className="kick">The OpsFlow approach</div>
      <h2>The same principles, <em>sized for growing companies.</em></h2>
      <p className="intro">For each case, here is what OpsFlow would set up in a growing company, and the solutions that cover it. Most engagements start with the Supply Chain Health Check, part of our <a href="/en/services/supply-chain-audit" style={{ color: 'var(--teal)' }}>Supply Chain Audit</a>.</p>
      <div className="map">
        {T.own.map((c, i) => (
          <div key={c.title} className="row">
            <div><span className="k">Case {i + 1}</span><h3>{c.title}</h3></div>
            <div><span className="k">What OpsFlow would set up</span><p>{c.setup}</p></div>
            <div className="links">
              <span className="k">Related solutions</span>
              {RELATED[i].map((r) => <a key={r.h} href={r.h}>{r.l} <Arrow /></a>)}
            </div>
          </div>
        ))}
      </div>
    </>
  )
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(META)) }} />
      <Band bg="cases"
        crumbs={[{ label: 'Home', href: '/en' }, { label: 'Case studies' }]}
        kick="Case studies"
        title={<>What happens when <em>supply chains work better.</em></>}
        lead="Three kinds of proof: results our partners delivered before OpsFlow, published examples from large companies, and how we apply the same principles to growing companies."
        actions={<a className="btn" href={CALENDLY} target="_blank" rel="noopener">Book a free 45-minute session <Arrow /></a>}
      />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: 24 }}>
          <CaseTabs panels={[
            { id: 'our-experience', label: 'Our experience', content: own },
            { id: 'market-proof', label: 'Market proof', content: market },
            { id: 'opsflow-approach', label: 'The OpsFlow approach', content: approach },
          ]} />
        </section>
        <CTA
          lang="en"
          h2="Want to know what this could look like for you?"
          text="Start with a free 45-minute session. Free, no commitment."
          secondary={{ label: 'See how we work', href: '/en/how-we-work' }}
        />
      </main>
      <Footer lang="en" />
    </>
  )
}
