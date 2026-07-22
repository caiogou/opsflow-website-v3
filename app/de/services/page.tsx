import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { servicesDe } from '@/lib/services_de'

export const metadata: Metadata = {
  title: 'Leistungen — Supply-Chain-Beratung & S&OP für KMU',
  description: 'Unsere Beratungsmandate: S&OP, Bestandsoptimierung, Risikomanagement, Distribution und Rapid Assessment.',
  alternates: { canonical: 'https://www.opsflow-advisory.ch/de/services' },
}

export default function Hub() {
  return (
    <>
      <Navbar lang="de" />
      <main className="max-w-3xl mx-auto px-6 md:px-8 py-14 md:py-20">
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4">Leistungen</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">Klar abgegrenzte Mandate, von einem Senior geführt, die Ihre Teams eigenständig machen.</p>
        <ul className="space-y-5 list-none pl-0">
          {servicesDe.map((r) => (
            <li key={r.slug} className="border-b border-gray-100 pb-5">
              <a href={`/de/services/${r.slug}`} className="no-underline block">
                <h2 className="text-xl font-bold text-navy hover:text-teal">{r.h1}</h2>
                <p className="text-sm text-gray-500 mt-1">{r.description}</p>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
