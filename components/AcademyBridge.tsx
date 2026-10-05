type Lang = 'fr' | 'de' | 'en'

const C: Record<Lang, {
  rubric: string; h2a: string; h2b: string; intro: string;
  leftLabel: string; leftDesc: string; badge: string;
  rightLabel: string; rightDesc: string; link: string;
}> = {
  fr: {
    rubric: 'Une maison, deux niveaux', h2a: 'Le niveau de l’entreprise.', h2b: 'Le niveau de l’équipe.',
    intro: 'Le même métier — simplifier le fonctionnement du travail et rendre les équipes autonomes — appliqué à deux échelles. Apportez le problème ; nous vous indiquons la bonne porte.',
    leftLabel: 'Pour la direction',
    leftDesc: 'La planification et la supply chain de votre entreprise : S&OP, stocks et fonds de roulement, risque fournisseurs, design du réseau.',
    badge: 'Vous êtes ici ↑',
    rightLabel: 'Pour les équipes',
    rightDesc: 'Un processus précis — intégration, vente, un flux qui coince — simplifié, et votre équipe formée pour le faire tourner sans nous.',
    link: 'Découvrir l’Academy →',
  },
  de: {
    rubric: 'Ein Haus, zwei Ebenen', h2a: 'Die Unternehmensebene.', h2b: 'Die Teamebene.',
    intro: 'Dasselbe Handwerk — die Funktionsweise der Arbeit vereinfachen und Teams befähigen — auf zwei Ebenen angewendet. Bringen Sie das Problem; wir zeigen Ihnen die richtige Tür.',
    leftLabel: 'Für die Geschäftsleitung',
    leftDesc: 'Die Planung und Supply Chain Ihres Unternehmens: S&OP, Bestände und Betriebskapital, Lieferantenrisiko, Netzwerkdesign.',
    badge: 'Sie sind hier ↑',
    rightLabel: 'Für die Teams',
    rightDesc: 'Ein konkreter Prozess — Einarbeitung, Verkauf, ein stockender Ablauf — vereinfacht, und Ihr Team geschult, um ihn ohne uns am Laufen zu halten.',
    link: 'Die Academy entdecken →',
  },
  en: {
    rubric: 'One firm, two levels', h2a: 'The company level.', h2b: 'The team level.',
    intro: 'The same craft — simplifying how work runs and making teams autonomous — applied at two scales. Bring the problem; we’ll point you to the right door.',
    leftLabel: 'For leadership',
    leftDesc: 'Your company’s planning and supply chain: S&OP, inventory and working capital, supplier risk, network design.',
    badge: 'You are here ↑',
    rightLabel: 'For teams',
    rightDesc: 'One specific process — onboarding, sales, a workflow that keeps jamming — simplified, and your team trained to run it without us.',
    link: 'Discover the Academy →',
  },
}

export function AcademyBridge({ lang = 'fr' }: { lang?: Lang }) {
  const t = C[lang]
  return (
    <section className="py-16 px-6 md:py-24 md:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{t.rubric}</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">
          {t.h2a}<br />{t.h2b}
        </h2>
        <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">{t.intro}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-9 flex flex-col border-t-4 border-t-navy">
            <p className="text-xs font-bold tracking-widest text-teal uppercase mb-2">{t.leftLabel}</p>
            <h3 className="text-lg font-bold text-navy mb-2">OpsFlow Advisory</h3>
            <p className="text-sm text-gray-500 mb-5">{t.leftDesc}</p>
            <span className="mt-auto self-start bg-teal-pale text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold">{t.badge}</span>
          </div>
          <div className="border border-gray-200 rounded-lg p-9 flex flex-col border-t-4 border-t-teal">
            <p className="text-xs font-bold tracking-widest text-teal uppercase mb-2">{t.rightLabel}</p>
            <h3 className="text-lg font-bold text-navy mb-2">OpsFlow Academy</h3>
            <p className="text-sm text-gray-500 mb-5">{t.rightDesc}</p>
            <a href="/academy" className="mt-auto self-start bg-teal text-white px-5 py-2.5 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">{t.link}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
