import type { Metadata } from 'next'
import { CTA, Footer } from '@/components/CTAFooter'
import { Band, Arrow } from '@/components/dark/Band'
import { CALENDLY } from '@/lib/booking'
import { TEAM } from '@/lib/team'
import { PAGE_META, breadcrumbLd, pageMetadata } from '@/lib/pages_en'

const META = PAGE_META.about
export const metadata: Metadata = pageMetadata(META)

const APPROACH = [
  { h: 'Practical and hands-on', p: 'We start from your real situation and your data, and size every solution to your scale.' },
  { h: 'Evidence-based decisions', p: 'Recommendations come from your figures and from the shop floor, compared side by side.' },
  { h: 'Collaborative with your team', p: 'Your team runs the work. We build capability in-house so it holds after we step back.' },
  { h: 'Focused on real results', p: 'We measure success by decisions that hold and results you can see, not by the size of the report.' },
]

export default function Page() {
  // Only members with a photo and a bio are shown (lib/team.ts). No placeholder people on the live site.
  const people = TEAM.filter((m) => m.photo && m.bio.en)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(META)) }} />
      <Band bg="about"
        crumbs={[{ label: 'Home', href: '/en' }, { label: 'About' }]}
        kick="About"
        title={<>A hands-on approach. <em>Real-world experience.</em></>}
        lead="Senior supply chain practitioners who work alongside your team, from the first conversation to measurable results."
        actions={<a className="btn" href={CALENDLY} target="_blank" rel="noopener">Book a free 45-minute session <Arrow /></a>}
        aside={
          <div className="pn" aria-label="At a glance">
            <h4>At a glance</h4>
            <ul className="plist">
              <li><b>1</b><div><strong>Based in</strong>Nyon, Switzerland</div></li>
              <li><b>2</b><div><strong>Languages</strong>English, French and German</div></li>
              <li><b>3</b><div><strong>Scope</strong>S&amp;OP/IBP, supply planning, order management, logistics</div></li>
              <li><b>4</b><div><strong>Clients</strong>Growing manufacturing and distribution companies across Europe</div></li>
            </ul>
          </div>
        }
      />
      <main id="main">
        <section className="wrap sec">
          <div className="kick">Who we are</div>
          <h2>A Swiss supply chain advisory <em>for growing companies.</em></h2>
          <div className="split" style={{ marginTop: 24 }}>
            <div>
              <p>OpsFlow Advisory is a supply chain advisory based in Nyon, Switzerland. We help growing manufacturing and distribution companies across Europe with S&amp;OP/IBP, supply planning, order management and logistics.</p>
              <p>We work in English, French and German. Our partners have worked as senior supply chain professionals; you can read what they delivered in our <a href="/en/case-studies" style={{ color: 'var(--teal)' }}>case studies</a>.</p>
            </div>
            <div style={{ display: 'grid', gap: 18 }}>
              <p className="quote">Embedded leadership, not an embedded team.</p>
              <p className="quote">AI-assisted, senior-decided.</p>
            </div>
          </div>
        </section>
        <section className="wrap sec">
          <div className="kick">Our approach</div>
          <h2>How we work <em>with you.</em></h2>
          <div className="cgrid g4">
            {APPROACH.map((a, i) => (
              <div key={a.h} className="card"><span className="tag">{String(i + 1).padStart(2, '0')}</span><h3>{a.h}</h3><p>{a.p}</p></div>
            ))}
          </div>
        </section>
        {people.length > 0 && (
          <section className="wrap sec" id="team">
            <div className="kick">Our team</div>
            <h2>The people <em>behind OpsFlow.</em></h2>
            <div className="cgrid g3">
              {people.map((m) => (
                <div key={m.name} className="card team">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="photo" src={m.photo} alt={m.name} width={88} height={88} />
                  <h3>{m.name}</h3>
                  <p className="role">{m.role.en}</p>
                  <p>{m.bio.en}</p>
                  {m.linkedin && <a className="more" href={m.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn profile <Arrow /></a>}
                </div>
              ))}
            </div>
          </section>
        )}
        <CTA
          lang="en"
          h2="Talk to a senior practitioner."
          text="A free 45-minute session about your supply chain. Free, no commitment."
          secondary={{ label: 'Contact us', href: '/en/contact' }}
        />
      </main>
      <Footer lang="en" />
    </>
  )
}
