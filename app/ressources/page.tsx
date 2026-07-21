import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
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
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 md:px-8 py-14 md:py-20">
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4">Ressources</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          Des fiches courtes et concrètes sur le S&amp;OP, les processus et la supply chain, pensées pour les PME.
        </p>
        <ul className="space-y-5 list-none pl-0">
          {ressources.map((r) => (
            <li key={r.slug} className="border-b border-gray-100 pb-5">
              <a href={`/ressources/${r.slug}`} className="no-underline block">
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
