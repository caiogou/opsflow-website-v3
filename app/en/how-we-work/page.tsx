import type { Metadata } from 'next'
import { CTA, Footer } from '@/components/CTAFooter'
import { Band, Arrow } from '@/components/dark/Band'
import { Faqs } from '@/components/dark/Faqs'
import { CALENDLY } from '@/lib/booking'
import { PAGE_META, breadcrumbLd, pageMetadata } from '@/lib/pages_en'

const META = PAGE_META.howWeWork
export const metadata: Metadata = pageMetadata(META)

const STEPS = [
  { n: '1', title: 'Free 45-minute session', price: 'Free, no commitment', what: 'A structured conversation with a senior practitioner about your supply chain reality. Bring your recent figures.', get: 'Your top priorities clear, and a plain answer on whether going further is worth it now.', dur: '45 minutes' },
  { n: '2', title: 'Supply Chain Health Check', price: 'From CHF 8,500, fixed price', what: 'We assess your planning, inventory and operational setup, from forecast to delivery, using your data and interviews with your teams.', get: 'Top 3 priorities ranked by P&L impact, a 90-day plan, an executive summary.', dur: 'Two weeks' },
  { n: '3', title: 'Strategy and senior follow-through', price: 'CHF 22,000 to 80,000 depending on scope', what: 'We build the plan with you. A senior practitioner then oversees execution with your team, month by month.', get: 'A plan your team executes, with senior oversight until the results show.', dur: 'Month by month, sized to the scope agreed' },
]

const FAQ = [
  { q: 'What does the first session cost?', a: 'Nothing. The 45-minute session is free, with no commitment. You leave with your top priorities clear, whether we work together or not.' },
  { q: 'What is the Supply Chain Health Check?', a: 'A two-week, fixed-price engagement, from CHF 8,500. You get your top 3 priorities ranked by P&L impact, a 90-day plan and an executive summary.' },
  { q: 'Do you place a team inside our company?', a: 'No. Embedded leadership, not an embedded team: a senior practitioner oversees execution month by month, and your own team runs it.' },
  { q: 'How do you use AI?', a: 'AI speeds up data analysis, diagnostics and scenario modeling. Judgment and decisions stay with senior people: AI-assisted, senior-decided.' },
]

export default function Page() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(META)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Band bg="how"
        crumbs={[{ label: 'Home', href: '/en' }, { label: 'How we work' }]}
        kick="How we work"
        title={<>From first conversation <em>to measurable results.</em></>}
        lead="Three clear steps, fixed prices, and a senior practitioner at every one of them. Your team stays in charge of the work."
        actions={<>
          <a className="btn" href={CALENDLY} target="_blank" rel="noopener">Book a free 45-minute session <Arrow /></a>
          <a className="btn2" href="#steps">See the three steps ›</a>
        </>}
        aside={
          <div className="pn" aria-label="The three steps at a glance">
            <h4>The three steps at a glance</h4>
            <ul className="plist">
              <li><b>1</b><div><strong>Free 45-minute session</strong>Free, no commitment</div></li>
              <li><b>2</b><div><strong>Supply Chain Health Check</strong>Two weeks, from CHF 8,500</div></li>
              <li><b>3</b><div><strong>Strategy and senior follow-through</strong>CHF 22,000 to 80,000 depending on scope</div></li>
            </ul>
          </div>
        }
      />
      <main id="main">
        <section className="wrap sec" id="steps">
          <div className="kick">The three steps</div>
          <h2>Start small. <em>Go further only when it pays.</em></h2>
          <p className="intro">Each step stands on its own. You decide at the end of each one whether to continue.</p>
          <div className="steps">
            {STEPS.map((s) => (
              <div key={s.n} className="pn step">
                <div className="n">{s.n}</div>
                <h3>{s.title}</h3>
                <div className="price">{s.price}</div>
                <dl>
                  <div><dt>What happens</dt><dd>{s.what}</dd></div>
                  <div><dt>What you get</dt><dd>{s.get}</dd></div>
                  <div><dt>Duration</dt><dd>{s.dur}</dd></div>
                </dl>
                {s.n === '2' && <a className="btn2" style={{ alignSelf: 'flex-start' }} href="/en/services/supply-chain-audit">About the Supply Chain Health Check ›</a>}
              </div>
            ))}
          </div>
        </section>
        <section className="wrap sec" id="leadership">
          <div className="kick">Follow-through</div>
          <h2>Embedded leadership, <em>not an embedded team.</em></h2>
          <div className="split" style={{ marginTop: 24 }}>
            <div>
              <p>Most plans fail in execution, not on paper. That is why our work does not stop at a report.</p>
              <p>In the follow-through step, a senior practitioner stays involved month by month: reviewing progress, unblocking decisions and keeping the plan on course. Your team runs the work. You build capability in-house instead of renting it.</p>
            </div>
            <div className="model" aria-label="Who does what">
              <div><b>Senior practitioner</b><span>Oversees execution, month by month, and keeps decisions moving.</span></div>
              <div><b>Your team</b><span>Runs the processes day to day and owns them after we step back.</span></div>
            </div>
          </div>
        </section>
        <section className="wrap sec" id="ai">
          <div className="kick">How we use AI</div>
          <h2>AI-assisted, <em>senior-decided.</em></h2>
          <div className="cgrid g3">
            <div className="card"><span className="tag">Faster analysis</span><h3>Data analysis</h3><p>AI speeds up the work of cleaning, combining and reading your planning, inventory and supply data.</p></div>
            <div className="card"><span className="tag">Faster diagnosis</span><h3>Diagnostics and scenarios</h3><p>AI helps us test diagnostics and model scenarios quickly, so more time goes into the decisions.</p></div>
            <div className="card"><span className="tag">Human judgment</span><h3>Senior decisions</h3><p>Judgment stays with senior people. Every recommendation is made and owned by an experienced practitioner.</p></div>
          </div>
        </section>
        <section className="wrap sec" id="faq">
          <div className="kick">FAQ</div>
          <h2>Questions we hear before the first session.</h2>
          <Faqs items={FAQ} />
        </section>
        <CTA lang="en" />
      </main>
      <Footer lang="en" />
    </>
  )
}
