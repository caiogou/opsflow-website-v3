import type { ReactNode } from 'react'
import { Money } from '@/components/ui/Money'

type Lang = 'fr' | 'de' | 'en'

// 23/set/2026: removed "MIT", "20+ years EMEA & LATAM" and "4 practice areas" (Caio). Only verifiable facts.
const C: Record<Lang, { id: string; num: ReactNode; label: string }[]> = {
  fr: [
    { id: 'senior', num: 'Senior', label: 'Chaque appel mené par un expert senior' },
    { id: 'follow', num: 'Suivi', label: 'Nous suivons le plan jusqu’aux résultats' },
    { id: 'diag', num: '5', label: 'Diagnostics gratuits sur vos propres données' },
    { id: 'zero', num: <Money chf={0} />, label: 'Pour commencer — session gratuite' },
  ],
  de: [
    { id: 'senior', num: 'Senior', label: 'Jedes Gespräch von einer erfahrenen Fachperson geführt' },
    { id: 'follow', num: 'Umsetzung', label: 'Wir begleiten den Plan bis zum Ergebnis' },
    { id: 'diag', num: '5', label: 'Kostenlose Diagnosen mit Ihren eigenen Daten' },
    { id: 'zero', num: <Money chf={0} />, label: 'Für den Anfang — kostenlose Session' },
  ],
  en: [
    { id: 'senior', num: 'Senior', label: 'Every call led by a senior practitioner' },
    { id: 'follow', num: 'On track', label: 'We follow the plan until results land' },
    { id: 'diag', num: '5', label: 'Free diagnostics on your own data' },
    { id: 'zero', num: <Money chf={0} />, label: 'To start — free session' },
  ],
}

export function Stats({ lang = 'fr' }: { lang?: Lang }) {
  const stats = C[lang]
  return (
    <div className="bg-navy-deep border-t border-navy-mid py-8 px-6 md:py-10 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.id} className="text-center">
            <div className="font-serif text-4xl text-teal">{s.num}</div>
            <div className="text-xs text-teal-muted mt-2 leading-snug">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
