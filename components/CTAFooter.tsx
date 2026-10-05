type Lang = 'fr' | 'de' | 'en'
const CALENDLY = 'https://calendly.com/caio-opsflow-advisory/30min'

const C: Record<Lang, {
  ctaH2: string; ctaText: string; cta1: string; cta2: string;
  fServices: string; fHow: string; fRessources: string; fContact: string; fLine: string;
}> = {
  fr: {
    ctaH2: 'Commençons par un échange.',
    ctaText: 'Une conversation structurée sur vos enjeux de supply chain. Un regard honnête sur là où se trouve la vraie valeur.',
    cta1: 'Réserver une session gratuite', cta2: 'Faire le diagnostic S&OP',
    fServices: 'Services', fHow: 'Notre approche', fRessources: 'Ressources', fContact: 'Contact',
    fLine: '2026 OpsFlow Advisory · Nyon, Suisse',
  },
  de: {
    ctaH2: 'Beginnen wir mit einem Gespräch.',
    ctaText: 'Ein strukturiertes Gespräch über Ihre Supply-Chain-Themen. Ein ehrlicher Blick darauf, wo der echte Wert liegt.',
    cta1: 'Kostenlose Session buchen', cta2: 'S&OP-Standortbestimmung starten',
    fServices: 'Dienstleistungen', fHow: 'Unser Ansatz', fRessources: 'Ressourcen', fContact: 'Kontakt',
    fLine: '2026 OpsFlow Advisory · Nyon, Schweiz',
  },
  en: {
    ctaH2: 'Start with a free conversation.',
    ctaText: 'Structured thinking about your supply chain challenges. Honest perspectives on where the real value is.',
    cta1: 'Book a free session', cta2: 'Take the S&OP Health Check',
    fServices: 'Services', fHow: 'How it works', fRessources: 'Resources', fContact: 'Contact',
    fLine: '2026 OpsFlow Advisory · Nyon, Switzerland',
  },
}

export function CTA({ lang = 'fr' }: { lang?: Lang }) {
  const t = C[lang]
  return (
    <section className="py-16 px-6 md:py-24 md:px-8 bg-teal text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-5">{t.ctaH2}</h2>
        <p className="text-base md:text-lg text-emerald-50 leading-relaxed mb-8 md:mb-10">{t.ctaText}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-navy px-8 py-4 md:px-10 md:py-5 rounded text-sm md:text-base font-bold hover:opacity-90 transition-opacity no-underline">{t.cta1}</a>
          <a href="/diagnostic" className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 md:px-10 md:py-5 rounded text-sm md:text-base font-bold hover:bg-white/10 transition-colors no-underline">{t.cta2}</a>
        </div>
      </div>
    </section>
  )
}

export function Footer({ lang = 'fr' }: { lang?: Lang }) {
  const t = C[lang]
  const base = lang === 'fr' ? '' : `/${lang}`
  return (
    <footer className="bg-navy-deep border-t border-navy-mid py-8 px-6 md:py-10 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
        <span className="text-base font-bold text-white">OpsFlow Advisory</span>
        <div className="flex flex-wrap justify-center gap-5 md:gap-7">
          <a href={`${base}/#services`} className="text-teal-muted text-sm hover:text-white transition-colors no-underline">{t.fServices}</a>
          <a href={`${base}/#how`} className="text-teal-muted text-sm hover:text-white transition-colors no-underline">{t.fHow}</a>
          <a href={`${base}/ressources`} className="text-teal-muted text-sm hover:text-white transition-colors no-underline">{t.fRessources}</a>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="text-teal-muted text-sm hover:text-white transition-colors no-underline">{t.fContact}</a>
        </div>
        <span className="text-xs text-slate-500 text-center">{t.fLine}</span>
      </div>
    </footer>
  )
}
