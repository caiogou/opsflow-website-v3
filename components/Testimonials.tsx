type Lang = 'fr' | 'de' | 'en'
type T = { text: string; initials: string; name: string; role: string }

const C: Record<Lang, { rubric: string; h2a: string; h2b: string; intro: string; badge: string; items: T[] }> = {
  fr: {
    rubric: 'Cas', h2a: 'Des résultats qui parlent', h2b: 'd’eux-mêmes.',
    intro: 'Les premiers cas clients seront publiés après les missions initiales.', badge: 'Bientôt',
    items: [
      { text: 'La session de diagnostic à elle seule nous a donné plus de clarté que six mois de discussions internes. Le plan d’action était concret, priorisé, et notre équipe a pu l’exécuter immédiatement.', initials: 'VP', name: 'VP Supply Chain', role: 'Industriel · Suisse' },
      { text: 'OpsFlow a identifié 800 K€ de fonds de roulement récupérable en deux semaines. L’investissement a été rentabilisé dès le premier mois. Nous sommes désormais en accompagnement continu.', initials: 'CO', name: 'COO', role: 'Industriel mid-market · Allemagne' },
      { text: 'Une exécution 100% senior, donc aucun temps de rodage — ils ont compris notre activité dès la première session et livré une refonte S&OP complète en six semaines.', initials: 'SC', name: 'Directeur Supply Chain', role: 'Entreprise FMCG · France' },
    ],
  },
  de: {
    rubric: 'Referenzen', h2a: 'Ergebnisse, die für sich', h2b: 'sprechen.',
    intro: 'Die ersten Kundenfälle werden nach den ersten Mandaten veröffentlicht.', badge: 'Bald',
    items: [
      { text: 'Allein die Standortbestimmung hat uns mehr Klarheit gebracht als sechs Monate interner Diskussionen. Der Aktionsplan war konkret, priorisiert, und unser Team konnte ihn sofort umsetzen.', initials: 'VP', name: 'VP Supply Chain', role: 'Industrieunternehmen · Schweiz' },
      { text: 'OpsFlow hat in zwei Wochen 800 000 € an rückgewinnbarem Betriebskapital identifiziert. Die Investition war schon im ersten Monat amortisiert. Wir sind heute in laufender Begleitung.', initials: 'CO', name: 'COO', role: 'Industrieunternehmen Mid-Market · Deutschland' },
      { text: 'Eine Umsetzung zu 100 % durch erfahrene Fachleute, also keine Einarbeitungszeit — sie haben unser Geschäft ab der ersten Session verstanden und in sechs Wochen eine komplette S&OP-Neugestaltung geliefert.', initials: 'SC', name: 'Supply Chain Director', role: 'FMCG-Unternehmen · Frankreich' },
    ],
  },
  en: {
    rubric: 'Case studies', h2a: 'Results that speak', h2b: 'for themselves.',
    intro: 'The first client cases will be published after the initial engagements.', badge: 'Soon',
    items: [
      { text: 'The diagnostic session alone gave us more clarity than six months of internal discussions. The action plan was concrete, prioritized, and our team could execute it immediately.', initials: 'VP', name: 'VP Supply Chain', role: 'Industrial · Switzerland' },
      { text: 'OpsFlow identified €800K of recoverable working capital in two weeks. The investment paid for itself in the first month. We are now in ongoing support.', initials: 'CO', name: 'COO', role: 'Mid-market industrial · Germany' },
      { text: '100% senior execution, so no ramp-up time — they understood our business from the first session and delivered a complete S&OP redesign in six weeks.', initials: 'SC', name: 'Supply Chain Director', role: 'FMCG company · France' },
    ],
  },
}

export function Testimonials({ lang = 'fr' }: { lang?: Lang }) {
  const t = C[lang]
  return (
    <section id="cases" className="py-16 px-6 md:py-24 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{t.rubric}</p>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4 leading-tight">
          {t.h2a}<br />{t.h2b}
        </h2>
        <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-10 md:mb-14">{t.intro}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.items.map((it) => (
            <div key={it.name} className="bg-white border border-gray-200 rounded-lg p-8 border-t-4 border-t-teal-pale">
              <span className="inline-block bg-orange-50 text-orange-600 text-xs font-bold tracking-widest px-2 py-1 rounded mb-4 uppercase">{t.badge}</span>
              <p className="text-sm text-gray-500 leading-relaxed italic mb-6">&ldquo;{it.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{it.initials}</div>
                <div>
                  <p className="text-sm font-bold text-navy">{it.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{it.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
