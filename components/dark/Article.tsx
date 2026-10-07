import type { ReactNode } from 'react'
import type { Bg } from '@/lib/bg'
import { Band, type Crumb } from '@/components/dark/Band'
import { Faqs } from '@/components/dark/Faqs'
import { Toc } from '@/components/dark/Toc'
import { Footer } from '@/components/CTAFooter'
import { prepareBody } from '@/lib/prose'
import { CALENDLY } from '@/lib/booking'

type Lang = 'fr' | 'de' | 'en'

const T: Record<Lang, { toc: string; faq: string; kick: string; q: string; li: string[]; btn: string; small: string; self: string }> = {
  en: { toc: 'On this page', faq: 'Frequently asked questions', kick: 'Free 45-minute session', q: 'Want a second pair of eyes on this?', li: ['45 minutes, no commitment', 'Bring your recent figures', 'A plain answer in writing'], btn: 'Book a free session', small: 'Senior practitioner on every call. We reply by email only about your request.', self: 'Take the free S&OP Self-Assessment' },
  fr: { toc: 'Sur cette page', faq: 'Questions fréquentes', kick: 'Session gratuite', q: 'Un regard senior sur votre situation ?', li: ['Sans engagement', 'Apportez vos chiffres récents', 'Une réponse claire'], btn: 'Réserver une session gratuite', small: 'Un praticien senior à chaque appel.', self: 'Faire le diagnostic S&OP' },
  de: { toc: 'Auf dieser Seite', faq: 'Häufige Fragen', kick: 'Kostenlose Session', q: 'Ein erfahrener Blick auf Ihre Situation?', li: ['Unverbindlich', 'Bringen Sie Ihre aktuellen Zahlen mit', 'Eine klare Antwort'], btn: 'Kostenlose Session buchen', small: 'Bei jedem Gespräch eine erfahrene Fachperson.', self: 'S&OP-Standortbestimmung starten' },
}

/** Dark reading template shared by service and article pages (TOC, reading column, FAQ, sticky booking card). */
export function Article({
  lang, crumbs, kick, title, lead, html, faq, model, aside, after, headerAside, bg }: {
  lang: Lang
  crumbs: Crumb[]
  kick?: string
  title: ReactNode
  lead?: string
  html: string
  faq: { q: string; a: string }[]
  model?: { decision: string; execution: string }
  aside?: ReactNode
  after?: ReactNode
  headerAside?: ReactNode
  bg?: Bg
}) {
  const t = T[lang]
  const { body, toc } = prepareBody(html, { lang, model })
  const items = faq.length ? [...toc, { id: 'faq', label: t.faq }] : toc
  return (
    <>
      <Band
        lang={lang}
        crumbs={crumbs}
        kick={kick}
        title={title}
        lead={lead}
        actions={<>
          <a className="btn" href={CALENDLY} target="_blank" rel="noopener">{t.btn} <span aria-hidden="true">→</span></a>
          <a className="btn2" href="/diagnostic">{t.self} ›</a>
        </>}
        aside={headerAside}
        bg={bg}
      />
      <main id="main">
        <div className="wrap smain">
          <Toc items={items} title={t.toc} />
          <article className="prose-dk">
            <div className="prose-body" dangerouslySetInnerHTML={{ __html: body }} />
            {faq.length > 0 && <>
              <h2 id="faq">{t.faq}</h2>
              <Faqs items={faq} />
            </>}
          </article>
          <aside className="aside" id="book">
            <div className="pn book">
              <div className="kick">{t.kick}</div>
              <h3 style={{ marginTop: 10 }}>{t.q}</h3>
              <ul>{t.li.map((l) => <li key={l}>{l}</li>)}</ul>
              <a className="btn" href={CALENDLY} target="_blank" rel="noopener">{t.btn} <span aria-hidden="true">→</span></a>
              <small>{t.small}</small>
            </div>
            {aside}
          </aside>
        </div>
        {after}
      </main>
      <Footer lang={lang} />
    </>
  )
}
