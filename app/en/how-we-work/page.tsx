import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { CTA, Footer } from '@/components/CTAFooter'
import { CALENDLY } from '@/lib/booking'
import { HOW_WE_WORK as T, OFFER_STEPS, PAGE_META, breadcrumbLd, pageMetadata } from '@/lib/pages_en'

const META = PAGE_META.howWeWork
export const metadata: Metadata = pageMetadata(META)

export default function Page() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: T.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  return (
    <>
      <Navbar lang="en" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(META)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <main>
        <section className="py-14 px-6 md:py-20 md:px-8">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{T.rubric}</p>
            <h1 className="font-serif text-3xl md:text-5xl font-normal text-navy mb-5 leading-tight max-w-3xl">{T.h1}</h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mb-12">{T.intro}</p>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 list-none pl-0">
              {OFFER_STEPS.map((s) => (
                <li key={s.num} className="rounded-lg border border-gray-200 p-7 flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center text-white text-xl font-serif mb-5">{s.num}</div>
                  <h2 className="text-lg font-bold text-navy mb-2">{s.title}</h2>
                  <p className="text-sm text-teal font-semibold mb-3">{s.price}</p>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{s.desc}</p>
                  {s.href && <a href={s.href} className="text-sm font-semibold text-teal no-underline hover:underline mt-4">{s.linkLabel} →</a>}
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-block bg-teal text-white px-7 py-3 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">Book a free 45-minute session</a>
            </div>
          </div>
        </section>

        <section className="py-14 px-6 md:py-20 md:px-8 bg-teal-pale/30">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy mb-5">{T.followThrough.h2}</h2>
              {T.followThrough.paragraphs.map((p) => <p key={p} className="text-base text-gray-600 leading-relaxed mb-4">{p}</p>)}
              <ul className="mt-4 space-y-2 list-disc pl-5">
                {T.followThrough.points.map((p) => <li key={p} className="text-sm text-gray-600 leading-relaxed">{p}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy mb-5">{T.ai.h2}</h2>
              {T.ai.paragraphs.map((p) => <p key={p} className="text-base text-gray-600 leading-relaxed mb-4">{p}</p>)}
              <div className="mt-8 rounded-lg border border-teal/30 bg-white p-6">
                <h3 className="text-base font-bold text-navy mb-2">{T.selfAssessment.h2}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{T.selfAssessment.text}</p>
                <a href="/diagnostic" className="text-sm font-semibold text-teal no-underline hover:underline">{T.selfAssessment.cta} →</a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 px-6 md:py-20 md:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy mb-8">Frequently asked questions</h2>
            <dl className="space-y-6">
              {T.faq.map((f) => (
                <div key={f.q} className="border-b border-gray-100 pb-5">
                  <dt className="text-base font-bold text-navy mb-2">{f.q}</dt>
                  <dd className="text-sm text-gray-600 leading-relaxed ml-0">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <CTA lang="en" />
      <Footer lang="en" />
    </>
  )
}
