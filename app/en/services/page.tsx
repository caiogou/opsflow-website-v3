import type { Metadata } from 'next'
import { Footer, CTA } from '@/components/CTAFooter'
import { Band, Arrow } from '@/components/dark/Band'
import { CALENDLY } from '@/lib/booking'
import { BASE, PAGE_META, breadcrumbLd, pageMetadata } from '@/lib/pages_en'

const META = PAGE_META.solutions
export const metadata: Metadata = pageMetadata(META)

const SOLUTIONS = [
  { slug: 's-op-consulting', tag: 'Solution 01', name: 'S&OP Consulting', out: 'Replace decisions made under pressure with prepared decisions that hold.', ticks: ['One shared plan for sales, operations and finance, signed off by leadership', 'Fewer stockouts alongside unsold goods, fewer last-minute decisions', 'A cycle your team runs without depending on us'] },
  { slug: 'inventory-optimization', tag: 'Solution 02', name: 'Inventory Optimization', out: 'Less stock, better service: free up working capital without hurting service.', ticks: ['Cash freed from slow-moving stock', 'Safety stocks recalculated on real data, SKU by SKU', 'Service strengthened where it was lacking'] },
  { slug: 'supply-chain-risk-management', tag: 'Solution 03', name: 'Supply Chain Risk Management', out: 'See supply disruptions coming instead of suffering them.', ticks: ['Critical dependencies on suppliers, materials and regions made visible', 'Risks ranked by impact and probability', 'Targeted countermeasures and early-warning indicators where they matter'] },
  { slug: 'distribution-planning', tag: 'Solution 04', name: 'Distribution Planning', out: 'Serve every location at the right service level and the right cost.', ticks: ['No more out-of-stock stores alongside overflowing warehouses', 'Replenishment rules consistent with your target service level', 'An explicit trade-off between transport cost, stock and service'] },
  { slug: 'supply-chain-audit', tag: 'Starting point', name: 'Supply Chain Audit', out: 'Know where to act first, in two weeks, before you invest.', ticks: ['Top 3 priorities ranked by P&L impact', 'A 90-day plan and an executive summary for leadership', 'Delivered as the Supply Chain Health Check: two weeks, fixed price'] },
]

export default function Hub() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'OpsFlow supply chain solutions',
    itemListElement: SOLUTIONS.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: `${BASE}/en/services/${s.slug}` })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(META)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <Band bg="solutions"
        crumbs={[{ label: 'Home', href: '/en' }, { label: 'Solutions' }]}
        kick="Solutions"
        title={<>Practical solutions for <em>real supply chain challenges.</em></>}
        lead="For growing manufacturing and distribution companies across Europe: we fix how planning, inventory and operations work together, with your team."
        actions={<>
          <a className="btn" href={CALENDLY} target="_blank" rel="noopener">Book a free 45-minute session <Arrow /></a>
          <a className="btn2" href="#all">See the five solutions ›</a>
        </>}
        aside={
          <div className="pn" aria-label="Our scope">
            <h4>What we work on</h4>
            <ul className="plist">
              <li><b>1</b><div><strong>S&amp;OP/IBP</strong>One plan for sales, operations and finance</div></li>
              <li><b>2</b><div><strong>Supply planning</strong>Forecasts, inventory and replenishment</div></li>
              <li><b>3</b><div><strong>Order management</strong>Promises your operations can keep</div></li>
              <li><b>4</b><div><strong>Logistics</strong>Distribution at the right cost and service</div></li>
            </ul>
          </div>
        }
      />
      <main id="main">
        <section className="wrap sec" id="all">
          <div className="kick">Our solutions</div>
          <h2>Five solutions, <em>one goal:</em> decisions that hold.</h2>
          <p className="intro">Our scope is S&amp;OP/IBP, supply planning, order management and logistics. Each solution starts from your real situation and is sized to your scale.</p>
          <div className="cgrid g3">
            {SOLUTIONS.map((s) => (
              <a key={s.slug} className="card svc" href={`/en/services/${s.slug}`}>
                <span className="tag">{s.tag}</span>
                <h3>{s.name}</h3>
                <p className="out">{s.out}</p>
                <ul className="ticks">{s.ticks.map((t) => <li key={t}>{t}</li>)}</ul>
                <span className="more">Explore {s.name} <Arrow /></span>
              </a>
            ))}
            <div className="card" style={{ borderStyle: 'dashed' }}>
              <span className="tag">How we engage</span>
              <h3>From a free session to senior follow-through</h3>
              <p>Every engagement follows the same three steps. You decide at each one whether to go further.</p>
              <a className="more" href="/en/how-we-work">See how we work <Arrow /></a>
            </div>
          </div>
        </section>
        <CTA
          lang="en"
          kick="Not sure?"
          h2="Not sure which solution is right for you?"
          text="Start with a free 45-minute session. We look at your situation with you and tell you plainly where to begin. Free, no commitment."
        />
      </main>
      <Footer lang="en" />
    </>
  )
}
