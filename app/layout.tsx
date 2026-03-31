import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpsFlow Advisory — Supply Chain Excellence for EMEA',
  description:
    'Supply chain advisory for companies across EMEA. Planning Excellence, Inventory Optimisation, Supply Risk & Distribution Planning. MIT-certified. 17 years EMEA & LATAM. Free 90-min diagnostic session.',
  metadataBase: new URL('https://opsflow-advisory.ch'),
  openGraph: {
    title: 'OpsFlow Advisory',
    description: 'Supply chain excellence for companies across EMEA.',
    url: 'https://opsflow-advisory.ch',
    siteName: 'OpsFlow Advisory',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-navy antialiased">{children}</body>
    </html>
  )
}
