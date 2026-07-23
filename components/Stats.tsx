type Lang = 'fr' | 'de' | 'en'

const C: Record<Lang, { num: string; label: string }[]> = {
  fr: [
    { num: '20+', label: 'Ans d’expérience EMEA & LATAM' },
    { num: 'MIT', label: 'Certifié en supply chain & logistique' },
    { num: '4', label: 'Domaines, un seul objectif : la marge' },
    { num: 'CHF 0', label: 'Pour commencer — session gratuite' },
  ],
  de: [
    { num: '20+', label: 'Jahre Erfahrung in EMEA & LATAM' },
    { num: 'MIT', label: 'Zertifiziert in Supply Chain & Logistik' },
    { num: '4', label: 'Handlungsfelder, ein Ziel: die Marge' },
    { num: 'CHF 0', label: 'Für den Anfang — kostenlose Session' },
  ],
  en: [
    { num: '20+', label: 'Years EMEA & LATAM experience' },
    { num: 'MIT', label: 'Certified in supply chain & logistics' },
    { num: '4', label: 'Practice areas, one goal: margin impact' },
    { num: 'CHF 0', label: 'To start — free session' },
  ],
}

export function Stats({ lang = 'fr' }: { lang?: Lang }) {
  const stats = C[lang]
  return (
    <div className="bg-navy-deep border-t border-navy-mid py-8 px-6 md:py-10 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.num} className="text-center">
            <div className="font-serif text-4xl text-teal">{s.num}</div>
            <div className="text-xs text-teal-muted mt-2 leading-snug">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
