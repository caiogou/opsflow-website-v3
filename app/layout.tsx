import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpsFlow Advisory — Supply chain strategy with embedded senior leadership',
  description:
    'Supply chain strategy with embedded senior leadership: S&OP/IBP, supply planning, order management and logistics. AI-assisted analysis, senior judgement. Free diagnostic session.',
  metadataBase: new URL('https://www.opsflow-advisory.ch'),
  openGraph: {
    title: 'OpsFlow Advisory',
    description: 'Supply chain strategy with embedded senior leadership. S&OP/IBP, supply planning, order management and logistics.',
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
    'Supply chain advisory based in Nyon, Switzerland: we build the supply chain strategy with the client and a senior leader stays with the team to make it happen — S&OP/IBP, supply planning, order management and logistics. AI-assisted analysis, senior judgement.',
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
    'Integrated Business Planning (IBP)',
    'Supply Planning',
    'Order Management',
    'Logistics',
    'Inventory Optimisation',
    'Demand Planning',
  ],
  sameAs: [],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
