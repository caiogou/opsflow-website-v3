const testimonials = [
  {
    text: 'La session de diagnostic à elle seule nous a donné plus de clarté que six mois de discussions internes. Le plan d’action était concret, priorisé, et notre équipe a pu l’exécuter immédiatement.',
    initials: 'VP',
    name: 'VP Supply Chain',
    role: 'Industriel · Suisse',
  },
  {
    text: 'OpsFlow a identifié 800 K€ de fonds de roulement récupérable en deux semaines. L’investissement a été rentabilisé dès le premier mois. Nous sommes désormais en accompagnement continu.',
    initials: 'CO',
    name: 'COO',
    role: 'Industriel mid-market · Allemagne',
  },
  {
    text: 'Une exécution 100% senior, donc aucun temps de rodage — ils ont compris notre activité dès la première session et livré une refonte S&OP complète en six semaines.',
    initials: 'SC',
    name: 'Directeur Supply Chain',
    role: 'Entreprise FMCG · France',
  },
]

export function Testimonials() {
  return (
    <section id="cases" className="py-16 px-6 md:py-24 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">Cas</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">
          Des résultats qui parlent<br />d&apos;eux-mêmes.
        </h2>
        <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">
          Les premiers cas clients seront publiés après les missions initiales.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-gray-200 rounded-lg p-8 border-t-4 border-t-teal-pale"
            >
              <span className="inline-block bg-orange-50 text-orange-600 text-xs font-bold tracking-widest px-2 py-1 rounded mb-4 uppercase">
                Bientôt
              </span>
              <p className="text-sm text-gray-500 leading-relaxed italic mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-navy">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
