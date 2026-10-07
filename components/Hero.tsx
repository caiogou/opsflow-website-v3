import { HeroDiagram } from './HeroDiagram'
type Lang = 'fr' | 'de' | 'en'
import { CALENDLY } from '@/lib/booking'

const C: Record<Lang, {
  kicker: string; h1a: string; h1b: string; lead: string; cta1: string; cta2: string;
  diag: { top: string; right1: string; right2: string; bottom: string; left1: string; left2: string };
}> = {
  fr: {
    kicker: 'Stratégie supply chain · leadership intégré',
    h1a: 'Nous construisons votre stratégie supply chain.',
    h1b: 'Un expert senior la garde sur les rails.',
    lead: 'Nous définissons avec vous la stratégie — S&OP/IBP, planification des approvisionnements, gestion des commandes et logistique. Puis un responsable senior suit le plan avec vos équipes : des appels réguliers, le suivi des résultats et les ajustements nécessaires pour rester sur la trajectoire. Un leadership intégré, pas une équipe à demeure.',
    cta1: 'Réserver une session gratuite',
    cta2: 'Faire le diagnostic S&OP',
    diag: { top: 'Excellence de planification', right1: 'Optimisation', right2: 'des stocks', bottom: 'Gestion des risques', left1: 'Distribution', left2: '& transport' },
  },
  de: {
    kicker: 'Supply-Chain-Strategie · eingebettete Führung',
    h1a: 'Wir entwickeln Ihre Supply-Chain-Strategie.',
    h1b: 'Eine Senior-Fachperson hält sie auf Kurs.',
    lead: 'Wir definieren mit Ihnen die Strategie — S&OP/IBP, Versorgungsplanung, Auftragsmanagement und Logistik. Danach begleitet eine erfahrene Führungskraft den Plan mit Ihrem Team: regelmässige Calls, Nachverfolgung der Ergebnisse und Anpassungen, damit alles auf Kurs bleibt. Eingebettete Führung, kein Team vor Ort.',
    cta1: 'Kostenlose Session buchen',
    cta2: 'S&OP-Standortbestimmung starten',
    diag: { top: 'Planungsexzellenz', right1: 'Bestands-', right2: 'optimierung', bottom: 'Risikomanagement', left1: 'Distribution', left2: '& Transport' },
  },
  en: {
    kicker: 'Supply chain strategy · embedded leadership',
    h1a: 'We build your supply chain strategy.',
    h1b: 'A senior expert keeps it on track.',
    lead: 'We define the strategy with you: S&OP/IBP, supply planning, order management and logistics. Then a senior leader stays with your team to see the plan through, with regular calls, results tracking and adjustments when reality changes. Embedded leadership, not an embedded team.',
    cta1: 'Book a free session',
    cta2: 'Take the free S&OP Self-Assessment',
    diag: { top: 'Planning Excellence', right1: 'Inventory', right2: 'Optimization', bottom: 'Risk & Resilience', left1: 'Distribution', left2: '& Shipping' },
  },
}

export function Hero({ lang = 'fr' }: { lang?: Lang }) {
  const t = C[lang]
  const base = lang === 'fr' ? '' : `/${lang}`
  return (
    <section className="bg-dk-bg py-20 px-6 md:py-32 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 items-center">
        <div>
          <p className="text-xs font-bold tracking-widest text-dk-teal uppercase mb-5">{t.kicker}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-dk-ink leading-tight mb-6">
            {t.h1a}<br />
            <em className="text-dk-teal not-italic">{t.h1b}</em>
          </h1>
          <p className="text-lg text-dk-body leading-relaxed mb-10 max-w-lg">{t.lead}</p>
          <div className="flex gap-4 flex-wrap">
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="bg-dk-teal text-dk-on px-9 py-4 rounded text-sm font-semibold hover:bg-dk-teal2 transition-colors no-underline">{t.cta1}</a>
            <a href="/diagnostic" className="text-dk-ink border border-dk-teal px-7 py-4 rounded text-sm font-semibold hover:bg-dk-teal/10 transition-colors no-underline">{t.cta2}</a>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center">
          <HeroDiagram lang={lang} labels={t.diag} />
        </div>
      </div>
    </section>
  )
}
