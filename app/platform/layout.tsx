import type { Metadata } from 'next'

export const metadata: Metadata = {
  // 05/oct/2026: out of the menu and the sitemap (Academy → Services, Platform out). Page kept online, not indexed.
  robots: { index: false, follow: true },
  title: 'Supply chain diagnostic platform — OpsFlow Advisory',
  description: 'Free data-driven supply chain diagnostics: inventory, demand & forecast, supply risk and planning KPIs. Upload your Excel exports and get prioritised recommendations.',
}

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
