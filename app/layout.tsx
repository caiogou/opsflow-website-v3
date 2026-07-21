import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpsFlow Advisory — Conseil supply chain & S&OP · Suisse',
  description:
    'Conseil en supply chain pour PME et entreprises en Suisse romande et EMEA : S&OP, optimisation des stocks, gestion des risques et planification de la distribution. Certifié MIT. Session diagnostic gratuite.',
  metadataBase: new URL('https://www.opsflow-advisory.ch'),
  openGraph: {
    title: 'OpsFlow Advisory',
    description: 'Conseil en supply chain augmenté par l’IA — Suisse & EMEA.',
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
    'Conseil en supply chain pour la Suisse et l’EMEA : S&OP, optimisation des stocks, gestion des risques et planification de la distribution.',
  areaServed: [
    { '@type': 'Place', name: 'Switzerland' },
    { '@type': 'Place', name: 'EMEA' },
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
