import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { ressourcesEn } from '@/lib/ressources_en'

export const metadata: Metadata = {
  title: 'Insights: Supply Chain and Operations for SMEs',
  description: 'Practical fact sheets on S&OP, processes and supply chain for SMEs: definitions, methods and guidance.',
  alternates: { canonical: 'https://www.opsflow-advisory.ch/en/insights' },
}

export default function Hub() {
  return (
    <>
      <Navbar lang="en" />
      <main className="max-w-3xl mx-auto px-6 md:px-8 py-14 md:py-20">
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4">Insights</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">Short, practical articles on S&OP, planning and supply chain, written for SMEs.</p>
        <ul className="space-y-5 list-none pl-0">
          {ressourcesEn.map((r) => (
            <li key={r.slug} className="border-b border-gray-100 pb-5">
              <a href={`/en/insights/${r.slug}`} className="no-underline block">
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
