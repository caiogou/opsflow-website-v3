import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { CTA, Footer } from '@/components/CTAFooter'
import { WHO_WE_HELP as T, PAGE_META, breadcrumbLd, pageMetadata } from '@/lib/pages_en'

const META = PAGE_META.whoWeHelp
export const metadata: Metadata = pageMetadata(META)

export default function Page() {
  return (
    <>
      <Navbar lang="en" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(META)) }} />
      <main>
        <section className="py-14 px-6 md:py-20 md:px-8">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-bold tracking-widest text-teal uppercase mb-4">{T.rubric}</p>
            <h1 className="font-serif text-3xl md:text-5xl font-normal text-navy mb-5 leading-tight max-w-3xl">{T.h1}</h1>
            {/* TODO Caio/Behrad: "[confirm with partners: revenue range and key industries]" */}
            <p className="text-xl text-navy font-semibold mb-4">{T.profile}</p>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">{T.intro}</p>
          </div>
        </section>

        <section className="py-14 px-6 md:py-16 md:px-8 bg-teal-pale/30">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy mb-6">{T.signalsH2}</h2>
              <ul className="space-y-3 list-none pl-0">
                {T.signals.map((s) => (
                  <li key={s} className="flex gap-3 text-base text-gray-700 leading-relaxed">
                    <span className="text-teal font-bold" aria-hidden="true">✓</span><span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy mb-6">{T.rolesH2}</h2>
              <ul className="space-y-3 list-disc pl-5">
                {T.roles.map((r) => <li key={r} className="text-base text-gray-700 leading-relaxed">{r}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-14 px-6 md:py-16 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy mb-8">{T.areasH2}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {T.areas.map((a) => (
                <a key={a.title} href={a.href} className="block rounded-lg border border-gray-200 p-6 no-underline hover:border-teal transition-colors">
                  <h3 className="text-lg font-bold text-navy mb-2">{a.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{a.desc}</p>
                </a>
              ))}
            </div>
            <p className="mt-8"><a href="/en/services" className="text-sm font-semibold text-teal no-underline hover:underline">All solutions →</a></p>
          </div>
        </section>
      </main>
      <CTA lang="en" />
      <Footer lang="en" />
    </>
  )
}
