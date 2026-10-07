import type { Metadata } from 'next'
import { Band } from '@/components/dark/Band'
import { CTA, Footer } from '@/components/CTAFooter'
import { ressourcesDe } from '@/lib/ressources_de'

export const metadata: Metadata = {
  title: 'Ressourcen — Supply Chain & Prozesse für KMU',
  description: 'Praktische Merkblätter zu S&OP, Prozessen und Supply Chain für KMU: Definitionen, Methoden und Orientierung.',
  alternates: { canonical: 'https://www.opsflow-advisory.ch/de/ressources' },
}

export default function Hub() {
  return (
    <>
      <Band bg="insights"
        lang="de"
        crumbs={[{ label: 'Start', href: '/de' }, { label: 'Ressourcen' }]}
        kick="Ressourcen"
        title="Ressourcen"
        lead="Kurze, konkrete Merkblätter zu S&OP, Prozessen und Supply Chain — für KMU gedacht."
      />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: 32 }}>
          <div className="cgrid g3">
            {ressourcesDe.map((r) => (
              <a key={r.slug} className="card" href={`/de/ressources/${r.slug}`}>
                <h2 style={{ fontSize: 19, lineHeight: 1.3, fontWeight: 700, marginTop: 0, letterSpacing: '-.01em' }}>{r.h1}</h2>
                <p>{r.description}</p>
                <span className="more">Weiterlesen <span aria-hidden="true">→</span></span>
              </a>
            ))}
          </div>
        </section>
        <CTA lang="de" />
      </main>
      <Footer lang="de" />
    </>
  )
}
