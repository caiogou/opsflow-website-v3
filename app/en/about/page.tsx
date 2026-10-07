import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Team } from '@/components/Team'
import { CTA, Footer } from '@/components/CTAFooter'
import { ABOUT as T, PAGE_META, breadcrumbLd, pageMetadata } from '@/lib/pages_en'

const META = PAGE_META.about
export const metadata: Metadata = pageMetadata(META)

export default function Page() {
  return (
    <>
      <Navbar lang="en" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(META)) }} />
      <main>
        <section className="py-14 px-6 md:py-20 md:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{T.rubric}</p>
            <h1 className="font-serif text-3xl md:text-5xl font-normal text-navy mb-6 leading-tight">{T.h1}</h1>
            <p className="font-serif text-2xl text-teal mb-8">{T.positioning}</p>
            {T.paragraphs.map((p) => <p key={p} className="text-lg text-gray-600 leading-relaxed mb-5">{p}</p>)}
            <p className="text-base font-semibold text-navy mt-6">{T.tagline}</p>
          </div>
        </section>

        <section className="py-14 px-6 md:py-16 md:px-8 bg-teal-pale/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy mb-8">{T.approachH2}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {T.approach.map((a) => (
                <div key={a.title} className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="text-base font-bold text-navy mb-2">{a.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 px-6 md:py-16 md:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy mb-4">{T.experienceH2}</h2>
            <p className="text-base text-gray-600 leading-relaxed mb-4">{T.experience}</p>
            <a href="/en/case-studies" className="text-sm font-semibold text-teal no-underline hover:underline">{T.experienceLink} →</a>
          </div>
        </section>

        {/* Renders only members with photo and bio (lib/team.ts); nothing is shown while the list is empty. */}
        <Team lang="en" />
      </main>
      <CTA lang="en" />
      <Footer lang="en" />
    </>
  )
}
