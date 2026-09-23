import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpsFlow Advisory — Supply chain strategy & S&OP advisory',
  description:
    'Senior supply chain advisory plus a lean planning team: S&OP/IBP, inventory optimisation, supply risk and distribution planning — with data-driven diagnostics. Free diagnostic session.',
  metadataBase: new URL('https://www.opsflow-advisory.ch'),
  openGraph: {
    title: 'OpsFlow Advisory',
    description: 'Supply chain strategy and planning, powered by AI diagnostics.',
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
    'Supply chain advisory: senior strategic direction plus a planning team that runs and supervises the client’s S&OP cycle — S&OP/IBP, inventory optimisation, supply risk and distribution planning.',
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
    <html lang="fr">
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
