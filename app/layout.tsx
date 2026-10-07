import type { Metadata } from 'next'
import './globals.css'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'OpsFlow Advisory: Supply Chain Strategy and S&OP Advisory',
  description:
    'Senior supply chain advisory for SMEs: S&OP/IBP, supply planning, order management and logistics. Embedded leadership, not an embedded team. Free 45-minute session.',
  metadataBase: new URL('https://www.opsflow-advisory.ch'),
  openGraph: {
    title: 'OpsFlow Advisory',
    description: 'Supply chain strategy and planning with senior follow-through, AI-assisted.',
    url: 'https://www.opsflow-advisory.ch',
    siteName: 'OpsFlow Advisory',
    type: 'website',
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'OpsFlow Advisory',
  url: 'https://www.opsflow-advisory.ch',
  email: 'caio@opsflow-advisory.ch',
  description:
    'Supply chain advisory based in Nyon, Switzerland: senior strategic direction and follow-through on S&OP/IBP, supply planning, order management and logistics. Embedded leadership, not an embedded team.',
  areaServed: [
    { '@type': 'Place', name: 'Europe' },
    { '@type': 'Place', name: 'Worldwide' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nyon',
    addressCountry: 'CH',
  },
  knowsAbout: [
    'Supply Chain Management',
    'Sales and Operations Planning (S&OP)',
    'Inventory Optimisation',
    'Demand Planning',
    'Supply Risk Management',
    'Distribution Planning',
  ],
  sameAs: [],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={headers().get('x-lang') || 'en'}>
      <body className="bg-white text-navy antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {children}
      </body>
    </html>
  )
}
