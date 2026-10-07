import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Article } from '@/components/dark/Article'
import { services, getService } from '@/lib/services'
import { serviceBg } from '@/lib/bg'


const BASE = 'https://www.opsflow-advisory.ch'

export function generateStaticParams() {
  return services.map((r) => ({ slug: r.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = getService(params.slug)
  if (!r) return {}
  const url = `${BASE}/services/${r.slug}`
  return {
    title: r.title,
    description: r.description,
    alternates: { canonical: url },
    openGraph: { title: r.title, description: r.description, url, type: 'website' },
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  const r = getService(params.slug)
  if (!r) notFound()
  const url = `${BASE}/services/${r.slug}`
  const others = services.filter((x) => x.slug !== r.slug)
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: r.h1,
    description: r.description,
    inLanguage: 'fr',
    serviceType: r.h1,
    areaServed: ['Switzerland', 'EMEA'],
    provider: { '@type': 'Organization', name: 'OpsFlow Advisory', url: BASE },
    url,
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: r.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Article bg={serviceBg(params.slug)}
        lang="fr"
        crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Services', href: '/services' }, { label: r.h1 }]}
        kick="Services"
        title={r.h1}
        lead={r.description}
        html={r.bodyHtml}
        faq={r.faq}
        aside={
          <div className="pn others">
            <h5>Autres services</h5>
            {others.slice(0, 6).map((o) => <a key={o.slug} href={`/services/${o.slug}`}>{o.h1} <span aria-hidden="true">›</span></a>)}
            <a href="/ressources">Nos ressources techniques <span aria-hidden="true">›</span></a>
          </div>
        }
      />
    </>
  )
}
