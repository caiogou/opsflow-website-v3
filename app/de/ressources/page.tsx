import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { ressourcesDe } from '@/lib/ressources_de'

export const metadata: Metadata = {
  title: 'Ressourcen — Supply Chain & Prozesse für KMU',
  description: 'Praktische Merkblätter zu S&OP, Prozessen und Supply Chain für KMU: Definitionen, Methoden und Orientierung.',
  alternates: { canonical: 'https://www.opsflow-advisory.ch/de/ressources' },
}

export default function Hub() {
  return (
    <>
      <Navbar lang="de" />
      <main className="max-w-3xl mx-auto px-6 md:px-8 py-14 md:py-20">
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4">Ressourcen</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">Kurze, konkrete Merkblätter zu S&OP, Prozessen und Supply Chain — für KMU gedacht.</p>
        <ul className="space-y-5 list-none pl-0">
          {ressourcesDe.map((r) => (
            <li key={r.slug} className="border-b border-gray-100 pb-5">
              <a href={`/de/ressources/${r.slug}`} className="no-underline block">
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
