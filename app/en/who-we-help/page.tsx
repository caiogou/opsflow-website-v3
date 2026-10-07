import type { Metadata } from 'next'
import { CTA, Footer } from '@/components/CTAFooter'
import { Band, Arrow } from '@/components/dark/Band'
import { CALENDLY } from '@/lib/booking'
import { PAGE_META, breadcrumbLd, pageMetadata } from '@/lib/pages_en'

const META = PAGE_META.whoWeHelp
export const metadata: Metadata = pageMetadata(META)

const SIGNALS = [
  { h: 'Forecasting gets harder', p: 'More products, channels and customers make demand harder to read, and forecasts in one place no longer match operations plans in another.' },
  { h: 'Inventory grows, service does not', p: 'Stock keeps rising, yet stockouts continue: overall overstock alongside local stockouts, because stock is allocated out of habit.' },
  { h: 'Planning is reactive', p: 'The same crisis meeting, month after month. Decisions are made under pressure instead of prepared in advance.' },
  { h: 'Data is fragmented', p: 'Planners spend their time reconciling reports and spreadsheets instead of managing the exceptions that matter.' },
  { h: 'More suppliers and markets', p: 'The chain has grown more complex or more international, and risk management and distribution rules have not kept pace.' },
  { h: 'Costs rise faster than the business', p: 'Logistics and cost-to-serve climb with no clear explanation, as the sum of many uncoordinated local trade-offs.' },
]

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(META)) }} />
      <Band bg="who"
        crumbs={[{ label: 'Home', href: '/en' }, { label: 'Who we help' }]}
        kick="Who we help"
        title={<>Built for companies where supply chain complexity is <em>catching up with growth.</em></>}
        lead="Growing manufacturing and distribution SMEs across Europe, at the point where informal planning stops working."
        actions={<>
          <a className="btn" href="/en/services/supply-chain-audit">Start with a Health Check <Arrow /></a>
          <a className="btn2" href={CALENDLY} target="_blank" rel="noopener">Or book a free session ›</a>
        </>}
        aside={
          <div className="pn" aria-label="Quick check">
            <h4>A quick check</h4>
            <ul className="plist">
              <li><b>?</b><div>Do sales promise lead times that operations discover after the fact?</div></li>
              <li><b>?</b><div>Is stock growing while service stays the same?</div></li>
              <li><b>?</b><div>Does your team spend more time reconciling data than deciding?</div></li>
            </ul>
            <p className="note">TWO OR MORE YES: <a href="/diagnostic" style={{ color: 'var(--teal)' }}>TAKE THE FREE S&amp;OP SELF-ASSESSMENT ›</a></p>
          </div>
        }
      />
      <main id="main">
        <section className="wrap sec">
          <div className="kick">Signals</div>
          <h2>You may recognize <em>some of these.</em></h2>
          <p className="intro">These are the signals that come up most often when growth outpaces the way supply chain decisions are made.</p>
          <ul className="signals">
            {SIGNALS.map((s, i) => (
              <li key={s.h}><i aria-hidden="true">{i + 1}</i><div><h3>{s.h}</h3><p>{s.p}</p></div></li>
            ))}
          </ul>
        </section>
        <section className="wrap sec" id="profile">
          <div className="kick">Typical profile</div>
          <h2>Who we usually <em>work with.</em></h2>
          <div className="split" style={{ marginTop: 24 }}>
            <div>
              <p>We work with growing manufacturing and distribution SMEs across Europe, where sales and production decisions are made by different people and coordination has become too complex to stay informal.</p>
              <p>You do not need to be a large company. What matters is that supply chain complexity is catching up with growth, and that leadership wants to decide on a shared plan rather than react.</p>
            </div>
            {/* Revenue range and key industries: hidden until confirmed by the partners (no placeholders on the live site). */}
            <div className="pn">
              <h4>Profile details</h4>
              <ul className="ticks" style={{ marginTop: 14 }}>
                <li>Manufacturing and distribution companies</li>
                <li>Growing SMEs across Europe</li>
                <li>Work in English, French and German</li>
              </ul>
            </div>
          </div>
        </section>
        <CTA
          lang="en"
          h2="Start with a Supply Chain Health Check."
          text="Two weeks, fixed price, from CHF 8,500. Top 3 priorities ranked by P&L impact, a 90-day plan, an executive summary. Not ready yet? Start with a free 45-minute session."
          primary={{ label: 'About the Health Check', href: '/en/services/supply-chain-audit' }}
          secondary={{ label: 'Book a free 45-minute session', href: CALENDLY }}
        />
      </main>
      <Footer lang="en" />
    </>
  )
}
