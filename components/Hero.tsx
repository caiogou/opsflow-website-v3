import { HeroDiagram } from './HeroDiagram'
type Lang = 'fr' | 'de' | 'en'
const CALENDLY = 'https://calendly.com/caio-opsflow-advisory/30min'

const C: Record<Lang, {
  kicker: string; h1a: string; h1b: string; lead: string; cta1: string; cta2: string;
  diag: { top: string; right1: string; right2: string; bottom: string; left1: string; left2: string };
}> = {
  fr: {
    kicker: 'Stratégie supply chain · leadership senior intégré',
    h1a: 'Nous construisons votre stratégie supply chain.',
    h1b: 'Un leader senior reste pour la faire vivre.',
    lead: 'Nous définissons avec vous la stratégie — S&OP/IBP, planification des approvisionnements, gestion des commandes et logistique. Puis un leader senior reste avec votre équipe : sessions de travail régulières, suivi des indicateurs et décisions sur la table, pendant que votre équipe continue de piloter le processus. Analyses assistées par l’IA ; le jugement reste senior. Un leadership intégré, pas une équipe à demeure.',
    cta1: 'Réserver une session gratuite',
    cta2: 'Faire le diagnostic S&OP',
    diag: { top: 'S&OP / IBP', right1: 'Planification des', right2: 'approvisionnements', bottom: 'Gestion des commandes', left1: 'Logistique', left2: '& distribution' },
  },
  de: {
    kicker: 'Supply-Chain-Strategie · eingebettete Senior-Führung',
    h1a: 'Wir entwickeln Ihre Supply-Chain-Strategie.',
    h1b: 'Eine Senior-Führungskraft bleibt und setzt sie um.',
    lead: 'Wir definieren mit Ihnen die Strategie — S&OP/IBP, Supply Planning, Order Management und Logistik. Danach bleibt eine Senior-Führungskraft bei Ihrem Team: regelmässige Arbeitssitzungen, KPI-Verfolgung und Entscheidungen auf dem Tisch, während Ihr Team den Prozess weiterführt. KI-gestützte Analysen; das Urteil bleibt senior. Eingebettete Führung, kein eingebettetes Team.',
    cta1: 'Kostenlose Session buchen',
    cta2: 'S&OP-Standortbestimmung starten',
    diag: { top: 'S&OP / IBP', right1: 'Supply', right2: 'Planning', bottom: 'Order Management', left1: 'Logistik', left2: '& Distribution' },
  },
  en: {
    kicker: 'Supply chain strategy · embedded senior leadership',
    h1a: 'We build your supply chain strategy.',
    h1b: 'A senior leader stays to make it happen.',
    lead: 'We define the strategy with you — S&OP/IBP, supply planning, order management and logistics. Then a senior leader stays with your team: regular working sessions, KPI tracking and decisions on the table, while your team keeps running the process. AI-assisted analysis; senior judgement on every call. Embedded leadership, not an embedded team.',
    cta1: 'Book a free session',
    cta2: 'Take the S&OP Health Check',
    diag: { top: 'S&OP / IBP', right1: 'Supply', right2: 'Planning', bottom: 'Order Management', left1: 'Logistics', left2: '& Distribution' },
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
            {t.h1a}<br />
            <em className="text-teal not-italic">{t.h1b}</em>
          </h1>
          <p className="text-lg text-teal-muted leading-relaxed mb-10 max-w-lg">{t.lead}</p>
          <div className="flex gap-4 flex-wrap">
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="bg-teal text-white px-9 py-4 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">{t.cta1}</a>
            <a href="/diagnostic" className="text-white border border-teal px-7 py-4 rounded text-sm font-semibold hover:bg-teal/10 transition-colors no-underline">{t.cta2}</a>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center">
          <HeroDiagram lang={lang} labels={t.diag} />
        </div>
      </div>
    </section>
  )
}
