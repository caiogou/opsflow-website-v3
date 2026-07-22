'use client'

import { LogoIcon } from './LogoIcon'

const CALENDLY = 'https://calendly.com/caio-opsflow-advisory/30min'

type Lang = 'fr' | 'de' | 'en'

const LABELS: Record<Lang, { services: string; how: string; academy: string; platform: string; ressources: string; diagnostic: string; cta: string; ctaShort: string }> = {
  fr: { services: 'Services', how: 'Notre approche', academy: 'Academy', platform: 'Plateforme', ressources: 'Ressources', diagnostic: 'Diagnostic', cta: 'Réserver un échange', ctaShort: 'Échange' },
  de: { services: 'Leistungen', how: 'Unser Ansatz', academy: 'Academy', platform: 'Plattform', ressources: 'Ressourcen', diagnostic: 'Diagnostik', cta: 'Termin buchen', ctaShort: 'Termin' },
  en: { services: 'Services', how: 'How it works', academy: 'Academy', platform: 'Platform', ressources: 'Resources', diagnostic: 'Diagnostic', cta: 'Book a session', ctaShort: 'Book' },
}

export function Navbar({ lang = 'fr' }: { lang?: Lang }) {
  const t = LABELS[lang]
  const base = lang === 'fr' ? '' : `/${lang}`
  const links = [
    { label: t.services, href: `${base}/services` },
    { label: t.how, href: `${base}/#how` },
    { label: t.academy, href: '/academy' },
    { label: t.platform, href: `/platform` },
    { label: t.ressources, href: `${base}/ressources` },
    { label: t.diagnostic, href: `/diagnostic` },
  ]
  return (
    <nav className="bg-navy sticky top-0 z-50 border-b border-navy-mid">
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <a href={base || '/'} className="flex items-center gap-3 no-underline">
          <LogoIcon size={34} />
          <span className="text-base md:text-lg font-bold text-white tracking-tight">OpsFlow Advisory</span>
        </a>
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-teal-muted text-sm hover:text-white transition-colors no-underline">{l.label}</a>
          ))}
          <div className="flex items-center gap-2 text-xs">
            <a href="/" className={`no-underline ${lang === 'fr' ? 'text-white font-bold' : 'text-teal-muted hover:text-white'}`}>FR</a>
            <span className="text-navy-mid">|</span>
            <a href="/de" className={`no-underline ${lang === 'de' ? 'text-white font-bold' : 'text-teal-muted hover:text-white'}`}>DE</a>
            <span className="text-navy-mid">|</span>
            <a href="/en" className={`no-underline ${lang === 'en' ? 'text-white font-bold' : 'text-teal-muted hover:text-white'}`}>EN</a>
          </div>
          <a href={CALENDLY} target="_blank" rel="noopener" className="bg-teal text-white px-5 py-2 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">{t.cta}</a>
        </div>
        <a href={CALENDLY} target="_blank" rel="noopener" className="md:hidden bg-teal text-white px-4 py-2 rounded text-xs font-semibold hover:bg-teal-light transition-colors no-underline">{t.ctaShort}</a>
      </div>
    </nav>
  )
}
