import type { Metadata } from 'next'
import { CTA, Footer } from '@/components/CTAFooter'
import { Band } from '@/components/dark/Band'
import { InsightsGrid } from '@/components/dark/InsightsGrid'
import { ressourcesEn } from '@/lib/ressources_en'
import { BASE } from '@/lib/pages_en'
import { TOPICS, TOPIC_ORDER, topicOf } from '@/lib/insights_meta'

export const metadata: Metadata = {
  title: 'Insights: Supply Chain and Operations for SMEs',
  description: 'Practical fact sheets on S&OP, processes and supply chain for SMEs: definitions, methods and guidance.',
  alternates: { canonical: 'https://www.opsflow-advisory.ch/en/insights' },
}

export default function Hub() {
  const cards = ressourcesEn
    .map((r) => {
      const t = topicOf(r.slug)
      return { slug: r.slug, title: r.title, description: r.description, topic: t.id, topicLabel: t.label, tile: t.tile }
    })
    .sort((a, b) => TOPIC_ORDER.indexOf(a.topic as never) - TOPIC_ORDER.indexOf(b.topic as never))
  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/en` },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: `${BASE}/en/insights` },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbLd) }} />
      <Band bg="insights"
        crumbs={[{ label: 'Home', href: '/en' }, { label: 'Insights' }]}
        kick="Insights"
        title={<>Practical insights for <em>better supply chains.</em></>}
        lead="Short, practical articles on planning, inventory, S&OP/IBP, suppliers and operations, written for SME leaders and their teams."
      />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: 32 }}>
          <div className="kick">Browse by topic</div>
          <InsightsGrid cards={cards} topics={TOPICS.map((t) => ({ id: t.id, label: t.label }))} />
        </section>
        <CTA
          lang="en"
          h2="Prefer to talk it through?"
          text="Bring your question to a free 45-minute session. Free, no commitment."
        />
      </main>
      <Footer lang="en" />
    </>
  )
}
