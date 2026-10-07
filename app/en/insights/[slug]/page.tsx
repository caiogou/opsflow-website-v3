import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Article } from '@/components/dark/Article'
import { CTA } from '@/components/CTAFooter'
import { ressourcesEn, getRessourceEn } from '@/lib/ressources_en'
import { INSIGHT_TOPIC, topicOf } from '@/lib/insights_meta'
import { insightBg } from '@/lib/bg'


const BASE = 'https://www.opsflow-advisory.ch'

export function generateStaticParams() {
  return ressourcesEn.map((r) => ({ slug: r.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = getRessourceEn(params.slug)
  if (!r) return {}
  const url = `${BASE}/en/insights/${r.slug}`
  return { title: r.title, description: r.description, alternates: { canonical: url }, openGraph: { title: r.title, description: r.description, url, type: 'website' } }
}

// The solution most related to each topic.
const SOLUTION_FOR: Record<string, { label: string; href: string }[]> = {
  sop: [{ label: 'S&OP Consulting', href: '/en/services/s-op-consulting' }, { label: 'Supply Chain Audit', href: '/en/services/supply-chain-audit' }],
  planning: [{ label: 'S&OP Consulting', href: '/en/services/s-op-consulting' }, { label: 'Inventory Optimization', href: '/en/services/inventory-optimization' }],
  inventory: [{ label: 'Inventory Optimization', href: '/en/services/inventory-optimization' }, { label: 'Distribution Planning', href: '/en/services/distribution-planning' }],
  suppliers: [{ label: 'Supply Chain Risk Management', href: '/en/services/supply-chain-risk-management' }, { label: 'Inventory Optimization', href: '/en/services/inventory-optimization' }],
  operations: [{ label: 'Supply Chain Audit', href: '/en/services/supply-chain-audit' }, { label: 'Distribution Planning', href: '/en/services/distribution-planning' }],
}

export default function Page({ params }: { params: { slug: string } }) {
  const r = getRessourceEn(params.slug)
  if (!r) notFound()
  const url = `${BASE}/en/insights/${r.slug}`
  const topic = topicOf(r.slug)
  const same = ressourcesEn.filter((x) => x.slug !== r.slug && INSIGHT_TOPIC[x.slug] === topic.id)
  const more = [...same, ...ressourcesEn.filter((x) => x.slug !== r.slug && INSIGHT_TOPIC[x.slug] !== topic.id)].slice(0, 3)
  const main = { '@context': 'https://schema.org', '@type': 'Article', headline: r.h1, description: r.description, inLanguage: 'en', mainEntityOfPage: url, url }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: r.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/en` },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: `${BASE}/en/insights` },
      { '@type': 'ListItem', position: 3, name: r.h1, item: url },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(main) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <Article bg={insightBg(params.slug)}
        lang="en"
        crumbs={[{ label: 'Home', href: '/en' }, { label: 'Insights', href: '/en/insights' }, { label: topic.label }]}
        kick={topic.label}
        title={r.h1}
        lead={r.description}
        html={r.bodyHtml}
        faq={r.faq}
        aside={
          <div className="pn others">
            <h5>Related solutions</h5>
            {SOLUTION_FOR[topic.id].map((s) => <a key={s.href} href={s.href}>{s.label} <span aria-hidden="true">›</span></a>)}
            <a href="/en/insights">All insights <span aria-hidden="true">›</span></a>
          </div>
        }
        after={<>
          <section className="wrap sec">
            <div className="kick">Insights</div>
            <h2>Also worth reading.</h2>
            <div className="rel">
              {more.map((o) => <a key={o.slug} href={`/en/insights/${o.slug}`}><span>{topicOf(o.slug).label}</span><b>{o.title}</b></a>)}
            </div>
          </section>
          <CTA lang="en" h2="Bring your figures. Leave with a plain answer." text="A free 45-minute session with a senior practitioner. Free, no commitment." />
        </>}
      />
    </>
  )
}
