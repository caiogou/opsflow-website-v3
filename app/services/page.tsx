import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { services } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Services — conseil supply chain & S&OP pour PME',
  description:
    'Nos missions de conseil en supply chain pour PME et entreprises : S&OP, optimisation des stocks, gestion des risques, distribution et Rapid Assessment.',
  alternates: { canonical: 'https://www.opsflow-advisory.ch/services' },
}

export default function Hub() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 md:px-8 py-14 md:py-20">
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4">Services</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          Des missions à périmètre clair, pilotées par un senior, qui laissent vos équipes autonomes.
        </p>
        <ul className="space-y-5 list-none pl-0">
          {services.map((r) => (
            <li key={r.slug} className="border-b border-gray-100 pb-5">
              <a href={`/services/${r.slug}`} className="no-underline block">
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
