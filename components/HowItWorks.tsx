type Lang = 'fr' | 'de' | 'en'
type Step = { num: string; title: string; desc: string; price: string }

const C: Record<Lang, { rubric: string; h2a: string; h2b: string; intro: string; steps: Step[] }> = {
  fr: {
    rubric: 'Notre approche', h2a: 'Du premier échange', h2b: 'à des résultats mesurables.',
    intro: 'Trois étapes. Des délais fixes. Aucune mission à durée indéterminée.',
    steps: [
      { num: '1', title: 'Session diagnostic gratuite', desc: 'Un échange structuré sur la réalité de votre supply chain. Vous repartez avec une vision claire de vos priorités, que nous travaillions ensemble ou non.', price: 'Gratuit — sans engagement' },
      { num: '2', title: 'Rapid Assessment', desc: 'Diagnostic structuré en 2 semaines. Vos 3 priorités classées par impact sur le résultat. Un plan d’action de 90 jours prêt à exécuter. Une synthèse pour votre direction.', price: 'Dès CHF 8 500 — prix fixe' },
      { num: '3', title: 'Mission complète', desc: 'Mise en œuvre du plan d’action, pilotée par un senior. 4 à 12 semaines selon le périmètre. Vos équipes s’approprient les résultats. Aucune dépendance créée.', price: 'CHF 22–80K selon le périmètre' },
    ],
  },
  de: {
    rubric: 'Unser Ansatz', h2a: 'Vom ersten Gespräch', h2b: 'zu messbaren Ergebnissen.',
    intro: 'Drei Schritte. Feste Fristen. Keine Mandate mit offenem Ende.',
    steps: [
      { num: '1', title: 'Kostenlose Standortbestimmung', desc: 'Ein strukturiertes Gespräch über die Realität Ihrer Supply Chain. Sie gehen mit einem klaren Bild Ihrer Prioritäten heraus — ob wir zusammenarbeiten oder nicht.', price: 'Kostenlos — unverbindlich' },
      { num: '2', title: 'Rapid Assessment', desc: 'Strukturierte Diagnose in 2 Wochen. Ihre 3 Prioritäten, nach Ergebniswirkung geordnet. Ein umsetzungsbereiter 90-Tage-Aktionsplan. Eine Zusammenfassung für Ihre Geschäftsleitung.', price: 'Ab CHF 8 500 — Festpreis' },
      { num: '3', title: 'Vollständiges Mandat', desc: 'Umsetzung des Aktionsplans, geführt von einer erfahrenen Person. 4 bis 12 Wochen je nach Umfang. Ihre Teams eignen sich die Ergebnisse an. Keine Abhängigkeit.', price: 'CHF 22–80K je nach Umfang' },
    ],
  },
  en: {
    rubric: 'How it works', h2a: 'From first conversation', h2b: 'to measurable results.',
    intro: 'Three steps. Fixed timelines. No open-ended engagements.',
    steps: [
      { num: '1', title: 'Free diagnostic session', desc: 'A structured conversation about your supply chain reality. You walk away with clarity on your top priorities whether we work together or not.', price: 'Free — no commitment' },
      { num: '2', title: 'Rapid Assessment', desc: '2-week structured diagnostic. Your top 3 priorities ranked by P&L impact. A 90-day action plan ready to execute. Executive summary for your leadership team.', price: 'Starting at CHF 8,500 — fixed price' },
      { num: '3', title: 'Full engagement', desc: 'Senior-led implementation of the action plan. 4–12 weeks depending on scope. Your team owns the results. No dependency created.', price: 'CHF 22–80K depending on scope' },
    ],
  },
}

export function HowItWorks({ lang = 'fr' }: { lang?: Lang }) {
  const t = C[lang]
  return (
    <section id="how" className="py-16 px-6 md:py-24 md:px-8 bg-teal-pale/30">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{t.rubric}</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">
          {t.h2a}<br />{t.h2b}
        </h2>
        <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">{t.intro}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {t.steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < t.steps.length - 1 && (
                <div className="absolute top-7 left-full w-12 flex items-center justify-center text-teal text-2xl -translate-x-6">
                  →
                </div>
              )}
              <div className="w-14 h-14 rounded-full bg-teal flex items-center justify-center text-white text-2xl font-serif mb-6">
                {s.num}
              </div>
              <h3 className="text-lg font-bold text-navy mb-3">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              <p className="text-xs text-teal font-semibold mt-4">{s.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
