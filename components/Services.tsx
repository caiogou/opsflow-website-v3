const services = [
  {
    title: 'Excellence de planification',
    desc: 'Conception S&OP et IBP, intégration de la demande et de l’offre, gouvernance et cadence. Nous construisons des processus de planification qui produisent des décisions — pas seulement des rapports. Gestion des exceptions et des priorités incluse.',
    tags: ['S&OP', 'IBP', 'Prévision de la demande', 'Gestion des exceptions'],
  },
  {
    title: 'Optimisation des stocks',
    desc: 'Segmentation des SKU (ABC/XYZ), refonte du stock de sécurité, logique de réapprovisionnement et DRP. Libérez du fonds de roulement sans dégrader le niveau de service — avec un impact mesurable sur le résultat.',
    tags: ['ABC/XYZ', 'Stock de sécurité', 'Fonds de roulement', 'DRP'],
  },
  {
    title: 'Risques et résilience',
    desc: 'Cartographie des risques rang 1 et 2, scoring de criticité, stratégie de double sourcing et feuille de route de mitigation sur 90 jours. Connaissez vos risques avant qu’ils ne deviennent des ruptures.',
    tags: ['Cartographie des risques', 'Double sourcing', 'Plan de mitigation'],
  },
  {
    title: 'Distribution et transport',
    desc: 'Modélisation du coût de service, analyse de scénarios de réseau et optimisation du transport. Bâtissez un réseau de distribution adapté à votre activité aujourd’hui — et qui grandit avec elle demain.',
    tags: ['Design du réseau', 'Coût de service', 'Optimisation transport'],
  },
]

export function Services() {
  return (
    <section id="services" className="py-16 px-6 md:py-24 md:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">Ce que nous faisons</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">
          Quatre domaines.<br />Un objectif : la marge.
        </h2>
        <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">
          Nous intervenons là où se trouvent les vraies opportunités de résultat — pas là où il y a du bruit.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="border border-gray-200 rounded-lg p-9 hover:border-teal transition-colors"
            >
              <h3 className="text-lg font-bold text-navy mb-3">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-teal-pale text-emerald-800 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
