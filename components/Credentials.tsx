type Lang = 'fr' | 'de' | 'en'
type Cred = { title: string; desc: string }

const C: Record<Lang, { rubric: string; h2a: string; h2b: string; intro: string; creds: Cred[] }> = {
  fr: {
    rubric: 'Pourquoi OpsFlow', h2a: 'Une expertise senior.', h2b: 'Pas de juniors. Pas de faux-semblant.',
    intro: 'Ce que vous voyez est ce que vous obtenez — la personne qui diagnostique votre problème pilote la solution.',
    creds: [
      { title: 'Direction senior de supply chain et d’opérations', desc: 'Des années de direction supply chain et opérations dans l’industrie, en Europe et en Amérique latine : planification, approvisionnements, commandes et logistique. Environnements réels, contraintes réelles, résultats réels.' },
      { title: 'Plus rapide et plus léger que les grands cabinets', desc: '6 semaines, pas 6 mois. Accès direct à un praticien senior dès le premier jour. Un coût plus bas à qualité stratégique égale. Aucun slide recyclé — tout est construit pour votre contexte.' },
      { title: 'Assisté par l’IA, piloté par des seniors', desc: 'Nous utilisons des outils assistés par l’IA pour accélérer les analyses — signaux de demande, stocks, scénarios. Le jugement et les recommandations restent entre des mains seniors.' },
    ],
  },
  de: {
    rubric: 'Warum OpsFlow', h2a: 'Seniorität und Erfahrung.', h2b: 'Keine Junioren. Kein Schein.',
    intro: 'Was Sie sehen, ist, was Sie bekommen — die Person, die Ihr Problem diagnostiziert, führt die Lösung.',
    creds: [
      { title: 'Senior-Führung in Supply Chain und Operations', desc: 'Jahre in Führungsrollen in Supply Chain und Operations in der Industrie, in Europa und Lateinamerika: Planung, Versorgung, Aufträge und Logistik. Reale Umgebungen, reale Zwänge, reale Ergebnisse.' },
      { title: 'Schneller und schlanker als grosse Beratungshäuser', desc: '6 Wochen statt 6 Monate. Direkter Zugang zu einer erfahrenen Fachperson ab dem ersten Tag. Geringere Kosten bei gleicher strategischer Qualität. Keine wiederverwendeten Folien — alles auf Ihren Kontext gebaut.' },
      { title: 'KI-gestützt, senior geführt', desc: 'Wir nutzen KI-gestützte Werkzeuge, um die Analysen zu beschleunigen — Nachfragesignale, Bestände, Szenarien. Urteil und Empfehlungen bleiben bei erfahrenen Leuten.' },
    ],
  },
  en: {
    rubric: 'Why OpsFlow', h2a: 'Senior expertise.', h2b: 'No junior consultants. No bait-and-switch.',
    intro: 'What you see is what you get — the same person who diagnoses your problem leads the solution.',
    creds: [
      { title: 'Senior supply chain and operations leadership', desc: 'Years of senior supply chain and operations roles in manufacturing, across Europe and Latin America: planning, supply, orders and logistics. Real environments, real constraints, real results.' },
      { title: 'Faster and leaner than big firms', desc: '6 weeks, not 6 months. Direct access to a senior practitioner from day one. Lower cost at the same strategic quality. No recycled slide decks — everything built for your context.' },
      { title: 'AI-assisted, senior-led', desc: 'We use AI-assisted tools to speed up the analysis — demand signals, inventory, scenarios. The judgement and the recommendations stay with senior people.' },
    ],
  },
}

export function Credentials({ lang = 'fr' }: { lang?: Lang }) {
  const t = C[lang]
  return (
    <section id="why" className="py-16 px-6 md:py-24 md:px-8 bg-navy">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal-light uppercase mb-4">{t.rubric}</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-4 leading-tight">
          {t.h2a}<br />{t.h2b}
        </h2>
        <p className="text-base text-teal-muted leading-relaxed max-w-xl mb-10 md:mb-14">{t.intro}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.creds.map((c) => (
            <div key={c.title} className="bg-navy-mid rounded-lg p-9 border-t-4 border-teal">
              <h3 className="text-base font-bold text-white mb-3">{c.title}</h3>
              <p className="text-sm text-teal-muted leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
