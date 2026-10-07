import type { Metadata } from 'next'
import { Band } from '@/components/dark/Band'
import { CTA, Footer } from '@/components/CTAFooter'
import { servicesDe } from '@/lib/services_de'

export const metadata: Metadata = {
  title: 'Leistungen — Supply-Chain-Beratung & S&OP für KMU',
  description: 'Unsere Beratungsmandate: S&OP, Bestandsoptimierung, Risikomanagement, Distribution und Supply Chain Health Check.',
  alternates: { canonical: 'https://www.opsflow-advisory.ch/de/services' },
}

export default function Hub() {
  return (
    <>
      <Band bg="solutions"
        lang="de"
        crumbs={[{ label: 'Start', href: '/de' }, { label: 'Leistungen' }]}
        kick="Leistungen"
        title="Leistungen"
        lead="Klar abgegrenzte Mandate, von einem Senior geführt, die Ihre Teams eigenständig machen."
      />
      <main id="main">
        <section className="wrap sec" style={{ paddingTop: 32 }}>
          <div className="cgrid g3">
            {servicesDe.map((r) => (
              <a key={r.slug} className="card" href={`/de/services/${r.slug}`}>
                <h2 style={{ fontSize: 19, lineHeight: 1.3, fontWeight: 700, marginTop: 0, letterSpacing: '-.01em' }}>{r.h1}</h2>
                <p>{r.description}</p>
                <span className="more">Mehr erfahren <span aria-hidden="true">→</span></span>
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
