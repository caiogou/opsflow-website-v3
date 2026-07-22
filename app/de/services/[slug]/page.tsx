import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { servicesDe, getServiceDe } from '@/lib/services_de'

const BASE = 'https://www.opsflow-advisory.ch'
const CALENDLY = 'https://calendly.com/caio-opsflow-advisory/30min'

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
  const main = { '@context': 'https://schema.org', '@type': 'Service', name: r.h1, description: r.description, inLanguage: 'de', serviceType: r.h1, areaServed: ['Switzerland','EMEA'], provider: {{ '@type':'Organization', name:'OpsFlow Advisory', url: BASE }}, url }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: r.faq.map((f) => ({ '@type':'Question', name: f.q, acceptedAnswer: { '@type':'Answer', text: f.a } })) }
  return (
    <>
      <Navbar lang="de" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(main) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <style>{`
        .ressource-body h1{font-size:2rem;line-height:1.2;font-weight:600;color:#0f2a4a;margin:0 0 1.25rem}
        .ressource-body h2{font-size:1.4rem;font-weight:700;color:#0f2a4a;margin:2rem 0 .75rem}
        .ressource-body h3{font-size:1.05rem;font-weight:700;color:#1a9e8f;margin:1.25rem 0 .35rem}
        .ressource-body p{color:#374151;line-height:1.75;margin:0 0 1rem}
        .ressource-body ul{margin:0 0 1rem 1.25rem;list-style:disc}
        .ressource-body li{color:#374151;line-height:1.7;margin:.25rem 0}
        .ressource-body a{color:#1a9e8f;text-decoration:underline}
`}</style>
      <main className="max-w-3xl mx-auto px-6 md:px-8 py-14 md:py-20">
        <p className="text-xs font-bold tracking-widest uppercase mb-6"><a href="/de/services" className="no-underline text-teal">Leistungen</a></p>
        <article className="ressource-body" dangerouslySetInnerHTML={{ __html: r.bodyHtml }} />
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <a href={CALENDLY} target="_blank" rel="noopener" className="bg-teal text-white px-7 py-3 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">Termin buchen</a>
          <a href="/de/diagnostic" className="text-sm font-semibold text-navy underline">Kostenlose Diagnostik</a>
        </div>
        <section className="mt-14 border-t border-gray-200 pt-8">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">Weitere Leistungen</p>
          <ul className="space-y-2 list-none pl-0">
            {others.map((o) => (
              <li key={o.slug}><a href={`/de/services/${o.slug}`} className="text-navy hover:text-teal no-underline">{o.h1}</a></li>
            ))}
            <li className="pt-2"><a href="/de/ressources" className="text-teal no-underline text-sm font-semibold">→ Unsere Fachressourcen</a></li>
          </ul>
        </section>
      </main>
    </>
  )
}
