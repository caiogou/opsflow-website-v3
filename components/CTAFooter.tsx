type Lang = 'fr' | 'de' | 'en'
import { CALENDLY } from '@/lib/booking'

const C: Record<Lang, {
  ctaH2: string; ctaText: string; cta1: string; cta2: string; bar: string;
  fServices: string; fHow: string; fRessources: string; fContact: string; fLine: string; fTag: string;
}> = {
  fr: {
    ctaH2: 'Commençons par un échange.',
    ctaText: 'Une conversation structurée sur vos enjeux de supply chain. Un regard honnête sur là où se trouve la vraie valeur.',
    cta1: 'Réserver une session gratuite', cta2: 'Faire le diagnostic S&OP', bar: 'Réserver une session gratuite',
    fServices: 'Services', fHow: 'Notre approche', fRessources: 'Ressources', fContact: 'Contact',
    fLine: '© 2026 OpsFlow Advisory · Nyon, Suisse', fTag: 'Conçu par des personnes, assisté par l’IA.',
  },
  de: {
    ctaH2: 'Beginnen wir mit einem Gespräch.',
    ctaText: 'Ein strukturiertes Gespräch über Ihre Supply-Chain-Themen. Ein ehrlicher Blick darauf, wo der echte Wert liegt.',
    cta1: 'Kostenlose Session buchen', cta2: 'S&OP-Standortbestimmung starten', bar: 'Kostenlose Session buchen',
    fServices: 'Leistungen', fHow: 'Unser Ansatz', fRessources: 'Ressourcen', fContact: 'Kontakt',
    fLine: '© 2026 OpsFlow Advisory · Nyon, Schweiz', fTag: 'Von Menschen gemacht, KI-gestützt.',
  },
  en: {
    ctaH2: 'Start with a free 45-minute session.',
    ctaText: 'A senior practitioner on the call. Free, no commitment.',
    cta1: 'Book a free 45-minute session', cta2: 'Or take the Free S&OP Self-Assessment', bar: 'Book a free session',
    fServices: 'Solutions', fHow: 'How we work', fRessources: 'Insights', fContact: 'Contact',
    fLine: '© 2026 OpsFlow Advisory · Nyon, Switzerland', fTag: 'Built by people, AI-assisted.',
  },
}

const Arrow = () => <span aria-hidden="true">→</span>

/** Closing band (".close" in the prototypes). Pass custom copy, or fall back to the language default. */
export function CTA({ lang = 'fr', h2, text, kick, primary, secondary }: {
  lang?: Lang
  h2?: string
  text?: string
  kick?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string } | null
}) {
  const t = C[lang]
  const p = primary || { label: t.cta1, href: CALENDLY }
  const s = secondary === null ? null : secondary || { label: t.cta2, href: '/diagnostic' }
  const ext = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})
  return (
    <section className="wrap sec">
      {kick && <div className="kick">{kick}</div>}
      <div className="close" id="book">
        <div>
          <h2>{h2 || t.ctaH2}</h2>
          {(text ?? t.ctaText) && <p>{text ?? t.ctaText}</p>}
        </div>
        <div className="btns">
          <a className="btn" href={p.href} {...ext(p.href)}>{p.label} <Arrow /></a>
          {s && <a className="btn2" href={s.href} {...ext(s.href)}>{s.label} ›</a>}
        </div>
      </div>
    </section>
  )
}

const EN_FOOTER = [
  { label: 'Solutions', href: '/en/services' },
  { label: 'How we work', href: '/en/how-we-work' },
  { label: 'Case studies', href: '/en/case-studies' },
  { label: 'Who we help', href: '/en/who-we-help' },
  { label: 'About', href: '/en/about' },
  { label: 'Insights', href: '/en/insights' },
  { label: 'Contact', href: '/en/contact' },
]

export function Footer({ lang = 'fr' }: { lang?: Lang }) {
  const t = C[lang]
  const base = lang === 'fr' ? '' : `/${lang}`
  const links = lang === 'en'
    ? EN_FOOTER
    : [
        { label: t.fServices, href: `${base}/services` },
        { label: t.fHow, href: `${base}/#how` },
        { label: t.fRessources, href: `${base}/ressources` },
        { label: t.fContact, href: 'mailto:caio@opsflow-advisory.ch' },
      ]
  return (
    <>
      <footer className="site-footer">
        <div className="wrap">
          <span>{t.fLine}</span>
          <nav aria-label="Footer">
            {links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
            <span aria-label="Language" style={{ display: 'flex', gap: 10 }}>
              {lang !== 'fr' && <a href="/" hrefLang="fr">FR</a>}
              {lang !== 'de' && <a href="/de" hrefLang="de">DE</a>}
              {lang !== 'en' && <a href="/en" hrefLang="en">EN</a>}
            </span>
          </nav>
          <span>{t.fTag}</span>
        </div>
      </footer>
      <MobileBar lang={lang} />
    </>
  )
}

/** Sticky booking bar under 860px (".mbar" in the prototypes). */
export function MobileBar({ lang = 'en' }: { lang?: Lang }) {
  return (
    <div className="mbar">
      <a className="btn" href={CALENDLY} target="_blank" rel="noopener">{C[lang].bar} <Arrow /></a>
    </div>
  )
}
