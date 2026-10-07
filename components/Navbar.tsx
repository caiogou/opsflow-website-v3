'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CALENDLY } from '@/lib/booking'

type Lang = 'fr' | 'de' | 'en'

const LABELS: Record<Lang, { services: string; how: string; ressources: string; diagnostic: string; cta: string; menu: string; close: string }> = {
  fr: { services: 'Services', how: 'Notre approche', ressources: 'Ressources', diagnostic: 'Diagnostic', cta: 'Réserver un échange', menu: 'Menu', close: 'Fermer' },
  de: { services: 'Leistungen', how: 'Unser Ansatz', ressources: 'Ressourcen', diagnostic: 'Diagnostik', cta: 'Termin buchen', menu: 'Menü', close: 'Schliessen' },
  en: { services: 'Solutions', how: 'How we work', ressources: 'Insights', diagnostic: 'Diagnostic', cta: 'Talk to us', menu: 'Menu', close: 'Close' },
}

// EN main menu (Behrad's structure, 07/10/2026). FR/DE keep their own menus.
const EN_LINKS = [
  { label: 'Solutions', href: '/en/services' },
  { label: 'How we work', href: '/en/how-we-work' },
  { label: 'Case studies', href: '/en/case-studies' },
  { label: 'Who we help', href: '/en/who-we-help' },
  { label: 'About', href: '/en/about' },
  { label: 'Insights', href: '/en/insights' },
]

export function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 46 46" fill="none" stroke="#2fd3bd" strokeWidth="2.4" aria-hidden="true">
      <circle cx="23" cy="10" r="6" /><circle cx="10" cy="36" r="6" /><circle cx="36" cy="36" r="6" />
      <path d="M19 15 12 30M27 15l7 15M16 36h14" />
    </svg>
  )
}

/** Dark site navigation. Desktop menu above 980px, a button-driven menu panel below. */
export function Navbar({ lang = 'fr' }: { lang?: Lang }) {
  const t = LABELS[lang]
  const base = lang === 'fr' ? '' : `/${lang}`
  const path = usePathname() || ''
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  const links = lang === 'en'
    ? EN_LINKS
    : [
        { label: t.services, href: `${base}/services` },
        { label: t.how, href: `${base}/#how` },
        { label: t.ressources, href: `${base}/ressources` },
        { label: t.diagnostic, href: `/diagnostic` },
      ]
  const cta = lang === 'en'
    ? { href: '/en/contact', ext: {} }
    : { href: CALENDLY, ext: { target: '_blank', rel: 'noopener' } }
  const isOn = (href: string) => !href.includes('#') && href !== '/' && (path === href || path.startsWith(href + '/'))

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onClick = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick) }
  }, [open])

  const langs = (
    <>
      <a href="/" className={lang === 'fr' ? 'on' : ''} hrefLang="fr">FR</a>
      <a href="/de" className={lang === 'de' ? 'on' : ''} hrefLang="de">DE</a>
      <a href="/en" className={lang === 'en' ? 'on' : ''} hrefLang="en">EN</a>
    </>
  )

  return (
    <div className="wrap site-nav">
      <nav className="nav" aria-label="Main">
        <a className="logo" href={base || '/'} aria-label="OpsFlow Advisory home">
          <Logo />
          <span>OpsFlow <b>Advisory</b></span>
        </a>
        <div className="menu">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={isOn(l.href) ? 'on' : undefined} aria-current={isOn(l.href) ? 'page' : undefined}>{l.label}</a>
          ))}
          {lang !== 'en' && <span className="langs" aria-label="Language">{langs}</span>}
        </div>
        <div className="mnav" ref={box}>
          <button type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            {open ? t.close : t.menu}
          </button>
          {open && (
            <div className="mpanel" id="mobile-menu">
              {links.map((l) => (
                <a key={l.href} href={l.href} className={isOn(l.href) ? 'on' : undefined} aria-current={isOn(l.href) ? 'page' : undefined} onClick={() => setOpen(false)}>{l.label}</a>
              ))}
              <div className="mlangs">{langs}</div>
            </div>
          )}
        </div>
        <a className="cta" href={cta.href} {...cta.ext}>{t.cta}</a>
      </nav>
    </div>
  )
}
