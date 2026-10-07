import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { CTA, Footer } from '@/components/CTAFooter'
import { CASES as T, PAGE_META, breadcrumbLd, pageMetadata } from '@/lib/pages_en'

const META = PAGE_META.caseStudies
export const metadata: Metadata = pageMetadata(META)

function Row({ label, text }: { label: string; text: string }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-bold tracking-widest text-teal uppercase mb-1">{label}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    </div>
  )
}

export default function Page() {
  const [own, market, approach] = T.tabs
  return (
    <>
      <Navbar lang="en" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(META)) }} />
      <main>
        <section className="pt-14 px-6 md:pt-20 md:px-8">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{T.rubric}</p>
            <h1 className="font-serif text-3xl md:text-5xl font-normal text-navy mb-5 leading-tight max-w-3xl">{T.h1}</h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mb-8">{T.intro}</p>
            <nav aria-label="Sections" className="flex flex-wrap gap-3">
              {T.tabs.map((t) => (
                <a key={t.id} href={`#${t.id}`} className="px-4 py-2 rounded-full border border-teal/40 text-sm font-semibold text-teal no-underline hover:bg-teal/10">{t.label}</a>
              ))}
            </nav>
          </div>
        </section>

        <section id={own.id} className="py-14 px-6 md:py-16 md:px-8 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy mb-2">{own.label}</h2>
            <p className="text-base text-gray-600 mb-2">{own.desc}</p>
            <p className="text-xs text-gray-500 mb-8">{T.ownNote}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {T.own.map((c) => (
                <article key={c.title} className="rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-navy mb-4">{c.title}</h3>
                  <Row label="Problem" text={c.problem} />
                  <Row label="Intervention" text={c.intervention} />
                  <Row label="Result" text={c.result} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id={market.id} className="py-14 px-6 md:py-16 md:px-8 bg-teal-pale/30 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-bold tracking-widest text-teal uppercase mb-3">{market.label}</p>
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy mb-2">{T.marketH2}</h2>
            <p className="text-base text-gray-600 max-w-2xl mb-8">{T.marketIntro}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {T.market.map((c) => (
                <article key={c.title} className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-bold text-navy mb-4">{c.title}</h3>
                  <Row label="What changed" text={c.changed} />
                  <Row label="Results" text={c.results} />
                  <Row label="Key lesson" text={c.lesson} />
                  <p className="text-xs text-gray-500 mt-2">
                    Source: <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-teal underline">{c.sourceLabel}</a>
                  </p>
                </article>
              ))}
            </div>
            <p className="text-sm text-gray-500 italic mt-8 max-w-3xl">{T.marketNote}</p>
          </div>
        </section>

        <section id={approach.id} className="py-14 px-6 md:py-16 md:px-8 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy mb-2">{T.approachH2}</h2>
            <p className="text-base text-gray-600 max-w-2xl mb-8">{T.approachIntro}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {T.own.map((c) => (
                <div key={c.title} className="rounded-lg border border-teal/30 p-6">
                  <h3 className="text-base font-bold text-navy mb-3">{c.title}</h3>
                  <Row label="What OpsFlow would set up" text={c.setup} />
                </div>
              ))}
            </div>
            <p className="mt-8"><a href="/en/how-we-work" className="text-sm font-semibold text-teal no-underline hover:underline">See how we work →</a></p>
          </div>
        </section>
      </main>
      <CTA lang="en" />
      <Footer lang="en" />
    </>
  )
}
