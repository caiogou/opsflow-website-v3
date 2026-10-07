type Lang = 'fr' | 'de' | 'en'
type Cred = { title: string; desc: string }

const C: Record<Lang, { rubric: string; h2a: string; h2b: string; intro: string; creds: Cred[] }> = {
  fr: {
    rubric: 'Pourquoi OpsFlow', h2a: 'Une expertise senior.', h2b: 'Pas de juniors. Pas de faux-semblant.',
    intro: 'Ce que vous voyez est ce que vous obtenez — la personne qui diagnostique votre problème pilote la solution.',
    creds: [
      { title: 'Un leadership intégré, pas une équipe à demeure', desc: 'Un responsable supply chain senior pilote votre cycle de planification avec vos équipes : appels réguliers, suivi des KPI, décisions sur la table. Vos équipes gardent la main ; nous gardons le cap.' },
      { title: 'Plus rapide et plus léger que les grands cabinets', desc: '6 semaines, pas 6 mois. Accès direct à un praticien senior dès le premier jour. Un coût plus bas à qualité stratégique égale. Aucun slide recyclé — tout est construit pour votre contexte.' },
      { title: 'Assisté par l’IA, décidé par des seniors', desc: 'Nous utilisons des outils d’IA pour accélérer l’analyse : lecture des données, diagnostics, scénarios. Le jugement et les recommandations restent ceux de professionnels seniors.' },
    ],
  },
  de: {
    rubric: 'Warum OpsFlow', h2a: 'Seniorität und Erfahrung.', h2b: 'Keine Junioren. Kein Schein.',
    intro: 'Was Sie sehen, ist, was Sie bekommen — die Person, die Ihr Problem diagnostiziert, führt die Lösung.',
    creds: [
      { title: 'Eingebettete Führung, kein Team vor Ort', desc: 'Eine erfahrene Supply-Chain-Führungskraft steuert Ihren Planungszyklus gemeinsam mit Ihrem Team: regelmässige Calls, KPI-Nachverfolgung, Entscheidungen auf dem Tisch. Ihr Team behält die Führung; wir halten den Kurs.' },
      { title: 'Schneller und schlanker als grosse Beratungshäuser', desc: '6 Wochen statt 6 Monate. Direkter Zugang zu einer erfahrenen Fachperson ab dem ersten Tag. Geringere Kosten bei gleicher strategischer Qualität. Keine wiederverwendeten Folien — alles auf Ihren Kontext gebaut.' },
      { title: 'KI-gestützt, von Senior-Fachleuten entschieden', desc: 'Wir nutzen KI-Werkzeuge, um die Analyse zu beschleunigen: Datenaufbereitung, Diagnosen, Szenarien. Urteil und Empfehlungen bleiben bei erfahrenen Fachleuten.' },
    ],
  },
  en: {
    rubric: 'Why OpsFlow', h2a: 'Senior expertise.', h2b: 'No junior consultants. No bait-and-switch.',
    intro: 'What you see is what you get: the same person who diagnoses your problem leads the solution.',
    creds: [
      { title: 'Embedded leadership, not an embedded team', desc: 'A senior supply chain leader steers your planning cycle with your team: regular calls, KPI tracking, decisions on the table. Your team keeps running it; we keep it on track.' },
      { title: 'Faster and leaner than big firms', desc: 'Weeks, not months. Direct access to a senior practitioner from day one. No recycled slide decks: everything is built for your context.' },
      { title: 'AI-assisted, senior-decided', desc: 'We use AI tools to speed up the analysis: reading your data, diagnostics, scenarios. Judgment and recommendations stay with senior people.' },
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
