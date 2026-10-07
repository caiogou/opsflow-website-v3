import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Article } from '@/components/dark/Article'
import { ressourcesDe, getRessourceDe } from '@/lib/ressources_de'


const BASE = 'https://www.opsflow-advisory.ch'

export function generateStaticParams() {
  return ressourcesDe.map((r) => ({ slug: r.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = getRessourceDe(params.slug)
  if (!r) return {}
  const url = `${BASE}/de/ressources/${r.slug}`
  return { title: r.title, description: r.description, alternates: { canonical: url }, openGraph: { title: r.title, description: r.description, url, type: 'website' } }
}

export default function Page({ params }: { params: { slug: string } }) {
  const r = getRessourceDe(params.slug)
  if (!r) notFound()
  const url = `${BASE}/de/ressources/${r.slug}`
  const others = ressourcesDe.filter((x) => x.slug !== r.slug)
  const main = { '@context': 'https://schema.org', '@type': 'Article', headline: r.h1, description: r.description, inLanguage: 'de', mainEntityOfPage: url, url }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: r.faq.map((f) => ({ '@type':'Question', name: f.q, acceptedAnswer: { '@type':'Answer', text: f.a } })) }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(main) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <Article bg={"insights"}
        lang="de"
        crumbs={[{ label: 'Start', href: '/de' }, { label: 'Ressourcen', href: '/de/ressources' }, { label: r.h1 }]}
        kick="Ressourcen"
        title={r.h1}
        lead={r.description}
        html={r.bodyHtml}
        faq={r.faq}
        aside={
          <div className="pn others">
            <h5>Auch lesenswert</h5>
            {others.slice(0, 6).map((o) => <a key={o.slug} href={`/de/ressources/${o.slug}`}>{o.h1} <span aria-hidden="true">›</span></a>)}
            <a href="/de/services">Unsere Leistungen <span aria-hidden="true">›</span></a>
          </div>
        }
      />
    </>
  )
}
