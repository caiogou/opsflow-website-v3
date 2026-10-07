import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/CTAFooter'
import { CALENDLY } from '@/lib/booking'
import { CONTACT as T, CONTACT_EMAIL, LOCATION, PAGE_META, breadcrumbLd, pageMetadata } from '@/lib/pages_en'

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
      <Navbar lang="en" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(META)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }} />
      <main className="py-14 px-6 md:py-20 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{T.rubric}</p>
            <h1 className="font-serif text-3xl md:text-5xl font-normal text-navy mb-5 leading-tight">{T.h1}</h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl mb-8">{T.intro}</p>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-block bg-teal text-white px-7 py-3 rounded text-sm font-semibold hover:bg-teal-light transition-colors no-underline">{T.bookCta}</a>
            <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <dt className="text-[11px] font-bold tracking-widest text-teal uppercase mb-1">{T.emailLabel}</dt>
                <dd className="ml-0"><a href={`mailto:${CONTACT_EMAIL}`} className="text-navy font-semibold underline">{CONTACT_EMAIL}</a></dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold tracking-widest text-teal uppercase mb-1">{T.locationLabel}</dt>
                <dd className="ml-0 text-navy font-semibold">{LOCATION}</dd>
              </div>
            </dl>
          </div>
          <aside className="space-y-6">
            <div className="rounded-lg border border-teal/30 bg-teal-pale/30 p-6">
              <h2 className="text-lg font-bold text-navy mb-2">{T.healthCheck.h2}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{T.healthCheck.text}</p>
              <a href={T.healthCheck.href} className="text-sm font-semibold text-teal no-underline hover:underline">{T.healthCheck.link} →</a>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-navy mb-2">{T.selfAssessment.h2}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{T.selfAssessment.text}</p>
              <a href="/diagnostic" className="text-sm font-semibold text-teal no-underline hover:underline">{T.selfAssessment.cta} →</a>
            </div>
          </aside>
        </div>
      </main>
      <Footer lang="en" />
    </>
  )
}
