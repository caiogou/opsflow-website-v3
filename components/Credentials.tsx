type Lang = 'fr' | 'de' | 'en'
type Cred = { title: string; desc: string }

const C: Record<Lang, { rubric: string; h2a: string; h2b: string; intro: string; creds: Cred[] }> = {
  fr: {
    rubric: 'Pourquoi OpsFlow', h2a: 'Une expertise senior.', h2b: 'Pas de juniors. Pas de faux-semblant.',
    intro: 'Ce que vous voyez est ce que vous obtenez — la personne qui diagnostique votre problème pilote la solution.',
    creds: [
      { title: 'Certifié MIT · 20+ ans EMEA & LATAM', desc: 'MIT Graduate Certificate in Supply Chain & Logistics. Directions senior en EMEA et LATAM dans l’agrochimie, les sciences du végétal et l’industrie de spécialité. Environnements réels, contraintes réelles, résultats réels.' },
      { title: 'Plus rapide et plus léger que les grands cabinets', desc: '6 semaines, pas 6 mois. Accès direct à un praticien senior dès le premier jour. Un coût plus bas à qualité stratégique égale. Aucun slide recyclé — tout est construit pour votre contexte.' },
      { title: 'Une exécution native IA', desc: 'Nos moteurs de décision IA alimentent chaque mission — de l’intelligence de la demande à l’analytique prédictive, du scoring de risque automatisé à l’optimisation dynamique des stocks. L’IA n’est pas une option ; c’est notre façon de livrer plus vite et plus juste.' },
    ],
  },
  de: {
    rubric: 'Warum OpsFlow', h2a: 'Seniorität und Erfahrung.', h2b: 'Keine Junioren. Kein Schein.',
    intro: 'Was Sie sehen, ist, was Sie bekommen — die Person, die Ihr Problem diagnostiziert, führt die Lösung.',
    creds: [
      { title: 'MIT-zertifiziert · 20+ Jahre EMEA & LATAM', desc: 'MIT Graduate Certificate in Supply Chain & Logistics. Senior-Führungsrollen in EMEA und LATAM in Agrochemie, Pflanzenwissenschaften und Spezialindustrie. Reale Umgebungen, reale Zwänge, reale Ergebnisse.' },
      { title: 'Schneller und schlanker als grosse Beratungshäuser', desc: '6 Wochen statt 6 Monate. Direkter Zugang zu einer erfahrenen Fachperson ab dem ersten Tag. Geringere Kosten bei gleicher strategischer Qualität. Keine wiederverwendeten Folien — alles auf Ihren Kontext gebaut.' },
      { title: 'KI-native Umsetzung', desc: 'Unsere KI-Entscheidungsmodelle unterstützen jedes Mandat — von der Nachfrageintelligenz bis zur prädiktiven Analytik, vom automatisierten Risiko-Scoring bis zur dynamischen Bestandsoptimierung. KI ist keine Option; sie ist unsere Art, schneller und treffsicherer zu liefern.' },
    ],
  },
  en: {
    rubric: 'Why OpsFlow', h2a: 'Senior expertise.', h2b: 'No junior consultants. No bait-and-switch.',
    intro: 'What you see is what you get — the same person who diagnoses your problem leads the solution.',
    creds: [
      { title: 'MIT-certified · 20+ years EMEA & LATAM', desc: 'MIT Graduate Certificate in Supply Chain & Logistics. Senior leadership across EMEA and LATAM in agrochemical, crop science, and specialty manufacturing. Real environments, real constraints, real results.' },
      { title: 'Faster and leaner than big firms', desc: '6 weeks, not 6 months. Direct access to a senior practitioner from day one. Lower cost at the same strategic quality. No recycled slide decks — everything built for your context.' },
      { title: 'AI-native delivery', desc: 'Our AI decision engines power every engagement — from demand intelligence and predictive analytics to automated risk scoring and dynamic inventory optimisation. AI is not an add-on; it is how we deliver faster, sharper results.' },
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
