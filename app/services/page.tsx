import type { Metadata } from 'next'
import { Band } from '@/components/dark/Band'
import { CTA, Footer } from '@/components/CTAFooter'
import { services } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Services — conseil supply chain & S&OP pour PME',
  description:
    'Nos missions de conseil en supply chain pour PME et entreprises : S&OP, optimisation des stocks, gestion des risques, distribution et Supply Chain Health Check.',
  alternates: { canonical: 'https://www.opsflow-advisory.ch/services' },
}

export default function Hub() {
  return (
    <>
      <Band bg="solutions"
        lang="fr"
        crumbs={[{ label: 'Accueil', href: '/' }, { label: 'Services' }]}
        kick="Services"
        title="Services"
        lead="Des missions à périmètre clair, pilotées par un senior, qui laissent vos équipes autonomes."
      />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: 32 }}>
          <div className="cgrid g3">
            {services.map((r) => (
              <a key={r.slug} className="card" href={`/services/${r.slug}`}>
                <h2 style={{ fontSize: 19, lineHeight: 1.3, fontWeight: 700, marginTop: 0, letterSpacing: '-.01em' }}>{r.h1}</h2>
                <p>{r.description}</p>
                <span className="more">En savoir plus <span aria-hidden="true">→</span></span>
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
