import type { Metadata } from 'next'
import HomeFlowLink from '@/components/flowlink/HomeFlowLink'

export const metadata: Metadata = {
  title: 'OpsFlow Advisory: Supply Chain Strategy and Follow-Through',
  description:
    'Swiss supply chain advisory in Nyon. S&OP/IBP, supply planning, order management and logistics for European SMEs. Free 45-minute session.',
  alternates: {
    canonical: 'https://www.opsflow-advisory.ch/en',
    languages: { fr: 'https://www.opsflow-advisory.ch/', de: 'https://www.opsflow-advisory.ch/de', en: 'https://www.opsflow-advisory.ch/en', 'x-default': 'https://www.opsflow-advisory.ch/en' },
  },
  openGraph: { title: 'OpsFlow Advisory', description: 'Supply chain strategy with senior follow-through.', url: 'https://www.opsflow-advisory.ch/en', type: 'website' },
}

const homeSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'OpsFlow Advisory',
  url: 'https://www.opsflow-advisory.ch/en',
  email: 'caio@opsflow-advisory.ch',
  description: 'Swiss supply chain advisory in Nyon. S&OP/IBP, supply planning, order management and logistics for European SMEs.',
  address: { '@type': 'PostalAddress', addressLocality: 'Nyon', addressCountry: 'CH' },
  areaServed: { '@type': 'Place', name: 'Europe' },
  knowsLanguage: ['en', 'fr', 'de'],
}

export default function Page() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      <HomeFlowLink />
    </main>
  )
}
