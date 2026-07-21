export function AcademyBridge() {
  return (
    <section className="py-16 px-6 md:py-24 md:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">Une maison, deux niveaux</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">
          Le niveau de l&apos;entreprise.<br />Le niveau de l&apos;équipe.
        </h2>
        <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">
          Le même métier — simplifier le fonctionnement du travail et rendre les équipes autonomes — appliqué à deux échelles. Apportez le problème ; nous vous indiquons la bonne porte.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-9 flex flex-col border-t-4 border-t-navy">
            <p className="text-xs font-bold tracking-widest text-teal uppercase mb-2">Pour la direction</p>
            <h3 className="text-lg font-bold text-navy mb-2">OpsFlow Advisory</h3>
            <p className="text-sm text-gray-500 mb-5">
              La planification et la supply chain de votre entreprise : S&amp;OP, stocks et fonds de roulement, risque fournisseurs, design du réseau.
            </p>
            <span className="mt-auto self-start bg-teal-pale text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold">
              Vous êtes ici ↑
            </span>
          </div>
          <div className="border border-gray-200 rounded-lg p-9 flex flex-col border-t-4 border-t-teal">
            <p className="text-xs font-bold tracking-widest text-teal uppercase mb-2">Pour les équipes</p>
            <h3 className="text-lg font-bold text-navy mb-2">OpsFlow Academy</h3>
            <p className="text-sm text-gray-500 mb-5">
              Un processus précis — intégration, vente, un flux qui coince — simplifié, et votre équipe formée pour le faire tourner sans nous.
            </p>
            <a
              href="/academy"
              className="mt-auto self-start bg-teal text-white px-5 py-2.5 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline"
            >
              Découvrir l&apos;Academy →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
