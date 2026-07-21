const steps = [
  {
    num: '1',
    title: 'Session diagnostic gratuite',
    desc: 'Un échange structuré sur la réalité de votre supply chain. Vous repartez avec une vision claire de vos priorités, que nous travaillions ensemble ou non.',
    price: 'Gratuit — sans engagement',
  },
  {
    num: '2',
    title: 'Rapid Assessment',
    desc: 'Diagnostic structuré en 2 semaines. Vos 3 priorités classées par impact sur le résultat. Un plan d’action de 90 jours prêt à exécuter. Une synthèse pour votre direction.',
    price: 'Dès CHF 8 500 — prix fixe',
  },
  {
    num: '3',
    title: 'Mission complète',
    desc: 'Mise en œuvre du plan d’action, pilotée par un senior. 4 à 12 semaines selon le périmètre. Vos équipes s’approprient les résultats. Aucune dépendance créée.',
    price: 'CHF 22–80K selon le périmètre',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="py-16 px-6 md:py-24 md:px-8 bg-teal-pale/30">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">Notre approche</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">
          Du premier échange<br />à des résultats mesurables.
        </h2>
        <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">
          Trois étapes. Des délais fixes. Aucune mission à durée indéterminée.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < steps.length - 1 && (
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
