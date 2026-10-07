import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Article } from '@/components/dark/Article'
import { servicesDe, getServiceDe } from '@/lib/services_de'
import { serviceBg } from '@/lib/bg'


const BASE = 'https://www.opsflow-advisory.ch'

export function generateStaticParams() {
  return servicesDe.map((r) => ({ slug: r.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = getServiceDe(params.slug)
  if (!r) return {}
  const url = `${BASE}/de/services/${r.slug}`
  return { title: r.title, description: r.description, alternates: { canonical: url }, openGraph: { title: r.title, description: r.description, url, type: 'website' } }
}

export default function Page({ params }: { params: { slug: string } }) {
  const r = getServiceDe(params.slug)
  if (!r) notFound()
  const url = `${BASE}/de/services/${r.slug}`
  const others = servicesDe.filter((x) => x.slug !== r.slug)
  const main = { '@context': 'https://schema.org', '@type': 'Service', name: r.h1, description: r.description, inLanguage: 'de', serviceType: r.h1, areaServed: ['Switzerland','EMEA'], provider: { '@type':'Organization', name:'OpsFlow Advisory', url: BASE }, url }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: r.faq.map((f) => ({ '@type':'Question', name: f.q, acceptedAnswer: { '@type':'Answer', text: f.a } })) }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(main) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <Article bg={serviceBg(params.slug)}
        lang="de"
        crumbs={[{ label: 'Start', href: '/de' }, { label: 'Leistungen', href: '/de/services' }, { label: r.h1 }]}
        kick="Leistungen"
        title={r.h1}
        lead={r.description}
        html={r.bodyHtml}
        faq={r.faq}
        aside={
          <div className="pn others">
            <h5>Weitere Leistungen</h5>
            {others.slice(0, 6).map((o) => <a key={o.slug} href={`/de/services/${o.slug}`}>{o.h1} <span aria-hidden="true">›</span></a>)}
            <a href="/de/ressources">Unsere Fachressourcen <span aria-hidden="true">›</span></a>
          </div>
        }
      />
    </>
  )
}
