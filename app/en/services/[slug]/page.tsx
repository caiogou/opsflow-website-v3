import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Footer } from '@/components/CTAFooter'
import { Band, Arrow } from '@/components/dark/Band'
import { Faqs } from '@/components/dark/Faqs'
import { Toc } from '@/components/dark/Toc'
import { ServiceViz } from '@/components/dark/ServiceViz'
import { servicesEn, getServiceEn } from '@/lib/services_en'
import { SERVICE_PAGES } from '@/lib/service_pages_en'
import { prepareBody } from '@/lib/prose'
import { CALENDLY } from '@/lib/booking'
import { serviceBg } from '@/lib/bg'


const BASE = 'https://www.opsflow-advisory.ch'

export function generateStaticParams() {
  return servicesEn.map((r) => ({ slug: r.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = getServiceEn(params.slug)
  if (!r) return {}
  const url = `${BASE}/en/services/${r.slug}`
  return { title: r.title, description: r.description, alternates: { canonical: url }, openGraph: { title: r.title, description: r.description, url, type: 'website' } }
}

const STEPS = [
  { n: '1', h: 'Free 45-minute session', p: 'A structured conversation about your supply chain reality. You leave with your top priorities clear, whether we work together or not.', em: 'Free, no commitment' },
  { n: '2', h: 'Supply Chain Health Check', p: 'Two-week structured diagnostic. Top 3 priorities ranked by P&L impact, a 90-day plan, an executive summary.', em: 'From CHF 8,500, fixed price' },
  { n: '3', h: 'Strategy and senior follow-through', p: 'We build the plan with you. A senior practitioner oversees execution with your team, month by month.', em: 'CHF 22,000 to 80,000 depending on scope' },
]

export default function Page({ params }: { params: { slug: string } }) {
  const r = getServiceEn(params.slug)
  const sp = SERVICE_PAGES[params.slug]
  if (!r || !sp) notFound()
  const url = `${BASE}/en/services/${r.slug}`
  const others = servicesEn.filter((x) => x.slug !== r.slug)
  const { body, toc } = prepareBody(r.bodyHtml, { lang: 'en', model: sp.model })
  const tocItems = [...toc, { id: 'faq', label: 'Frequently asked questions' }]
  const main = { '@context': 'https://schema.org', '@type': 'Service', name: r.h1, description: r.description, inLanguage: 'en', serviceType: r.h1, areaServed: ['Switzerland', 'EMEA'], provider: { '@type': 'Organization', name: 'OpsFlow Advisory', url: BASE }, url }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: r.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/en` },
      { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${BASE}/en/services` },
      { '@type': 'ListItem', position: 3, name: sp.short, item: url },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(main) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <Band bg={serviceBg(params.slug)}
        crumbs={[{ label: 'Home', href: '/en' }, { label: 'Solutions', href: '/en/services' }, { label: sp.short }]}
        title={<>{sp.h1a}<em>{sp.h1b}</em></>}
        lead={r.description}
        actions={<>
          <a className="btn" href={CALENDLY} target="_blank" rel="noopener">Book a free session <Arrow /></a>
          <a className="btn2" href="/diagnostic">Take the free S&amp;OP Self-Assessment ›</a>
        </>}
        aside={<ServiceViz slug={r.slug} />}
      >
        <div className="facts">
          {sp.facts.map((f) => <div key={f.b}><b>{f.b}</b>{f.s}</div>)}
        </div>
      </Band>

      <main id="main">
        <div className="wrap smain">
          <Toc items={tocItems} />
          <article className="prose-dk">
            <div dangerouslySetInnerHTML={{ __html: body }} className="prose-body" />
            <h2 id="faq">Frequently asked questions</h2>
            <Faqs items={r.faq} />
          </article>
          <aside className="aside" id="book">
            <div className="pn book">
              <div className="kick">Free 45-minute session</div>
              <h3 style={{ marginTop: 10 }}>{sp.bookQ}</h3>
              <ul><li>45 minutes, no commitment</li><li>Bring your recent figures</li><li>A plain answer in writing</li></ul>
              <a className="btn" href={CALENDLY} target="_blank" rel="noopener">Book a free session <Arrow /></a>
              <small>Senior practitioner on every call. We reply by email only about your request.</small>
            </div>
            {sp.offer && (
              <div className="pn offer">
                <div className="kick">The paid offer</div>
                <h3>Supply Chain Health Check</h3>
                <p>Two weeks, fixed price. Top 3 priorities ranked by P&amp;L impact, a 90-day plan, an executive summary.</p>
                <div className="price">From CHF 8,500 <small>fixed price</small></div>
              </div>
            )}
            <div className="pn others">
              <h5>Other services</h5>
              {others.map((o) => <a key={o.slug} href={`/en/services/${o.slug}`}>{SERVICE_PAGES[o.slug]?.short || o.h1} <span aria-hidden="true">›</span></a>)}
            </div>
          </aside>
        </div>

        <section className="wrap sec">
          <div className="kick">How it works</div>
          <h2>From first conversation <em>to measurable results.</em></h2>
          <div className="steps mini">
            {STEPS.map((s) => (
              <div key={s.n} className="pn"><div className="n">{s.n}</div><h3>{s.h}</h3><p>{s.p}</p><em>{s.em}</em></div>
            ))}
          </div>
        </section>

        <section className="wrap sec">
          <div className="kick">Insights</div>
          <h2>Read before the session.</h2>
          <div className="rel">
            {sp.related.map((x) => <a key={x.slug} href={`/en/insights/${x.slug}`}><span>{x.kind}</span><b>{x.title}</b></a>)}
          </div>
          <div className="close" style={{ marginTop: 40 }}>
            <h2>Bring your figures. Leave with a plain answer.</h2>
            <a className="btn" href={CALENDLY} target="_blank" rel="noopener">Book a free session <Arrow /></a>
          </div>
        </section>
      </main>
      <Footer lang="en" />
    </>
  )
}
