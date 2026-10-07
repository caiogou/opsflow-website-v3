import type { ReactNode } from 'react'
import { Navbar } from '@/components/Navbar'
import { bgUrl, type Bg } from '@/lib/bg'

type Lang = 'fr' | 'de' | 'en'
export type Crumb = { label: string; href?: string }

/** Header band of the dark visual: map plate, navigation, breadcrumb, kicker, H1, lead, buttons and an optional side card. */
export function Band({
  lang = 'en', crumbs, kick, title, lead, actions, aside, children, bg,
}: {
  bg?: Bg
  lang?: Lang
  crumbs?: Crumb[]
  kick?: string
  title: ReactNode
  lead?: ReactNode
  actions?: ReactNode
  aside?: ReactNode
  children?: ReactNode
}) {
  return (
    <>
      <a className="skip" href="#main">{lang === 'fr' ? 'Aller au contenu' : lang === 'de' ? 'Zum Inhalt' : 'Skip to content'}</a>
      <header className="band">
        {bg ? <div className="plate plate-pg" role="presentation" style={{ backgroundImage: `url(${bgUrl(bg)})` }} /> : <div className="plate" role="img" aria-label="Supply network over Europe at night" />}
        <div style={{ position: 'relative', zIndex: 3 }}><Navbar lang={lang} /></div>
        <div className={`wrap hero${aside ? '' : ' solo'}`}>
          <div>
            {crumbs && crumbs.length > 0 && (
              <nav className="crumb" aria-label="Breadcrumb">
                {crumbs.map((c, i) => (
                  <span key={i} style={{ display: 'contents' }}>
                    {i > 0 && <span aria-hidden="true">›</span>}
                    {c.href ? <a href={c.href}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
                  </span>
                ))}
              </nav>
            )}
            {kick && <div className="kick" style={{ marginTop: crumbs ? 22 : 0 }}>{kick}</div>}
            <h1>{title}</h1>
            {lead && <p className="lead">{lead}</p>}
            {actions && <div className="btns">{actions}</div>}
            {children}
          </div>
          {aside}
        </div>
      </header>
    </>
  )
}

export function Arrow() {
  return <span aria-hidden="true">→</span>
}
