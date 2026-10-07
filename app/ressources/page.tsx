import type { Metadata } from 'next'
import { Band } from '@/components/dark/Band'
import { CTA, Footer } from '@/components/CTAFooter'
import { ressources } from '@/lib/ressources'

export const metadata: Metadata = {
  title: 'Ressources — supply chain et processus pour PME',
  description:
    'Fiches courtes et concrètes sur le S&OP, les processus et la supply chain, pensées pour les PME romandes : définitions, méthodes et repères.',
  alternates: { canonical: 'https://www.opsflow-advisory.ch/ressources' },
}

export default function Hub() {
  return (
    <>
      <Band bg="insights"
        lang="fr"
        crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Ressources' }]}
        kick="Ressources"
        title="Ressources"
        lead="Des fiches courtes et concrètes sur le S&OP, les processus et la supply chain, pensées pour les PME."
      />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: 32 }}>
          <div className="cgrid g3">
            {ressources.map((r) => (
              <a key={r.slug} className="card" href={`/ressources/${r.slug}`}>
                <h2 style={{ fontSize: 19, lineHeight: 1.3, fontWeight: 700, marginTop: 0, letterSpacing: '-.01em' }}>{r.h1}</h2>
                <p>{r.description}</p>
                <span className="more">Lire la fiche <span aria-hidden="true">→</span></span>
              </a>
            ))}
          </div>
        </section>
        <CTA lang="fr" />
      </main>
      <Footer lang="fr" />
    </>
  )
}
