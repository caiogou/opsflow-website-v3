type Lang = 'fr' | 'de' | 'en'
const CALENDLY = 'https://calendly.com/caio-opsflow-advisory/30min'

const C: Record<Lang, {
  kicker: string; h1a: string; h1b: string; lead: string; cta1: string; cta2: string;
  diag: { top: string; right1: string; right2: string; bottom: string; left1: string; left2: string };
}> = {
  fr: {
    kicker: 'Conseil supply chain augmenté par l’IA · Suisse & EMEA',
    h1a: 'Des supply chains plus intelligentes.',
    h1b: 'Portées par l’humain. Augmentées par l’IA.',
    lead: 'Nous combinons plus de 20 ans d’expérience terrain en EMEA avec des moteurs de décision IA pour libérer de la marge, réduire le gaspillage de stock et bâtir des opérations résilientes — en quelques semaines, pas en quelques mois.',
    cta1: 'Réserver une session gratuite',
    cta2: 'Faire le diagnostic S&OP',
    diag: { top: 'Excellence de planification', right1: 'Optimisation', right2: 'des stocks', bottom: 'Gestion des risques', left1: 'Distribution', left2: '& transport' },
  },
  de: {
    kicker: 'Supply-Chain-Beratung, verstärkt durch KI · Schweiz & EMEA',
    h1a: 'Klügere Supply Chains.',
    h1b: 'Vom Menschen geführt. Durch KI verstärkt.',
    lead: 'Wir verbinden über 20 Jahre Praxiserfahrung in EMEA mit KI-gestützten Entscheidungsmodellen, um Marge freizusetzen, Bestandsverschwendung zu senken und widerstandsfähige Abläufe aufzubauen — in Wochen, nicht in Monaten.',
    cta1: 'Kostenlose Session buchen',
    cta2: 'S&OP-Standortbestimmung starten',
    diag: { top: 'Planungsexzellenz', right1: 'Bestands-', right2: 'optimierung', bottom: 'Risikomanagement', left1: 'Distribution', left2: '& Transport' },
  },
  en: {
    kicker: 'AI-powered supply chain advisory · Switzerland & EMEA',
    h1a: 'Smarter supply chains.',
    h1b: 'Built by people. Powered by AI.',
    lead: 'We combine 20+ years of hands-on EMEA experience with AI decision engines to unlock margin, cut inventory waste, and build resilient operations — in weeks, not months.',
    cta1: 'Book a free session',
    cta2: 'Take the S&OP Health Check',
    diag: { top: 'Planning Excellence', right1: 'Inventory', right2: 'Optimisation', bottom: 'Risk & Resilience', left1: 'Distribution', left2: '& Shipping' },
  },
}

export function Hero({ lang = 'fr' }: { lang?: Lang }) {
  const t = C[lang]
  const base = lang === 'fr' ? '' : `/${lang}`
  return (
    <section className="bg-navy py-20 px-6 md:py-32 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 items-center">
        <div>
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-5">{t.kicker}</p>
          <h1 className="font-serif text-4xl md:text-6xl font-normal text-white leading-tight mb-6">
            {t.h1a}{' '}
            <em className="text-teal not-italic">{t.h1b}</em>
          </h1>
          <p className="text-lg text-teal-muted leading-relaxed mb-10 max-w-lg">{t.lead}</p>
          <div className="flex gap-4 flex-wrap">
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="bg-teal text-white px-9 py-4 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">{t.cta1}</a>
            <a href="/diagnostic" className="text-white border border-teal px-7 py-4 rounded text-sm font-semibold hover:bg-teal/10 transition-colors no-underline">{t.cta2}</a>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center">
          <svg width="400" height="380" viewBox="0 0 340 320" xmlns="http://www.w3.org/2000/svg">
            <circle cx="170" cy="160" r="130" fill="none" stroke="#1a3a5c" strokeWidth="1" />
            <circle cx="170" cy="160" r="88" fill="none" stroke="#1a3a5c" strokeWidth="1" />
            <circle cx="170" cy="160" r="48" fill="#1a9e8f" />
            <text x="170" y="155" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Supply</text>
            <text x="170" y="172" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Chain</text>
            <rect x="86" y="14" width="168" height="36" rx="18" fill="#1a3a5c" stroke="#1a9e8f" strokeWidth="1" />
            <text x="170" y="37" textAnchor="middle" fill="#9fd8d0" fontSize="11">{t.diag.top}</text>
            <rect x="240" y="120" width="96" height="36" rx="18" fill="#1a3a5c" stroke="#1a9e8f" strokeWidth="1" />
            <text x="288" y="138" textAnchor="middle" fill="#9fd8d0" fontSize="10">{t.diag.right1}</text>
            <text x="288" y="151" textAnchor="middle" fill="#9fd8d0" fontSize="10">{t.diag.right2}</text>
            <rect x="94" y="270" width="152" height="36" rx="18" fill="#1a3a5c" stroke="#1a9e8f" strokeWidth="1" />
            <text x="170" y="293" textAnchor="middle" fill="#9fd8d0" fontSize="11">{t.diag.bottom}</text>
            <rect x="4" y="120" width="96" height="36" rx="18" fill="#1a3a5c" stroke="#1a9e8f" strokeWidth="1" />
            <text x="52" y="135" textAnchor="middle" fill="#9fd8d0" fontSize="10">{t.diag.left1}</text>
            <text x="52" y="149" textAnchor="middle" fill="#9fd8d0" fontSize="10">{t.diag.left2}</text>
            <line x1="170" y1="50" x2="170" y2="112" stroke="#1a9e8f" strokeWidth="1.5" />
            <line x1="244" y1="138" x2="218" y2="150" stroke="#1a9e8f" strokeWidth="1.5" />
            <line x1="170" y1="208" x2="170" y2="270" stroke="#1a9e8f" strokeWidth="1.5" />
            <line x1="96" y1="138" x2="122" y2="150" stroke="#1a9e8f" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </section>
  )
}
