const creds = [
  {
    title: 'Certifié MIT · 20+ ans EMEA & LATAM',
    desc: 'MIT Graduate Certificate in Supply Chain & Logistics. Directions senior en EMEA et LATAM dans l’agrochimie, les sciences du végétal et l’industrie de spécialité. Environnements réels, contraintes réelles, résultats réels.',
  },
  {
    title: 'Plus rapide et plus léger que les grands cabinets',
    desc: '6 semaines, pas 6 mois. Accès direct à un praticien senior dès le premier jour. Un coût plus bas à qualité stratégique égale. Aucun slide recyclé — tout est construit pour votre contexte.',
  },
  {
    title: 'Une exécution native IA',
    desc: 'Nos moteurs de décision IA alimentent chaque mission — de l’intelligence de la demande à l’analytique prédictive, du scoring de risque automatisé à l’optimisation dynamique des stocks. L’IA n’est pas une option ; c’est notre façon de livrer plus vite et plus juste.',
  },
]

export function Credentials() {
  return (
    <section id="why" className="py-16 px-6 md:py-24 md:px-8 bg-navy">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal-light uppercase mb-4">
          Pourquoi OpsFlow
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-4 leading-tight">
          Une expertise senior.<br />Pas de juniors. Pas de faux-semblant.
        </h2>
        <p className="text-base text-teal-muted leading-relaxed max-w-xl mb-10 md:mb-14">
          Ce que vous voyez est ce que vous obtenez — la personne qui diagnostique votre problème pilote la solution.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creds.map((c) => (
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
