type Lang = 'fr' | 'de' | 'en'
type Col = { tag: string; title: string; points: string[] }

// Positioning (Caio, 23/set/2026): we do the supply chain strategy, and a senior professional follows the plan,
// runs calls with the client and adjusts the plan to keep it on track.
const C: Record<Lang, { rubric: string; h2a: string; h2b: string; intro: string; cols: Col[]; vs: string[] }> = {
  en: {
    rubric: 'How we engage', h2a: 'Strategy and follow-through.', h2b: 'One team, from plan to results.',
    intro: 'Most firms either hand over a strategy deck, or place a team inside your company. We do both halves of the job — without taking over your operations. AI-assisted analysis speeds up the work; the judgement and the recommendations stay with senior people.',
    cols: [
      { tag: '01 · Strategy', title: 'We design the supply chain strategy', points: ['Diagnose with your own data', 'Set priorities by P&L impact', 'Design the S&OP/IBP cycle, the supply plan and the order-to-delivery flow', 'A 90-day plan your team can execute'] },
      { tag: '02 · Senior follow-through', title: 'A senior professional keeps it on track', points: ['Regular calls with your planning team', 'Supervises your planning cycle — you keep running it', 'Tracks the KPIs and the plan every month', 'Adjusts the plan when reality changes'] },
    ],
    vs: ['Embedded leadership, not an embedded team', 'Not a generic report left on a shelf', 'Senior people on every call', 'AI-assisted, senior-led'],
  },
  fr: {
    rubric: 'Notre façon de travailler', h2a: 'La stratégie et le suivi.', h2b: 'Une seule équipe, du plan aux résultats.',
    intro: 'La plupart des cabinets livrent une stratégie en slides, ou placent une équipe chez vous. Nous faisons les deux moitiés du travail — sans prendre la main sur vos opérations. L’IA accélère les analyses ; le jugement et les recommandations restent entre des mains seniors.',
    cols: [
      { tag: '01 · Stratégie', title: 'Nous construisons la stratégie supply chain', points: ['Diagnostic sur vos propres données', 'Priorités classées par impact sur le résultat', 'Conception du cycle S&OP/IBP, du plan d’approvisionnement et du flux commande–livraison', 'Un plan à 90 jours exécutable par vos équipes'] },
      { tag: '02 · Suivi senior', title: 'Un professionnel senior garde le cap', points: ['Des appels réguliers avec votre équipe de planification', 'Il supervise votre cycle de planification — vous le pilotez', 'Suivi mensuel des indicateurs et du plan', 'Ajustement du plan quand la réalité change'] },
    ],
    vs: ['Un leadership intégré, pas une équipe à demeure', 'Pas de rapport générique qui dort dans un tiroir', 'Des seniors à chaque appel', 'Assisté par l’IA, piloté par des seniors'],
  },
  de: {
    rubric: 'Wie wir arbeiten', h2a: 'Strategie und Begleitung.', h2b: 'Ein Team, vom Plan bis zum Ergebnis.',
    intro: 'Die meisten Beratungen liefern entweder ein Strategiedeck oder setzen ein Team in Ihr Unternehmen. Wir übernehmen beide Hälften — ohne Ihren Betrieb zu übernehmen. KI-gestützte Analysen beschleunigen die Arbeit; Urteil und Empfehlungen bleiben bei erfahrenen Leuten.',
    cols: [
      { tag: '01 · Strategie', title: 'Wir entwickeln die Supply-Chain-Strategie', points: ['Diagnose mit Ihren eigenen Daten', 'Prioritäten nach Ergebniswirkung', 'Aufbau von S&OP-/IBP-Zyklus, Versorgungsplan und Order-to-Delivery-Ablauf', 'Ein 90-Tage-Plan, den Ihr Team umsetzen kann'] },
      { tag: '02 · Senior-Begleitung', title: 'Eine erfahrene Fachperson hält Kurs', points: ['Regelmässige Calls mit Ihrem Planungsteam', 'Begleitet Ihren Planungszyklus — Sie führen ihn weiter', 'Monatliche Nachverfolgung von Kennzahlen und Plan', 'Passt den Plan an, wenn sich die Realität ändert'] },
    ],
    vs: ['Eingebettete Führung, kein eingebettetes Team', 'Kein generischer Bericht für die Schublade', 'Erfahrene Leute in jedem Call', 'KI-gestützt, senior geführt'],
  },
}

export function Approach({ lang = 'fr' }: { lang?: Lang }) {
  const t = C[lang]
  return (
    <section id="approach" className="py-16 px-6 md:py-24 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{t.rubric}</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">{t.h2a}<br />{t.h2b}</h2>
        <p className="text-base text-gray-500 leading-relaxed max-w-2xl mb-10 md:mb-14">{t.intro}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {t.cols.map((c) => (
            <div key={c.tag} className="rounded-lg border border-gray-200 p-9 hover:border-teal transition-colors">
              <p className="text-xs font-bold tracking-widest text-teal uppercase mb-3">{c.tag}</p>
              <h3 className="text-xl font-bold text-navy mb-5">{c.title}</h3>
              <ul className="space-y-2">
                {c.points.map((p) => (
                  <li key={p} className="text-sm text-gray-600 flex gap-2"><span className="text-teal">✓</span>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {t.vs.map((v) => (
            <span key={v} className="bg-teal-pale text-emerald-800 text-xs px-3 py-1.5 rounded-full font-medium">{v}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
