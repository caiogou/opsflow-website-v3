import type { Metadata } from 'next'
import { CTA, Footer } from '@/components/CTAFooter'
import { Band, Arrow } from '@/components/dark/Band'
import { CALENDLY } from '@/lib/booking'
import { CONTACT_EMAIL, LOCATION, PAGE_META, breadcrumbLd, pageMetadata } from '@/lib/pages_en'

const META = PAGE_META.contact
export const metadata: Metadata = pageMetadata(META)

// No form on purpose: /api/lead forwards any JSON to the Supabase RPC opsflow_capturar_lead, which is built for the
// diagnostic lead (origem/email/empresa/score...). It is not confirmed that it stores a free-text message or notifies
// anyone, so contact goes through Calendly and email until a contact form is agreed with Caio.
export default function Page() {
  const contactLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: META.title,
    url: `https://www.opsflow-advisory.ch${META.path}`,
    about: { '@type': 'ProfessionalService', name: 'OpsFlow Advisory', email: CONTACT_EMAIL, address: { '@type': 'PostalAddress', addressLocality: 'Nyon', addressCountry: 'CH' } },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(META)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }} />
      <Band bg="contact"
        crumbs={[{ label: 'Home', href: '/en' }, { label: 'Contact' }]}
        kick="Contact"
        title={<>Let&apos;s talk about your <em>supply chain challenges.</em></>}
        lead="Book a free 45-minute session with a senior practitioner, or email us."
        actions={<a className="btn" href={CALENDLY} target="_blank" rel="noopener">Book a free 45-minute session <Arrow /></a>}
      />
      <main id="main">
        <section className="wrap sec">
          <div className="ctc">
            <div>
              <div className="kick">Talk to us</div>
              <h2>Tell us what is <em>slowing you down.</em></h2>
              <p className="intro">The first conversation is a free 45-minute session about your supply chain, with a senior practitioner. Free, no commitment. Pick a time that suits you, or write to us and we reply by email, only about your request.</p>
              <div className="btns">
                <a className="btn" href={CALENDLY} target="_blank" rel="noopener">Pick a time for your free session <Arrow /></a>
                <a className="btn2" href={`mailto:${CONTACT_EMAIL}`}>Email {CONTACT_EMAIL} ›</a>
              </div>
              <div className="steps mini" style={{ marginTop: 36 }}>
                <div className="pn"><div className="n">1</div><h3>Pick a time</h3><p>Choose a 45-minute slot in the calendar. No preparation needed.</p></div>
                <div className="pn"><div className="n">2</div><h3>Bring your figures</h3><p>Recent figures help, if you have them. We look at your situation with you.</p></div>
                <div className="pn"><div className="n">3</div><h3>A plain answer</h3><p>You leave with your top priorities clear, whether we work together or not.</p></div>
              </div>
            </div>
            <aside className="side">
              <div className="pn">
                <h4>Contact details</h4>
                <ul className="dets">
                  <li><b>Email</b><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
                  <li><b>Location</b>{LOCATION}</li>
                  <li><b>Languages</b>English, French and German</li>
                </ul>
              </div>
              <div className="pn">
                <div className="kick">Supply Chain Health Check</div>
                <h3>Prefer to start with a Supply Chain Health Check?</h3>
                <p>In two weeks we assess your planning, inventory and operational setup and give you a prioritized roadmap. From CHF 8,500.</p>
                <div className="btns" style={{ marginTop: 16 }}><a className="btn" href="/en/services/supply-chain-audit" style={{ fontSize: 15 }}>About the Health Check <Arrow /></a></div>
                <p style={{ fontSize: 14 }}>Not ready to talk yet? Take the <a href="/diagnostic" style={{ color: 'var(--teal)', borderBottom: '1px solid var(--line2)' }}>Free S&amp;OP Self-Assessment</a>: 32 questions, about 12 minutes.</p>
              </div>
            </aside>
          </div>
        </section>
        <CTA
          lang="en"
          h2="Rather talk first?"
          text="Book a free 45-minute session with a senior practitioner. Free, no commitment."
          secondary={null}
        />
      </main>
      <Footer lang="en" />
    </>
  )
}
