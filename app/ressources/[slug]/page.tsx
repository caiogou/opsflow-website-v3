import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Article } from '@/components/dark/Article'
import { ressources, getRessource } from '@/lib/ressources'


const BASE = 'https://www.opsflow-advisory.ch'

export function generateStaticParams() {
  return ressources.map((r) => ({ slug: r.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = getRessource(params.slug)
  if (!r) return {}
  const url = `${BASE}/ressources/${r.slug}`
  return {
    title: r.title,
    description: r.description,
    alternates: { canonical: url },
    openGraph: { title: r.title, description: r.description, url, type: 'article' },
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  const r = getRessource(params.slug)
  if (!r) notFound()
  const url = `${BASE}/ressources/${r.slug}`
  const others = ressources.filter((x) => x.slug !== r.slug)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: r.h1,
    description: r.description,
    inLanguage: 'fr',
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'OpsFlow Advisory' },
    publisher: { '@type': 'Organization', name: 'OpsFlow Advisory' },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Article bg={"insights"}
        lang="fr"
        crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Ressources', href: '/ressources' }, { label: r.h1 }]}
        kick="Ressources"
        title={r.h1}
        lead={r.description}
        html={r.bodyHtml}
        faq={r.faq}
        aside={
          <div className="pn others">
            <h5>À lire aussi</h5>
            {others.slice(0, 6).map((o) => <a key={o.slug} href={`/ressources/${o.slug}`}>{o.h1} <span aria-hidden="true">›</span></a>)}
            <a href="/services">Nos services <span aria-hidden="true">›</span></a>
          </div>
        }
      />
    </>
  )
}
