import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpsFlow Advisory — Supply Chain Excellence for EMEA',
  description:
    'Supply chain advisory for companies across EMEA. Planning Excellence, Inventory Optimisation, Supply Risk & Distribution Planning. MIT-certified. 17 years EMEA & LATAM. Free 90-min diagnostic session.',
  metadataBase: new URL('https://www.opsflow-advisory.ch'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'OpsFlow Advisory',
    description: 'Supply chain excellence for companies across EMEA.',
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
    'Supply chain advisory for companies across EMEA: Planning Excellence, S&OP, Inventory Optimisation, Supply Risk & Distribution Planning.',
  areaServed: [
    { '@type': 'Place', name: 'Switzerland' },
    { '@type': 'Place', name: 'EMEA' },
  ],
  address: {
    '@type': 'PostalAddress',
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
