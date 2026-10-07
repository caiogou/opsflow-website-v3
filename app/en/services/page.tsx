import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/CTAFooter'
import { CALENDLY } from '@/lib/booking'
import { servicesEn } from '@/lib/services_en'
import { PAGE_META, breadcrumbLd, pageMetadata } from '@/lib/pages_en'

const META = PAGE_META.solutions
export const metadata: Metadata = pageMetadata(META)

export default function Hub() {
  return (
    <>
      <Navbar lang="en" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(META)) }} />
      <main>
        <section className="max-w-3xl mx-auto px-6 md:px-8 py-14 md:py-20">
          <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">Solutions</p>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-navy mb-4">Supply Chain Solutions for Growing SMEs</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">Clearly scoped, senior-led engagements across S&OP/IBP, supply planning, order management and logistics.</p>
          <p className="text-base text-gray-600 leading-relaxed mb-10">Each solution starts from your own data and ends with a plan your team can run. A senior practitioner follows the execution month by month. Embedded leadership, not an embedded team.</p>
          <ul className="space-y-5 list-none pl-0">
            {servicesEn.map((r) => (
              <li key={r.slug} className="border-b border-gray-100 pb-5">
                <a href={`/en/services/${r.slug}`} className="no-underline block">
                  <h2 className="text-xl font-bold text-navy hover:text-teal">{r.h1}</h2>
                  <p className="text-sm text-gray-500 mt-1">{r.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section className="py-14 px-6 md:py-16 md:px-8 bg-teal text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-white mb-4">Not sure which solution is right for you?</h2>
            <p className="text-base text-emerald-50 leading-relaxed mb-8">Start with a free 45-minute session. We look at your situation together and tell you where we would start. Free, no commitment.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-navy px-8 py-4 rounded text-sm font-bold hover:opacity-90 transition-opacity no-underline">Book a free session</a>
              <a href="/en/how-we-work" className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 rounded text-sm font-bold hover:bg-white/10 transition-colors no-underline">See how we work</a>
            </div>
          </div>
        </section>
      </main>
      <Footer lang="en" />
    </>
  )
}
